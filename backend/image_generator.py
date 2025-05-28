from flask import Flask, request, send_file, jsonify
import base64
import io
from google import genai
from google.genai import types
import os
from flask_cors import CORS

# Initialize the Gemini API client
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCUqIDiOTbIWcBIfukHHBcFalN1dRQRyGI")
genai.configure(api_key=API_KEY)
MODEL_ID = "gemini-2.0-flash-preview-image-generation"
client = genai.GenerativeModel(model_name=MODEL_ID)

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

        # Enhance prompt with style information
        enhanced_prompt = prompt
        if style:
            if style.lower() == "surreal":
                enhanced_prompt = f"{prompt}. Create a surreal, dreamlike image with vibrant colors and imaginative elements."
            elif style.lower() == "realistic":
                enhanced_prompt = f"{prompt}. Create a photorealistic image with natural lighting and detailed textures."
            elif style.lower() == "abstract":
                enhanced_prompt = f"{prompt}. Create an abstract representation with bold colors and geometric shapes."
            elif style.lower() == "anime":
                enhanced_prompt = f"{prompt}. Create an anime-style illustration with vibrant colors and expressive characters."

        print(f"Generating image with prompt: {enhanced_prompt}")

        response = client.generate_content(
            contents=enhanced_prompt,
            generation_config=types.GenerationConfig(
                response_mime_types=["image/png"]
            )
        )

        # For direct image response
        if request.args.get('format') == 'raw':
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_data = part.inline_data.data
                    image_bytes = base64.b64decode(image_data)
                    return send_file(
                        io.BytesIO(image_bytes),
                        mimetype="image/png",
                        as_attachment=False,
                        download_name="generated.png"
                    )

        # For JSON response with base64 image (compatible with OneirVision)
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                
                # Generate a unique ID for this visualization
                import time
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
