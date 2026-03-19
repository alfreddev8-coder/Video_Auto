import os
import sys
import json
import asyncio
import requests
import random
from edge_tts import Communicate
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips, TextClip, CompositeVideoClip
import yt_dlp
from libsql_client import create_client

# Turso Config
DATABASE_URL = os.getenv("TURSO_DATABASE_URL")
AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

async def get_project_data(project_id):
    client = create_client(url=DATABASE_URL, auth_token=AUTH_TOKEN)
    result = client.execute("SELECT * FROM projects WHERE id = ?", [project_id])
    return result.rows[0] if result.rows else None

async def update_project_status(project_id, status, video_url=None):
    client = create_client(url=DATABASE_URL, auth_token=AUTH_TOKEN)
    if video_url:
        client.execute("UPDATE projects SET status = ?, video_url = ? WHERE id = ?", [status, video_url, project_id])
    else:
        client.execute("UPDATE projects SET status = ? WHERE id = ?", [status, project_id])

async def generate_voiceover(text, output_path):
    communicate = Communicate(text, "en-US-ChristopherNeural")
    await communicate.save(output_path)

def download_tiktok_search(keyword, output_dir, max_clips=5):
    """
    Search TikTok for videos based on keyword and download them.
    """
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': f'{output_dir}/%(id)s.%(ext)s',
        'noplaylist': True,
        'max_filesize': 50 * 1024 * 1024, # 50MB
        'quiet': True,
        'no_warnings': True,
        'download_archive': 'downloaded.txt',
    }
    
    # We want different channels, so we'll try to find multiple search results
    search_query = f"ttsearch{max_clips}:{keyword}"
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            ydl.download([search_query])
        except Exception as e:
            print(f"Error downloading clips for {keyword}: {e}")

def get_keywords(sentence):
    # Simple keyword extraction (remove common words)
    common_words = {'the', 'a', 'an', 'and', 'but', 'is', 'are', 'was', 'were', 'to', 'in', 'of', 'for', 'with'}
    words = [w.lower() for w in sentence.split() if w.lower() not in common_words and len(w) > 3]
    return " ".join(words[:3])

async def generate_video(project_id):
    project = await get_project_data(project_id)
    if not project: return

    script = project['script']
    lines = [L.strip() for L in script.split('\n') if L.strip()]
    
    # 1. Voiceover
    audio_path = "voiceover.mp3"
    await generate_voiceover(script, audio_path)
    audio = AudioFileClip(audio_path)
    
    # 2. Clips
    os.makedirs("clips", exist_ok=True)
    video_clips = []
    
    # Estimate time per line
    total_duration = audio.duration
    duration_per_line = total_duration / len(lines)
    
    for i, line in enumerate(lines):
        keywords = get_keywords(line)
        if not keywords: keywords = project['niche']
        
        download_tiktok_search(f"{project['niche']} {keywords}", "clips", max_clips=1)
        
        # Pick a random downloaded file in the clips folder that hasn't been used
        all_files = [f for f in os.listdir("clips") if f.endswith(('.mp4', '.mkv', '.webm'))]
        if not all_files:
            continue
            
        file_path = os.path.join("clips", random.choice(all_files))
        clip = VideoFileClip(file_path).subclip(0, duration_per_line)
        clip = clip.resize(height=1920) # Portrait
        clip = clip.crop(x_center=clip.w/2, width=1080, y_center=clip.h/2, height=1920)
        video_clips.append(clip)

    # 3. Final Assembly
    final_video = concatenate_videoclips(video_clips, method="compose")
    final_video = final_video.set_audio(audio)
    final_output = "final_video.mp4"
    final_video.write_videofile(final_output, fps=24, codec="libx264", audio_codec="aac")

    # 4. Upload & Finish
    # Placeholder for upload to Supabase/Cloudinary
    # In GitHub Actions, we can just print the success and update DB
    await update_project_status(project_id, "completed", "https://placeholder-url.com/video")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        asyncio.run(generate_video(sys.argv[1]))
