import os
import sys
from flask import Flask, redirect, url_for, session, jsonify, request
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from backend.lyrics.image_analysis import analyze_img, generate_caption


# Load environment variables from .env
load_dotenv()

# Configure Google Gemini API
#genai.configure(api_key="GEMINI_API_KEY")

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
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={'scope': 'openid email profile'}
)

@app.route("/")
def home():
    #return "Welcome! <a href='/login'>Login with Google</a>"
    user = session.get("user")
    if user:
        return f"Welcome {user['name']}!"
    return "Welcome! <a href='/login'>Login with Google</a>"

@app.route("/login")
def login():
    redirect_uri = url_for("callback", _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route("/callback")
def callback():
   
    #token = google.authorize_access_token()
    #user_info = google.get("userinfo").json()

    token = google.authorize_access_token()
    user_info = google.get("userinfo").json()  # Get user info directly
    print(user_info)  # Debugging
    session["user"] = user_info
    return redirect(url_for("home"))
    #return f"Hello, {user_info['name']}! <a href='/logout'>Logout</a>"


@app.route('/generate', methods=['POST'])
def generate_text():
    try:
        #Check if an image is provided in the request
        if "image" not in request.files:
            return jsonify({"error": "No image found."}), 400
        
        image_file = request.files["image"]
        image = Image.open(image_file)

        # Step 1: Get song, artist, and lyrics based on image analysis
        song_data = analyze_img(image)

        if "error" in song_data:
            return jsonify(song_data), 500
        
        song_name = song_data.get("Song")
        artist = song_data.get("Artist")
        link = song_data.get("genius link")
        print("Song_name: ", song_name)
        print("Artist: ", artist)
        print("Link: ", link)

        if not artist:
            return jsonify({"error": "Artist not found for the selected song."}), 500
        
        if not song_name:
            return jsonify({"error": "Song_name not found for the selected song."}), 500

        #Step 2: Generate caption based on lyrics and image
        caption = generate_caption(image, song_name, artist, link)

        print("Caption: ", caption)

        if "error" in caption:
            return jsonify({"error": "Failed to generate caption."}), 500
        
        # Return the generated caption along with song details
        return jsonify({
            "song": song_name,
            "artist": artist,
            "caption": caption
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

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