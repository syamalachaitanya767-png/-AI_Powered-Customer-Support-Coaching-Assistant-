import os
import requests
import urllib3
from dotenv import load_dotenv

# Disable SSL verification warnings for local dev environment
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load .env file
load_dotenv()

# Read values from .env
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "nvidia/nemotron-3-nano-30b-a3b:free")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def get_headers():
    api_key = os.getenv("OPENROUTER_API_KEY")
    site_url = os.getenv("SITE_URL", "http://localhost:5000")
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": site_url,
        "X-Title": "AI Customer Support Assistant",
    }


def get_fallback_models():
    model = os.getenv("MODEL_NAME", "nvidia/nemotron-3-nano-30b-a3b:free")
    return [
        model,
        "nvidia/nemotron-3-nano-30b-a3b:free",
        "liquid/lfm-2.5-2.6b:free",
        "google/gemma-4-26b-a4b-it:free",
        "z-ai/glm-5.2:free",
    ]


def generate_response(prompt):
    # Try models in sequence if one hits rate limits or is unavailable
    models_to_try = []
    for m in get_fallback_models():
        if m and m not in models_to_try:
            models_to_try.append(m)

    headers = get_headers()

    for model in models_to_try:
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2,
            "top_p": 0.9,
            "presence_penalty": 0,
            "frequency_penalty": 0,
            "max_tokens": 500
        }

        try:
            response = requests.post(
                OPENROUTER_URL,
                headers=headers,
                json=payload,
                timeout=30,
                verify=False
            )

            print("=" * 60)
            print(f"Model: {model} | Status Code : {response.status_code}")
            print("=" * 60)

            if response.status_code == 200:
                data = response.json()
                if "choices" in data and len(data["choices"]) > 0:
                    message_obj = data["choices"][0].get("message", {})
                    content = message_obj.get("content") or message_obj.get("reasoning") or ""
                    if not content and "text" in data["choices"][0]:
                        content = data["choices"][0]["text"]
                    if content:
                        import re
                        content = re.sub(r"<think>.*?</think>", "", str(content), flags=re.DOTALL).strip()
                        if content:
                            return content

        except Exception as e:
            print(f"Error calling {model}: {e}")
            continue

    return "Sorry, I couldn't generate a response."