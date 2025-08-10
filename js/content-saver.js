const saveContent = async (lessonData) => {
    try {
        // Save lesson text content
        localStorage.setItem('lesson1_text', JSON.stringify(lessonData.lesson));

        // Save audio files (as base64 strings for simplicity in this demo)
        const audioPromises = lessonData.audio.map(async (audioItem, index) => {
            const arrayBuffer = audioItem.audioData;
            const base64String = await arrayBufferToBase64(arrayBuffer);
            localStorage.setItem(`lesson1_audio_chunk${index + 1}`, base64String);
            return { chunkId: audioItem.chunkId, filename: audioItem.filename, base64: base64String };
        });

        const savedAudio = await Promise.all(audioPromises);
        console.log('Content saved: text + audio files');
        return { text: lessonData.lesson, audio: savedAudio };
    } catch (error) {
        console.error('Error saving content:', error);
        return null;
    }
};

const loadContent = async () => {
    try {
        const text = localStorage.getItem('lesson1_text');
        const audioFiles = [];
        let index = 1;
        while (localStorage.getItem(`lesson1_audio_chunk${index}`)) {
            const base64 = localStorage.getItem(`lesson1_audio_chunk${index}`);
            const arrayBuffer = await base64ToArrayBuffer(base64);
            audioFiles.push({
                chunkId: index,
                filename: `lesson1_chunk${index}.mp3`,
                audioData: arrayBuffer
            });
            index++;
        }

        if (text && audioFiles.length > 0) {
            console.log('Content loaded: text + audio files');
            return { lesson: JSON.parse(text), audio: audioFiles };
        } else {
            console.error('No saved content');
            return null;
        }
    } catch (error) {
        console.error('Error loading content:', error);
        return null;
    }
};

// Utility to convert ArrayBuffer to Base64
const arrayBufferToBase64 = async (buffer) => {
    return new Promise((resolve) => {
        const blob = new Blob([buffer], { type: 'audio/mpeg' });
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
    });
};

// Utility to convert Base64 to ArrayBuffer
const base64ToArrayBuffer = async (base64) => {
    const response = await fetch(`data:audio/mpeg;base64,${base64}`);
    return await response.arrayBuffer();
};

window.ContentSaver = {
    saveContent,
    loadContent
};