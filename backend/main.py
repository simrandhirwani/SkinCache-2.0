import sqlite3
import os
import requests
import psycopg2 
import base64
import json
# --- NEW IMPORTS FOR EMAIL ---
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
# -----------------------------
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
GEMINI_API_KEY     = os.getenv("GEMINI_API_KEY") 

# === NEW KEYS FOR EMAIL (SMTP) ===
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
# =================================

DB_NAME = "skincache.db"

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

# --- NEW CUSTOM EMAIL SENDER FUNCTION (FIXED) ---
def send_confirmation_email(name, email):
    # This function uses Python's standard library to send email via SMTP (Gmail)
    
    # Check if credentials are set in .env/Render
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("⚠️ SMTP credentials missing. Cannot send email.")
        return

    sender_email = SMTP_EMAIL
    receiver_email = email
    
    # 1. Email structure setup
    message = MIMEMultipart("alternative")
    message["Subject"] = "You're In! Welcome to the SkinCache Community! ✨"
    message["From"] = f"The SkinCache Team <{sender_email}>"
    message["To"] = receiver_email

    # 2. Custom HTML Content (Footer year fixed to prevent background task errors)
    html = f"""
    <html>
    <body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <div style="background-color: #3D1132; color: white; padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">
                    WELCOME, {name.upper()}
                </h1>
            </div>

            <div style="padding: 25px 35px;">
                <h2 style="color: #3D1132; font-size: 24px;">You made it! 🎉</h2>
                <p style="color: #4a4a4a; line-height: 1.6;">
                    Hi {name},
                </p>
                <p style="color: #4a4a4a; line-height: 1.6;">
                    You just made the best decision for your skin. While others are still guessing with "trial and error," you've secured your spot for science-backed skin intelligence. ✨
                </p>

                <div style="background-color: #f1f8e9; border-left: 5px solid #66bb6a; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="margin: 0; color: #1b5e20; font-weight: bold;">
                        🚀 Your Spot is SECURED!
                    </p>
                    <p style="margin: 5px 0 0 0; color: #4a4a4a; font-size: 14px;">
                        You are officially in the SkinCache Priority Community.
                    </p>
                </div>

                <h3 style="color: #3D1132; font-size: 18px; margin-top: 30px;">Here is what awaits you inside:</h3>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 10px; color: #4a4a4a;">🔍 Instant Ingredient Analysis</li>
                    <li style="margin-bottom: 10px; color: #4a4a4a;">🔬 Verified Skin Insights (No more hidden nasties)</li>
                    <li style="margin-bottom: 10px; color: #4a4a4a;">🔮 "Future Me" Prediction Tool</li>
                </ul>

                <p style="color: #4a4a4a; line-height: 1.6; margin-top: 30px;">
                    We are putting the finishing touches on the platform. Watch this space—your invite code will drop soon! ❤️
                </p>

                <p style="color: #3D1132; font-weight: bold; margin-top: 30px;">
                    Stay glowing,<br>
                    The SkinCache Team 💜
                </p>
            </div>
            
            <div style="background-color: #3D1132; color: white; padding: 15px 20px; text-align: center; font-size: 12px;">
                <p style="margin: 0; font-weight: bold; color: #DCA637;">SKINCACHE</p>
                <p style="margin: 5px 0 0 0; color: #aaa;">Made with Science & Love.<br>&copy; 2025 SkinCache Inc.</p> 
            </div>

        </div>
    </body>
    </html>
    """
    
    # 3. Attach and Send
    part = MIMEText(html, "html")
    message.attach(part)

    try:
        # Connect to Gmail's secure SMTP server on port 465
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(sender_email, receiver_email, message.as_string())
        
        print(f"📧 SMTP email sent to {email}. Status: SUCCESS")
        return True

    except Exception as e:
        print(f"❌ SMTP Email Error: {e}")
        return False
# ----------------------------------------

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

# --- A. WAITLIST (UPDATED) ---
@app.post("/join")
def join_waitlist(user: UserData, background_tasks: BackgroundTasks):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email) VALUES (?, ?)", (user.name, user.email))
        conn.commit()
        
        # 1. Save data to Google Sheet
        background_tasks.add_task(save_waitlist_to_sheet, user.name, user.email)
        
        # 2. Send the confirmation email
        background_tasks.add_task(send_confirmation_email, user.name, user.email) 
        
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

# --- E. ROBUST GEMINI (HTTP Mode - UPDATED TO 2.5) ---
@app.post("/analyze-ingredients")
async def analyze_ingredients(
    text: str = Form(None), 
    file: UploadFile = File(None)
):
    try:
        if not GEMINI_API_KEY:
            # Return JSON error structure to fix frontend SyntaxError
            return {"error": "Gemini Key Missing in Server"}

        # 1. PREPARE PROMPT
        prompt_text = """
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

        # 2. BUILD PAYLOAD
        parts = [{"text": prompt_text}]
        
        if text:
            parts.append({"text": f"Ingredients list: {text}"})
        
        if file:
            print("📸 Processing Ingredient Photo...")
            image_bytes = await file.read()
            # Convert image bytes to Base64 string
            image_b64 = base64.b64encode(image_bytes).decode('utf-8')
            
            parts.append({
                "inline_data": {
                    "mime_type": file.content_type,
                    "data": image_b64
                }
            })

        # 3. DIRECT HTTP REQUEST (UPDATED TO GEMINI 2.5 FLASH)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [{ "parts": parts }]
        }

        print("🚀 Sending Direct Request to Google Gemini 2.5...")
        response = requests.post(url, json=payload)
        
        # --- AGGRESSIVE ERROR CHECKING ---
        if response.status_code != 200:
            print(f"Google API Error Status: {response.status_code}")
            # Return JSON error structure to fix frontend SyntaxError
            return {"error": f"AI Service Error (Status {response.status_code}). Please check API Key and Try again."}
        # ---------------------------------

        # 4. PARSE RESPONSE
        result = response.json()
        try:
            raw_text = result['candidates'][0]['content']['parts'][0]['text']
            clean_json = raw_text.replace("```json", "").replace("```", "").strip()
            return {"analysis": clean_json}
        except KeyError:
             print(f"Unexpected Response Structure: {result}")
             # Return JSON error structure to fix frontend SyntaxError
             return {"error": "AI could not process this request or returned malformed JSON."}

    except Exception as e:
        print(f"Server Error: {e}")
        # Return JSON error structure to fix frontend SyntaxError
        return {"error": f"Internal Server Error: {str(e)}"}