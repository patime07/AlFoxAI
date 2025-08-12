# AlFoxAI

![Animation](/Users/user/Downloads/AlFoxAi.gif)

AlFoxAi addresses the educational gap for Arabic-speaking learners in artificial intelligence by providing MIT-level, culturally relevant content generated using advanced language models. The platform was developed during the 2nd Hack-Nation's Global AI Hackathon, in collaboration with the MIT Sloan AI Club (in just 24 HOURS !)

## Problem Statement

Despite over 400 million Arabic speakers worldwide, less than 0.5% of online content is in Arabic. Educational resources, especially in AI theory, are scarce and often inaccessible to Arabic learners. This language gap limits equal participation in AI education and innovation across Arabic-speaking regions. Additionally, many learners struggle emotionally when faced with complex theoretical content, leading to poor retention.

## Solution

AlFoxAi is an emotionally intelligent Arabic-first AI professor focused exclusively on AI theory. It begins by identifying the learner’s preferred learning style (visual, auditory, text-based, or kinesthetic) and adapts lessons accordingly. Core features include:

- Content Generator: Automated lesson and quiz creation
- Audio Player: Chunked audio playback with text synchronization
- Assessment Engine: Multi-format quiz system with adaptive feedback
- Progress Tracker: Learning path management and completion tracking


## Technical Architecture

### Frontend
- Vanilla HTML5, CSS3, and JavaScript
- Right-to-left (RTL) text support for Arabic content

### Backend Services
- OpenAI GPT-4o API for Arabic content generation
- ElevenLabs API for text-to-speech generation
- LocalStorage

## Installation

1. Clone the repository
```bash
git clone https://github.com/username/araprof-ai.git
cd araprof-ai
```

2. Configure API keys in `js/content-generator.js`
```javascript
const OPENAI_API_KEY = 'your-openai-api-key';
const ELEVENLABS_API_KEY = 'your-elevenlabs-api-key';
const VOICE_ID = 'your-arabic-voice-id';
```

3. Serve the application using a local HTTP server
```bash
python -m http.server 8000
# or
npx http-server
```

4. Navigate to `http://localhost:8000`

## Usage

### Content Generation
Run the content generation script to create lesson materials:
```javascript
ContentGenerator.generateCompleteLesson();
```

This generates:
- 4 lesson chunks in Arabic (approximately 1500 words)
- Assessment questions with multiple formats
- Audio files for each lesson segment
- Key terminology with translations

### User Journey
1. User selects knowledge level (Beginner/Intermediate/Advanced)
2. User chooses learning style (Visual/Auditory/Reading-Writing)
3. Platform generates personalized lesson content
4. User progresses through chunked audio lessons
5. Assessment validates comprehension
6. Adaptive feedback provided based on performance

## File Structure

```
araprof-ai/
├── index.html              # Welcome page
├── levels.html              # Knowledge level selection
├── learning-style.html      # Learning style selection
├── lesson1.html             # Primary lesson interface
├── quiz1.html               # Assessment interface
├── css/
│   ├── main.css            # Global styles
│   ├── welcome.css         # Welcome page styles
│   ├── lessons.css         # Lesson interface styles
│   └── quiz.css            # Quiz interface styles
├── js/
│   ├── main.js             # Core navigation logic
│   ├── content-generator.js # API integration
│   ├── lesson-player.js    # Audio playback management
│   └── quiz-handler.js     # Assessment logic
└── README.md
```

## API Integration

### OpenAI GPT-4o
- Generates lesson content in Modern Standard Arabic
- Creates culturally relevant examples using Middle Eastern context
- Produces assessment questions with varying difficulty levels
- Provides adaptive feedback based on student responses

### ElevenLabs
- Synthesizes natural Arabic speech from generated text
- Maintains consistent voice across all lesson segments
- Optimized for educational content delivery

## Acknowledgments

- MIT OpenCourseWare for curriculum foundation
- OpenAI for content generation capabilities
- ElevenLabs for Arabic voice synthesis
- Global AI Hackathon for development opportunity
