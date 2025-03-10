from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from gridfs import GridFS
import datetime
import os
from dotenv import load_dotenv
import sqlite3 # Use database to store saved captions
import base64
from bson import ObjectId
import hashlib

load_dotenv()
uri = os.getenv("MONGODB_URI")


class CreditCard: # placeholder for credit card/payment info
    def __init__(self, user_id, card_number):
        self.user_id = user_id
        self.card_number = card_number


client = MongoClient(uri, server_api=ServerApi('1'))
database = client["test"]
fs = GridFS(database)

collection_accounts = database["user_accounts"]
collection_history = database["user_history"]
collection_payment = database["user_payment"]
collection_instagram = database["user_ig"]

collection_offline_songs = database["offline_songs"] # collection for offline songs - song titles, artist, genius link, mood category

def drop_collection(collection_name):
    """Drops a collection from the MongoDB database."""
    database.drop_collection(collection_name)

def hash_image(image_file):
    """Compute a hash of the image file content to check for duplicates."""
    hasher = hashlib.sha256()
    hasher.update(image_file.read())
    image_file.seek(0)  # Reset file pointer after hashing
    return hasher.hexdigest()

def save_user_caption(user_id, image_file, caption, song, artist):
    """
    Saves a captioned image for a user in MongoDB.
    The image is stored in GridFS, and the caption, song, and artist info are stored in the collection.
    If an entry with the same image hash, song, and artist already exists, it is not re-inserted.
    """
    image_hash = hash_image(image_file)

    # Check if an entry with the same image hash, song, and artist exists
    existing_entry = collection_history.find_one({
        "user_id": user_id,
        "image_hash": image_hash,
        "song": song,
        "artist": artist
    })

    if existing_entry:
        print("Entry already exists. Skipping insertion.")
        return existing_entry  # Optionally return the existing entry

    image_id = fs.put(image_file, filename=f"{user_id}")  # Store image in GridFS
    print(f"Image saved to GridFS with ID: {image_id}")

    collection_history.insert_one({
        "user_id": user_id,
        "image_id": image_id,
        "image_hash": image_hash,
        "caption": caption,
        "song": song,
        "artist": artist
    })

def get_user_captions(user_id):
    """
    Retrieves all saved captions for a user, including the images as base64 strings.
    """
    captions = list(collection_history.find({"user_id": user_id}, {"_id": 0, "user_id": 0}))

    for caption in captions:
        image_id = caption.get("image_id")
        if image_id:
            #image_file = fs.get(image_id)  # Retrieve image from GridFS
            # Convert ObjectId to string for JSON serialization
            caption["image_id"] = str(image_id)
            image_file = fs.get(ObjectId(image_id))  # Ensure it's an ObjectId and retrieve image from GridFS
            image_data = image_file.read()
            caption["image_base64"] = base64.b64encode(image_data).decode('utf-8')  # Convert image to base64 for frontend display
    
    return captions

def get_user_account(user_id):
    return collection_accounts.find_one({ "user_id" : user_id })

def create_user_account(user_id, google_email, username, date_joined, last_login_date, last_login_ip, profile_pic_path, tier, api_token):
    with open(profile_pic_path, "rb") as f:
        pfp_id = fs.put(f)
    collection_accounts.insert_one({"user_id" : user_id,
                                    "google_email" : google_email,
                                    "username" : username,
                                    "date_joined" : date_joined,
                                    "last_login_date" : last_login_date, # Python3 datetime object
                                    "last_login_ip" : last_login_ip,     # Python3 datetime object
                                    "profile_pic" : pfp_id,
                                    "tier" : tier, # 0 - free, 1 - basic, 2 - pro
                                    "api_token" : api_token})

def update_last_login(user_id, new_login_date, new_login_ip):
    collection_accounts.update_one({"user_id" : user_id}, 
                                    {'$set' : {"last_login_date" : new_login_date, "last_login_ip" : new_login_ip}})

def get_user_history(user_id):
    user_history = collection_history.find_one({"user_id": user_id})
    
    if not user_history:
        return None  # No history found for the user
    
    for record in user_history.get("history", []):
        # Retrieve image files from GridFS
        record["pictures"] = [
            fs.get(pic_id).read() for pic_id in record["pictures"]
        ]

    return user_history


def add_user_history(user_id, batch_id, bulk, pictures, captions):
    # pictures is list of file paths to pictures
    # captions is list of captions to corresponding pictures in same order

    picture_list = []
    for p in pictures:
        with open(p, "rb") as f:
            pic_id = fs.put(f)
        picture_list.insert(pic_id)

    history = {"batch_id" : batch_id,
               "bulk" : bulk,
               "pictures" : picture_list,
               "captions" : captions
               }

    if (collection_history.find_one({"user_id" : user_id})) :
        collection_history.update_one({"user_id" : user_id},
                                      {'$push' : {"history" : history}})
    else:
        collection_history.insert_one({"user_id" : user_id,
                                       "history" : [history]})

def get_user_payment(user_id):
    return collection_payment.find_one({"user_id" : user_id})

def set_user_payment(user_id, payment_method):
    collection_payment.insert_one({"user_id" : user_id,
                                    "payment_method" : payment_method} ) # Python3 creditCard object

def get_song(song_title):
    return collection_offline_songs({"song_title" : song_title})

def add_song(song_title, artist, genius_link, category):
    collection_offline_songs.insert_one({"song_title" : song_title,
                                         "artist" : artist,
                                         "genius_link" : genius_link,
                                         "category" : category})

def get_all_songs():
    return collection_offline_songs.distinct("song_title")

def get_songs(category):
    return collection_offline_songs.distinct("song_title", {"category" : category})

def save_instagram(user_id, ig_username, ig_password):
    collection_instagram.insert_one({"user_id" : user_id, 
                                     "ig_username" : ig_username,
                                     "ig_password" : ig_password})
    
def get_instagram(user_id):
    return collection_instagram.distinct({"user_id": user_id})

'''
collection_captions = database["user_captions"]  # New collection for saved captions

def save_user_caption(user_id, image_url, caption):
    """Saves a captioned image for a user in MongoDB."""
    collection_captions.insert_one({
        "user_id": user_id,
        "image_url": image_url,
        "caption": caption,
        "timestamp": datetime.datetime.utcnow()
    })

def get_user_captions(user_id):
    """Retrieves all saved captions for a user."""
    return list(collection_captions.find({"user_id": user_id}, {"_id": 0, "user_id": 0}))
'''
