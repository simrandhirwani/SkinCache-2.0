import sqlite3
import os
import requests
from datetime import datetime
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. PASTE YOUR API KEYS HERE ---
# API for Emails (Waitlist)
SHEET_WAITLIST_URL = "https://sheetdb.io/api/v1/o5imc2ju7gvga"

# API for Reviews (Articles) -- NEW!
SHEET_REVIEWS_URL = "https://sheetdb.io/api/v1/n9oa94b9ofb4u" 

# --- DATABASE SETUP ---
DB_NAME = "skincache.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Create Users Table
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)''')
    # Create Reviews Table
    c.execute('''CREATE TABLE IF NOT EXISTS reviews 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  name TEXT, skinType TEXT, title TEXT, fullStory TEXT, 
                  location TEXT, concerns TEXT, rating INTEGER DEFAULT 5, 
                  time TEXT DEFAULT "Just now")''')
    conn.commit()
    conn.close()
    
    # --- MEMORY RESTORE ---
    # When server wakes up, pull old reviews from Google Sheets!
    restore_reviews()

def restore_reviews():
    """Downloads reviews from Google Sheets and puts them back into the app."""
    try:
        print("🔄 Restoring memory from Google Sheets...")
        response = requests.get(SHEET_REVIEWS_URL)
        if response.status_code == 200:
            reviews = response.json()
            conn = sqlite3.connect(DB_NAME)
            c = conn.cursor()
            for r in reviews:
                # Check if review already exists to avoid duplicates
                c.execute("SELECT id FROM reviews WHERE title = ? AND name = ?", (r.get('title'), r.get('name')))
                if not c.fetchone():
                    c.execute("INSERT INTO reviews (name, skinType, title, fullStory, location, concerns, time) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                              (r.get('name'), r.get('skinType'), r.get('title'), r.get('fullStory'), r.get('location'), r.get('concerns'), r.get('date')))
            conn.commit()
            conn.close()
            print("✅ Memory Restored: Reviews loaded.")
        else:
            print("⚠️ Could not reach Google Sheet.")
    except Exception as e:
        print(f"⚠️ Restore Failed: {e}")

@app.on_event("startup")
def on_startup():
    init_db()

# --- MODELS ---
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

# --- GOOGLE SHEET HELPERS ---
def save_waitlist_to_sheet(name, email):
    try:
        payload = {"data": {"name": name, "email": email, "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}}
        requests.post(SHEET_WAITLIST_URL, json=payload)
    except: pass

def save_review_to_sheet(data: ReviewData):
    try:
        payload = {"data": {
            "name": data.name,
            "skinType": data.skinType,
            "title": data.title,
            "fullStory": data.review, # Mapping 'review' to 'fullStory' column
            "location": data.location,
            "concerns": data.concerns,
            "date": datetime.now().strftime("%Y-%m-%d")
        }}
        requests.post(SHEET_REVIEWS_URL, json=payload)
    except: pass

# --- ENDPOINTS ---
@app.get("/")
def read_root():
    return {"status": "SkinCache is Live!"}

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

@app.post("/submit-review")
def submit_review(data: ReviewData, background_tasks: BackgroundTasks):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        # 1. Save locally (Fast Display)
        c.execute("INSERT INTO reviews (name, skinType, title, fullStory, location, concerns) VALUES (?, ?, ?, ?, ?, ?)", 
                  (data.name, data.skinType, data.title, data.review, data.location, data.concerns))
        conn.commit()
        
        # 2. Save to Cloud (Backup)
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