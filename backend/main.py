import sqlite3
import os
import requests
import psycopg2 
import google.generativeai as genai
from psycopg2.extras import RealDictCursor
from datetime import datetime, date
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load keys from .env file (for local development)
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. API KEYS (SECURE LOAD)
# ==========================================

SHEET_WAITLIST_URL = os.getenv("SHEET_WAITLIST_URL")
SHEET_REVIEWS_URL  = os.getenv("SHEET_REVIEWS_URL")
NEON_DB_URL        = os.getenv("NEON_DB_URL")
FACEPP_KEY         = os.getenv("FACEPP_KEY")
FACEPP_SECRET      = os.getenv("FACEPP_SECRET")
WEATHER_KEY        = os.getenv("WEATHER_KEY")
GEMINI_API_KEY     = os.getenv("GEMINI_API_KEY") # <--- NEW KEY

DB_NAME = "skincache.db"

# Configure Google AI
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ==========================================
# 2. DATABASE INITIALIZATION
# ==========================================

def init_local_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)''')
    c.execute('''CREATE TABLE IF NOT EXISTS reviews 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, skinType TEXT, title TEXT, fullStory TEXT, location TEXT, concerns TEXT, rating INTEGER DEFAULT 5, time TEXT DEFAULT "Just now")''')
    conn.commit()
    conn.close()
    if SHEET_REVIEWS_URL: 
        restore_reviews()

def restore_reviews():
    try:
        print("🔄 Restoring memory from Google Sheets...")
        response = requests.get(SHEET_REVIEWS_URL)
        if response.status_code == 200:
            reviews = response.json()
            conn = sqlite3.connect(DB_NAME)
            c = conn.cursor()
            for r in reviews:
                c.execute("SELECT id FROM reviews WHERE title = ? AND name = ?", (r.get('title'), r.get('name')))
                if not c.fetchone():
                    c.execute("INSERT INTO reviews (name, skinType, title, fullStory, location, concerns, time) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                              (r.get('name'), r.get('skinType'), r.get('title'), r.get('fullStory'), r.get('location'), r.get('concerns'), r.get('date')))
            conn.commit()
            conn.close()
            print("✅ Memory Restored.")
    except Exception as e:
        print(f"⚠️ Restore Failed: {e}")

def init_neon_db():
    if not NEON_DB_URL:
        print("⚠️ No Neon URL found. Skipping Cloud DB.")
        return
    try:
        conn = psycopg2.connect(NEON_DB_URL)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS tracker (
                id SERIAL PRIMARY KEY, 
                email TEXT, 
                challenge_name TEXT, 
                current_day INTEGER DEFAULT 0, 
                last_checkin_date TEXT
            );
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Connected to Neon Cloud DB.")
    except Exception as e:
        print(f"⚠️ Neon Connection Failed: {e}")

@app.on_event("startup")
def on_startup():
    init_local_db()
    init_neon_db()

# ==========================================
# 3. MODELS
# ==========================================

class UserData(BaseModel):
    name: str
    email: str

class ReviewData(BaseModel):
    name: str
    skinType: str
    title: str
    review: str
    location: str = "Community Member"
    concerns: str = "User Verification Pending"

class ChallengeCheckin(BaseModel):
    email: str
    challenge_name: str

# ==========================================
# 4. HELPER FUNCTIONS
# ==========================================

def save_waitlist_to_sheet(name, email):
    try:
        if SHEET_WAITLIST_URL:
            requests.post(SHEET_WAITLIST_URL, json={"data": {"name": name, "email": email, "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}})
    except: pass

def save_review_to_sheet(data: ReviewData):
    try:
        if SHEET_REVIEWS_URL:
            requests.post(SHEET_REVIEWS_URL, json={"data": {"name": data.name, "skinType": data.skinType, "title": data.title, "fullStory": data.review, "location": data.location, "concerns": data.concerns, "date": datetime.now().strftime("%Y-%m-%d")}})
    except: pass

def get_neon_connection():
    return psycopg2.connect(NEON_DB_URL, cursor_factory=RealDictCursor)

# ==========================================
# 5. ENDPOINTS
# ==========================================

@app.get("/")
def read_root():
    return {"status": "SkinCache Hybrid Backend is Live!"}

# --- A. WAITLIST ---
@app.post("/join")
def join_waitlist(user: UserData, background_tasks: BackgroundTasks):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email) VALUES (?, ?)", (user.name, user.email))
        conn.commit()
        background_tasks.add_task(save_waitlist_to_sheet, user.name, user.email)
        return {"message": "Success"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")
    finally:
        conn.close()

# --- B. REVIEWS ---
@app.post("/submit-review")
def submit_review(data: ReviewData, background_tasks: BackgroundTasks):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO reviews (name, skinType, title, fullStory, location, concerns) VALUES (?, ?, ?, ?, ?, ?)", 
                  (data.name, data.skinType, data.title, data.review, data.location, data.concerns))
        conn.commit()
        background_tasks.add_task(save_review_to_sheet, data)
        return {"message": "Review added!"}
    finally:
        conn.close()

@app.get("/reviews")
def get_reviews():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    try:
        c.execute("SELECT * FROM reviews ORDER BY id DESC")
        return c.fetchall()
    finally:
        conn.close()

# --- C. CHALLENGES ---
@app.post("/challenge/status")
def get_challenge_status(data: ChallengeCheckin):
    try:
        conn = get_neon_connection()
        cur = conn.cursor()
        cur.execute("SELECT current_day, last_checkin_date FROM tracker WHERE email = %s AND challenge_name = %s", (data.email, data.challenge_name))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row: return {"status": "active", "day": row['current_day'], "last_checkin": row['last_checkin_date']}
        else: return {"status": "new", "day": 0, "last_checkin": None}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Cloud DB Error")

@app.post("/challenge/checkin")
def check_in_challenge(data: ChallengeCheckin):
    try:
        conn = get_neon_connection()
        cur = conn.cursor()
        today_str = str(date.today())
        cur.execute("SELECT id, current_day, last_checkin_date FROM tracker WHERE email = %s AND challenge_name = %s", (data.email, data.challenge_name))
        row = cur.fetchone()
        new_day = 1
        
        if row:
            if row['last_checkin_date'] == today_str:
                cur.close(); conn.close()
                return {"status": "already_done", "day": row['current_day'], "message": "Already done today!"}
            new_day = row['current_day'] + 1
            cur.execute("UPDATE tracker SET current_day = %s, last_checkin_date = %s WHERE id = %s", (new_day, today_str, row['id']))
        else:
            cur.execute("INSERT INTO tracker (email, challenge_name, current_day, last_checkin_date) VALUES (%s, %s, %s, %s)", (data.email, data.challenge_name, 1, today_str))
        
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "success", "day": new_day, "message": "Day Complete!"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Cloud DB Error")

# --- D. PROXY ENDPOINT (FACE++ & WEATHER) ---
@app.post("/analyze")
async def analyze_skin(file: UploadFile = File(...), lat: str = Form("0"), lon: str = Form("0")):
    try:
        if not FACEPP_KEY or not FACEPP_SECRET:
             return {"error": "Server API Keys missing"}

        image_data = await file.read()
        res = requests.post(
            "https://api-us.faceplusplus.com/facepp/v3/detect",
            data={
                "api_key": FACEPP_KEY,
                "api_secret": FACEPP_SECRET,
                "return_attributes": "skinstatus,gender,age"
            },
            files={"image_file": image_data}
        )
        
        aqi = 1
        if lat != "0" and WEATHER_KEY:
            try:
                w_res = requests.get(f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={WEATHER_KEY}")
                if w_res.status_code == 200: aqi = w_res.json()['list'][0]['main']['aqi']
            except: pass
        
        return {"face": res.json(), "weather": {"aqi": aqi}}
    except Exception as e:
        return {"error": str(e)}

# --- E. NEW: INGREDIENT ANALYZER (GEMINI AI) ---
@app.post("/analyze-ingredients")
async def analyze_ingredients(
    text: str = Form(None), 
    file: UploadFile = File(None)
):
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini Key Missing in Server")

        
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # PROMPT: Strict Dermatologist Mode
        system_prompt = """
        You are an expert Dermatologist. Analyze the skincare ingredients provided.
        Identify the Top 3 "Hero" ingredients and any "Risky" ingredients (comedogenic, irritants, fungal acne triggers).
        Return ONLY valid JSON in this exact format, do not wrap in markdown:
        {
            "overall_rating": 0-10,
            "skin_types": "Best for Oily/Dry/etc",
            "heroes": [{"name": "Name", "function": "Short explanation"}],
            "concerns": [{"name": "Name", "reason": "Why it is risky"}],
            "verdict": "A short 1-sentence summary."
        }
        """

        response = None
        
        # CASE A: Image (OCR + Analysis)
        if file:
            print("📸 Processing Ingredient Photo...")
            image_bytes = await file.read()
            
            # Create a blob for Gemini
            cookie_picture = {
                'mime_type': file.content_type,
                'data': image_bytes
            }
            response = model.generate_content([system_prompt, cookie_picture])
            
        # CASE B: Text
        elif text:
            print("📝 Processing Ingredient Text...")
            response = model.generate_content([system_prompt, f"Ingredients list: {text}"])
        
        else:
            return {"error": "No input provided"}

        # Clean up response (remove markdown backticks if Gemini adds them)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        
        return {"analysis": clean_json}

    except Exception as e:
        print(f"Gemini Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))