import os
import json
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai
from backend.mongodb.test import get_all_songs


load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

songs_list = get_all_songs()
    
def analyze_img(image):
    #API Call #1: User-submitted image goes into Gemini, returns: a song name, an artist, and the language in JSON format based on song

    prompt = f'''Analyze the sentiment and emotional tone of the following image {image}. Based on this list of songs: {songs_list}, 
    determine which song best matches the mood, theme, and emotions conveyed in the image. 
    USe the lyrics, musical style, and overall sentiment of each song when making a selection. 
    Use the following JSON format ensuring parseability, Song: , Artist:, genius link: . No need for a reasoning.'''

    try:
        response = model.generate_content([image, prompt]) 
        response_json = json.loads(response.text[8:-5])
        return response_json
    
    except Exception as e:
        return {"error": str(e)}

def generate_caption(image, lyrics):
    #API Call #2: Input the lyrics of a song and the image into Gemini to get a lyric caption

    if not lyrics:
        return {"error: Lyrics not given."}
    
    caption_prompt = f'''Based on the following lyrics {lyrics} and the image {image}, 
    return a short lyric caption that captures the mood and emotion of the image. 
    Return only the caption, no need for explanation.'''

    try:
        caption = model.generate_content([image, caption_prompt])
        caption = caption.text[:-1]
        return caption
    except Exception as e:
        return {"error": str(e)}