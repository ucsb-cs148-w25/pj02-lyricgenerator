import requests

MUSIXMATCH_API_KEY = os.getenv("MUSIXMATCH_API_KEY")

GENRE_MAP = {
    "pop": 14,
    "rock": 21,
    "hip-hop": 18,
    "jazz": 11,
    "electronic": 7,
    "classical": 5,
}

def get_top_songs_by_genre(genre):
    """Fetch the top 3 popular songs in a given genre using Musixmatch API."""
    genre_id = GENRE_MAP.get(genre.lower())
    if not genre_id:
        return []

    url = f"https://api.musixmatch.com/ws/1.1/track.search?music_genre_id={genre_id}&page_size=3&s_track_rating=desc&apikey={MUSIXMATCH_API_KEY}"
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
    """Fetch lyrics for a list of songs """
    lyrics_list = []

    for song in songs:
        track_id = song["track_id"]
        url = f"https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id={track_id}&apikey={MUSIXMATCH_API_KEY}"
        response = requests.get(url)

        if response.status_code == 200:
            lyrics_data = response.json()["message"]["body"].get("lyrics", {})
            lyrics = lyrics_data.get("lyrics_body", "Lyrics not available.")
            lyrics_list.append({
                "title": song["title"],
                "artist": song["artist"],
                "lyrics": lyrics
            })

    return lyrics_list