// Template definitions for the 3 share-image layouts (F1, F2, F3).
// CSS and HTML ported from .agent/diagrams/bias-ranking-final-3.html and
// adapted to consume the live sorter's top-12 ranking + memberData.
// The CSS is lazy-injected by injectTemplateCSS() on first openExportModal().

import { html } from "./html.js";

const STYLE_ID = "export-template-css";

const TEMPLATE_CSS = `
/* === Base mockup (1080×1080) === */
.mockup { width: 100%; height: 100%; font-family: 'Nunito', system-ui, sans-serif; position: relative; overflow: hidden; }
.mockup * { box-sizing: border-box; }
.mockup-canvas { width: 1080px; height: 1080px; transform: scale(var(--mockup-scale, 1)); transform-origin: top left; position: absolute; top: 0; left: 0; }

/* === F1 — S1 + faint bubbles === */
.layout-f1 { background: radial-gradient(900px 700px at 30% 20%, #ffd6e7 0%, transparent 55%), radial-gradient(700px 500px at 80% 80%, #d8c8f7 0%, transparent 55%), linear-gradient(170deg, #fff5fa 0%, #f0e9fb 100%); }
.layout-f1::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 8% 12%, #ff4d85 0 16px, transparent 17px), radial-gradient(circle at 92% 18%, #9b72cf 0 14px, transparent 15px), radial-gradient(circle at 14% 38%, #5c9eff 0 12px, transparent 13px), radial-gradient(circle at 88% 42%, #ff4d85 0 14px, transparent 15px), radial-gradient(circle at 6% 68%, #9b72cf 0 12px, transparent 13px), radial-gradient(circle at 94% 72%, #ff4d85 0 16px, transparent 17px), radial-gradient(circle at 22% 92%, #5c9eff 0 12px, transparent 13px), radial-gradient(circle at 78% 96%, #9b72cf 0 14px, transparent 15px), radial-gradient(circle at 20% 30%, transparent 70px, rgba(255,77,133,0.13) 72px, transparent 74px), radial-gradient(circle at 78% 28%, transparent 60px, rgba(155,114,207,0.13) 62px, transparent 64px), radial-gradient(circle at 30% 58%, transparent 80px, rgba(92,158,255,0.11) 82px, transparent 84px), radial-gradient(circle at 82% 62%, transparent 64px, rgba(255,77,133,0.11) 66px, transparent 68px), radial-gradient(circle at 48% 50%, transparent 86px, rgba(155,114,207,0.08) 88px, transparent 90px); pointer-events: none; opacity: 0.75; }
.layout-f1 .sticker-deco { position: absolute; pointer-events: none; z-index: 1; color: #fff; }
.layout-f1 .sticker-deco.s1 { top: 40px; left: 60px; font-size: 150px; transform: rotate(-15deg); }
.layout-f1 .sticker-deco.s2 { top: 90px; right: 80px; font-size: 120px; transform: rotate(20deg); }
.layout-f1 .sticker-deco.s3 { bottom: 180px; left: 50px; font-size: 130px; transform: rotate(12deg); }
.layout-f1 .sticker-deco.s4 { bottom: 160px; right: 60px; font-size: 110px; transform: rotate(-18deg); }
.layout-f1 .title { position: absolute; top: 70px; left: 0; right: 0; text-align: center; z-index: 2; }
.layout-f1 .title .t1 { font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 62px; letter-spacing: -0.02em; color: #1c1424; line-height: 1; text-shadow: 0 4px 0 #fff, 0 6px 12px rgba(40,24,60,0.15); }
.layout-f1 .title .t1 span { display: inline-block; background: linear-gradient(120deg, #ff4d85, #9b72cf); -webkit-background-clip: text; background-clip: text; color: transparent; }
.layout-f1 .title .t2 { margin-top: 14px; font-family: 'Nunito', system-ui, sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 0.3em; text-transform: uppercase; color: #9890a4; }
.layout-f1 .hero-cluster { position: absolute; top: 220px; left: 0; right: 0; height: 320px; }
.layout-f1 .sticker { position: absolute; border-radius: 50%; overflow: visible; }
.layout-f1 .sticker .img { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #fff; border: 8px solid #fff; box-shadow: 0 0 0 3px rgba(0,0,0,0.06), 0 12px 30px rgba(40,24,60,0.2); }
.layout-f1 .sticker .img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.layout-f1 .sticker .rank-tag { position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 28px; color: #fff; z-index: 3; }
.layout-f1 .sticker .name-tag { position: absolute; top: -36px; left: 50%; transform: translateX(-50%); background: #fff; padding: 8px 18px; border-radius: 999px; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 17px; color: #1c1424; white-space: nowrap; box-shadow: 0 6px 14px rgba(0,0,0,0.12); z-index: 3; }
.layout-f1 .sticker .emoji { position: absolute; top: -10px; right: -10px; width: 54px; height: 54px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 6px 14px rgba(0,0,0,0.15); z-index: 3; }
.layout-f1 .sticker.s1 .name-tag { left: calc(50% - 28px); }
.layout-f1 .sticker.s1 .emoji { right: 20px; }
.layout-f1 .sticker.s2 .emoji { right: auto; left: -10px; }
.layout-f1 .sticker.s1 { width: 240px; height: 240px; left: 50%; top: 0; transform: translateX(-50%) rotate(-3deg); z-index: 3; }
.layout-f1 .sticker.s2 { width: 190px; height: 190px; left: calc(50% - 280px); top: 60px; transform: rotate(8deg); z-index: 2; }
.layout-f1 .sticker.s3 { width: 190px; height: 190px; left: calc(50% + 90px); top: 60px; transform: rotate(-6deg); z-index: 2; }
.layout-f1 .sticker.s1 .rank-tag { background: #ff4d85; clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); width: 70px; height: 70px; }
.layout-f1 .sticker.s2 .rank-tag { background: #9b72cf; width: 60px; height: 60px; }
.layout-f1 .sticker.s3 .rank-tag { background: #5c9eff; width: 56px; height: 56px; }
.layout-f1 .sticker-grid { position: absolute; top: 500px; left: 0; right: 0; padding: 0 50px; }
.layout-f1 .sticker-grid .row { display: flex; justify-content: space-evenly; margin-bottom: 20px; }
.layout-f1 .sticker-grid .row:last-child { margin-bottom: 0; }
.layout-f1 .sticker-grid .mini { position: relative; width: 150px; height: 150px; flex: 0 0 150px; }
.layout-f1 .sticker-grid .mini .img { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #fff; border: 5px solid #fff; box-shadow: 0 8px 20px rgba(40,24,60,0.15); }
.layout-f1 .sticker-grid .mini .img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.layout-f1 .sticker-grid .mini .num { position: absolute; bottom: -4px; right: 0; width: 36px; height: 36px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 16px; color: #1c1424; box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
.layout-f1 .sticker-grid .mini.r1 { transform: rotate(-4deg); } .layout-f1 .sticker-grid .mini.r2 { transform: rotate(5deg); } .layout-f1 .sticker-grid .mini.r3 { transform: rotate(-3deg); } .layout-f1 .sticker-grid .mini.r4 { transform: rotate(7deg); } .layout-f1 .sticker-grid .mini.r5 { transform: rotate(-5deg); } .layout-f1 .sticker-grid .mini.r6 { transform: rotate(4deg); } .layout-f1 .sticker-grid .mini.r7 { transform: rotate(-6deg); } .layout-f1 .sticker-grid .mini.r8 { transform: rotate(3deg); } .layout-f1 .sticker-grid .mini.r9 { transform: rotate(-2deg); }
.layout-f1 .sticker-grid .mini.empty { background: rgba(255,255,255,0.35); border-radius: 50%; border: 5px solid #fff; box-shadow: 0 8px 20px rgba(40,24,60,0.1); }
.layout-f1 .footer { position: absolute; bottom: 36px; left: 0; right: 0; text-align: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 800; font-size: 14px; letter-spacing: 0.16em; text-transform: uppercase; color: #b3a8c2; }

/* === F2 — S4 + dotted + tape === */
.layout-f2 { background: radial-gradient(800px 600px at 30% 30%, #ffe6f0 0%, transparent 60%), radial-gradient(700px 500px at 70% 80%, #e0e8ff 0%, transparent 60%), linear-gradient(170deg, #fff8fb 0%, #f5f0ff 100%); }
.layout-f2::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,77,133,0.14) 0 3px, transparent 4px); background-size: 40px 40px; pointer-events: none; opacity: 0.75; }
.layout-f2 .deco-note { position: absolute; pointer-events: none; z-index: 1; border-radius: 10px; box-shadow: 0 6px 14px rgba(40,24,60,0.08); }
.layout-f2 .deco-note.n1 { top: 50px; left: 60px; width: 150px; height: 52px; background: #ffd6e7; transform: rotate(-12deg); opacity: 0.9; }
.layout-f2 .deco-note.n2 { top: 130px; right: 80px; width: 110px; height: 44px; background: #d8c8f7; transform: rotate(15deg); opacity: 0.9; }
.layout-f2 .deco-note.n3 { bottom: 240px; left: 50px; width: 130px; height: 48px; background: #c8e0ff; transform: rotate(8deg); opacity: 0.9; }
.layout-f2 .deco-note.n4 { bottom: 210px; right: 60px; width: 95px; height: 40px; background: #ffe6c8; transform: rotate(-10deg); opacity: 0.9; }
.layout-f2 .title { position: absolute; top: 70px; left: 0; right: 0; text-align: center; z-index: 2; }
.layout-f2 .title .t1 { font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 62px; letter-spacing: -0.02em; color: #1c1424; line-height: 1; text-shadow: 0 4px 0 #fff, 0 6px 12px rgba(40,24,60,0.15); }
.layout-f2 .title .t1 span { display: inline-block; background: linear-gradient(120deg, #ff4d85, #5c9eff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.layout-f2 .title .t2 { margin-top: 14px; font-family: 'Nunito', system-ui, sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 0.3em; text-transform: uppercase; color: #9890a4; }
.layout-f2 .hero-cluster { position: absolute; top: 200px; left: 0; right: 0; height: 360px; }
.layout-f2 .sticker { position: absolute; background: #fff; padding: 12px 12px 50px 12px; box-shadow: 0 14px 32px rgba(40,24,60,0.18); }
.layout-f2 .sticker.s2, .layout-f2 .sticker.s3 { padding: 10px 10px 42px 10px; }
.layout-f2 .sticker .img { position: relative; width: 100%; padding-bottom: 100%; border-radius: 4px; overflow: hidden; background: #f0e9fb; }
.layout-f2 .sticker .img img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.layout-f2 .sticker .caption { position: absolute; left: 0; right: 0; text-align: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; color: #1c1424; letter-spacing: 0.02em; }
.layout-f2 .sticker.s1 .caption { bottom: 14px; font-size: 18px; } .layout-f2 .sticker.s2 .caption { bottom: 10px; font-size: 15px; } .layout-f2 .sticker.s3 .caption { bottom: 10px; font-size: 15px; }
.layout-f2 .sticker .tape { position: absolute; top: -8px; left: 50%; width: 60px; height: 18px; transform: translateX(-50%) rotate(-4deg); opacity: 0.88; }
.layout-f2 .sticker.s1 .tape { background: #ff4d85; } .layout-f2 .sticker.s2 .tape { background: #9b72cf; transform: translateX(-50%) rotate(5deg); } .layout-f2 .sticker.s3 .tape { background: #5c9eff; transform: translateX(-50%) rotate(-3deg); }
.layout-f2 .sticker .rank-tag { position: absolute; top: -10px; right: -10px; width: 44px; height: 44px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 20px; color: #1c1424; box-shadow: 0 6px 14px rgba(0,0,0,0.18); z-index: 3; }
.layout-f2 .sticker.s2 .rank-tag { right: auto; left: -10px; }
.layout-f2 .sticker.s1 { width: 270px; left: 50%; top: 0; transform: translateX(-50%) rotate(-3deg); z-index: 3; }
.layout-f2 .sticker.s2 { width: 215px; left: calc(50% - 335px); top: 50px; transform: rotate(8deg); z-index: 2; }
.layout-f2 .sticker.s3 { width: 215px; left: calc(50% + 120px); top: 50px; transform: rotate(-6deg); z-index: 2; }
.layout-f2 .sticker-grid { position: absolute; top: 520px; left: 0; right: 0; padding: 0 40px; }
.layout-f2 .sticker-grid .row { display: flex; justify-content: space-evenly; margin-bottom: 16px; }
.layout-f2 .sticker-grid .row:last-child { margin-bottom: 0; }
.layout-f2 .sticker-grid .mini { position: relative; width: 125px; height: 155px; flex: 0 0 125px; background: #fff; padding: 8px 8px 26px 8px; box-shadow: 0 8px 18px rgba(40,24,60,0.12); }
.layout-f2 .sticker-grid .mini .img { position: relative; width: 100%; padding-bottom: 100%; border-radius: 3px; overflow: hidden; background: #f0e9fb; }
.layout-f2 .sticker-grid .mini .img img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.layout-f2 .sticker-grid .mini .num { position: absolute; bottom: 5px; left: 0; right: 0; text-align: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 14px; color: #1c1424; }
.layout-f2 .sticker-grid .mini.r1 { transform: rotate(-4deg); } .layout-f2 .sticker-grid .mini.r2 { transform: rotate(5deg); } .layout-f2 .sticker-grid .mini.r3 { transform: rotate(-3deg); } .layout-f2 .sticker-grid .mini.r4 { transform: rotate(7deg); } .layout-f2 .sticker-grid .mini.r5 { transform: rotate(-5deg); } .layout-f2 .sticker-grid .mini.r6 { transform: rotate(4deg); } .layout-f2 .sticker-grid .mini.r7 { transform: rotate(-6deg); } .layout-f2 .sticker-grid .mini.r8 { transform: rotate(3deg); } .layout-f2 .sticker-grid .mini.r9 { transform: rotate(-2deg); }
.layout-f2 .sticker-grid .mini.empty { background: rgba(255,255,255,0.55); }
.layout-f2 .footer { position: absolute; bottom: 30px; left: 0; right: 0; text-align: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 800; font-size: 14px; letter-spacing: 0.16em; text-transform: uppercase; color: #b3a8c2; }

/* === F3 — S7 + grid === */
.layout-f3 { background: #FAFAF5; }
.layout-f3::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(0,0,0,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.06) 2px, transparent 2px), linear-gradient(45deg, #ff4d85 0 34px, transparent 34px), linear-gradient(-25deg, #9b72cf 0 26px, transparent 26px), linear-gradient(60deg, #5c9eff 0 20px, transparent 20px), linear-gradient(15deg, #c8e860 0 30px, transparent 30px), linear-gradient(80deg, #ffb84a 0 22px, transparent 22px), linear-gradient(-60deg, #ff7eb3 0 28px, transparent 28px), radial-gradient(circle, #ff4d85 0 16px, transparent 17px), radial-gradient(circle, #9b72cf 0 14px, transparent 15px), radial-gradient(circle, #5c9eff 0 12px, transparent 13px), radial-gradient(circle, #c8e860 0 14px, transparent 15px); background-size: 80px 80px, 80px 80px, 300px 300px, 400px 400px, 260px 260px, 380px 380px, 300px 300px, 360px 360px, 180px 180px, 200px 200px, 240px 240px, 190px 190px; background-position: 0 0, 0 0, 80px 100px, 780px 80px, 50px 520px, 850px 480px, 880px 760px, 140px 880px, 480px 140px, 920px 340px, 40px 720px, 520px 940px; background-repeat: repeat, repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat; pointer-events: none; opacity: 0.65; }
.layout-f3 .confetti-piece { position: absolute; pointer-events: none; z-index: 1; }
.layout-f3 .confetti-piece.k1 { top: 5%; left: 4%; width: 40px; height: 56px; background: #ff4d85; transform: rotate(25deg); border-radius: 4px; }
.layout-f3 .confetti-piece.k2 { top: 6%; right: 5%; width: 48px; height: 28px; background: #9b72cf; transform: rotate(-15deg); border-radius: 50%; }
.layout-f3 .confetti-piece.k3 { top: 22%; left: 3%; width: 32px; height: 32px; background: #5c9eff; transform: rotate(45deg); }
.layout-f3 .confetti-piece.k4 { top: 18%; right: 4%; width: 42px; height: 24px; background: #c8e860; transform: rotate(70deg); border-radius: 4px; }
.layout-f3 .confetti-piece.k5 { top: 52%; left: 2%; width: 30px; height: 44px; background: #ffb84a; transform: rotate(-30deg); border-radius: 4px; }
.layout-f3 .confetti-piece.k6 { top: 55%; right: 2%; width: 38px; height: 38px; background: #ff7eb3; transform: rotate(20deg); border-radius: 50%; }
.layout-f3 .confetti-piece.k7 { bottom: 8%; left: 7%; width: 32px; height: 24px; background: #9b72cf; transform: rotate(-50deg); border-radius: 4px; }
.layout-f3 .confetti-piece.k8 { bottom: 5%; right: 8%; width: 48px; height: 28px; background: #5c9eff; transform: rotate(35deg); border-radius: 4px; }
.layout-f3 .title { position: absolute; top: 70px; left: 0; right: 0; text-align: center; z-index: 2; }
.layout-f3 .title .t1 { font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 62px; letter-spacing: -0.02em; color: #1c1424; line-height: 1; text-shadow: 0 4px 0 #fff, 0 6px 12px rgba(40,24,60,0.15); }
.layout-f3 .title .t1 span { display: inline-block; background: linear-gradient(120deg, #ff4d85, #c8e860); -webkit-background-clip: text; background-clip: text; color: transparent; }
.layout-f3 .title .t2 { margin-top: 14px; font-family: 'Nunito', system-ui, sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 0.3em; text-transform: uppercase; color: #9890a4; }
.layout-f3 .hero-cluster { position: absolute; top: 220px; left: 0; right: 0; height: 320px; }
.layout-f3 .sticker { position: absolute; }
.layout-f3 .sticker .img { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #fff; border: 10px solid #fff; box-shadow: 0 0 0 4px #1c1424, 0 14px 32px rgba(40,24,60,0.25); }
.layout-f3 .sticker .img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.layout-f3 .sticker .rank-tag { position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); width: 64px; height: 64px; border-radius: 50%; background: #ff4d85; display: flex; align-items: center; justify-content: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 28px; color: #fff; box-shadow: 0 0 0 3px #fff, 0 0 0 5px #1c1424, 0 8px 16px rgba(0,0,0,0.2); z-index: 3; }
.layout-f3 .sticker.s2 .rank-tag { background: #9b72cf; } .layout-f3 .sticker.s3 .rank-tag { background: #5c9eff; }
.layout-f3 .sticker .name-tag { position: absolute; top: -36px; left: 50%; transform: translateX(-50%); background: #1c1424; color: #fff; padding: 8px 18px; border-radius: 999px; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 17px; white-space: nowrap; z-index: 3; }
.layout-f3 .sticker .emoji { position: absolute; top: -10px; right: -10px; width: 54px; height: 54px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 0 3px #1c1424, 0 6px 14px rgba(0,0,0,0.2); z-index: 3; }
.layout-f3 .sticker.s1 .name-tag { left: calc(50% - 28px); }
.layout-f3 .sticker.s1 .emoji { right: 20px; }
.layout-f3 .sticker.s2 .emoji { right: auto; left: -10px; }
.layout-f3 .sticker.s1 { width: 240px; height: 240px; left: 50%; top: 0; transform: translateX(-50%) rotate(-3deg); z-index: 3; }
.layout-f3 .sticker.s2 { width: 190px; height: 190px; left: calc(50% - 280px); top: 60px; transform: rotate(8deg); z-index: 2; }
.layout-f3 .sticker.s3 { width: 190px; height: 190px; left: calc(50% + 90px); top: 60px; transform: rotate(-6deg); z-index: 2; }
.layout-f3 .sticker-grid { position: absolute; top: 500px; left: 0; right: 0; padding: 0 50px; }
.layout-f3 .sticker-grid .row { display: flex; justify-content: space-evenly; margin-bottom: 20px; }
.layout-f3 .sticker-grid .row:last-child { margin-bottom: 0; }
.layout-f3 .sticker-grid .mini { position: relative; width: 150px; height: 150px; flex: 0 0 150px; }
.layout-f3 .sticker-grid .mini .img { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #fff; border: 6px solid #fff; box-shadow: 0 0 0 2px #1c1424, 0 8px 20px rgba(40,24,60,0.18); }
.layout-f3 .sticker-grid .mini .img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.layout-f3 .sticker-grid .mini .num { position: absolute; bottom: -4px; right: 0; width: 36px; height: 36px; border-radius: 50%; background: #1c1424; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 900; font-size: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
.layout-f3 .sticker-grid .mini.r1 { transform: rotate(-4deg); } .layout-f3 .sticker-grid .mini.r2 { transform: rotate(5deg); } .layout-f3 .sticker-grid .mini.r3 { transform: rotate(-3deg); } .layout-f3 .sticker-grid .mini.r4 { transform: rotate(7deg); } .layout-f3 .sticker-grid .mini.r5 { transform: rotate(-5deg); } .layout-f3 .sticker-grid .mini.r6 { transform: rotate(4deg); } .layout-f3 .sticker-grid .mini.r7 { transform: rotate(-6deg); } .layout-f3 .sticker-grid .mini.r8 { transform: rotate(3deg); } .layout-f3 .sticker-grid .mini.r9 { transform: rotate(-2deg); }
.layout-f3 .sticker-grid .mini.empty { background: rgba(255,255,255,0.5); border-radius: 50%; border: 6px solid #fff; box-shadow: 0 0 0 2px #1c1424, 0 8px 20px rgba(40,24,60,0.12); }
.layout-f3 .footer { position: absolute; bottom: 36px; left: 0; right: 0; text-align: center; font-family: 'Nunito', system-ui, sans-serif; font-weight: 800; font-size: 14px; letter-spacing: 0.16em; text-transform: uppercase; color: #b3a8c2; }
`;

let injected = false;

export function injectTemplateCSS() {
  if (injected) return;
  if (document.getElementById(STYLE_ID)) {
    injected = true;
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = TEMPLATE_CSS;
  document.head.appendChild(style);
  injected = true;
}

const imgSrc = (md, name) => `/members/${md[name].sNumber}.jpg`;
const emo = (md, name) => md[name].emoji;

const NOW = new Date();
const TITLE_DATE = `bias sort · ${NOW.toLocaleString("en-US", { month: "short" }).toLowerCase()} ${NOW.getFullYear()}`;

function gridRows({ top12, memberData, renderMini, startSlot = 3 }) {
  const rest = top12.slice(startSlot);
  const rows = [];
  for (let row = 0; row < 3; row++) {
    const cells = [];
    for (let col = 0; col < 3; col++) {
      const slot = row * 3 + col;
      const pos = slot + 1;
      const name = rest[slot];
      const rank = slot + startSlot + 1;
      cells.push(
        name
          ? renderMini(name, rank, pos, memberData)
          : html`<div class="mini r${pos} empty"></div>`,
      );
    }
    rows.push(html`<div class="row">${cells.join("")}</div>`);
  }
  return rows.join("");
}

function stickerRound(name, rank, size, color, memberData) {
  return html`<div class="sticker s${rank === 1 ? 1 : rank}">
    <div class="img"><img src="${imgSrc(memberData, name)}" alt="" /></div>
    <div class="rank-tag">${rank}</div>
    <div class="name-tag">${name}</div>
    <div class="emoji">${emo(memberData, name)}</div>
  </div>`;
}

export function renderF1({ top12, memberData }) {
  const [r1, r2, r3] = top12;
  return html`<div class="mockup-canvas layout-f1" data-export-canvas>
      <div class="sticker-deco s1">✦</div>
      <div class="sticker-deco s2">♡</div>
      <div class="sticker-deco s3">✿</div>
      <div class="sticker-deco s4">★</div>
      <div class="title">
        <div class="t1">my <span>top 12</span> ♡</div>
        <div class="t2">${TITLE_DATE}</div>
      </div>
      <div class="hero-cluster">
        ${r2 ? stickerRound(r2, 2, 190, "#9b72cf", memberData) : ""}
        ${r1 ? stickerRound(r1, 1, 240, "#ff4d85", memberData) : ""}
        ${r3 ? stickerRound(r3, 3, 190, "#5c9eff", memberData) : ""}
      </div>
      <div class="sticker-grid">
        ${gridRows({
          top12,
          memberData,
          renderMini: (n, rk, pos) =>
            html`<div class="mini r${pos}">
              <div class="img">
                <img src="${imgSrc(memberData, n)}" alt="" />
              </div>
              <div class="num">${rk}</div>
            </div>`,
          startSlot: 3,
        })}
      </div>
      <div class="footer">sssorter.pages.dev</div>
  </div>`;
}

function stickerPolaroid(name, rank, memberData) {
  const sizeClass = rank === 1 ? "s1" : rank === 2 ? "s2" : "s3";
  return html`<div class="sticker ${sizeClass}">
    <div class="tape"></div>
    <div class="img"><img src="${imgSrc(memberData, name)}" alt="" /></div>
    <div class="caption">${rank} · ${name} ${emo(memberData, name)}</div>
    <div class="rank-tag">${rank}</div>
  </div>`;
}

export function renderF2({ top12, memberData }) {
  const [r1, r2, r3] = top12;
  return html`<div class="mockup-canvas layout-f2" data-export-canvas>
      <div class="deco-note n1"></div>
      <div class="deco-note n2"></div>
      <div class="deco-note n3"></div>
      <div class="deco-note n4"></div>
      <div class="title">
        <div class="t1">my <span>top 12</span> ♡</div>
        <div class="t2">${TITLE_DATE}</div>
      </div>
      <div class="hero-cluster">
        ${r2 ? stickerPolaroid(r2, 2, memberData) : ""}
        ${r1 ? stickerPolaroid(r1, 1, memberData) : ""}
        ${r3 ? stickerPolaroid(r3, 3, memberData) : ""}
      </div>
      <div class="sticker-grid">
        ${gridRows({
          top12,
          memberData,
          renderMini: (n, rk, pos) =>
            html`<div class="mini r${pos}">
              <div class="img">
                <img src="${imgSrc(memberData, n)}" alt="" />
              </div>
              <div class="num">${rk}</div>
            </div>`,
          startSlot: 3,
        })}
      </div>
      <div class="footer">sssorter.pages.dev</div>
  </div>`;
}

export function renderF3({ top12, memberData }) {
  const [r1, r2, r3] = top12;
  return html`<div class="mockup-canvas layout-f3" data-export-canvas>
      <div class="confetti-piece k1"></div>
      <div class="confetti-piece k2"></div>
      <div class="confetti-piece k3"></div>
      <div class="confetti-piece k4"></div>
      <div class="confetti-piece k5"></div>
      <div class="confetti-piece k6"></div>
      <div class="confetti-piece k7"></div>
      <div class="confetti-piece k8"></div>
      <div class="title">
        <div class="t1">my <span>top 12</span> ♡</div>
        <div class="t2">${TITLE_DATE}</div>
      </div>
      <div class="hero-cluster">
        ${r2 ? stickerRound(r2, 2, 190, "#9b72cf", memberData) : ""}
        ${r1 ? stickerRound(r1, 1, 240, "#ff4d85", memberData) : ""}
        ${r3 ? stickerRound(r3, 3, 190, "#5c9eff", memberData) : ""}
      </div>
      <div class="sticker-grid">
        ${gridRows({
          top12,
          memberData,
          renderMini: (n, rk, pos) =>
            html`<div class="mini r${pos}">
              <div class="img">
                <img src="${imgSrc(memberData, n)}" alt="" />
              </div>
              <div class="num">${rk}</div>
            </div>`,
          startSlot: 3,
        })}
      </div>
      <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
