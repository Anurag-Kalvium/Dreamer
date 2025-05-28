# OneirVision Image Generation Service

This service uses Google's Gemini model to generate dream visualizations for the OneirVision app.

## Setup Instructions

1. Install the required Python packages:

```bash
pip install -r requirements.txt
```

2. Make sure your Gemini API key is set in the `.env` file or as an environment variable:

```
GEMINI_API_KEY=your_api_key_here
```

3. Start the image generation service:

```bash
python image_generator.py
```

The service will run on port 5001 by default.

## API Endpoints

### Generate Image

**Endpoint:** `/generate-image`

**Method:** POST

**Request Body:**
```json
{
  "image_prompt": "Description of the dream to visualize",
  "style": "surreal" // Optional: can be "surreal", "realistic", "abstract", or "anime"
}
```

**Response:**
```json
{
  "visualization": {
    "id": "vis-1234567890",
    "title": "Dream Visualization (surreal style)",
    "description": "AI-generated visualization based on your dream description",
    "imageUrl": "data:image/png;base64,<base64_encoded_image>",
    "createdAt": "2025-05-28T05:01:23.456Z"
  }
}
```

### Health Check

**Endpoint:** `/health`

**Method:** GET

**Response:**
```json
{
  "status": "healthy",
  "model": "gemini-2.0-flash-preview-image-generation"
}
```

## Integration with OneirVision

The OneirVision frontend has been updated to connect to this service instead of the Node.js backend for image generation. The service maintains the same response format to ensure compatibility with the existing frontend code.
