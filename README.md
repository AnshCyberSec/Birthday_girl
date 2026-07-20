# Birthday Surprise — Indira Priyadarshini Nayak

5-page cinematic birthday website.

## Pages
| File | Kya hai |
|---|---|
| `index.html` + `script.js` | Page 1 — intro, balloons, "Click Here" → message popup |
| `page2.html/css/js` | Page 2 — **4 sequential themed videos**: Queen (Baahubali/Devsena gold-royal), Chutki (Chhota Bheem green), Priya (soft pink), Memories (photo-video montage). Ek khatam hote hi "Next" se agla chapter khulta hai, dots progress dikhate hain. |
| `page3.html/css/js` | Page 3 — **Memory Thread**: scroll karte hi ek glowing thread photos ko connect karte hue neeche badhta hai, har photo alternate left/right reveal hoti hai. |
| `page4.html/css/js` | Page 4 — **Realistic Cake**: 5 candles jinhe "Blow" button se ek-ek karke bujhaya jata hai (smoke effect), sab bujhne par "Cut the Cake" unlock hota hai — slice fly-out + confetti + blush reaction. |
| `page5.html/css/js` | Page 5 — final cinematic message: twinkling starfield background, line-by-line text reveal, letter, replay/home buttons. |

## Files tumhe khud daalne honge (abhi placeholders hain)

### Videos → `assets/videos/`
- `video1_queen.mp4`
- `video2_chutki.mp4`
- `video3_priya.mp4`
- `video4_memories.mp4`

Agar video file nahi milti, page apne aap themed fallback icon (crown/drum/feather/film) dikha dega — crash nahi hoga.

### Photos → `assets/images/gallery/`
- `photo1.jpg` se `photo9.jpg` (page3.js ke `photos` array mein naam/caption edit kar sakte ho)

### Hero images (page 1) → `assets/images/hero/`
Same as pehle: `1.png`, `hat.png`, `balloon1.png`, `balloon2.png`, `unnamed.png`, `decorate_flower.png`, `decorate.png`, `smiley_icon.png`

### Audio → `assets/audio/`
`intro.mp3`, `click.mp3` (optional — sab jagah `.catch(()=>{})` laga hai so missing audio se error nahi aayega)

## Jo cheezein tum khud edit karoge
- `script.js` line ~22 → birthday date ab `'28 July'` set hai (already updated)
- `page3.js` → `photos` array mein caption/paths
- `page5.html` → final letter ka text (abhi ek warm brother-sister tone ka draft daal diya hai, apne alfaazon mein badal sakte ho)

## Flow
`index.html` → **Next Surprise** → `page2.html` (4 videos) → **Continue** → `page3.html` (thread gallery) → **Continue** → `page4.html` (cake) → **Continue** → `page5.html` (final message) → **Shuruaat Se** → wapas `index.html`
