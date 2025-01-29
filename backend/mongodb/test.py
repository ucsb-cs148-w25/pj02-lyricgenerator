from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import datetime

class CreditCard:
    def __init__(self, user_id, card_number):
        self.user_id = user_id
        self.card_number = card_number

uri = "mongodb+srv://alicezhong:fk8GZwWNjZn08wmy@cluster0.fkxv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    database = client["test"]
    collection_accounts = database["user_accounts"]
    collection_history = database["user_history"]
    collection_payment = database["user_payment"]

except Exception as e:
    print(e)

def get_user_account(user_id):
    return collection_accounts.find_one({ "user_id" : user_id })

def create_user_account(user_id, google_email, username, date_joined, last_login_date, last_login_ip, profile_pic_path, tier, api_token):
    collection_accounts.insert_one({"user_id" : user_id,
                                    "google_email" : google_email,
                                    "username" : username,
                                    "date_joined" : date_joined,
                                    "last_login_date" : last_login_date, # Python3 datetime object
                                    "last_login_ip" : last_login_ip,     # Python3 datetime object
                                    "profile_pic" : profile_pic_path,
                                    "tier" : tier, # 0 - free, 1 - basic, 2 - pro
                                    "api_token" : api_token})

def update_last_login(user_id, new_login_date, new_login_ip):
    collection_accounts.update_one({"user_id" : user_id}, 
                                    {'$set' : {"last_login_date" : new_login_date, "last_login_ip" : new_login_ip}})

def get_user_history(user_id):
    return collection_history.find_one({"user_id" : user_id})

def add_user_history(user_id, history):
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
