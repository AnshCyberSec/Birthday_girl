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
  document.querySelectorAll('.line, .letter, .replay-btn, .home-btn').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth; // reflow to restart animation
    el.style.animation = null;
  });
  location.reload();
});

// ============================================================
// BYE BYE BUTTON - farewell animation, then restart the whole journey
// ============================================================
document.getElementById('byeBtn').addEventListener('click', function(){
  const overlay = document.getElementById('byeOverlay');
  overlay.classList.add('active');

  const symbols = ['❤️','💖','✨','👋'];
  const burstInterval = setInterval(() => {
    const el = document.createElement('div');
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.style.position = 'fixed';
    el.style.left = Math.random()*100+'vw';
    el.style.top = '105vh';
    el.style.fontSize = (Math.random()*1.4+1.2)+'rem';
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
  }, 2200);
});