// ============================================================
// FLOATING HEARTS
// ============================================================
(function createHearts(){
  const c = document.getElementById('heartsContainer');
  const symbols = ['❤️','💖','✨','💫'];
  for(let i=0;i<18;i++){
    const el = document.createElement('i');
    el.textContent = symbols[i % symbols.length];
    el.style.left = Math.random()*100+'%';
    el.style.fontSize = (Math.random()*1.4+1)+'rem';
    el.style.animationDuration = (Math.random()*18+14)+'s';
    el.style.animationDelay = (Math.random()*14)+'s';
    c.appendChild(el);
  }
})();

// ============================================================
// PER-CHAPTER THEMED PARTICLE FX (crown sparkles / jungle bounce / petals / twinkles)
// ============================================================
const fxSymbols = {
  0: ['👑','✨','⭐'],           // queen
  1: ['🥁','🍃','🐾'],           // chutki
  2: ['🌸','🦋','💗'],           // priya
  3: ['🎞️','✨','📸']            // memories
};
const fxSpawned = {};
function spawnFx(chapterIndex){
  const layer = document.getElementById('fx' + chapterIndex);
  if(!layer || fxSpawned[chapterIndex]) return;
  fxSpawned[chapterIndex] = true;
  const symbols = fxSymbols[chapterIndex] || ['✨'];
  const count = 14;
  for(let i=0;i<count;i++){
    const el = document.createElement('span');
    el.className = 'fx-item';
    el.textContent = symbols[i % symbols.length];
    el.style.left = Math.random()*100+'%';
    el.style.animationDuration = (Math.random()*6+5)+'s';
    el.style.animationDelay = (Math.random()*6)+'s';
    layer.appendChild(el);
  }
}

// ============================================================
// SYNTHESIZED SOUND EFFECTS (Web Audio API — no extra files needed)
// ============================================================
let sharedCtx2 = null;
function getCtx2(){
  sharedCtx2 = sharedCtx2 || new (window.AudioContext || window.webkitAudioContext)();
  return sharedCtx2;
}

function playClapSound(){
  try{
    const ctxA = getCtx2();
    const bufferSize = ctxA.sampleRate * 0.12;
    const buffer = ctxA.createBuffer(1, bufferSize, ctxA.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){ data[i] = (Math.random()*2-1) * (1 - i/bufferSize); }
    const noise = ctxA.createBufferSource();
    noise.buffer = buffer;
    const filter = ctxA.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 900;
    const gain = ctxA.createGain();
    gain.gain.setValueAtTime(0.55, ctxA.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxA.currentTime + 0.12);
    noise.connect(filter); filter.connect(gain); gain.connect(ctxA.destination);
    noise.start(); noise.stop(ctxA.currentTime + 0.12);
  }catch(e){}
}

function playTickSound(){
  try{
    const ctxA = getCtx2();
    const now = ctxA.currentTime;
    const o = ctxA.createOscillator();
    const g = ctxA.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.2, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    o.connect(g); g.connect(ctxA.destination);
    o.start(now); o.stop(now + 0.18);
  }catch(e){}
}

function playWhooshReveal(){
  try{
    const ctxA = getCtx2();
    const bufferSize = ctxA.sampleRate * 0.4;
    const buffer = ctxA.createBuffer(1, bufferSize, ctxA.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){ data[i] = Math.random()*2-1; }
    const noise = ctxA.createBufferSource();
    noise.buffer = buffer;
    const bandpass = ctxA.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(300, ctxA.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(2000, ctxA.currentTime + 0.38);
    const gain = ctxA.createGain();
    gain.gain.setValueAtTime(0.25, ctxA.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxA.currentTime + 0.4);
    noise.connect(bandpass); bandpass.connect(gain); gain.connect(ctxA.destination);
    noise.start(); noise.stop(ctxA.currentTime + 0.4);
  }catch(e){}
}

// ============================================================
// CINEMATIC INTRO SEQUENCE — plays before every chapter's video
// ============================================================
const cinemaIntro = document.getElementById('cinemaIntro');
const creditBlock = document.getElementById('creditBlock');
const clapperBoard = document.getElementById('clapperBoard');
const nowWatching = document.getElementById('nowWatching');
const nwIcon = document.getElementById('nwIcon');
const nwTitle = document.getElementById('nwTitle');
const countdownWrap = document.getElementById('countdownWrap');
const countdownNum = document.getElementById('countdownNum');
const clapScene = document.getElementById('clapScene');

const chapterMeta = {
  0: { icon: 'fa-crown', title: 'QUEEN' },
  1: { icon: 'fa-drum', title: 'CHUTKI' },
  2: { icon: 'fa-feather-alt', title: 'PRIYA' },
  3: { icon: 'fa-film', title: 'MEMORIES' }
};

let introTimeouts = [];
let introIntervals = [];
function introTimeout(fn, delay){
  const id = setTimeout(fn, delay);
  introTimeouts.push(id);
  return id;
}
function clearIntroTimers(){
  introTimeouts.forEach(id => clearTimeout(id));
  introIntervals.forEach(id => clearInterval(id));
  introTimeouts = [];
  introIntervals = [];
}

function resetIntroState(){
  [creditBlock, clapperBoard, nowWatching, countdownWrap].forEach(el => el.classList.remove('show'));
  clapperBoard.classList.remove('clap-close');
  countdownNum.textContent = '3';
}

function playIntroThenGo(i){
  cinemaIntro.classList.add('active');
  resetIntroState();
  clapScene.textContent = String(i+1).padStart(2,'0');
  nwIcon.innerHTML = `<i class="fas ${chapterMeta[i].icon}"></i>`;
  nwTitle.textContent = chapterMeta[i].title;

  // 1. credit card: "A Film Directed & Produced By ANSHUMAN"
  introTimeout(() => creditBlock.classList.add('show'), 100);
  introTimeout(() => creditBlock.classList.remove('show'), 1600);

  // 2. clapperboard slams shut
  introTimeout(() => clapperBoard.classList.add('show'), 1750);
  introTimeout(() => { clapperBoard.classList.add('clap-close'); playClapSound(); }, 2300);
  introTimeout(() => clapperBoard.classList.remove('show'), 2900);

  // 3. "Now Watching: CHAPTER"
  introTimeout(() => nowWatching.classList.add('show'), 3050);
  introTimeout(() => nowWatching.classList.remove('show'), 4300);

  // 4. 3-2-1 countdown
  introTimeout(startCountdown, 4450);
}

function startCountdown(){
  countdownWrap.classList.add('show');
  let n = 3;
  countdownNum.textContent = n;
  playTickSound();
  const interval = setInterval(() => {
    n--;
    if(n <= 0){
      clearInterval(interval);
      countdownWrap.classList.remove('show');
      introTimeout(finishIntro, 250);
      return;
    }
    countdownNum.textContent = n;
    playTickSound();
  }, 1000);
  introIntervals.push(interval);
}

function finishIntro(){
  playWhooshReveal();
  cinemaIntro.classList.remove('active');
  const v = activeVideo();
  v.currentTime = 0;
  v.play().catch(() => {});
}

// tap anywhere on the intro to skip straight to the video
cinemaIntro.addEventListener('click', () => {
  clearIntroTimers();
  finishIntro();
});

// ============================================================
// CHAPTER PLAYER
// ============================================================
const chapters = Array.from(document.querySelectorAll('.chapter'));
const dots = Array.from(document.querySelectorAll('.dot'));
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const curT = document.getElementById('curT');
const durT = document.getElementById('durT');
const finaleOverlay = document.getElementById('finaleOverlay');

let current = 0;

function fmt(s){
  if(isNaN(s)) return '0:00';
  const m = Math.floor(s/60), sec = Math.floor(s%60);
  return m+':'+(sec<10?'0':'')+sec;
}

function activeVideo(){
  return chapters[current].querySelector('video');
}

function checkVideoSource(video){
  // if video fails to load (no real file), show themed fallback instead
  video.addEventListener('error', () => {
    video.closest('.video-box').classList.add('no-source');
  });
  // if metadata never loads within 3s, assume missing
  setTimeout(() => {
    if(video.readyState === 0){
      video.closest('.video-box').classList.add('no-source');
    }
  }, 3000);
}
chapters.forEach(ch => checkVideoSource(ch.querySelector('video')));

function goToChapter(i){
  clearIntroTimers();
  chapters[current].classList.remove('active');
  const oldVideo = chapters[current].querySelector('video');
  oldVideo.pause();

  current = i;
  chapters[current].classList.add('active');
  spawnFx(current);

  dots.forEach((d, idx) => {
    d.classList.toggle('active', idx === current);
    d.classList.toggle('done', idx < current);
  });

  nextBtn.innerHTML = (current === chapters.length - 1)
    ? 'Finish <i class="fas fa-check"></i>'
    : 'Next <i class="fas fa-arrow-right"></i>';

  progressFill.style.width = '0%';
  curT.textContent = '0:00';
  durT.textContent = '0:00';

  const v = activeVideo();
  v.currentTime = 0;

  // cinematic intro plays first, then the video begins
  playIntroThenGo(current);
}

function bindVideoEvents(video){
  video.addEventListener('loadedmetadata', () => {
    if(video === activeVideo()) durT.textContent = fmt(video.duration);
  });
  video.addEventListener('timeupdate', () => {
    if(video !== activeVideo()) return;
    if(video.duration){
      progressFill.style.width = (video.currentTime/video.duration*100)+'%';
    }
    curT.textContent = fmt(video.currentTime);
  });
  video.addEventListener('ended', () => {
    nextBtn.classList.add('pulse');
  });
}
chapters.forEach(ch => bindVideoEvents(ch.querySelector('video')));

// play/pause via overlay button or click on video
chapters.forEach(ch => {
  const video = ch.querySelector('video');
  const btn = ch.querySelector('.play-pause');
  function toggle(){
    if(video.paused){ video.play().catch(()=>{}); btn.innerHTML='<i class="fas fa-pause"></i>'; }
    else { video.pause(); btn.innerHTML='<i class="fas fa-play"></i>'; }
  }
  btn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  video.addEventListener('play', () => btn.innerHTML='<i class="fas fa-pause"></i>');
  video.addEventListener('pause', () => btn.innerHTML='<i class="fas fa-play"></i>');
});

// seek
document.querySelector('.progress-track').addEventListener('click', function(e){
  const v = activeVideo();
  if(!v.duration) return;
  const rect = this.getBoundingClientRect();
  const percent = (e.clientX - rect.left)/rect.width;
  v.currentTime = percent * v.duration;
});

// dots click - only allow going back, or forward if already visited
dots.forEach(d => {
  d.addEventListener('click', function(){
    const i = parseInt(this.dataset.i);
    if(i <= current) goToChapter(i);
  });
});

// next button
nextBtn.addEventListener('click', function(){
  this.classList.remove('pulse');
  if(current < chapters.length - 1){
    goToChapter(current + 1);
  } else {
    finaleOverlay.classList.add('active');
    activeVideo().pause();
  }
});

document.getElementById('goPage3').addEventListener('click', function(){
  window.location.href = 'page3.html';
});

// first chapter: play cinematic intro, then autoplay the video
window.addEventListener('load', () => {
  spawnFx(0);
  playIntroThenGo(0);
});