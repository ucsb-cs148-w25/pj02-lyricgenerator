import os
from flask import Flask, redirect, url_for, session, jsonify
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)  # Enable CORS for React frontend
app.secret_key = os.getenv("SECRET_KEY")  # Replace with a secure key
oauth = OAuth(app)

# Google OAuth configuration
google = oauth.register(
    name="google",
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
    request_token_params={
        "scope": "email profile",
    },
    base_url="https://www.googleapis.com/oauth2/v1/",
    request_token_url=None,
    access_token_method="POST",
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    client_kwargs={'scope': 'openid email profile'}
)

@app.route("/")
def home():
    return "Welcome! <a href='/login'>Login with Google</a>"

@app.route("/login")
def login():
    redirect_uri = url_for("callback", _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route("/callback")
def callback():
    token = google.authorize_access_token()
    user_info = google.get("userinfo").json()
    session["user"] = user_info
    return f"Hello, {user_info['name']}! <a href='/logout'>Logout</a>"

@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("home"))

@app.route("/me")
def me():
    user = session.get("user")
    if user:
        return jsonify(user)
    return jsonify({"message": "Not logged in"}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5005)