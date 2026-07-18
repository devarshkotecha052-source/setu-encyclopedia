const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldSectionRegex = /<section id="experience" class="section"[^>]*>[\s\S]*?<!-- 4\. Geography & Scale -->/;

const newSection = `
  <!-- Experience Setu Premium V3 Simulation -->
  <section id="experience" class="section" style="background: #ffffff; overflow: hidden; position: relative;">
    <div class="container fade-up" style="max-width: 1600px; padding: 0 24px;">
      
      <div style="text-align: center; margin-bottom: 40px;">
        <span class="sec-tag">Product Lab</span>
        <h2 class="sec-title">The Setu Orchestration Engine</h2>
        <p style="color: var(--text-tertiary); max-width: 700px; margin: 16px auto 0;">Interact with the mock application on the left to witness how Setu powers the complex financial infrastructure in real-time on the right.</p>
        
        <div class="scenario-selector v3-tabs" style="margin-top: 32px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">
          <button class="v3-tab active" data-scenario="kyc">🔐 KYC Verification</button>
          <button class="v3-tab" data-scenario="aa">🏦 Account Aggregation</button>
          <button class="v3-tab" data-scenario="payment">💸 UPI Payment</button>
          <button class="v3-tab disabled">📊 Statement Fetch</button>
          <button class="v3-tab disabled">💳 Loan Eligibility</button>
          <button class="v3-tab disabled">👤 Identity Check</button>
        </div>
      </div>
      
      <div class="v3-sim-layout">
        
        <!-- LEFT: Phone Mockup (40%) -->
        <div class="v3-phone-wrapper">
          <div class="v3-phone">
            <div class="v3-phone-glass-reflection"></div>
            <div class="v3-phone-notch"></div>
            <div class="v3-phone-screen" id="v3-app-screen">
              <!-- Injected by JS -->
            </div>
          </div>
        </div>
        
        <!-- RIGHT: Orchestration Engine (60%) -->
        <div class="v3-backend-wrapper">
          <div class="v3-orch-header">
            <span class="glow-dot"></span> SETU ORCHESTRATION ENGINE
          </div>
          
          <!-- Architecture Diagram -->
          <div class="v3-diagram-card">
            <div class="v3-diagram-track" id="v3-diagram-track">
              <!-- Nodes and Paths injected by JS based on scenario to keep HTML clean -->
            </div>
          </div>
          
          <!-- Middle Grid: Timeline, Logs, Inspector -->
          <div class="v3-middle-grid">
            
            <div class="v3-panel v3-timeline-panel">
              <h5 class="v3-panel-title">Sync Timeline</h5>
              <div class="v3-timeline-list" id="v3-timeline">
                <!-- Checkmarks injected -->
              </div>
            </div>
            
            <div class="v3-panel v3-terminal-panel">
              <h5 class="v3-panel-title">Live Server Logs</h5>
              <div class="v3-terminal-body" id="v3-terminal">
                <div class="log-line sys">System initialized. Awaiting user interaction...</div>
              </div>
            </div>
            
            <div class="v3-panel v3-json-panel">
              <h5 class="v3-panel-title">API Inspector</h5>
              <pre class="v3-json-body" id="v3-json">{
  "status": "idle",
  "message": "waiting for request"
}</pre>
            </div>
            
          </div>
          
          <!-- Bottom Grid: Explanations & Metrics -->
          <div class="v3-bottom-grid">
            
            <div class="v3-expl-cards">
              <div class="v3-expl-card">
                <span class="v3-expl-label">What's Happening</span>
                <p id="v3-what">Interact with the phone to begin.</p>
              </div>
              <div class="v3-expl-card">
                <span class="v3-expl-label">Why?</span>
                <p id="v3-why">-</p>
              </div>
              <div class="v3-expl-card highlight">
                <span class="v3-expl-label">Setu's Role</span>
                <p id="v3-role">-</p>
              </div>
            </div>
            
            <div class="v3-metrics-dashboard">
              <div class="v3-metric">
                <span class="v3-metric-val" id="met-api">0</span>
                <span class="v3-metric-lbl">API Calls</span>
              </div>
              <div class="v3-metric">
                <span class="v3-metric-val" id="met-lat">0ms</span>
                <span class="v3-metric-lbl">Latency</span>
              </div>
              <div class="v3-metric">
                <span class="v3-metric-val" id="met-suc">99.9%</span>
                <span class="v3-metric-lbl">Success Rate</span>
              </div>
              <div class="v3-metric">
                <span class="v3-metric-val" id="met-srv">0</span>
                <span class="v3-metric-lbl">Services Sync</span>
              </div>
            </div>
            
          </div>
          
        </div>
        
      </div>
      
      <!-- Celebration Overlay -->
      <div class="v3-celebration" id="v3-celebration">
        <div class="v3-confetti"></div>
        <div class="v3-cel-card">
          <div class="v3-cel-icon">🎉</div>
          <h3>Journey Complete</h3>
          <p>Congratulations! You just experienced how Setu orchestrates multiple financial systems behind a single tap.</p>
          <div class="v3-cel-stats">
            <div><strong id="cel-apis">7</strong><span>API Calls</span></div>
            <div><strong id="cel-time">183ms</strong><span>Total Time</span></div>
            <div><strong id="cel-nodes">5</strong><span>Systems Synced</span></div>
          </div>
          <button class="btn-primary" id="btn-v3-restart" style="margin-top:24px; width:100%;">Run Another Scenario</button>
        </div>
      </div>
      
    </div>
  </section>
  <!-- 4. Geography & Scale -->
`;

html = html.replace(oldSectionRegex, newSection);
fs.writeFileSync('index.html', html);
