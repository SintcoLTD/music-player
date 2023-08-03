const audioPlayer = document.getElementById('audioPlayer');
const musicList = document.getElementById('songList');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressSlider = document.getElementById('progressSlider');
const progressTime = document.getElementById('progressTime');
const speedSelect = document.getElementById('speedSelect');

let isPlaying = false;
let isSeeking = false;

function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = 'Play';
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
}

function updateProgressSlider() {
    if (!isSeeking) {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progress = (currentTime / duration) * 100;
        progressSlider.value = currentTime;
        progressTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
}

// Helper function to create and add a download button to the music list
function addDownloadButton(li, songName) {
    const downloadDiv = document.createElement('div');
    downloadDiv.className = 'download-div';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.className = 'download-btn';
    downloadBtn.setAttribute('data-song', songName);

    // Event listener for the download button
    downloadBtn.addEventListener('click', function () {
        const songSrc = `music/${this.getAttribute('data-song')}.mp3`;
        const link = document.createElement('a');
        link.href = songSrc;
        link.download = `${this.getAttribute('data-song')}.mp3`;
        link.click();
    });

    downloadDiv.appendChild(downloadBtn);
    li.appendChild(downloadDiv);

    const songNameDiv = document.createElement('div');
    songNameDiv.textContent = songName;
    songNameDiv.className = 'song-name';

    // Event listener for the song name
    songNameDiv.addEventListener('click', function () {
        const currentSong = document.querySelector('.song-name.darken');
        if (currentSong) {
            currentSong.classList.remove('darken');
        }
        audioPlayer.src = `music/${songName}.mp3`;
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.textContent = 'Pause';
        songNameDiv.classList.add('darken');
    });

    li.appendChild(songNameDiv);
    musicList.appendChild(li);
}

// Fetch the list of songs from the server
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(songName => {
            const songSrc = `music/${songName}.mp3`;
            const li = document.createElement('li');
            li.setAttribute('data-src', songSrc);
            addDownloadButton(li, songName); // Add the download button
        });
    });

// Add event listeners to each list item to play the corresponding song
musicList.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        const songSource = event.target.getAttribute('data-src');
        audioPlayer.src = songSource;
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.textContent = 'Pause';
    }
});

// Event listener for the play/pause button
playPauseBtn.addEventListener('click', togglePlay);

// Event listener for the progress slider (when the user drags the slider)
progressSlider.addEventListener('input', function () {
    const seekTime = parseFloat(this.value);
    audioPlayer.currentTime = seekTime;
    progressTime.textContent = `${formatTime(seekTime)} / ${formatTime(audioPlayer.duration)}`;
    isSeeking = true;
});

// Event listener for the progress slider (when the user releases the slider)
progressSlider.addEventListener('change', function () {
    isSeeking = false;
});

// Event listener for the audio time update to update the progress slider
audioPlayer.addEventListener('timeupdate', updateProgressSlider);

// Event listener for the speed selection
speedSelect.addEventListener('change', function () {
    audioPlayer.playbackRate = parseFloat(this.value);
});

// Helper function to format time in MM:SS format
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
