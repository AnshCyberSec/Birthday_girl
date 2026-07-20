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
  v.play().catch(()=>{});
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
document.querySelectorAll('.progress-track').forEach(()=>{});
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

// autoplay first chapter
window.addEventListener('load', () => {
  activeVideo().play().catch(()=>{});
  spawnFx(0);
});
