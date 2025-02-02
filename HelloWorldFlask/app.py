import os
from flask import Flask, redirect, url_for, session, jsonify
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS
from backend.lyrics.image_analysis import analyze_img, generate_caption

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = os.getenv("FLASK_SECRET_KEY")
oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url="https://oauth2.googleapis.com/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={
        "scope": "openid email profile", 
    },
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

@app.route("/analyze_image", methods=["POST"])
def analyze_image():
    if "image" not in request.files:
        return jsonify({"error": "No image found."}), 400
    
    image_file = request.files["image"]
    image = Image.open(image_file)
    song = analyze_img(image)

    #TODO: Get lyrics and function call to generate_caption
    return "Caption generated successfully!"


if __name__ == '__main__':
    app.run(debug=True, port=5005)