from flask import Flask, request, jsonify, render_template
from youtube_transcript_api import YouTubeTranscriptApi
import re
from collections import Counter

app = Flask(__name__, static_folder='static')

def get_video_id(url):
    video_id_match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    if video_id_match:
        return video_id_match.group(1)
    else:
        return None

def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([entry['text'] for entry in transcript])
    except Exception as e:
        print(f"Virhe transkriptin hakemisessa: {e}")
        return None

def process_transcript(transcript):
    words = re.findall(r'\w+', transcript.lower())
    word_counts = Counter(words)
    top_10_words = word_counts.most_common(10)
    return top_10_words

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    video_url = request.form['video_url']
    video_id = get_video_id(video_url)
    
    if video_id:
        transcript = get_transcript(video_id)
        if transcript:
            top_words = process_transcript(transcript)
            return jsonify({'success': True, 'result': top_words})
        else:
            return jsonify({'success': False, 'error': 'Transkriptiota ei löytynyt.'})
    else:
        return jsonify({'success': False, 'error': 'Virheellinen YouTube URL.'})

if __name__ == "__main__":
    app.run(debug=True)