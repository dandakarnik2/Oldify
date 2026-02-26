const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const fileInput = document.getElementById('file-input');
const songsGrid = document.getElementById('songs-grid');
const emptyState = document.getElementById('empty-state');
const progressBar = document.getElementById('progress-bar');
const titleDisplay = document.getElementById('current-title');

// Prvky UI
const homeView = document.getElementById('home-view');
const playerView = document.getElementById('player-view');
const backBtn = document.getElementById('back-btn');
const openPlayerBtn = document.getElementById('open-player-btn');

// Sekce
const navHome = document.getElementById('nav-home');
const navLibrary = document.getElementById('nav-library');
const homeSection = document.getElementById('home-section');
const librarySection = document.getElementById('library-section');
const playlistDetailSection = document.getElementById('playlist-detail-section');

// Playlisty UI
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const playlistsGrid = document.getElementById('playlists-grid');
const emptyPlaylistState = document.getElementById('empty-playlist-state');
const detailPlaylistName = document.getElementById('detail-playlist-name');
const detailPlaylistCount = document.getElementById('detail-playlist-count');
const playlistSongsGrid = document.getElementById('playlist-songs-grid');
const backToLibraryBtn = document.getElementById('back-to-library-btn');
const playlistFileInput = document.getElementById('playlist-file-input');

// ==========================================
// TVÁ DATABÁZE (Předpřipravené skladby)
// ==========================================
let globalSongs = [
    { name: "DGG - DASCH Gruppe (feat. Olda)", fileUrl: "hudba/DGG - DASCH Gruppe (feat. Olda).mp3", coverUrl:"covers/IMG_20260227_000602.jpg"}, 
    { name: "FEELOW - DGG (feat. 0LD4, H0NZ1K & CHYT4PUST).mp3", fileUrl: "hudba/FEELOW - DGG (feat. 0LD4, H0NZ1K & CHYT4PUST).mp3", coverUrl:"covers/IMG_20260227_000631.jpg"},
    { name: "JOOOBOY - Šimon Anděl (feat. Danny)", fileUrl:"hudba/JOOOBOY - Šimon Anděl (feat. Danny).mp3", coverUrl:"covers/Screenshot_2026-02-27-00-03-02-415_com.discord.jpg" },
    { name: "Music sounds better with Feelow - Olda (feat. DGG)", fileUrl: "hudba/Music sounds better with Feelow - Olda (feat. DGG & HONZ1K).mp3", coverUrl:"covers/Screenshot_2026-02-27-00-04-54-957_com.whatsapp.jpg" },
    { name: "NÁŠ MILÝ FEELOW - DGG", fileUrl: "hudba/NÁŠ MILÝ FEELOU - DGG.mp3" },
    { name: "Olda Phonk - OP", fileUrl: "hudba/OLDA phonk.mp3", coverUrl:"covers/Adobe_Express_20230711_1256210_1.png" },
    { name: "Moje milá škola - Olda (feat. kDS)", fileUrl: "hudba/Oldrich - Moje milá škola (feat. Karniel Damuel Samík).mp3", coverUrl:"covers/Screenshot_2026-02-27-00-02-57-138_com.discord.jpg",

     }
]; 

let playlists = [
    {
      name: "DGG Official Playlist",
      songs: [
        { name: "DGG - DASCH Gruppe (feat. Olda)", fileUrl: "hudba/DGG - DASCH Gruppe (feat. Olda).mp3"}, 
        { name: "FEELOW - DGG (feat. 0LD4, H0NZ1K & CHYT4PUST).mp3", fileUrl: "hudba/FEELOW - DGG (feat. 0LD4, H0NZ1K & CHYT4PUST).mp3"},
        { name: "JOOOBOY - Šimon Anděl (feat. Danny)", fileUrl:"hudba/JOOOBOY - Šimon Anděl (feat. Danny).mp3" },
        { name: "Music sounds better with Feelow - Olda (feat. DGG)", fileUrl: "hudba/Music sounds better with Feelow - Olda (feat. DGG & HONZ1K) .mp3" },
        { name: "NÁŠ MILÝ FEELOW - DGG", fileUrl: "hudba/NÁŠ MILÝ FEELOU - DGG.mp3" },
        { name: "Olda Phonk - OP", fileUrl: "hudba/OLDA phonk.mp3" },
        { name: "Moje milá škola - Olda (feat. kDS)", fileUrl: "hudba/Oldrich - Moje milá škola (feat. Karniel Damuel Samík).mp3" }
      ]
    }
]; 

let currentActivePlaylistIndex = null; 
let currentQueue = []; 
let currentIndex = 0;


// --- VYKRESLENÍ ÚVODNÍ OBRAZOVKY (Toto předtím chybělo) ---
function renderGlobalSongs() {
    songsGrid.innerHTML = '';
    globalSongs.forEach((item, index) => {
        const cleanName = item.name.replace(/\.[^/.]+$/, ""); // Odstraní koncovku .mp3 z názvu pro hezčí vzhled
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300" alt="Cover">
                <button class="card-play-btn">▶</button>
            </div>
            <div class="card-info"><h4>${cleanName}</h4></div>
        `;
        card.onclick = () => { playSong(index, globalSongs); showPlayerView(); };
        const playIcon = card.querySelector('.card-play-btn');
        playIcon.onclick = (event) => { event.stopPropagation(); playSong(index, globalSongs); showPlayerView(); };
        songsGrid.appendChild(card);
    });
}

function renderPlaylists() {
    playlistsGrid.innerHTML = '';
    if (emptyPlaylistState && playlists.length > 0) emptyPlaylistState.style.display = 'none';
    
    playlists.forEach((pl, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-container playlist-card-img">🎵</div>
            <div class="card-info">
                <h4>${pl.name}</h4>
                <p id="pl-count-${index}">${pl.songs.length} skladeb</p>
            </div>
        `;
        card.onclick = () => openPlaylistDetail(index);
        playlistsGrid.appendChild(card);
    });
}

// Spustíme vykreslování hned po načtení
renderGlobalSongs();
renderPlaylists();


// --- DYNAMICKÉ UVÍTÁNÍ ---
const hour = new Date().getHours();
const greetingDisplay = document.getElementById('greeting');
if (hour < 12) greetingDisplay.textContent = 'Dobré ráno';
else if (hour < 18) greetingDisplay.textContent = 'Dobré odpoledne';
else greetingDisplay.textContent = 'Dobrý večer';

// --- PŘEPÍNÁNÍ POHLEDŮ ---
function showPlayerView() { homeView.classList.remove('active'); playerView.classList.add('active'); }
function showHomeView() { playerView.classList.remove('active'); homeView.classList.add('active'); if (currentQueue.length > 0) openPlayerBtn.style.display = 'block'; }
backBtn.addEventListener('click', showHomeView);
openPlayerBtn.addEventListener('click', showPlayerView);

// --- NAVIGACE ---
function hideAllSections() {
    homeSection.classList.add('hidden');
    librarySection.classList.add('hidden');
    playlistDetailSection.classList.add('hidden');
}

navHome.addEventListener('click', () => {
    navHome.classList.add('active-link'); navLibrary.classList.remove('active-link');
    hideAllSections(); homeSection.classList.remove('hidden');
});

navLibrary.addEventListener('click', () => {
    navLibrary.classList.add('active-link'); navHome.classList.remove('active-link');
    hideAllSections(); librarySection.classList.remove('hidden');
});

backToLibraryBtn.addEventListener('click', () => {
    hideAllSections(); librarySection.classList.remove('hidden');
});

// --- VYTVÁŘENÍ PLAYLISTŮ ---
createPlaylistBtn.addEventListener('click', () => {
    const playlistName = prompt("Zadej název nového playlistu:");
    if (playlistName && playlistName.trim() !== "") {
        playlists.push({ name: playlistName, songs: [] });
        renderPlaylists();
    }
});

// --- OTEVŘENÍ DETAILU PLAYLISTU ---
function openPlaylistDetail(index) {
    currentActivePlaylistIndex = index;
    const pl = playlists[index];
    detailPlaylistName.textContent = pl.name;
    detailPlaylistCount.textContent = `${pl.songs.length} skladeb`;
    hideAllSections();
    playlistDetailSection.classList.remove('hidden');
    renderPlaylistSongs();
}

// --- VYKRESLENÍ SKLADEB V PLAYLISTU ---
function renderPlaylistSongs() {
    playlistSongsGrid.innerHTML = '';
    const plSongs = playlists[currentActivePlaylistIndex].songs;
    
    if (plSongs.length === 0) {
        playlistSongsGrid.innerHTML = `<p style="color: var(--text-dim); grid-column: 1/-1;">Playlist je prázdný. Přidej hudbu pomocí tlačítka nahoře.</p>`;
        return;
    }

    plSongs.forEach((item, index) => {
        const cleanName = item.name.replace(/\.[^/.]+$/, "");
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300" alt="Cover">
                <button class="card-play-btn">▶</button>
            </div>
            <div class="card-info"><h4>${cleanName}</h4></div>
        `;
        card.onclick = () => { playSong(index, plSongs); showPlayerView(); };
        const playIcon = card.querySelector('.card-play-btn');
        playIcon.onclick = (event) => { event.stopPropagation(); playSong(index, plSongs); showPlayerView(); };
        playlistSongsGrid.appendChild(card);
    });
}

// --- NAHRÁVÁNÍ NOVÝCH SOUBORŮ ---
playlistFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && currentActivePlaylistIndex !== null) {
        files.forEach(file => playlists[currentActivePlaylistIndex].songs.push(file));
        const count = playlists[currentActivePlaylistIndex].songs.length;
        detailPlaylistCount.textContent = `${count} skladeb`;
        renderPlaylists(); 
        renderPlaylistSongs(); 
    }
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        files.forEach(file => globalSongs.push(file));
        renderGlobalSongs();
    }
});

// --- OPRAVENÉ PŘEHRÁVÁNÍ (Chápe předpřipravené i nové soubory) ---
function playSong(index, queueArray) {
    currentQueue = queueArray; 
    if (index < 0 || index >= currentQueue.length) return;
    
    currentIndex = index;
    const item = currentQueue[currentIndex];
    
    // Zde je ten hlavní trik - rozlišíme pevně zapsaný soubor od nahraného!
    if (item.fileUrl) {
        audio.src = item.fileUrl; // Přehraje tvůj pevný soubor ze složky "hudba"
    } else {
        audio.src = URL.createObjectURL(item); // Přehraje soubor vložený ručně přes tlačítko
    }
    
    titleDisplay.textContent = item.name.replace(/\.[^/.]+$/, ""); 
    audio.play();
    playBtn.textContent = '⏸';
}

playBtn.addEventListener('click', () => {
    if (audio.src === "") return;
    if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; } 
    else { audio.pause(); playBtn.textContent = '▶'; }
});

document.getElementById('next-btn').addEventListener('click', () => playSong((currentIndex + 1) % currentQueue.length, currentQueue));
document.getElementById('prev-btn').addEventListener('click', () => playSong((currentIndex - 1 + currentQueue.length) % currentQueue.length, currentQueue));

audio.addEventListener('timeupdate', () => {
    if(!audio.duration) return;
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    let min = Math.floor(audio.currentTime / 60), sec = Math.floor(audio.currentTime % 60);
    document.getElementById('current-time').textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    let durMin = Math.floor(audio.duration / 60), durSec = Math.floor(audio.duration % 60);
    document.getElementById('duration').textContent = `${durMin}:${durSec < 10 ? '0' : ''}${durSec}`;
});

progressBar.addEventListener('input', () => audio.currentTime = (progressBar.value / 100) * audio.duration);
audio.addEventListener('ended', () => playSong((currentIndex + 1) % currentQueue.length, currentQueue));
