/**
 * CASAMENTO ADILSON & VANESA — 17 DE DEZEMBRO DE 2026
 * Player de música (MP3 próprio).
 *
 * Toca apenas o ficheiro definido em CONFIG.src.
 * API usada pelo resto do site: window.weddingAudio.isPlaying / .togglePlay()
 */

const AUDIO_CONFIG = {
  src: 'assets/audio/musica.mp3', // caminho do seu MP3 (relativo ao index.html)
  volume: 0.6,                    // 0 a 1
  loop: true                      // true = repete; false = toca uma vez
};

const ICON_PLAY = `
  <svg width="24" height="24" style="color:#B38F4D" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>`;

const ICON_PAUSE = `
  <svg width="24" height="24" style="color:#B38F4D" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>`;

class WeddingAudioPlayer {
  constructor(config) {
    this.config = config;
    this.isPlaying = false;

    this.audio = new Audio(config.src);
    this.audio.loop = config.loop;
    this.audio.volume = config.volume;
    this.audio.preload = 'auto';

    this.initDOM();
    this.initAudioEvents();
  }

  /* ---------- DOM ---------- */
  initDOM() {
    this.playBtn = document.getElementById('music-toggle-btn');
    this.musicIcon = document.getElementById('music-icon');
    this.musicLabel = document.getElementById('music-label');
    this.soundWaves = document.getElementById('sound-waves');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }
  }

  /* Mantém o estado e a interface sempre alinhados com o MP3 */
  initAudioEvents() {
    this.audio.addEventListener('play', () => this.setState(true));
    this.audio.addEventListener('pause', () => this.setState(false));
    this.audio.addEventListener('ended', () => this.setState(false));
    this.audio.addEventListener('error', () => {
      console.warn('Não foi possível carregar a música:', this.config.src);
      this.setState(false);
    });
  }

  /* ---------- Controlo ---------- */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    const promise = this.audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => this.setState(false)); // bloqueado pelo navegador ou ficheiro em falta
    }
  }

  pause() {
    this.audio.pause();
  }

  /* ---------- Interface ---------- */
  setState(playing) {
    this.isPlaying = playing;
    this.updateUI(playing);
  }

  updateUI(isPlaying) {
    if (!this.playBtn) return;

    this.playBtn.classList.toggle('music-spinning', isPlaying);
    if (this.musicIcon) this.musicIcon.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
    if (this.musicLabel) this.musicLabel.textContent = isPlaying ? 'Pausar Trilha' : 'Tocar Trilha Sonora';
    if (this.soundWaves) this.soundWaves.classList.toggle('hidden', !isPlaying);
  }
}

// Inicializar áudio global
window.weddingAudio = new WeddingAudioPlayer(AUDIO_CONFIG);