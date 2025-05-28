from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Gemini API configuration
API_KEY = "AIzaSyCUqIDiOTbIWcBIfukHHBcFalN1dRQRyGI"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent"

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get("image_prompt")

        if not prompt:
            return jsonify({"error": "Missing 'image_prompt'"}), 400

        # Prepare the payload for image generation
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "response_mime_type": ["image/png"],
            "generationConfig": {
                "temperature": 0.7
            }
        }

        # Make the API request to Gemini
        response = requests.post(
            f"{GEMINI_API_URL}?key={API_KEY}",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        # Check for errors in the response
        response.raise_for_status()
        
        # Return the full response from Gemini
        return jsonify(response.json()), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
