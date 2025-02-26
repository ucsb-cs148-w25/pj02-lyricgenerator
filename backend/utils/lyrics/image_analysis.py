import os
import io
import json
import re
from PIL import Image
from dotenv import load_dotenv
import base64
import google.generativeai as genai
import requests
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from transformers import CLIPProcessor, CLIPModel
import torch
# from .lyrics_scraper import initChromeDriver, GeniusLyricsScraper
# from ..mongodb.connection import get_all_songs

# Load the pre-trained CLIP model and processor
model_clip = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor_clip = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# songs_list = get_all_songs()
#print(songs_list)

def analyze_img(image):
    #API Call #1: User-submitted image goes into Gemini, returns: a song name, an artist, and the language in JSON format based on song

    #Convert PIL Image to base64 for GEMINI API 
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG') #Convert image to JPEG format
    img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

    prompt = f'''Analyze the sentiment and emotional tone of the following image {image}. Based on this list of songs: {songs_list}, 
    determine which song best matches the mood, theme, and emotions conveyed in the image. 
    Use the lyrics, musical style, and overall sentiment of each song when making a selection. 
    Use the following JSON format ensuring parseability:
    {{
        "Song": "<song name>",
        "Artist": "<artist>",
        "genius link": "<genius link>"
    }}.
    No need for a reasoning.'''
    #Use the following JSON format ensuring parseability, Song: , Artist:, genius link: . No need for a reasoning.

    try:
        response = model.generate_content([image, prompt]) 
        # Sending image and prompt together
        # Correct API call format
        print("Full API Response:", response)

        # Extract response text from parts
        response_text = response.candidates[0].content.parts[0].text
        print("Raw Response Text:", response_text)

        # Remove triple backticks using regex
        cleaned_text = re.sub(r"```json\n|\n```", "", response_text).strip()
        print("Cleaned JSON:", cleaned_text)

        # Parse JSON
        response_json = json.loads(cleaned_text)
        return response_json

    except Exception as e:
        print("Error:", str(e))
        return {"error": str(e)}
    
def generate_caption(image, song_name, artist, genius_url):
    """
    Fetches lyrics using GeniusLyricsScraper, then analyzes the image and selects the most relevant lyric.
    """
    if not song_name:
        return {"error": "Song name not given."}

    if not artist:
        return {"error": "Artist not given."}

    if not genius_url:
        return {"error": "Genius URL not provided."}

    try:
        # Initialize GeniusLyricsScraper
        scraper = GeniusLyricsScraper()
        lyrics = scraper.getLyrics(genius_url, clean=True)  # Fetch and clean lyrics
        del scraper  # Close the browser session

        if not lyrics:
            return {"error": "Could not retrieve lyrics."}

        # Construct prompt to analyze image and find the most relevant lyric
        caption_prompt = f'''Given the following song lyrics:
        {lyrics}
        
        And this image: {image}, 
        
        Identify the single most relevant lyric line that best matches the mood, theme, or emotion conveyed in the image.
        Only return the lyric line without any explanations or formatting.
        '''

        # Generate a caption (lyric) using Gemini API
        response = model.generate_content([image, caption_prompt])

        # Extract text response
        lyric_caption = response.candidates[0].content.parts[0].text.strip()
        #print("lyric caption from inside function: ", lyric_caption)
        
        return lyric_caption

    except Exception as e:
        return {"error": str(e)}
    
'''
The rest of the functions below perform an image analysis based on detected genres instead
of using AI for the entire workflow.
'''

MUSIXMATCH_API_KEY = os.getenv("MUSIXMATCH_API_KEY")

GENRE_MAP = {
    "pop": 14,
    "rock": 21,
    "hip-hop": 18,
    "jazz": 11,
    "electronic": 7,
    "classical": 5,
}

EMOTION_MAP = {
    "pop": ["happy", "bright", "energetic", "fun"],
    "rock": ["rebellious", "intense", "powerful", "dark"],
    "hip-hop": ["confident", "street", "rhythmic", "bold"],
    "jazz": ["smooth", "relaxed", "classic", "nostalgic"],
    "electronic": ["futuristic", "upbeat", "trippy", "fast-paced"],
    "classical": ["elegant", "sophisticated", "calm", "melancholic"]
}

def get_genre(image):
    """Returns a genre that best matches an image, selected from the GENRE_MAP."""
    # Convert image to base64
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')  # Convert image to JPEG format
    img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

    # Prepare prompt with strict word selection
    emotion_words = ", ".join(sum(EMOTION_MAP.values(), []))
    prompt = f"""Analyze the emotional tone of the following image. Select strictly one word from this list: 
    {emotion_words}. Only return the word, nothing else."""
    
    try:
        response = model.generate_content([image, prompt])  # Send image & prompt together
        detected_emotion = response.text.strip().lower()
    except Exception as e:
        print("Error:", e)
        return None  # Handle API error

    # Match detected emotion to a genre in GENRE_MAP
    genre = None
    for g, keywords in EMOTION_MAP.items():
        if detected_emotion in keywords:
            genre = g
            break
        
    if not genre:
        return None  # No valid match found
    
    inputs = processor_clip(images=image, return_tensors="pt")
    with torch.no_grad():
        image_embedding = model_clip.get_image_features(**inputs)

    # Convert the image embedding to a list
    image_encoding = image_embedding.tolist()
    return {
        "genre": genre,
        "encodings": image_encoding  # List of numbers representing the image
    }

def get_top_songs_by_genre(genre):
    """Fetch the top 3 popular songs in a given genre using Musixmatch API."""
    genre_id = GENRE_MAP.get(genre.lower())
    if not genre_id:
        return []

    url = f"https://api.musixmatch.com/ws/1.1/track.search?f_music_genre_id={genre_id}&page_size=3&s_track_rating=DESC&f_has_lyrics=1&f_lyrics_language=en&apikey={MUSIXMATCH_API_KEY}"
    response = requests.get(url)

    if response.status_code == 200:
        tracks = response.json()["message"]["body"]["track_list"]
        return [
            {
                "track_id": track["track"]["track_id"],
                "title": track["track"]["track_name"],
                "artist": track["track"]["artist_name"],
            }
            for track in tracks
        ]
    return []

def get_lyrics_for_songs(songs):
    """Fetches entire lyrics for a list of songs """
    lyrics_list = []

    for song in songs:
        track_id = song["track_id"]
        url = f"https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id={track_id}&apikey={MUSIXMATCH_API_KEY}"
        response = requests.get(url)

        if response.status_code == 200:
            try:
                data = response.json()
                message = data.get("message", {})
                body = message.get("body", {})
                
                if isinstance(body, dict) and "lyrics" in body:
                    lyrics_data = body["lyrics"]
                    lyrics_text = lyrics_data.get("lyrics_body", "Lyrics not available.")
                    # Convert lyrics string into a list of lines
                    lyrics_array = lyrics_text.strip().split("\n")
                else:
                    lyrics_array = ["Lyrics not available."]

            except Exception as e:
                print(f"Error processing lyrics for track {track_id}: {e}")
                lyrics_array = ["Lyrics not available."]
                
            filtered_lyrics = []
            for l in range(len(lyrics_array) - 1):
                if l != "" and l != "...":
                    filtered_lyrics.append(lyrics_array[l])

            lyrics_list.append({
                "title": song["title"],
                "artist": song["artist"],
                "lyrics": filtered_lyrics
            })
    return lyrics_list

def get_most_relevant_lyric(encodings, lyrics):
    """
    Given an emotion embedding from an image and a list of lyrics, 
    finds the most relevant lyric based on cosine similarity.
    
    Args:
        encodings (list): The sentence embedding (vector) for the detected emotion.
        lyrics (list): A list of lyrics (strings) to compare against.
    
    Returns:
        str: The most relevant lyric.
    """
    inputs = processor_clip(text=lyrics, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        lyric_encodings = model_clip.get_text_features(**inputs)
    
    # Ensure the image encoding is a tensor
    encodings_tensor = torch.tensor(encodings)

    # Compute cosine similarity between emotion encoding and lyric encodings
    similarities = cosine_similarity(encodings_tensor.numpy().reshape(1, -1), lyric_encodings.numpy())

    # Find the index of the most similar lyric
    best_match_idx = np.argmax(similarities)
    return lyrics[best_match_idx]

if __name__ == "__main__":
    image_path = "happy_image.jpeg" 
    image = Image.open(image_path)

    data = get_genre(image)
    genre_id = data["genre"]
    song_enc = data["encodings"]

    print(f"Detected Genre ID: {genre_id}")

    print("---")

    print("Detected Top Songs:")

    songss = get_top_songs_by_genre(genre_id)
    print(songss)
    print("--")

    print("Lyrics from those songs:")
    lyricss = get_lyrics_for_songs(songss)[0]['lyrics']


    print(lyricss)

    print("Most relevant lyric---:")
    print(get_most_relevant_lyric(song_enc, lyricss))
