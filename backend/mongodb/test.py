from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from gridfs import GridFS
import datetime
import os
from dotenv import load_dotenv

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

collection_offline_songs = database["offline_songs"] # collection for offline songs - song titles, artist, genius link, mood category

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
    return collection_history.find_one({"user_id" : user_id})

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
