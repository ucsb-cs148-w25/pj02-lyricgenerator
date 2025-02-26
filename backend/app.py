import os
import sys
import uuid
from flask import Flask, redirect, url_for, session, jsonify, request
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
from authlib.jose import jwt
from authlib.jose import JsonWebKey
from uuid import uuid4
from authlib.jose.errors import InvalidClaimError
from instabot import Bot
import numpy as np
import io
from utils.lyrics.image_analysis import get_genre, get_top_songs_by_genre, get_lyrics_for_songs, get_most_relevant_lyric


# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from utils.lyrics.image_analysis import analyze_img, generate_caption

GOOGLE_CERTS_URL = "https://www.googleapis.com/oauth2/v3/certs"


# Load environment variables from .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env.example'))


# Configure Google Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
if not os.getenv("GEMINI_API_KEY"):
    print("Check your .env file")
    raise ValueError("GEMINI_API_KEY is missing. Check your .env file.")

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)  # Enable CORS for React frontend
app.secret_key = os.getenv("FLASK_SECRET_KEY")  # Replace with a secure key
oauth = OAuth(app)

# Google OAuth configuration

google = oauth.register(
    name="google",
    client_id=os.getenv("REACT_APP_GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    request_token_params={
        "scope": "email profile",
    },
    base_url="https://www.googleapis.com/oauth2/v1/",
    request_token_url=None,
    authorize_params={"scope": "openid email profile"},
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_method="POST",
    access_token_url="https://oauth2.googleapis.com/token",
    access_token_params=None,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        'scope': 'openid email profile',
        'issuer': "https://accounts.google.com"  # Explicitly setting the allowed issuer
    }
)

def getApp():
    return app

@app.route("/")
def home():
    #return "Welcome! <a href='/login'>Login with Google</a>"
    user = session.get("user")
    if user:
        return f"Welcome {user['name']}!"
    return "Welcome! <a href='/login'>Login with Google</a>"

@app.route("/login")
def login():
    #Generate and store nonce in session
    nonce = str(uuid.uuid4())
    session["nonce"] = nonce
    #redirect_uri = url_for("callback", _external=True)
    print("Stored nonce in session:", session["nonce"])
    return google.authorize_redirect("http://localhost:5005/callback")

@app.route("/callback")
def callback():
    token = google.authorize_access_token()
    print(f"Token printed here: {token}") 

    # Retrieve nonce from session (Ensure it was stored during login request)
    nonce = session.get("nonce")
    
    if not nonce:
        return "Missing nonce in session", 400  # Handle missing nonce case
    try: 
        userinfo = oauth.google.parse_id_token(token, nonce=nonce)  # Pass nonce explicitly
        print(f"User Info: {userinfo}")
    except InvalidClaimError as e:
        print("Error with token validation:", e)
        return f"Invalid claim error: {str(e)}", 400
    
    # Extract user info and store it in session
    #userinfo = google.parse_id_token(token)
    session["user"] = userinfo 
    return redirect("/") 
    #return redirect(url_for("home"))
    #return f"Hello, {user_info['name']}! <a href='/logout'>Logout</a>"

'''
@app.route('/generate', methods=['POST'])
def generate_text():
    try:
        #Check if an image is provided in the request
            return jsonify({"error": "No image found."}), 400
        
        image_file = request.files["images"]
        image = Image.open(image_file)
        print("Opened the image\n")

        # Step 1: Get song, artist, and lyrics based on image analysis
        #song_data = analyze_img(image)

        data = get_genre(image)
        genre_id = data["genre"]
        song_enc = data["encodings"]

        print(f"Data {genre_id}")
        print(f"Song encoding {song_enc}")

        if "error" in data:
            return jsonify(data), 500

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
'''
    
@app.route('/get_top_tracks', methods=['POST'])
def get_top_tracks():
    """
    Accepts an image file, detects its genre, and returns the top 3 tracks (with their metadata) along with image encodings.
    """
    try: 
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        image = Image.open(image_file)
        print("ur mom")
        
        # Get genre and encodings
        data = get_genre(image)
        if not data:
            return jsonify({'error': 'Could not determine genre'}), 500
        
        print("ur mom after generating the genre")

        genre = data["genre"]
        print(f"Genre {genre}")
        encodings = data["encodings"]  # Extract image encodings
        print(f"Encodings {encodings}")
        
        tracks = get_top_songs_by_genre(genre) # get top tracks
        print(f"Tracks {tracks}")
        tracks_with_their_lyrics = get_lyrics_for_songs(tracks) # gets the lyrics of the associated tracks
        print(f"Track with their lyrics: {tracks_with_their_lyrics}")
        '''
        for reference, the tracks_with_their_lyrics variables is structured as an array as follows with 3 elements, each being a dictionary as below
        [
            {
                title: God's Plan
                artist: Drake
                lyrics: [xyz, abc, etc.]
            }
        ]
        '''
        return jsonify({'genre': genre, 'tracks': tracks_with_their_lyrics, 'image_encodings': encodings})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_best_lyric', methods=['POST'])
def get_best_lyric():
    """
    Accepts image encodings and lyrics array, finds the most relevant lyric.
    """
    data = request.get_json()

    if not data or 'image_encodings' not in data or 'lyrics' not in data:
        return jsonify({'error': 'Invalid request, missing parameters'}), 400

    image_encodings = data["image_encodings"]
    lyrics = data["lyrics"]

    if not isinstance(image_encodings, list) or not isinstance(lyrics, list):
        return jsonify({'error': 'Invalid data format'}), 400

    best_lyric = get_most_relevant_lyric(image_encodings, lyrics)
    
    return jsonify({'best_lyric': best_lyric})

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

@app.route("/instagram", methods=['POST'])
def instagram():
    username = request.form['Username']
    password = request.form['Password']
    caption = request.form['Caption']
    file = request.files['Image']

    bot = Bot()
    bot.login(username=username, password=password, is_threaded=True)

    # aspect ratios have to be 1:1 (1080 x 1080), 1.91:1 (1080 x 608), 4:5 (1080 x 1350), 9:16 (1080 x 1920), 1:1.55 (420 x 654)
    im = Image.open(file)  
    newsize = (1080, 1080) 
    im1 = im.resize(newsize) 
    im1.save("resized.jpg")

    bot.upload_photo("resized.jpg", caption)

    # clean up file paths
    os.remove("resized.jpg.REMOVE_ME")
    clean_path = os.path.join("config/" + username + "_uuid_and_cookie.json")
    if os.path.isfile(clean_path):
        os.remove(clean_path)

    return jsonify("Posted to Instagram")

if __name__ == '__main__':
    app.run(debug=True, port=5005)