from flask import Flask, request, send_file, jsonify
import base64
import io
import os
import requests
import json
import time
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCUqIDiOTbIWcBIfukHHBcFalN1dRQRyGI")
MODEL_ID = "gemini-2.0-flash-preview-image-generation"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get("image_prompt")
        style = data.get("style", "")

        if not prompt:
            return jsonify({"error": "Missing 'image_prompt' in request body"}), 400

        # Use only the dream description as the prompt
        # Completely ignore any style parameter
        print(f"Generating image based solely on dream description")

        print(f"Generating image with prompt: {prompt}")

        # Call the Gemini API directly using requests with corrected parameters
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_ID}:generateContent?key={API_KEY}",
            headers={"Content-Type": "application/json"},
            json={
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                # Include both image/png and text/plain MIME types
                "generation_config": {
                    "response_mime_types": ["image/png", "text/plain"]
                }
            }
        )

        if response.status_code != 200:
            return jsonify({"error": f"Gemini API error: {response.status_code}: {response.text}"}), 500

        response_data = response.json()
        
        # For direct image response
        if request.args.get('format') == 'raw':
            for part in response_data["candidates"][0]["content"]["parts"]:
                if "inline_data" in part:
                    image_data = part["inline_data"]["data"]
                    image_bytes = base64.b64decode(image_data)
                    return send_file(
                        io.BytesIO(image_bytes),
                        mimetype="image/png",
                        as_attachment=False,
                        download_name="generated.png"
                    )

        # For JSON response with base64 image (compatible with OneirVision)
        for part in response_data["candidates"][0]["content"]["parts"]:
            if "inline_data" in part:
                image_data = part["inline_data"]["data"]
                
                # Generate a unique ID for this visualization
                visualization_id = f"vis-{int(time.time() * 1000)}"
                
                # Create visualization object matching the expected format from the frontend
                visualization = {
                    "id": visualization_id,
                    "title": f"Dream Visualization ({style} style)" if style else "Dream Visualization",
                    "description": "AI-generated visualization based on your dream description",
                    "imageUrl": f"data:image/png;base64,{image_data}",
                    "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                }
                
                return jsonify({"visualization": visualization})

        # If we get here, no image was found in the response
        return jsonify({"error": "No image found in the response"}), 500

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model": MODEL_ID})

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
