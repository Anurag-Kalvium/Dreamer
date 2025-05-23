# OneirVision Backend

This is the backend server for OneirVision, providing AI-powered dream interpretation services using OpenAI's GPT-4 API.

## Setup

1. Make sure you have Node.js installed on your system
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running the Server

Start the server with:
```
node index.js
```

The server will run on port 5000 by default.

## API Endpoints

### POST /interpret

Interprets a dream using AI.

**Request Body:**
```json
{
  "dreamText": "Description of the dream to interpret"
}
```

**Response:**
```json
{
  "interpretation": "AI-generated interpretation of the dream"
}
```

## Connecting with Frontend

The frontend React application should make POST requests to `http://localhost:5000/interpret` to get dream interpretations.
