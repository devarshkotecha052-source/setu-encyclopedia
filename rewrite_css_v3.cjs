const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');
const oldCssRegex = /\/\* Experience Setu Dual-Screen Simulation \*\/[\s\S]*?\/\* Shared Section Styles \*\//;

const newCss = `/* Experience Setu Premium V3 Simulation */
.v3-tabs { margin-bottom: 32px; }
.v3-tab { padding: 8px 16px; border: 1px solid var(--surface-border); background: #fff; border-radius: 20px; font-weight: 600; cursor: pointer; color: var(--text-secondary); transition: var(--transition); display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
.v3-tab.active { background: #091016; color: #fff; border-color: #091016; box-shadow: 0 4px 12px rgba(9, 16, 22, 0.2); }
.v3-tab.disabled { opacity: 0.5; cursor: not-allowed; }

.v3-sim-layout { display: grid; grid-template-columns: 4fr 6fr; gap: 48px; min-height: 700px; align-items: start; }
@media (max-width: 1100px) { .v3-sim-layout { grid-template-columns: 1fr; } }

/* The Phone */
.v3-phone-wrapper { display: flex; justify-content: center; position: relative; z-index: 10; }
.v3-phone { width: 340px; height: 720px; background: #fff; border-radius: 50px; border: 14px solid #000; box-shadow: 0 30px 60px -15px rgba(0,0,0,0.3), inset 0 0 0 2px #333; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.v3-phone-glass-reflection { position: absolute; top: 0; left: -50%; width: 200%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%); z-index: 15; pointer-events: none; }
.v3-phone-notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 100px; height: 25px; background: #000; border-radius: 20px; z-index: 20; box-shadow: inset 0 -1px 2px rgba(255,255,255,0.1); }
.v3-phone-screen { flex: 1; position: relative; background: #f4f6f8; overflow: hidden; display: flex; flex-direction: column; }

/* Phone Screens */
.v3-screen { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #f4f6f8; display: flex; flex-direction: column; transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease; padding: 56px 20px 24px; transform: translateX(100%); opacity: 0; pointer-events: none; }
.v3-screen.active { transform: translateX(0); opacity: 1; pointer-events: all; }
.v3-screen.exit { transform: translateX(-100%); opacity: 0; }
.v3-app-header { font-size: 1.1rem; font-weight: 700; color: #1a202c; text-align: center; margin-bottom: 24px; }
.v3-app-card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-bottom: 16px; border: 1px solid rgba(0,0,0,0.05); }
.v3-input { width: 100%; padding: 14px; background: #edf2f7; border: 1px solid #e2e8f0; border-radius: 10px; font-family: inherit; font-size: 1rem; margin-bottom: 16px; transition: border-color 0.2s; }
.v3-input:focus { border-color: var(--primary-color); outline: none; }
.v3-btn { width: 100%; padding: 16px; background: #000; color: #fff; border: none; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: transform 0.1s, background 0.2s; margin-top: auto; display: flex; justify-content: center; align-items: center; gap: 8px; }
.v3-btn:active { transform: scale(0.97); }
.v3-btn:hover { background: #1a202c; }
.v3-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Skeletons */
.skeleton-line { height: 12px; background: #e2e8f0; border-radius: 6px; margin-bottom: 12px; overflow: hidden; position: relative; }
.skeleton-line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

/* Orchestration Engine */
.v3-backend-wrapper { display: flex; flex-direction: column; gap: 24px; }
.v3-orch-header { font-size: 0.8rem; font-weight: 800; letter-spacing: 0.1em; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
.glow-dot { width: 8px; height: 8px; background: var(--primary-color); border-radius: 50%; box-shadow: 0 0 10px var(--primary-color); animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

/* Architecture Diagram */
.v3-diagram-card { background: #091016; border-radius: 20px; padding: 40px 24px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2); position: relative; border: 1px solid rgba(255,255,255,0.05); }
.v3-diagram-track { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px 8px; align-items: center; position: relative; }

.v3-node { width: 100px; height: 90px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #a0aec0; font-size: 0.75rem; text-align: center; transition: all 0.3s ease; position: relative; z-index: 5; }
.v3-node i { font-size: 1.5rem; font-style: normal; }
.v3-node.active { color: #fff; background: rgba(66,202,205,0.15); border-color: var(--primary-color); box-shadow: 0 0 25px rgba(66,202,205,0.3); transform: translateY(-3px); }
.v3-node.success { color: #fff; background: rgba(56,161,105,0.15); border-color: #38a169; box-shadow: 0 0 25px rgba(56,161,105,0.3); }

.v3-path { flex-grow: 1; min-width: 30px; height: 2px; background: rgba(255,255,255,0.1); position: relative; z-index: 1; }
.v3-packet { position: absolute; top: -4px; left: 0; width: 10px; height: 10px; background: #fff; border-radius: 50%; opacity: 0; box-shadow: 0 0 15px 5px rgba(255,255,255,0.5); }
.v3-packet.fwd { animation: shootRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; opacity: 1; background: var(--primary-color); box-shadow: 0 0 15px 5px rgba(66,202,205,0.6); }
.v3-packet.rev { animation: shootLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; opacity: 1; background: #38a169; box-shadow: 0 0 15px 5px rgba(56,161,105,0.6); }

/* Middle Grid: Timeline, Logs, JSON */
.v3-middle-grid { display: grid; grid-template-columns: 2fr 3fr 3fr; gap: 16px; }
@media (max-width: 1300px) { .v3-middle-grid { grid-template-columns: 1fr; } }
.v3-panel { background: #fff; border: 1px solid var(--surface-border); border-radius: 12px; padding: 16px; box-shadow: var(--shadow); display: flex; flex-direction: column; height: 240px; }
.v3-panel-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 12px; font-weight: 700; border-bottom: 1px solid var(--surface-border); padding-bottom: 8px; }

/* Timeline */
.v3-timeline-list { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1; font-size: 0.85rem; color: var(--text-secondary); }
.v3-tl-item { display: flex; align-items: center; gap: 8px; opacity: 0; transform: translateY(10px); transition: all 0.3s ease; }
.v3-tl-item.visible { opacity: 1; transform: translateY(0); }
.v3-tl-item i { color: #38a169; }

/* Terminal Logs */
.v3-terminal-panel { background: #091016; border-color: #1a202c; }
.v3-terminal-panel .v3-panel-title { border-color: #2d3748; color: #a0aec0; }
.v3-terminal-body { font-family: 'Courier New', Courier, monospace; font-size: 0.75rem; color: #a0aec0; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 6px; }
.log-line.sys { color: #718096; }
.log-line.req { color: #42cacd; }
.log-line.res { color: #38a169; }
.log-line.err { color: #e53e3e; }

/* JSON Inspector */
.v3-json-panel { background: #1a202c; border-color: #2d3748; }
.v3-json-panel .v3-panel-title { border-color: #4a5568; color: #cbd5e0; }
.v3-json-body { font-family: 'Courier New', Courier, monospace; font-size: 0.75rem; color: #e2e8f0; overflow-y: auto; flex: 1; margin: 0; }
.json-key { color: #90cdf4; }
.json-val-str { color: #f6ad55; }
.json-val-num { color: #fc8181; }

/* Bottom Grid: Cards & Metrics */
.v3-bottom-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
@media (max-width: 1300px) { .v3-bottom-grid { grid-template-columns: 1fr; } }
.v3-expl-cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.v3-expl-card { background: #fff; border: 1px solid var(--surface-border); border-radius: 12px; padding: 16px; box-shadow: var(--shadow); }
.v3-expl-card.highlight { background: rgba(66,202,205,0.05); border-color: rgba(66,202,205,0.2); }
.v3-expl-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); font-weight: 700; display: block; margin-bottom: 8px; }
.v3-expl-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin: 0; }

.v3-metrics-dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.v3-metric { background: #fff; border: 1px solid var(--surface-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: var(--shadow); }
.v3-metric-val { font-size: 1.5rem; font-weight: 800; color: #091016; transition: color 0.3s; }
.v3-metric-val.updated { color: var(--primary-color); }
.v3-metric-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); margin-top: 4px; }

/* Celebration Overlay */
.v3-celebration { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.5s ease; }
.v3-celebration.active { opacity: 1; pointer-events: all; }
.v3-cel-card { background: #fff; border-radius: 24px; padding: 48px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: 1px solid var(--surface-border); text-align: center; max-width: 500px; transform: scale(0.9); transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.v3-celebration.active .v3-cel-card { transform: scale(1); }
.v3-cel-icon { font-size: 4rem; margin-bottom: 16px; animation: bounce 2s infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.v3-cel-card p { color: var(--text-secondary); margin-bottom: 32px; font-size: 1.1rem; line-height: 1.5; }
.v3-cel-stats { display: flex; justify-content: space-around; background: #f4f6f8; border-radius: 16px; padding: 24px; }
.v3-cel-stats div { display: flex; flex-direction: column; align-items: center; }
.v3-cel-stats strong { font-size: 1.8rem; color: #1a202c; }
.v3-cel-stats span { font-size: 0.75rem; text-transform: uppercase; color: #718096; margin-top: 4px; font-weight: 600; }

/* Confetti (pure CSS trick via multiple box shadows, simplified for size) */
.v3-confetti { position: absolute; width: 10px; height: 10px; background: #38a169; top: -10px; left: 50%; opacity: 0; }
.v3-celebration.active .v3-confetti { animation: confettiFall 3s ease-out forwards; }
@keyframes confettiFall { 0% { transform: translateY(0) rotate(0); opacity: 1; box-shadow: 100px 100px #42cacd, -100px 200px #f6ad55, 200px 50px #fc8181, -200px 300px #90cdf4; } 100% { transform: translateY(1000px) rotate(720deg); opacity: 0; box-shadow: 100px 1100px #42cacd, -100px 1200px #f6ad55, 200px 1050px #fc8181, -200px 1300px #90cdf4; } }

/* Shared Section Styles */`;

css = css.replace(oldCssRegex, newCss);
fs.writeFileSync('style.css', css);
