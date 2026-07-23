// ============================================================
// PARTY START GATE - music begins only after the user taps the button
// ============================================================
const partyStartOverlay = document.getElementById('partyStartOverlay');
const startPartyBtn = document.getElementById('startPartyBtn');
const bgMusic = document.getElementById('bgMusic');

startPartyBtn.addEventListener('click', function(){
  if(bgMusic){
    bgMusic.volume = 0.45;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  }
  launchConfetti();
  partyStartOverlay.classList.add('hide');
  setTimeout(() => { partyStartOverlay.style.display = 'none'; }, 600);
  setTimeout(() => wishBubble.classList.add('show'), 700);
});

// ============================================================
// FLOATING HEARTS
// ============================================================
(function createHearts(){
  const c = document.getElementById('heartsContainer');
  const symbols = ['❤️','💖','🎈'];
  for(let i=0;i<16;i++){
    const el = document.createElement('i');
    el.textContent = symbols[i % symbols.length];
    el.style.left = Math.random()*100+'%';
    el.style.fontSize = (Math.random()*1.5+1)+'rem';
    el.style.animationDuration = (Math.random()*20+15)+'s';
    el.style.animationDelay = (Math.random()*15)+'s';
    c.appendChild(el);
  }
})();

// ============================================================
// AMBIENT BOKEH LIGHTS
// ============================================================
(function createBokeh(){
  const layer = document.getElementById('bokehLayer');
  const colors = ['#FF7882','#FFD700','#A29BFE','#45B7D1','#7CFC7C'];
  for(let i=0;i<10;i++){
    const b = document.createElement('div');
    b.className = 'bokeh-circle';
    const size = Math.random()*70+40;
    b.style.width = size+'px';
    b.style.height = size+'px';
    b.style.left = Math.random()*100+'%';
    b.style.top = Math.random()*100+'%';
    b.style.background = colors[Math.floor(Math.random()*colors.length)];
    b.style.animationDuration = (Math.random()*14+14)+'s';
    b.style.animationDelay = (Math.random()*10)+'s';
    layer.appendChild(b);
  }
})();

// ============================================================
// TWINKLING SPARKLES AROUND THE CAKE
// ============================================================
(function createSparkles(){
  const layer = document.getElementById('sparkleLayer');
  for(let i=0;i<14;i++){
    const s = document.createElement('span');
    s.className = 'twinkle-star';
    s.textContent = '✦';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*90+'%';
    s.style.fontSize = (Math.random()*10+8)+'px';
    s.style.animationDelay = (Math.random()*4)+'s';
    s.style.animationDuration = (Math.random()*2+2)+'s';
    layer.appendChild(s);
  }
})();

const wishBubble = document.getElementById('wishBubble');

// ============================================================
// SUBTLE PARALLAX TILT ON THE CAKE (desktop / mouse only)
// ============================================================
const cakeSceneEl = document.getElementById('cakeScene');
if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    const rect = cakeSceneEl.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    cakeSceneEl.style.transform = `perspective(900px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg)`;
  });
}

// ============================================================
// SYNTHESIZED SOUND EFFECTS (Web Audio API — no extra files needed)
// ============================================================
let sharedCtx = null;
function getCtx(){
  sharedCtx = sharedCtx || new (window.AudioContext || window.webkitAudioContext)();
  return sharedCtx;
}

function playWhooshSound(){
  try{
    const ctxA = getCtx();
    const bufferSize = ctxA.sampleRate * 0.35;
    const buffer = ctxA.createBuffer(1, bufferSize, ctxA.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){ data[i] = Math.random()*2-1; }
    const noise = ctxA.createBufferSource();
    noise.buffer = buffer;
    const bandpass = ctxA.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, ctxA.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(300, ctxA.currentTime + 0.32);
    bandpass.Q.value = 0.8;
    const gain = ctxA.createGain();
    gain.gain.setValueAtTime(0.35, ctxA.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxA.currentTime + 0.35);
    noise.connect(bandpass); bandpass.connect(gain); gain.connect(ctxA.destination);
    noise.start(); noise.stop(ctxA.currentTime + 0.35);
  }catch(e){}
}

function playWishChime(){
  try{
    const ctxA = getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const t = ctxA.currentTime + i*0.12;
      const o = ctxA.createOscillator();
      const g = ctxA.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.connect(g); g.connect(ctxA.destination);
      o.start(t); o.stop(t + 0.55);
    });
  }catch(e){}
}

function playCutSound(){
  try{
    const ctxA = getCtx();
    const now = ctxA.currentTime;
    [1800, 2150].forEach((freq) => {
      const o = ctxA.createOscillator();
      const g = ctxA.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      o.connect(g); g.connect(ctxA.destination);
      o.start(now); o.stop(now + 0.4);
    });
  }catch(e){}
}

// ============================================================
// BUILD CANDLES (SVG) on top tier — with warm glow halo
// ============================================================
const svgNS = 'http://www.w3.org/2000/svg';
const candleGroup = document.getElementById('candleGroup');
const NUM_CANDLES = 5;
const candles = [];

const startX = 150, spacing = (250-150)/(NUM_CANDLES-1), candleY = 215;

for(let i=0;i<NUM_CANDLES;i++){
  const x = startX + spacing*i;
  const colors = ['#FF7882','#FFD700','#7CFC7C','#A29BFE','#45B7D1'];

  const stick = document.createElementNS(svgNS,'rect');
  stick.setAttribute('x', x-4);
  stick.setAttribute('y', candleY-40);
  stick.setAttribute('width', 8);
  stick.setAttribute('height', 40);
  stick.setAttribute('fill', colors[i%colors.length]);
  stick.setAttribute('stroke', '#333');
  stick.setAttribute('stroke-width', 1.2);
  candleGroup.appendChild(stick);

  // warm glow halo behind the flame
  const glow = document.createElementNS(svgNS,'ellipse');
  glow.setAttribute('cx', x);
  glow.setAttribute('cy', candleY-46);
  glow.setAttribute('rx', 16);
  glow.setAttribute('ry', 20);
  glow.setAttribute('fill', colors[i%colors.length]);
  glow.setAttribute('opacity', 0.35);
  glow.style.filter = 'blur(6px)';
  glow.classList.add('candle-glow');
  candleGroup.appendChild(glow);

  const flame = document.createElementNS(svgNS,'ellipse');
  flame.setAttribute('cx', x);
  flame.setAttribute('cy', candleY-46);
  flame.setAttribute('rx', 5);
  flame.setAttribute('ry', 9);
  flame.setAttribute('fill', '#FFB347');
  flame.classList.add('flame');
  candleGroup.appendChild(flame);

  const innerFlame = document.createElementNS(svgNS,'ellipse');
  innerFlame.setAttribute('cx', x);
  innerFlame.setAttribute('cy', candleY-44);
  innerFlame.setAttribute('rx', 2.5);
  innerFlame.setAttribute('ry', 5);
  innerFlame.setAttribute('fill', '#FFE066');
  innerFlame.classList.add('flame');
  candleGroup.appendChild(innerFlame);

  candles.push({ x, y: candleY-46, flame, innerFlame, glow, lit: true });
}

// sprinkles decoration
const sprinkleGroup = document.getElementById('sprinkles');
for(let i=0;i<40;i++){
  const dot = document.createElementNS(svgNS,'circle');
  dot.setAttribute('cx', 90 + Math.random()*220);
  dot.setAttribute('cy', 230 + Math.random()*150);
  dot.setAttribute('r', Math.random()*2.5+1);
  const colors = ['#FF7882','#FFD700','#7CFC7C','#A29BFE','#45B7D1','#fff'];
  dot.setAttribute('fill', colors[Math.floor(Math.random()*colors.length)]);
  dot.setAttribute('opacity', .85);
  sprinkleGroup.appendChild(dot);
}

// tiny pearl dragees along the tier edges for a premium look
const pearlGroup = document.getElementById('pearls');
for(let x=125; x<=275; x+=14){
  const pearl = document.createElementNS(svgNS,'circle');
  pearl.setAttribute('cx', x);
  pearl.setAttribute('cy', 215);
  pearl.setAttribute('r', 2.2);
  pearl.setAttribute('fill', '#FFD700');
  pearl.setAttribute('opacity', .9);
  pearlGroup.appendChild(pearl);
}
for(let x=80; x<=320; x+=16){
  const pearl = document.createElementNS(svgNS,'circle');
  pearl.setAttribute('cx', x);
  pearl.setAttribute('cy', 300);
  pearl.setAttribute('r', 2.4);
  pearl.setAttribute('fill', '#fff');
  pearl.setAttribute('opacity', .8);
  pearlGroup.appendChild(pearl);
}

// ============================================================
// BLOW CANDLES
// ============================================================
const blowBtn = document.getElementById('blowBtn');
const cutBtn = document.getElementById('cutBtn');
const smokeLayer = document.getElementById('smokeLayer');
const hintText = document.getElementById('hintText');
const cakeScene = document.getElementById('cakeScene');
const reactionFace = document.getElementById('reactionFace');

let litCount = NUM_CANDLES;

function extinguishOne(){
  const litCandles = candles.filter(c => c.lit);
  if(litCandles.length === 0) return;
  const c = litCandles[Math.floor(Math.random()*litCandles.length)];
  c.lit = false;
  c.flame.classList.add('out');
  c.innerFlame.classList.add('out');
  c.glow.classList.add('out');
  spawnSmoke(c.x, c.y);
  litCount--;
}

function spawnSmoke(svgX, svgY){
  // convert svg coords (viewBox 400x420) to actual pixel position
  const svgEl = document.getElementById('cakeSvg');
  const rect = svgEl.getBoundingClientRect();
  const scaleX = rect.width/400, scaleY = rect.height/420;
  const px = rect.left + svgX*scaleX;
  const py = rect.top + svgY*scaleY;

  for(let i=0;i<4;i++){
    const puff = document.createElement('div');
    puff.className = 'smoke-puff';
    puff.style.left = (px - cakeScene.getBoundingClientRect().left + (Math.random()*14-7)) + 'px';
    puff.style.top = (py - cakeScene.getBoundingClientRect().top) + 'px';
    puff.style.animationDelay = (i*0.08)+'s';
    smokeLayer.appendChild(puff);
    setTimeout(()=>puff.remove(), 1800);
  }
}

blowBtn.addEventListener('click', function(){
  wishBubble.classList.remove('show');
  wishBubble.classList.add('hide');
  playWhooshSound();
  extinguishOne();
  if(litCount === 0){
    blowBtn.disabled = true;
    cutBtn.disabled = false;
    hintText.textContent = 'Yay! Wish complete 🌟 Ab cake cut karo!';
    reactionFace.classList.add('show');
    playWishChime();
  } else {
    hintText.textContent = `${litCount} candle${litCount>1?'s':''} left... blow again! 💨`;
  }
});

// ============================================================
// CUT CAKE
// ============================================================
const cutLine = document.getElementById('cutLine');
const slicePiece = document.getElementById('slicePiece');
const continueBtn = document.getElementById('continueBtn');
const finaleBanner = document.getElementById('finaleBanner');
const finaleWash = document.getElementById('finaleWash');

cutBtn.addEventListener('click', function(){
  cutBtn.disabled = true;
  cutLine.setAttribute('opacity', 1);
  playCutSound();

  setTimeout(() => {
    slicePiece.classList.add('fly');
    launchConfetti();
    hintText.textContent = 'Cake cut ho gaya! Happy Birthday Indira 🎂💕';
    finaleWash.classList.add('show');
    setTimeout(() => {
      finaleBanner.classList.add('show');
    }, 400);
    setTimeout(() => {
      continueBtn.style.display = 'inline-flex';
    }, 1100);
  }, 500);
});

continueBtn.addEventListener('click', () => {
  window.location.href = 'page5.html';
});

// ============================================================
// CONFETTI (round + square + ribbon streamers)
// ============================================================
function launchConfetti(){
  const colors = ['#FF7882','#FFD700','#7CFC7C','#A29BFE','#45B7D1','#FF9EC8'];

  for(let i=0;i<60;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random()*100+'%';
    piece.style.top = '-20px';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.borderRadius = Math.random()>0.5 ? '50%' : '2px';
    piece.style.animationDuration = (Math.random()*2+2)+'s';
    piece.style.animationDelay = (Math.random()*1)+'s';
    document.body.appendChild(piece);
    setTimeout(()=>piece.remove(), 4500);
  }

  for(let i=0;i<26;i++){
    const ribbon = document.createElement('div');
    ribbon.className = 'confetti-ribbon';
    ribbon.style.left = Math.random()*100+'%';
    ribbon.style.top = '-30px';
    ribbon.style.background = colors[Math.floor(Math.random()*colors.length)];
    ribbon.style.animationDuration = (Math.random()*2+2.6)+'s';
    ribbon.style.animationDelay = (Math.random()*1.2)+'s';
    document.body.appendChild(ribbon);
    setTimeout(()=>ribbon.remove(), 5200);
  }
}