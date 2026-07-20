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
// BUILD CANDLES (SVG) on top tier
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

  candles.push({ x, y: candleY-46, flame, innerFlame, lit: true });
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
  extinguishOne();
  if(litCount === 0){
    blowBtn.disabled = true;
    cutBtn.disabled = false;
    hintText.textContent = 'Yay! Wish complete 🌟 Ab cake cut karo!';
    reactionFace.classList.add('show');
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

cutBtn.addEventListener('click', function(){
  cutBtn.disabled = true;
  cutLine.setAttribute('opacity', 1);

  setTimeout(() => {
    slicePiece.classList.add('fly');
    launchConfetti();
    hintText.textContent = 'Cake cut ho gaya! Happy Birthday Indira 🎂💕';
    setTimeout(() => {
      continueBtn.style.display = 'inline-flex';
    }, 900);
  }, 500);
});

continueBtn.addEventListener('click', () => {
  window.location.href = 'page5.html';
});

// ============================================================
// CONFETTI
// ============================================================
function launchConfetti(){
  const colors = ['#FF7882','#FFD700','#7CFC7C','#A29BFE','#45B7D1','#FF9EC8'];
  for(let i=0;i<70;i++){
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
}