import sqlite3
import os
import requests  # <--- NEW LIBRARY
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

# --- 1. PASTE YOUR SHEETDB URL HERE ---
SHEET_DB_URL = "https://sheetdb.io/api/v1/o5imc2ju7gvga" 

# --- DATABASE SETUP (Temporary storage for speed) ---
DB_NAME = "skincache.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)''')
    c.execute('''CREATE TABLE IF NOT EXISTS reviews 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  name TEXT, skinType TEXT, title TEXT, fullStory TEXT, 
                  location TEXT, concerns TEXT, rating INTEGER DEFAULT 5, 
                  time TEXT DEFAULT "Just now")''')
    conn.commit()
    conn.close()

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

# --- GOOGLE SHEETS LOGIC ---
def add_to_google_sheet(name, email):
    """Sends data to your Google Sheet via SheetDB"""
    try:
        payload = {
            "data": {
                "name": name,
                "email": email,
                "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        }
        requests.post(SHEET_DB_URL, json=payload)
        print(f"✅ Added {name} to Google Sheet")
    except Exception as e:
        print(f"⚠️ SheetDB Error: {e}")

# --- ENDPOINTS ---
@app.get("/")
def read_root():
    return {"status": "SkinCache is Live!"}

@app.post("/join")
def join_waitlist(user: UserData, background_tasks: BackgroundTasks):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        # 1. Save to temporary local DB (for speed)
        c.execute("INSERT INTO users (name, email) VALUES (?, ?)", (user.name, user.email))
        conn.commit()
        
        # 2. Save to Google Sheet (Permanent Backup)
        background_tasks.add_task(add_to_google_sheet, user.name, user.email)
        
        return {"message": "Success"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")
    finally:
        conn.close()

@app.post("/submit-review")
def submit_review(data: ReviewData):
    # Reviews currently only go to temporary DB. 
    # If you want them in Sheets too, create a second sheet tab and API.
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO reviews (name, skinType, title, fullStory, location, concerns) VALUES (?, ?, ?, ?, ?, ?)", 
                  (data.name, data.skinType, data.title, data.review, data.location, data.concerns))
        conn.commit()
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