# DripNow - Colorblind Fashion Assistant

A voice-enabled fashion assistant specifically designed to help colorblind individuals understand and coordinate their outfits.

## Features

- **Image Analysis**: Upload photos of your outfits for detailed color and style analysis using Google's Gemini Vision API
- **Voice Conversations**: Get real-time fashion advice through natural voice conversations powered by VAPI
- **Color Education**: Learn about color combinations and style rules tailored for colorblind users
- **Responsive Design**: Works on both desktop and mobile devices

## How It Works

1. Users upload a photo of their outfit
2. Google Gemini analyzes the image and provides a detailed description of colors and style
3. This description is sent to VAPI's voice assistant as context
4. Users can have natural voice conversations with the assistant about their outfit

## Getting Started

### Prerequisites

- Node.js (v16+)
- PNPM (recommended) or NPM
- Google Gemini API key
- VAPI account and API keys

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/dripnow.git
cd dripnow
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

3. Create a `.env.local` file based on `.env.example`
```bash
cp .env.example .env.local
```

4. Add your API keys to the `.env.local` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_api_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```

### VAPI Assistant Setup

1. Create a new assistant in your [VAPI Dashboard](https://app.vapi.ai)
2. Configure your assistant with appropriate settings:
   - Model: We recommend GPT-4o or similar for best quality advice
   - Voice: Choose a natural-sounding voice that's easy to understand
   - System Prompt: Include color theory basics and fashion advice

3. Copy the assistant ID to your `.env.local` file

### Running the Application

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Allow microphone access when prompted
2. Upload a photo of your outfit using the interface
3. Wait for the analysis to complete
4. Start speaking with the assistant about your outfit
5. Ask questions about colors, style, and possible improvements

## Tech Stack

- **Next.js**: React framework for the frontend
- **Google Gemini**: Multimodal AI for image analysis
- **VAPI**: Voice assistant platform for natural conversations
- **TailwindCSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with ❤️ to help colorblind individuals navigate fashion with confidence
