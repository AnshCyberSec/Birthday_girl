// ============================================================
// 1. FLOATING HEARTS BACKGROUND
// ============================================================
(function createHearts() {
    const container = document.getElementById('heartsContainer');
    const heartSymbols = ['❤️', '💖', '💕', '💗', '✨'];
    for (let i = 0; i < 25; i++) {
        const el = document.createElement('i');
        el.textContent = heartSymbols[i % heartSymbols.length];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        el.style.animationDuration = (Math.random() * 20 + 15) + 's';
        el.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(el);
    }
})();

// ============================================================
// 2. DATE TYPING EFFECT — EDIT THE DATE HERE
// ============================================================
(function typeDate() {
    const target = document.getElementById('dateText');
    const text = '28 July'; // <-- Indira's actual birthday
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            target.textContent += text[i];
            i++;
        } else {
            clearInterval(interval);
        }
    }, 120);
})();

// ============================================================
// 3. CIRCLE TEXT POSITIONING
// ============================================================
(function positionCircleText() {
    document.querySelectorAll('.circle-text .inner span').forEach(el => {
        const idx = parseInt(el.style.getPropertyValue('--i'));
        const angle = idx * 24;
        el.style.transform = `rotate(${angle}deg) translateY(-55px)`;
    });
})();

// ============================================================
// 4. MAIN BUTTON RIPPLE EFFECT
// ============================================================
document.getElementById('mainBtn').addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    document.getElementById('clickSound').play().catch(() => {});
    document.getElementById('messageModal').classList.add('active');
});

// ============================================================
// 5. MODAL CONTROLS
// ============================================================
document.getElementById('modalClose').addEventListener('click', function() {
    document.getElementById('messageModal').classList.remove('active');
});

document.getElementById('messageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// ============================================================
// 6. NEXT PAGE BUTTON
// ============================================================
document.getElementById('nextPageBtn').addEventListener('click', function() {
    document.getElementById('clickSound').play().catch(() => {});
    window.location.href = 'page2.html';
});

// ============================================================
// 7. BACKGROUND MUSIC
// ============================================================
let musicStarted = false;
function startMusic() {
    if (!musicStarted) {
        const bg = document.getElementById('bgMusic');
        bg.volume = 0.3;
        bg.play().catch(() => {});
        musicStarted = true;
    }
}
document.addEventListener('click', startMusic);
document.addEventListener('touchstart', startMusic);

window.addEventListener('load', function() {
    setTimeout(() => {
        const bg = document.getElementById('bgMusic');
        bg.volume = 0.3;
        bg.play().catch(() => {});
    }, 500);
});

console.log('🎂 Happy Birthday Indira! ✨');
