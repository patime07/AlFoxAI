// Content Generator - OpenAI API Integration
const OPENAI_API_KEY = 'your key';
const ELEVENLABS_API_KEY = 'your key';
const VOICE_ID = 'JjTirzdD7T3GMLkwdd3a'; 

// Lesson 1 Generation Function
async function generateLesson1() {
    const lessonPrompt = `
    Create a comprehensive Arabic lesson about "Introduction to Search in AI" for advanced computer science students.

    REQUIREMENTS:
    - Total length: ~1500 words (10 minutes reading time)
    - Language: Modern Standard Arabic
    - Level: Advanced (MIT 6.034 equivalent)
    
    CONTENT STRUCTURE:
    1. Introduction to the lesson (2 minutes / ~300 words)
    2. Role of search in AI (3 minutes / ~450 words)
    3. Uninformed vs Informed search (3 minutes / ~450 words) 
    4. Any-path vs Optimal path (2 minutes / ~300 words)

    CHUNKING:
    - Divide content into 4 clear chunks/sections
    - Each chunk should be timed for audio narration
    - Include natural pause points between chunks

    CONTEXT & EXAMPLES:
    - Use Middle Eastern companies (Careem, Talabat, Noon, Anghami)
    - Include practical applications in Arabic context
    - Reference MIT 6.034 concepts but make accessible

    OUTPUT FORMAT:
    Return as JSON with this exact structure:
    {
        "title": "Arabic lesson title",
        "totalWords": number,
        "estimatedTime": "10 minutes",
        "chunks": [
            {
                "id": 1,
                "title": "Introduction",
                "timeStart": "0:00",
                "timeEnd": "2:00", 
                "arabicText": "chunk content in Arabic...",
                "englishSummary": "brief English summary",
                "wordCount": number
            }
            // ... 3 more chunks
        ],
        "keyTerms": [
            {"arabic": "البحث", "english": "Search", "definition": "..."},
            // ... more terms
        ]
    }

    Make the Arabic natural, engaging, and technically accurate.
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert Arabic AI educator creating MIT-quality content.'
                    },
                    {
                        role: 'user',
                        content: lessonPrompt
                    }
                ],
                max_tokens: 4000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        let responseContent = data.choices[0].message.content;
        
        // Clean up markdown formatting if present
        if (responseContent.includes('```json')) {
            responseContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const lessonContent = JSON.parse(responseContent);
        
        console.log('Lesson content generated');
        return lessonContent;

    } catch (error) {
        console.error('Error generating lesson:', error);
        return null;
    }
}

// Quiz Generation Function
async function generateQuiz() {
    const quizPrompt = `
    Create a 10-question quiz for the lesson "Introduction to Search in AI" in Arabic.

    REQUIREMENTS:
    - 10 questions total
    - Mix of question types: multiple choice, short answer, fill the gap
    - Questions in Modern Standard Arabic
    - English translations provided
    - Covers all lesson topics

    TOPICS TO COVER:
    1. Role of search in AI (3 questions)
    2. Uninformed vs Informed search (4 questions)
    3. Any-path vs Optimal search (3 questions)

    OUTPUT FORMAT:
    {
        "quizTitle": "اختبار: مقدمة في البحث في الذكاء الاصطناعي",
        "totalQuestions": 10,
        "questions": [
            {
                "id": 1,
                "type": "multiple_choice",
                "arabicQuestion": "Arabic question text",
                "englishTranslation": "English translation",
                "options": [
                    {"arabic": "option A in Arabic", "english": "option A translation"},
                    {"arabic": "option B in Arabic", "english": "option B translation"},
                    {"arabic": "option C in Arabic", "english": "option C translation"},
                    {"arabic": "option D in Arabic", "english": "option D translation"}
                ],
                "correctAnswer": 1,
                "explanation": {
                    "arabic": "explanation in Arabic",
                    "english": "explanation in English"
                },
                "encouragement": {
                    "correct": {
                        "arabic": "ممتاز! إجابة صحيحة",
                        "english": "Excellent! Correct answer"
                    },
                    "incorrect": {
                        "arabic": "لا بأس، تعلم من الأخطاء",
                        "english": "No worries, learn from mistakes"
                    }
                }
            }
            // ... 9 more questions
        ]
    }
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system', 
                        content: 'You are creating educational Arabic quiz content.'
                    },
                    {
                        role: 'user',
                        content: quizPrompt
                    }
                ],
                max_tokens: 3000,
                temperature: 0.5
            })
        });

        const data = await response.json();
        let responseContent = data.choices[0].message.content;
        
        // Clean up markdown formatting if present
        if (responseContent.includes('```json')) {
            responseContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        const quizContent = JSON.parse(responseContent);
        
        console.log('Quiz generated');
        return quizContent;

    } catch (error) {
        console.error('Error generating quiz:', error);
        return null;
    }
}

// ElevenLabs Audio Generation
async function generateAudio(text, filename) {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBuffer = await response.arrayBuffer();
        
        // Save audio file (you'll need to implement file saving based on your setup)
        console.log(`Audio generated for: ${filename}`);
        return audioBuffer;

    } catch (error) {
        console.error('Error generating audio:', error);
        return null;
    }
}

// Generate all lesson content and audio
async function generateCompleteLesson() {
    console.log('Starting lesson generation...');
    
    try {
        // 1. Generate lesson content
        console.log('Generating lesson content...');
        const lessonContent = await generateLesson1();
        if (!lessonContent) throw new Error('Failed to generate lesson content');

        // 2. Generate quiz
        console.log('Generating quiz...');
        const quizContent = await generateQuiz();
        if (!quizContent) throw new Error('Failed to generate quiz');

        // 3. Generate audio for each chunk
        console.log('🎵 Generating audio files...');
        const audioFiles = [];
        
        for (let i = 0; i < lessonContent.chunks.length; i++) {
            const chunk = lessonContent.chunks[i];
            console.log(`Generating audio for chunk ${i + 1}...`);
            
            const audio = await generateAudio(chunk.arabicText, `lesson1_chunk${i + 1}.mp3`);
            if (audio) {
                audioFiles.push({
                    chunkId: chunk.id,
                    filename: `lesson1_chunk${i + 1}.mp3`,
                    audioData: audio
                });
            }
            
            // Add delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 4. Save everything
        const completeLesson = {
            lesson: lessonContent,
            quiz: quizContent,
            audio: audioFiles,
            generatedAt: new Date().toISOString()
        };

        // Save to localStorage for now (in production, save to server)
        localStorage.setItem('lesson1_complete', JSON.stringify(completeLesson));
        
        console.log('Complete lesson generated and saved!');
        return completeLesson;

    } catch (error) {
        console.error('Error in lesson generation:', error);
        throw error;
    }
}

// Load saved lesson content
function loadLesson1() {
    const savedLesson = localStorage.getItem('lesson1_complete');
    if (savedLesson) {
        return JSON.parse(savedLesson);
    }
    return null;
}

// Export functions
window.ContentGenerator = {
    generateCompleteLesson,
    generateLesson1,
    generateQuiz,
    generateAudio,
    loadLesson1
};

// ... (previous imports and code remain unchanged)

async function generateCompleteLesson() {
    console.log('Starting lesson generation...');
    
    try {
        // 1. Generate lesson content
        console.log('Generating lesson content...');
        const lessonContent = await generateLesson1();
        if (!lessonContent) throw new Error('Failed to generate lesson content');

        // 2. Generate quiz
        console.log('Generating quiz...');
        const quizContent = await generateQuiz();
        if (!quizContent) throw new Error('Failed to generate quiz');

        // 3. Generate audio for each chunk
        console.log('Generating audio files...');
        const audioFiles = [];
        
        for (let i = 0; i < lessonContent.chunks.length; i++) {
            const chunk = lessonContent.chunks[i];
            console.log(`Generating audio for chunk ${i + 1}...`);
            
            const audio = await generateAudio(chunk.arabicText, `lesson1_chunk${i + 1}.mp3`);
            if (audio) {
                audioFiles.push({
                    chunkId: chunk.id,
                    filename: `lesson1_chunk${i + 1}.mp3`,
                    audioData: audio
                });
            }
            
            // Add delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 4. Save everything
        const completeLesson = {
            lesson: lessonContent,
            quiz: quizContent,
            audio: audioFiles,
            generatedAt: new Date().toISOString()
        };

        // Use ContentSaver to save
        await window.ContentSaver.saveContent(completeLesson);
        
        console.log('Complete lesson generated and saved!');
        return completeLesson;

    } catch (error) {
        console.error('Error in lesson generation:', error);
        throw error;
    }
}

