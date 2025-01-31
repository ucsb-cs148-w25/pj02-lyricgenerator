import os
import json
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
    
def analyze_img(image, songs_dict):
    #API Call #1: User-submitted image goes into Gemini, returns: a song name, an artist, and the language in JSON format based on song

    prompt = f'''Analyze the sentiment and emotional tone of the following image {image}. Based on this list of songs: {songs_list}, 
    determine which song best matches the mood, theme, and emotions conveyed in the image. 
    USe the lyrics, musical style, and overall sentiment of each song when making a selection. 
    Use the following JSON format ensuring parseability, Song: , Artist:, Language: . No need for a reasoning.'''

    try:
        response = model.generate_content([img, prompt]) 
        response_json = json.loads(response.text[8:-5])
        print(response_json)
        return response_json
    except Exception as e:
        return {"error": str(e)}

#API Call #2: Input the lyrics of a song and the image into Gemini to get a lyric caption
def generate_caption(image, lyrics):
    if not lyrics:
        return {"error: Lyrics not given."}
    
    caption_prompt = f'''Based on the following lyrics {lyrics} and the image {image}, 
    return a short lyric caption that captures the mood and emotion of the image. 
    Return only the caption, no need for explanation.'''

    try:
        caption = model.generate_content([img, caption_prompt])
        caption = caption.text[:-1]
        return caption
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":

    #test functionality
    path_to_file = "" #ADD DEFAULT PATH
    img = Image.open(path_to_file)
    
    songs_list = [{"Name": "Melting", "Artist": "Kali Uchis", "Language": "English"}, {"Name": "Happy", "Artist": "Pharell Williams", "Language": "English"}, {"Name": "Ruthless", "Artist": "The Marias", "Language": "English"}, {"Name": "Pink + White", "Artist": "Frank Ocean", "Language": "English"}]
    lyrics = "That's the way everyday goes Every time we've no control If the sky is pink and white If the ground is black and yellow It's the same way you showed me Nod my head, don't close my eyes Halfway on a slow move It's the same way you showed me If you could fly then you'd feel south Up north's getting cold soon The way it is, we're on land So I'm someone to hold true Keep you cool when it's still alive Won't let you down when it's all ruin Just the same way you showed me, showed me You showed me love Glory from above Regard my dear It's all downhill from here In the wake of a hurricane Dark skin of a summer shade Nosedive in the flood lines Tall tower of milk crates It's the same way you showed me Cannonball off the porch side Older kids trying off the roof Just the same way you showed me (You showed) If you could die and come back to life Up for air from the swimming pool You'd kneel down to the dry land Kiss the Earth that birthed you Gave you tools just to stay alive And make it out when the sun is ruined That's the same way you showed me, showed me You showed me love Glory from above Regard my dear It's all downhill from here Remember life Remember how it was Climb trees, Michael Jackson, it all ends here Say what up to Matthew, to Shoob Say what up to Danny Say what up to life immortality Bending up my Nikes Running out the melpomene, nicotine Stealing granny cigs (Take it easy) Gimme something sweet Bitch, I might like immortality This is life, life immortality"

    song = analyze_img(img, songs_list)
    caption = generate_caption(img, lyrics)
    print(caption)