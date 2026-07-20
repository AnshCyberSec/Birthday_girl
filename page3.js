// ============================================================
// BACKGROUND MUSIC
// ============================================================
let musicStarted3 = false;
function startMusic3() {
  if (musicStarted3) return;
  const bg = document.getElementById('bgMusic');
  if (!bg) return;
  bg.volume = 0.3;
  bg.play().catch(() => {});
  musicStarted3 = true;
}
document.addEventListener('click', startMusic3);
document.addEventListener('touchstart', startMusic3);
window.addEventListener('load', () => setTimeout(startMusic3, 400));

// ============================================================
// FLOATING HEARTS
// ============================================================
const isMobile = window.innerWidth <= 768;
(function createHearts(){
  const c = document.getElementById('heartsContainer');
  const symbols = isMobile ? ['❤️','💖','💕','🌸','🌷','🦋','🐦'] : ['❤️','💖','💕'];
  const count = isMobile ? 26 : 20;
  for(let i=0;i<count;i++){
    const el = document.createElement('i');
    el.textContent = symbols[i % symbols.length];
    el.style.left = Math.random()*100+'%';
    el.style.fontSize = (Math.random()*1.6+1)+'rem';
    el.style.animationDuration = (Math.random()*22+16)+'s';
    el.style.animationDelay = (Math.random()*16)+'s';
    c.appendChild(el);
  }
})();

// ============================================================
// FLYING BIRDS (mobile scroll vfx)
// ============================================================
if(isMobile){
  const birdsC = document.getElementById('birdsContainer');
  for(let i=0;i<3;i++){
    const b = document.createElement('span');
    b.className = 'bird';
    b.textContent = '🐦';
    b.style.top = (15 + Math.random()*60) + '%';
    b.style.animationDuration = (Math.random()*10+14)+'s';
    b.style.animationDelay = (Math.random()*10)+'s';
    birdsC.appendChild(b);
  }
}

// ============================================================
// BALLOON-BURST PARTICLE EFFECT (fires when a memory node reveals)
// ============================================================
const burstSymbols = ['🌸','🎈','✨','💫','🦋'];
function burstAt(x, y){
  const num = isMobile ? 8 : 6;
  for(let i=0;i<num;i++){
    const p = document.createElement('span');
    p.className = 'burst-particle';
    p.textContent = burstSymbols[Math.floor(Math.random()*burstSymbols.length)];
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    const angle = (Math.PI*2*i)/num + Math.random()*0.5;
    const dist = 40 + Math.random()*50;
    p.style.setProperty('--bx', Math.cos(angle)*dist + 'px');
    p.style.setProperty('--by', Math.sin(angle)*dist + 'px');
    p.style.setProperty('--br', (Math.random()*180-90)+'deg');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}

// ============================================================
// PHOTOS - edit captions/paths as needed
// ============================================================
const photos = [
  { src: 'assets/images/gallery/photo1.jpeg', caption: 'Grace, without trying. ✨' },

  { src: 'assets/images/gallery/photo2.png', caption: 'Some smiles dont need a reason. 🌸' },

  { src: 'assets/images/gallery/photo3.png', caption: 'Confidence looks good on you. 💫' },

  { src: 'assets/images/gallery/photo4.png', caption: 'A little sunshine in one frame. ☀️' },

  { src: 'assets/images/gallery/photo5.png', caption: 'Simply unforgettable. 🤍' },

  { src: 'assets/images/gallery/photo6.png', caption: 'A moment worth keeping. 📸' },

  { src: 'assets/images/gallery/photo7.png', caption: 'Effortlessly beautiful. 🌷' },

  { src: 'assets/images/gallery/photo8.jpeg', caption: 'Some pictures speak for themselves. ✨' },

  { src: 'assets/images/gallery/photo9.jpg', caption: 'And this one... had to be the last. 🌼' }
];

const timeline = document.getElementById('timeline');
const fallbackColors = ['#FF7882','#FFD700','#7CFC7C','#FF9EC8','#FFB347','#A29BFE','#4ECDC4','#FD79A8','#45B7D1'];

photos.forEach((p, i) => {
  const item = document.createElement('div');
  item.className = 'thread-item ' + (i % 2 === 0 ? 'left' : 'right');

  const node = document.createElement('div');
  node.className = 'thread-node';

  const card = document.createElement('div');
  card.className = 'thread-card';

  const img = document.createElement('img');
  img.src = p.src;
  img.loading = 'lazy';
  img.alt = p.caption;
  img.onerror = function(){
    const color = fallbackColors[i % fallbackColors.length];
    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect width="400" height="500" fill="' + encodeURIComponent(color) + '"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="40" fill="white" opacity="0.8"%3E%F0%9F%92%96%3C/text%3E%3C/svg%3E';
  };

  const cap = document.createElement('div');
  cap.className = 'cap';
  cap.textContent = p.caption;

  card.appendChild(img);
  card.appendChild(cap);
  item.appendChild(node);
  item.appendChild(card);
  timeline.appendChild(item);

  card.addEventListener('click', () => showLightbox(img.src));
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const items = Array.from(document.querySelectorAll('.thread-item'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting && !e.target.classList.contains('visible')){
      e.target.classList.add('visible');
      const node = e.target.querySelector('.thread-node');
      if(node){
        const r = node.getBoundingClientRect();
        burstAt(r.left + r.width/2, r.top + r.height/2);
      }
    }
  });
}, { threshold: 0.3 });
items.forEach(i => observer.observe(i));

// ============================================================
// DRAW THREAD PATH BASED ON SCROLL PROGRESS
// ============================================================
const svg = document.getElementById('threadSvg');
const path = document.getElementById('threadPath');

function updateThread(){
  const docHeight = document.body.scrollHeight;
  const winHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  const total = docHeight - winHeight;
  const progress = total > 0 ? Math.min(scrollTop / total, 1) : 0;

  svg.setAttribute('viewBox', `0 0 6 ${docHeight}`);
  const currentY = docHeight * progress;

  // simple wavy path down to current scroll position
  let d = `M 3 0`;
  const step = 60;
  for(let y = step; y <= currentY; y += step){
    const x = 3 + Math.sin(y / 80) * 2;
    d += ` L ${x} ${y}`;
  }
  path.setAttribute('d', d);
}
window.addEventListener('scroll', updateThread);
window.addEventListener('resize', updateThread);
window.addEventListener('load', updateThread);
setTimeout(updateThread, 500);

// ============================================================
// LIGHTBOX
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });

function showLightbox(src){
  lightboxImage.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
// CONTINUE BUTTON
// ============================================================
document.getElementById('continueBtn').addEventListener('click', () => {
  window.location.href = 'page4.html';
});