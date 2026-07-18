const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldSection = /<section id="experience" class="section"[^>]*>[\s\S]*?<!-- 4\. Geography & Scale -->/;

const newSection = `
  <!-- Experience Setu Dual-Screen Simulation -->
  <section id="experience" class="section" style="background: #ffffff; overflow: hidden; position: relative;">
    <div class="container fade-up" style="max-width: 1400px;">
      <div style="text-align: center; margin-bottom: 48px;">
        <span class="sec-tag">Experience Setu</span>
        <h2 class="sec-title">Interactive Product Demo</h2>
        <p style="color: var(--text-tertiary); max-width: 600px; margin: 16px auto 0;">Interact with the mobile app on the left to see how Setu seamlessly orchestrates the backend infrastructure on the right.</p>
        
        <div class="scenario-selector" style="margin-top: 32px;">
          <button class="scen-tab active" data-scenario="kyc">KYC Verification</button>
          <button class="scen-tab" data-scenario="aa">Account Aggregation</button>
          <button class="scen-tab" data-scenario="payment">UPI Payment</button>
        </div>
      </div>
      
      <div class="dual-sim-layout">
        <!-- LEFT: Mobile App Mockup -->
        <div class="phone-container">
          <div class="phone-mockup">
            <div class="phone-notch"></div>
            <div class="phone-screen" id="app-screen-container">
              <!-- Screens injected by JS -->
            </div>
          </div>
        </div>
        
        <!-- RIGHT: Backend & Educational View -->
        <div class="backend-view">
          
          <!-- Top: Network Diagram -->
          <div class="network-diagram-card">
            <h4 class="card-title">Live Infrastructure Diagram</h4>
            <div class="node-network">
              <div class="net-node" id="node-customer">
                 <div class="node-icon">📱</div>
                 <span>Partner App</span>
              </div>
              <div class="net-path" id="path-1">
                 <div class="packet-sim" id="packet-1"></div>
              </div>
              <div class="net-node core" id="node-setu">
                 <div class="node-icon">⚡</div>
                 <span>Setu API</span>
              </div>
              <div class="net-path" id="path-2">
                 <div class="packet-sim" id="packet-2"></div>
              </div>
              <div class="net-node" id="node-bank">
                 <div class="node-icon">🏦</div>
                 <span id="bank-name">Regulated Bank</span>
              </div>
            </div>
          </div>

          <!-- Bottom: Split Info & Dashboard -->
          <div class="backend-lower-split">
            <!-- Dynamic Narrative Panel -->
            <div class="narrative-card">
              <h4 class="card-title" id="step-title">Waiting for interaction...</h4>
              <div class="narrative-content">
                <div class="narrative-block">
                  <h5>What's happening?</h5>
                  <p id="desc-what">Use the smartphone on the left to begin.</p>
                </div>
                <div class="narrative-block">
                  <h5>Why is this necessary?</h5>
                  <p id="desc-why">-</p>
                </div>
                <div class="narrative-block">
                  <h5>What is Setu doing?</h5>
                  <p id="desc-role">-</p>
                </div>
                <details class="tech-insight">
                  <summary>Technical Insight</summary>
                  <p id="desc-tech" style="font-family: monospace; font-size: 0.8rem; margin-top: 8px; color: var(--text-tertiary);">-</p>
                </details>
              </div>
            </div>

            <!-- Live Metrics Dashboard -->
            <div class="metrics-card">
              <h4 class="card-title">Live Metrics</h4>
              <div class="metric-grid">
                <div class="metric-box">
                  <span class="m-label">Status</span>
                  <span class="m-val" id="dash-status">Idle</span>
                </div>
                <div class="metric-box">
                  <span class="m-label">API Calls</span>
                  <span class="m-val" id="dash-apis">0</span>
                </div>
                <div class="metric-box">
                  <span class="m-label">Network Latency</span>
                  <span class="m-val" id="dash-latency">0ms</span>
                </div>
                <div class="metric-box">
                  <span class="m-label">Security Layer</span>
                  <span class="m-val" style="color:#38a169;">TLS 1.3 Active</span>
                </div>
              </div>
              <div class="live-chart" style="margin-top: 24px;">
                <div class="bar" style="height: 10%"></div>
                <div class="bar" style="height: 10%"></div>
                <div class="bar" style="height: 10%"></div>
                <div class="bar" style="height: 10%"></div>
                <div class="bar" style="height: 10%"></div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Educational Toast Notification -->
      <div class="edu-toast" id="edu-toast">
        <div class="toast-header">💡 Did You Know?</div>
        <p id="toast-msg">Setu standardizes responses from different banks into a consistent format.</p>
      </div>
      
      <!-- Final Summary Overlay -->
      <div class="sim-gamification" id="sim-gamification">
        <div class="learning-summary">
          <h3 style="color: #38a169; margin-bottom: 16px;">✓ Customer Journey Completed</h3>
          <div class="summary-content">
            <p><strong>Total Steps:</strong> <span id="sum-steps">4</span></p>
            <p><strong>APIs Invoked:</strong> <span id="sum-apis">3</span></p>
            <p><strong>Time Taken:</strong> <span id="sum-time">1.2s</span></p>
            <p style="margin-top: 16px;"><strong>Key Learning:</strong> By embedding Setu's APIs directly into the application flow, the customer never had to leave the app, resulting in a seamless embedded finance experience.</p>
          </div>
          <button class="btn-primary" id="btn-restart" style="margin-top: 24px; width: 100%;">Restart Demo</button>
        </div>
      </div>
      
    </div>
  </section>
  <!-- 4. Geography & Scale -->
`;

html = html.replace(oldSection, newSection);

fs.writeFileSync('index.html', html);
