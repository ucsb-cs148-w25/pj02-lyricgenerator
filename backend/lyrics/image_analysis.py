import google.generativeai as genai
import os
from dotenv import load_dotenv
from PIL import Image
import json


path_to_file = ""
img = Image.open(path_to_file) #open image
songs_dict = [{"Name": "Melting", "Artist": "Kali Uchis", "Langauge": "English"}, {"Name": "Ruthless", "Artist": "The Marias", "Langauge": "English"}, {"Name": "Pink + White", "Artist": "Frank Ocean", "Langauge": "English"}]

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)
lyrics = "That's the way everyday goes Every time we've no control If the sky is pink and white If the ground is black and yellow It's the same way you showed me Nod my head, don't close my eyes Halfway on a slow move It's the same way you showed me If you could fly then you'd feel south Up north's getting cold soon The way it is, we're on land So I'm someone to hold true Keep you cool when it's still alive Won't let you down when it's all ruin Just the same way you showed me, showed me You showed me love Glory from above Regard my dear It's all downhill from here In the wake of a hurricane Dark skin of a summer shade Nosedive in the flood lines Tall tower of milk crates It's the same way you showed me Cannonball off the porch side Older kids trying off the roof Just the same way you showed me (You showed) If you could die and come back to life Up for air from the swimming pool You'd kneel down to the dry land Kiss the Earth that birthed you Gave you tools just to stay alive And make it out when the sun is ruined That's the same way you showed me, showed me You showed me love Glory from above Regard my dear It's all downhill from here Remember life Remember how it was Climb trees, Michael Jackson, it all ends here Say what up to Matthew, to Shoob Say what up to Danny Say what up to life immortality Bending up my Nikes Running out the melpomene, nicotine Stealing granny cigs (Take it easy) Gimme something sweet Bitch, I might like immortality This is life, life immortality"
prompt = f"Based on this list of songs: {songs_dict}, use sentiment analysis on the image and return a song that best describes the image. Use the following JSON format ensuring parseability, Song: ,Artist: Language: No need for a reasoning."
model = genai.GenerativeModel("gemini-1.5-flash")

#API Call #1: User-submitted image goes into Gemini, returns: a song name, an artist, and the language in JSON format
response = model.generate_content([img, prompt]) 
response_json = json.loads(response.text[8:-5])
print(response_json)

#API Call #2: Gemini-returned song goes into the-lyrics-api, returns: lyrics for the song
#the_lyrics_api(response_json["Song"], response_json["Artist"], response_json["Language"])

#API Call #3: Input the lyrics of a song into Gemini to get a caption for the image
caption_prompt = f"Based on the following lyrics, return a lyric line caption that captures the vibe of the image. Return only the caption, no need for explanation. Lyrics {lyrics}"
# caption = model.generate_content([img, caption_prompt])
caption = model.generate_content([img,caption_prompt])
caption = caption.text[:-1]
print(caption)