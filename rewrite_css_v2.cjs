const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const oldCssRegex = /\/\* Experience Setu Simulation \*\/[\s\S]*?\/\* Shared Section Styles \*\//;

const newCss = `/* Experience Setu Dual-Screen Simulation */
.dual-sim-layout { display: grid; grid-template-columns: 350px 1fr; gap: 48px; align-items: start; margin-top: 24px; min-height: 600px; }
@media (max-width: 1024px) {
  .dual-sim-layout { grid-template-columns: 1fr; }
}

/* Phone Mockup (Left) */
.phone-container { display: flex; justify-content: center; position: relative; z-index: 10; }
.phone-mockup { width: 320px; height: 650px; background: #fff; border-radius: 40px; border: 12px solid #091016; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25), inset 0 0 0 4px #e2e8f0; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.phone-notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 30px; background: #091016; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; z-index: 20; }
.phone-screen { flex: 1; padding: 48px 24px 24px; display: flex; flex-direction: column; position: relative; overflow: hidden; background: #f9fbfd; }

/* In-Phone App UI */
.app-view { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: 48px 24px 24px; background: #f9fbfd; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); transform: translateX(100%); display: flex; flex-direction: column; }
.app-view.active { transform: translateX(0); }
.app-view.exit { transform: translateX(-100%); }
.app-header { font-size: 1.2rem; font-weight: 700; color: #091016; margin-bottom: 24px; text-align: center; }
.app-input { width: 100%; padding: 12px 16px; border: 1px solid var(--surface-border); border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; font-family: inherit; }
.app-btn { width: 100%; padding: 14px; background: var(--primary-color); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: var(--transition); margin-top: auto; }
.app-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }
.app-btn.loading { opacity: 0.7; pointer-events: none; }
.app-card { background: #fff; padding: 16px; border-radius: 12px; border: 1px solid var(--surface-border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 16px; }

/* Backend View (Right) */
.backend-view { display: flex; flex-direction: column; gap: 24px; height: 100%; }
.card-title { font-size: 0.9rem; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 16px; letter-spacing: 0.05em; font-weight: 700; }
.network-diagram-card { background: #091016; border-radius: 16px; padding: 32px; box-shadow: var(--shadow); position: relative; }
.backend-lower-split { display: grid; grid-template-columns: 1fr 250px; gap: 24px; }
@media (max-width: 768px) {
  .backend-lower-split { grid-template-columns: 1fr; }
}

.narrative-card { background: #fff; border: 1px solid var(--surface-border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow); }
.metrics-card { background: #fff; border: 1px solid var(--surface-border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow); display: flex; flex-direction: column; }
.metric-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.metric-box { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid var(--surface-border); font-size: 0.85rem; }
.m-label { color: var(--text-secondary); font-weight: 600; }
.m-val { font-weight: 700; color: #091016; }

/* Network Diagram Logic */
.node-network { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 16px; }
.net-node { width: 100px; height: 100px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 0.8rem; font-weight: 600; text-align: center; backdrop-filter: blur(10px); transition: var(--transition); z-index: 5; }
.net-node .node-icon { font-size: 1.8rem; margin-bottom: 4px; }
.net-node.core { border-color: var(--primary-color); box-shadow: 0 0 30px rgba(66,202,205,0.2); background: rgba(66,202,205,0.1); }
.net-node.active { transform: scale(1.05); border-color: #38a169; box-shadow: 0 0 20px rgba(56,161,105,0.4); }

.net-path { flex: 1; height: 2px; background: rgba(255,255,255,0.1); position: relative; margin: 0 12px; z-index: 1; }
.packet-sim { position: absolute; top: -5px; left: 0; width: 12px; height: 12px; background: var(--primary-color); border-radius: 50%; opacity: 0; box-shadow: 0 0 10px var(--primary-color); z-index: 10; }
.packet-sim.animate-forward { animation: shootRight 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; opacity: 1; }
.packet-sim.animate-backward { animation: shootLeft 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; opacity: 1; background: #38a169; box-shadow: 0 0 10px #38a169; }

@keyframes shootRight { 0% { left: 0; opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
@keyframes shootLeft { 0% { left: 100%; opacity: 1; } 90% { opacity: 1; } 100% { left: 0; opacity: 0; } }

/* Live Chart */
.live-chart { display: flex; align-items: flex-end; gap: 4px; height: 60px; }
.live-chart .bar { flex: 1; background: var(--primary-color); opacity: 0.5; border-radius: 2px 2px 0 0; transition: height 0.5s ease; }
.live-chart.active .bar { animation: fluctuate 1s infinite alternate; }
@keyframes fluctuate { 0% { height: 20%; } 100% { height: 90%; } }

/* Educational Toast */
.edu-toast { position: absolute; bottom: 32px; right: -400px; width: 320px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border: 1px solid var(--surface-border); border-left: 4px solid var(--primary-color); border-radius: 8px; padding: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 50; }
.edu-toast.visible { right: 32px; }
.toast-header { font-weight: 700; color: var(--primary-color); font-size: 0.85rem; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.edu-toast p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4; margin: 0; }

.scen-tab { padding: 8px 16px; border: 1px solid var(--surface-border); background: #fff; border-radius: 20px; font-weight: 600; cursor: pointer; color: var(--text-secondary); transition: var(--transition); }
.scen-tab.active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }

/* Shared Section Styles */`;

css = css.replace(oldCssRegex, newCss);

fs.writeFileSync('style.css', css);
