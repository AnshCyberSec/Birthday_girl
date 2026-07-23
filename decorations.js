// ============================================================
// DECORATIONS: balloons, flowers, fairy lights (gift boxes & teddy are pure CSS/HTML)
// ============================================================

// balloons from left/right sides only — center clear for the cake
(function createBalloons(){
  const layer = document.getElementById('decoLayer');
  if(!layer) return;
  const colors = ['#FF7882','#FFD700','#7CFC7C','#A29BFE','#45B7D1','#FF9EC8'];
  const leftRightPositions = [4, 12, 88, 96]; // % from left, hugging the sides
  leftRightPositions.forEach((pos, i) => {
    const b = document.createElement('div');
    b.className = 'balloon';
    const color = colors[i % colors.length];
    b.style.setProperty('--bcolor', color);
    b.style.left = pos + '%';
    b.style.animationDuration = (Math.random()*8 + 16) + 's';
    b.style.animationDelay = (Math.random()*10) + 's';
    layer.appendChild(b);
  });
})();

// scattered twinkling flowers around the edges
(function createFlowers(){
  const layer = document.getElementById('decoLayer');
  if(!layer) return;
  const blossoms = ['🌸','🌷','💮','🌺'];
  const spots = [
    {left:'3%', top:'20%'}, {left:'8%', top:'55%'}, {left:'2%', top:'80%'},
    {left:'93%', top:'22%'}, {left:'90%', top:'58%'}, {left:'95%', top:'78%'}
  ];
  spots.forEach((pos, i) => {
    const f = document.createElement('span');
    f.className = 'deco-flower';
    f.textContent = blossoms[i % blossoms.length];
    f.style.left = pos.left;
    f.style.top = pos.top;
    f.style.fontSize = (Math.random()*10 + 18) + 'px';
    f.style.animationDuration = (Math.random()*2 + 2.5) + 's';
    f.style.animationDelay = (Math.random()*3) + 's';
    layer.appendChild(f);
  });
})();

// fairy lights strip across the very top
(function createFairyLights(){
  const strip = document.getElementById('fairyLights');
  if(!strip) return;
  const colors = ['#FF7882','#FFD700','#7CFC7C','#A29BFE','#45B7D1','#FF9EC8'];
  const count = 26;
  for(let i=0;i<count;i++){
    const bulb = document.createElement('span');
    bulb.className = 'fairy-bulb';
    bulb.style.left = (i * (100/count)) + '%';
    const color = colors[i % colors.length];
    bulb.style.background = color;
    bulb.style.color = color; // for currentColor glow
    bulb.style.animationDelay = (Math.random()*1.4) + 's';
    strip.appendChild(bulb);
  }
})();