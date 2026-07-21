// ============================================================
// BACKGROUND MUSIC
// ============================================================
let musicStarted5 = false;
function startMusic5() {
  if (musicStarted5) return;
  const bg = document.getElementById('bgMusic');
  if (!bg) return;
  bg.volume = 0.3;
  bg.play().catch(() => {});
  musicStarted5 = true;
}
document.addEventListener('click', startMusic5);
document.addEventListener('touchstart', startMusic5);
window.addEventListener('load', () => setTimeout(startMusic5, 400));

// ============================================================
// FLOATING HEARTS
// ============================================================
(function createHearts(){
  const c = document.getElementById('heartsContainer');
  const symbols = ['❤️','✨','💫'];
  for(let i=0;i<16;i++){
    const el = document.createElement('i');
    el.textContent = symbols[i % symbols.length];
    el.style.left = Math.random()*100+'%';
    el.style.fontSize = (Math.random()*1.4+1)+'rem';
    el.style.animationDuration = (Math.random()*20+16)+'s';
    el.style.animationDelay = (Math.random()*16)+'s';
    c.appendChild(el);
  }
})();

// ============================================================
// STARFIELD / TWINKLING PARTICLES BACKGROUND
// ============================================================
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}
function initStars(){
  const count = Math.floor((canvas.width*canvas.height)/9000);
  stars = Array.from({length: count}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.5+0.3,
    speed: Math.random()*0.3+0.05,
    twinkle: Math.random()*Math.PI*2
  }));
}
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(s => {
    s.twinkle += 0.02;
    const alpha = 0.4 + Math.sin(s.twinkle)*0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,120,130,${Math.max(alpha,0.1)})`;
    ctx.fill();
    s.y -= s.speed;
    if(s.y < 0) s.y = canvas.height;
  });
  requestAnimationFrame(animate);
}
window.addEventListener('resize', resize);
resize();
animate();

// ============================================================
// REPLAY BUTTON - restarts text animations
// ============================================================
document.getElementById('replayBtn').addEventListener('click', function(){
  location.reload();
});

// ============================================================
// PHOTOBOOTH — shutter sound (synthesized, no audio file needed)
// ============================================================

function playShutterSound() {
    const cameraSound = document.getElementById("cameraSound");

    if (cameraSound) {
        cameraSound.currentTime = 0; // har click pe shuru se play hoga
        cameraSound.volume = 1.0;    // full volume
        cameraSound.play().catch(() => {});
    }
}

// ============================================================
// PHOTOBOOTH — paparazzi flash-dot bursts around the screen
// ============================================================
function triggerLightBursts(){
  const container = document.getElementById('pbLights');
  for(let i = 0; i < 6; i++){
    setTimeout(() => {
      const dot = document.createElement('div');
      dot.className = 'flash-dot';
      dot.style.left = (Math.random()*90 + 5) + '%';
      dot.style.top = (Math.random()*80 + 5) + '%';
      container.appendChild(dot);
      setTimeout(() => dot.remove(), 420);
    }, i * 70);
  }
}

// ============================================================
// PHOTOBOOTH — main flow
// ============================================================
const captions = [
  'Okay... this smile was unfair. 🙂',
  'Now I know why cameras never complain.',
  'Some smiles deserve extra storage. 💾',
  'I am keeping this one. 🤍',
  'This one might be my favourite.',
  'Not gonna lie... this turned out beautiful.',
  'The camera had one job... and nailed it.',
  'I hope you smiled like this in real life too. 🌸'
];

let shotsTaken = 0;
const TOTAL_SHOTS = 4;
let boothOpen = false;

const byeBtn = document.getElementById('byeBtn');
const photoboothOverlay = document.getElementById('photoboothOverlay');
const shutterBtn = document.getElementById('shutterBtn');
const flashOverlay = document.getElementById('flashOverlay');
const polaroidStack = document.getElementById('polaroidStack');
const shotCount = document.getElementById('shotCount');
const pbContent = document.getElementById('pbContent');
const pbFinal = document.getElementById('pbFinal');
const pbTitle = document.getElementById('pbTitle');
const pbSub = document.getElementById('pbSub');

byeBtn.addEventListener('click', function(){
  if (boothOpen) return;
  boothOpen = true;
  photoboothOverlay.classList.add('active');
});

shutterBtn.addEventListener('click', function(){
  if (shotsTaken >= TOTAL_SHOTS) return;

  shutterBtn.disabled = true;

  // camera flash across the whole screen
  flashOverlay.classList.add('flash-active');
  setTimeout(() => flashOverlay.classList.remove('flash-active'), 90);

  // shutter sound + paparazzi lights
  playShutterSound();
  triggerLightBursts();

  // little camera shake for realism
  const cameraFrame = document.getElementById('cameraFrame');
  cameraFrame.style.transition = 'transform .08s ease';
  cameraFrame.style.transform = 'scale(0.97)';
  setTimeout(() => { cameraFrame.style.transform = 'scale(1)'; }, 100);

  shotsTaken++;

  // add polaroid to stack
  const polaroid = document.createElement('div');
  polaroid.className = 'polaroid';
  const rotation = (Math.random() * 16 - 8).toFixed(1);
  polaroid.style.setProperty('--r', rotation + 'deg');
  const emoji = ['📸','💛','✨','🥰'][Math.floor(Math.random()*4)];
  polaroid.innerHTML = `<div class="thumb">${emoji}</div><span>${captions[Math.floor(Math.random()*captions.length)]}</span>`;
  polaroidStack.appendChild(polaroid);

  shotCount.textContent = `${shotsTaken} / ${TOTAL_SHOTS} clicked`;

  if (shotsTaken === 1) {
    pbTitle.textContent = 'Okay... that smile was worth waiting for. 😊';
    pbSub.textContent = 'One photo is definitely not enough.';
} else if (shotsTaken === 2) {
    pbTitle.textContent = 'Hmm... this one is even better. 📸';
    pbSub.textContent = 'I think the camera likes you too.';
} else if (shotsTaken === 3) {
    pbTitle.textContent = 'One last click... ✨';
    pbSub.textContent = 'Lets save your best birthday smile forever.';
}

  setTimeout(() => { shutterBtn.disabled = false; }, 500);

  if (shotsTaken >= TOTAL_SHOTS) {
    shutterBtn.disabled = true;
    setTimeout(showFinalGoodbye, 1200);
  }
});

function showFinalGoodbye(){
  pbContent.classList.add('fade-out');
  setTimeout(() => {
    pbContent.style.display = 'none';
    pbFinal.classList.add('active');

    // heart & sparkle burst for farewell
    const symbols = ['❤️','💖','✨','👋'];
    const burstInterval = setInterval(() => {
      const el = document.createElement('div');
      el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
      el.style.position = 'fixed';
      el.style.left = Math.random()*100 + 'vw';
      el.style.top = '105vh';
      el.style.fontSize = (Math.random()*1.4 + 1.2) + 'rem';
      el.style.zIndex = 310;
      el.style.pointerEvents = 'none';
      el.style.transition = 'transform 1.6s ease-out, opacity 1.6s ease-out';
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translateY(-120vh) translateX(${Math.random()*80-40}px)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1700);
    }, 120);

    setTimeout(() => {
      clearInterval(burstInterval);
      window.location.href = 'index.html';
    }, 5000);
  }, 420);
}