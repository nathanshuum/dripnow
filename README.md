# DripNow: Fashion Assistant for Colorblind Users

DripNow is a real-time speech-based fashion advisor designed specifically for colorblind individuals. The app helps users understand the colors in their outfits, provides coordination advice, and offers fashion tips through a natural voice conversation.

## How It Works

1. **Upload an outfit image**: Users take a photo or upload an image of their outfit
2. **AI Analysis**: Google's Gemini Vision API analyzes the outfit and provides detailed color information
3. **Voice Conversation**: Users talk with a Vapi-powered voice assistant to get fashion advice

## Features

- **Image Analysis**: Detailed breakdown of clothing colors with specific color names and coordination information
- **Voice Interface**: Natural speech conversation for asking questions about the outfit
- **Colorblind-Specific**: Provides advice tailored for people who have difficulty distinguishing colors
- **Real-time Feedback**: Interactive conversation with immediate responses

## Tech Stack

- **Frontend**: Next.js, React, and TypeScript
- **UI Components**: Shadcn UI components with Tailwind CSS
- **AI Vision**: Google Gemini Pro Vision API for image analysis
- **Voice AI**: Vapi.ai for real-time voice conversations
- **Animation**: Framer Motion for smooth UI transitions

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google Gemini API key
- Vapi.ai account with API key and assistant setup

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Gemini API key for image analysis
GEMINI_API_KEY=your_gemini_api_key_here

# VAPI public API key (for client-side usage)
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_api_key_here

# VAPI assistant ID (created in your VAPI dashboard)
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```

### Vapi Assistant Setup

1. Create a Vapi account at [vapi.ai](https://vapi.ai)
2. Create a new assistant with the following settings:
   - **Model**: Choose GPT-4 or equivalent for best results
   - **Voice**: Select a natural-sounding voice (Alloy or Nova recommended)
   - **Configure your assistant to be helpful and knowledgeable about fashion and color theory**

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage Guide

1. Open the application in your browser
2. Click "Upload Image" or "Take Photo" to capture your outfit
3. Wait a few seconds for the AI to analyze the image
4. Once analysis is complete, the voice assistant will automatically connect
5. Start talking to the assistant about your outfit
6. Ask questions like:
   - "What colors am I wearing?"
   - "Do these colors go well together?"
   - "What other colors would match with this shirt?"
   - "Is this appropriate for a formal event?"

## Development

### Project Structure

```
/
├── app/                # Next.js app router
│   ├── api/            # API routes
│   │   └── analyze-outfit/ # Image analysis endpoint
│   └── page.tsx        # Main application page
├── components/         # React components
│   ├── ImageUploader.tsx  # Image upload component
│   ├── VapiChat.tsx    # Voice assistant component
│   └── ui/             # UI components
├── utils/              # Utility functions
│   ├── getGeminiAnalysis.ts # Gemini API integration
│   └── vapiService.ts  # Vapi.ai integration
└── public/             # Static assets
```

## Troubleshooting

- **Microphone Access**: Ensure you've granted microphone permissions to the browser
- **Image Analysis Errors**: Make sure the image is clear and well-lit
- **Voice Assistant Not Connecting**: Check your API keys in the .env file

## License

[MIT License](LICENSE)
