import os
import io
import json
import re
from PIL import Image
from dotenv import load_dotenv
import base64
import google.generativeai as genai
from .lyrics_scraper import initChromeDriver, GeniusLyricsScraper
from ..mongodb.test import get_all_songs


load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

songs_list = get_all_songs()
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

if __name__ == "__main__":
    image_path = "static/images/sample.jpg"
    image = Image.open(image_path)
    result = analyze_img(image)
    print(result)