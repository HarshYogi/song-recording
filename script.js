// Global variables
let mediaRecorder;
let recordedChunks = [];
let selectedSongLyrics = "";
let recordedAudios = {};

// Get references to DOM elements
const songSelect = document.getElementById('songSelect');
const lyricsDisplay = document.getElementById('lyricsDisplay');
const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const recordingsList = document.getElementById('recordingsList');
const lyricsImage = document.getElementById('lyricsImage');

// A mapping of song values to their corresponding lyrics
const songLyrics = {
    song1: "10000 hour.png",
    song2: "chaand baaliyaan .png",
    song3: "one call away.png",
    song4: "kabhi tumhe.png",
    song5: "never be the same.png",
    song6: "pasoori.png",
    song7: "steal my girl.png",
    song8: "raanjha.png",
    // Add more song lyrics here
};

// Event listener for song selection
songSelect.addEventListener('change', () => {
    const selectedSong = songSelect.value;
    if (selectedSong === '') {
        // If no song is selected, disable the "Start Recording" button
        startRecordingBtn.disabled = true;
        lyricsDisplay.innerText = '';
        lyricsImage.src = ''; // Clear the image source
    } else {
        // If a song is selected, enable the "Start Recording" button and display lyrics
        startRecordingBtn.disabled = false;
        selectedSongLyrics = songLyrics[selectedSong];
        
        // Check if the selectedSongLyrics is an image URL or a valid image filename
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const isImage = imageExtensions.some(ext => selectedSongLyrics.toLowerCase().endsWith(ext));
        
        if (isImage) {
            lyricsImage.src = selectedSongLyrics; // Set the image source
            lyricsDisplay.innerText = ''; // Clear the text display if any
        } else {
            lyricsDisplay.innerText = selectedSongLyrics; // Set the text display
            lyricsImage.src = ''; // Clear the image source if any
        }
    }
});

// Event listener for start recording button
startRecordingBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleRecordingStop;
        recordedChunks = [];
        mediaRecorder.start();

        // Update button states
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
});

// Event listener for stop recording button
stopRecordingBtn.addEventListener('click', () => {
    mediaRecorder.stop();

    // Update button states
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
});

// Function to handle recorded data
function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

// Function to handle recording stop
function handleRecordingStop() {
    const selectedSong = songSelect.value;
    const blob = new Blob(recordedChunks, { type: 'audio/mpeg' });

    // Save the recorded audio blob with the song name
    if (!recordedAudios[selectedSong]) {
        recordedAudios[selectedSong] = [];
    }
    recordedAudios[selectedSong].push(blob);

    // Create audio element for playback
    const url = URL.createObjectURL(blob);
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.src = url;

    // Create an element to display the song name
    const songNameElement = document.createElement('div');
    songNameElement.className = `audio`
    songNameElement.innerText = `Song Name: ${selectedSong}`;

    // Append the recorded audio and song name to the list
    const recordingItem = document.createElement('div');
    recordingItem.className = `audios`;
    recordingItem.appendChild(songNameElement);
    recordingItem.appendChild(audioElement);

    // Insert the new recording at the top of the list
    const recordingsList = document.getElementById('recordingsList');
    recordingsList.insertBefore(recordingItem, recordingsList.firstChild);

    // Clear recordedChunks array for the next recording
    recordedChunks = [];
}