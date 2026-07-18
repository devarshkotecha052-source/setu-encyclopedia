const fs = require('fs');

let js = fs.readFileSync('main.js', 'utf8');
const oldLogicStr = "// Experience Setu Dual-Screen Simulation Logic";
const oldLogicIndex = js.indexOf(oldLogicStr);
if (oldLogicIndex === -1) {
    console.log("Could not find old logic");
} else {
    js = js.substring(0, oldLogicIndex);
}

const newLogic = `// Experience Setu Dual-Screen Simulation Logic
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.v3-tab:not(.disabled)');
  const appScreen = document.getElementById('v3-app-screen');
  const diagramTrack = document.getElementById('v3-diagram-track');
  const tlList = document.getElementById('v3-timeline');
  const termBody = document.getElementById('v3-terminal');
  const jsonBody = document.getElementById('v3-json');
  
  const explWhat = document.getElementById('v3-what');
  const explWhy = document.getElementById('v3-why');
  const explRole = document.getElementById('v3-role');
  
  const metApi = document.getElementById('met-api');
  const metLat = document.getElementById('met-lat');
  const metSrv = document.getElementById('met-srv');
  
  const celOverlay = document.getElementById('v3-celebration');
  const celApis = document.getElementById('cel-apis');
  const celTime = document.getElementById('cel-time');
  const celNodes = document.getElementById('cel-nodes');
  const btnRestart = document.getElementById('btn-v3-restart');
  
  let currentScenario = null;
  let apiCount = 0;
  let startTime = 0;
  let srvCount = 0;

  const scenarios = {
    kyc: {
      nodes: [
        { id: 'n-app', icon: '📱', label: 'App Frontend' },
        { id: 'n-srv', icon: '💻', label: 'App Server' },
        { id: 'n-gw', icon: '⚡', label: 'Setu Gateway' },
        { id: 'n-auth', icon: '🔒', label: 'Auth Layer' },
        { id: 'n-rout', icon: '🔀', label: 'API Router' },
        { id: 'n-nsdl', icon: '🏛️', label: 'NSDL Gov' }
      ],
      screens: [
        {
          id: 'kyc-1',
          html: \`
            <div class="v3-app-header">CryptoX</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px;">Identity Verification</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">We need to verify your PAN before you can trade.</p>
              <label style="font-size: 0.75rem; color: #4a5568; font-weight: bold; margin-bottom: 4px; display: block;">Permanent Account Number</label>
              <input type="text" class="v3-input" value="ABCDE1234F" readonly />
              <button class="v3-btn" onclick="simTrigger('kyc', 1)">Verify PAN securely</button>
            </div>
          \`
        },
        {
          id: 'kyc-2',
          html: \`
            <div class="v3-app-header">CryptoX</div>
            <div class="v3-app-card" style="padding: 32px 20px;">
              <div class="skeleton-line" style="width: 60%;"></div>
              <div class="skeleton-line" style="width: 100%;"></div>
              <div class="skeleton-line" style="width: 80%;"></div>
              <p style="font-size:0.85rem; color:#718096; margin-top:24px; text-align:center;">Verifying with NSDL...</p>
            </div>
          \`
        },
        {
          id: 'kyc-3',
          html: \`
            <div class="v3-app-header">CryptoX</div>
            <div class="v3-app-card" style="text-align:center; padding: 40px 20px;">
              <div style="font-size:3rem; color:#38a169; margin-bottom:16px;">✓</div>
              <h4>Identity Verified</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">Welcome to CryptoX! Your account is fully activated.</p>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('234ms')">Go to Portfolio</button>
            </div>
          \`
        }
      ],
      actions: {
        1: async () => {
          startTime = Date.now();
          transitionScreen('kyc-2');
          
          updateExpl('App validates input', 'Basic frontend sanity check before calling servers.', '-');
          await activateNode('n-app');
          addTimeline('Frontend Validated');
          
          updateExpl('App calls backend', 'Secure server-to-server communication.', '-');
          await sendPacket('n-app', 'n-srv');
          await activateNode('n-srv');
          addTimeline('App Server Received');
          
          updateExpl('Routing to Setu', 'The app uses Setu SDK to trigger KYC verify.', 'Setu Gateway ingests the request.');
          addLog('req', 'POST /api/v1/kyc/pan/verify');
          updateJSON({ pan: "ABCDE1234F", consent: true });
          await sendPacket('n-srv', 'n-gw');
          await activateNode('n-gw');
          incApi();
          
          updateExpl('Authentication', 'Ensuring the app is an authorized Setu partner.', 'Setu Auth verifies JWT tokens.');
          addLog('sys', 'Authenticating partner...');
          await sendPacket('n-gw', 'n-auth');
          await activateNode('n-auth');
          
          updateExpl('Routing to Gov DB', 'Setu maps the generic request to NSDL specific XML format.', 'Router formats and securely transmits.');
          addLog('sys', 'Routing to NSDL provider');
          await sendPacket('n-auth', 'n-rout');
          await activateNode('n-rout');
          
          updateExpl('NSDL Verification', 'The official government database checks the PAN.', 'Setu waits for upstream response.');
          await sendPacket('n-rout', 'n-nsdl');
          await activateNode('n-nsdl');
          addTimeline('NSDL Hit');
          addLog('sys', 'Awaiting NSDL response...');
          await sleep(600); // Gov DB delay
          
          updateExpl('Formatting Response', 'NSDL returns raw XML which is hard to parse.', 'Setu standardizes XML into a clean JSON response.');
          addLog('res', '200 OK - NSDL XML Parsed');
          updateJSON({ status: "success", name: "Rahul Kumar", valid: true });
          document.getElementById('n-nsdl').classList.add('success');
          await sendPacket('n-nsdl', 'n-rout', true);
          await sendPacket('n-rout', 'n-auth', true);
          await sendPacket('n-auth', 'n-gw', true);
          
          updateExpl('Success', 'The app receives the result and updates the UI.', '-');
          await sendPacket('n-gw', 'n-srv', true);
          await sendPacket('n-srv', 'n-app', true);
          addTimeline('UI Updated');
          
          transitionScreen('kyc-3');
        }
      }
    },
    aa: {
      nodes: [
        { id: 'n-app', icon: '📱', label: 'App Frontend' },
        { id: 'n-gw', icon: '⚡', label: 'Setu Gateway' },
        { id: 'n-fiu', icon: '🔍', label: 'FIU Module' },
        { id: 'n-cons', icon: '📝', label: 'Consent Mgr' },
        { id: 'n-fip', icon: '🏦', label: 'HDFC Bank (FIP)' }
      ],
      screens: [
        {
          id: 'aa-1',
          html: \`
            <div class="v3-app-header">LendSmart</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px;">Loan Eligibility</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">We need 6 months of bank statements to assess your loan.</p>
              <button class="v3-btn" onclick="simTrigger('aa', 1)">Link Bank Account</button>
            </div>
          \`
        },
        {
          id: 'aa-2',
          html: \`
            <div class="v3-app-header" style="color: #42cacd;">Setu AA Screen</div>
            <div class="v3-app-card" style="border: 2px solid #42cacd;">
              <h4 style="margin-bottom:8px;">Approve Data Share</h4>
              <div style="background:#f4f6f8; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 0.8rem;">
                <strong>Bank:</strong> HDFC Bank Ltd<br>
                <strong>Duration:</strong> 6 Months<br>
                <strong>Purpose:</strong> Loan Underwriting
              </div>
              <button class="v3-btn" style="background:#42cacd;" onclick="simTrigger('aa', 2)">I Approve</button>
            </div>
          \`
        },
        {
          id: 'aa-3',
          html: \`
            <div class="v3-app-header">LendSmart</div>
            <div class="v3-app-card" style="padding: 32px 20px;">
               <div class="skeleton-line" style="width: 100%;"></div>
               <div class="skeleton-line" style="width: 80%;"></div>
               <p style="font-size:0.85rem; color:#718096; margin-top:24px; text-align:center;">Decrypting Bank Data...</p>
            </div>
          \`
        },
        {
          id: 'aa-4',
          html: \`
            <div class="v3-app-header">LendSmart</div>
            <div class="v3-app-card" style="text-align:center;">
              <h4 style="color:#38a169;">Approved: ₹5,00,000</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">Based on your healthy cash flows, you are pre-approved!</p>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('412ms')">Accept Loan</button>
            </div>
          \`
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('aa-2');
          updateExpl('Request Consent', 'App requests the Account Aggregator interface.', 'Setu generates a secure RBI-compliant webview.');
          addTimeline('Consent Requested');
          addLog('req', 'GET /aa/consent/init');
          updateJSON({ purpose: "LOAN_UNDERWRITING", duration: "6M" });
          await activateNode('n-app');
          await sendPacket('n-app', 'n-gw');
          await activateNode('n-gw');
          await sendPacket('n-gw', 'n-cons');
          await activateNode('n-cons');
          incApi();
        },
        2: async () => {
          transitionScreen('aa-3');
          updateExpl('Data Fetch', 'User approved. Encrypted data is pulled from the bank.', 'Setu acts as the FIU to request data.');
          addTimeline('Consent Granted');
          addLog('req', 'POST /aa/data/fetch');
          updateJSON({ consentId: "cns_987654321", format: "JSON" });
          await sendPacket('n-cons', 'n-fiu');
          await activateNode('n-fiu');
          await sendPacket('n-fiu', 'n-fip');
          await activateNode('n-fip');
          incApi();
          
          addLog('sys', 'Waiting for HDFC to pack statements...');
          await sleep(600);
          
          updateExpl('Data Decryption', 'The bank statement is heavily encrypted.', 'Setu decrypts it locally and parses it into JSON.');
          addTimeline('Data Decrypted');
          addLog('res', '200 OK - Data ready');
          updateJSON({ accounts: [{ balance: 145000, type: "SAVINGS" }] });
          document.getElementById('n-fip').classList.add('success');
          
          await sendPacket('n-fip', 'n-fiu', true);
          await sendPacket('n-fiu', 'n-gw', true);
          await sendPacket('n-gw', 'n-app', true);
          
          transitionScreen('aa-4');
        }
      }
    },
    payment: {
      nodes: [
        { id: 'n-app', icon: '📱', label: 'QuickPay' },
        { id: 'n-gw', icon: '⚡', label: 'Setu API' },
        { id: 'n-upi', icon: '🔄', label: 'UPI Switch' },
        { id: 'n-npci', icon: '🏦', label: 'NPCI Core' }
      ],
      screens: [
        {
          id: 'pay-1',
          html: \`
            <div class="v3-app-header">QuickPay</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px; text-align:center;">Send to Merchant</h4>
              <input type="text" class="v3-input" value="₹2,500" readonly style="font-size:1.5rem; text-align:center; font-weight:bold;" />
              <button class="v3-btn" onclick="simTrigger('payment', 1)">Pay Securely</button>
            </div>
          \`
        },
        {
          id: 'pay-2',
          html: \`
            <div class="v3-app-header">QuickPay</div>
            <div class="v3-app-card" style="text-align:center; padding: 32px 20px;">
               <div class="skeleton-line" style="width: 100%;"></div>
               <div class="skeleton-line" style="width: 60%;"></div>
               <p style="font-size:0.85rem; color:#718096; margin-top:24px;">Please authorize on your UPI app...</p>
            </div>
          \`
        },
        {
          id: 'pay-3',
          html: \`
            <div class="v3-app-header">QuickPay</div>
            <div class="v3-app-card" style="text-align:center;">
              <div style="font-size:3rem; color:#38a169; margin-bottom:16px;">✓</div>
              <h4 style="color:#38a169;">Payment Success</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">Transaction SETU12345 confirmed.</p>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('1.2s')">View Receipt</button>
            </div>
          \`
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('pay-2');
          updateExpl('UPI Collect', 'A payment request is triggered to the user\\'s VPA.', 'Setu handles the complex UPI spec via a simple REST API.');
          addTimeline('Collect Triggered');
          addLog('req', 'POST /payments/upi-collect');
          updateJSON({ amount: 250000, vpa: "user@okbank" });
          await activateNode('n-app');
          await sendPacket('n-app', 'n-gw');
          await activateNode('n-gw');
          incApi();
          
          updateExpl('NPCI Routing', 'The request travels to the central NPCI switch.', 'Setu translates the REST API call into ISO standard banking messages.');
          addLog('sys', 'Routing to NPCI Switch...');
          await sendPacket('n-gw', 'n-upi');
          await activateNode('n-upi');
          await sendPacket('n-upi', 'n-npci');
          await activateNode('n-npci');
          
          addTimeline('User Prompted');
          addLog('sys', 'Waiting for user to enter PIN...');
          await sleep(1000);
          
          updateExpl('Webhook Confirmation', 'The user paid on their UPI app.', 'Setu receives the async webhook and instantly notifies the merchant.');
          addTimeline('Webhook Received');
          addLog('res', 'WEBHOOK POST - PAID');
          updateJSON({ status: "SUCCESS", utr: "231456789012" });
          document.getElementById('n-npci').classList.add('success');
          
          await sendPacket('n-npci', 'n-upi', true);
          await sendPacket('n-upi', 'n-gw', true);
          await sendPacket('n-gw', 'n-app', true);
          
          transitionScreen('pay-3');
        }
      }
    }
  };
  
  // Core Functions
  window.simTrigger = async (scen, actionId) => {
    document.querySelectorAll('.v3-btn').forEach(b => b.disabled = true);
    await scenarios[scen].actions[actionId]();
    document.querySelectorAll('.v3-btn').forEach(b => b.disabled = false);
  };

  function transitionScreen(screenId) {
    const current = document.querySelector('.v3-screen.active');
    if (current) current.classList.replace('active', 'exit');
    
    const next = document.getElementById(screenId);
    if (next) {
      next.classList.remove('exit');
      next.classList.add('active');
    }
  }

  function updateExpl(what, why, role) {
    explWhat.innerText = what;
    explWhy.innerText = why;
    explRole.innerText = role;
  }

  function updateJSON(obj) {
    const str = JSON.stringify(obj, null, 2);
    // Syntax highlighting logic
    const highlighted = str
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="json-val-str">"$1"</span>')
      .replace(/: ([0-9]+)/g, ': <span class="json-val-num">$1</span>');
    jsonBody.innerHTML = highlighted;
  }

  function addLog(type, msg) {
    const d = new Date();
    const t = \`\${d.getHours()}:\${d.getMinutes()}:\${d.getSeconds()}\`;
    const div = document.createElement('div');
    div.className = \`log-line \${type}\`;
    div.innerText = \`[\${t}] \${msg}\`;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function addTimeline(msg) {
    const div = document.createElement('div');
    div.className = 'v3-tl-item visible';
    div.innerHTML = \`<i class="fas fa-check-circle"></i> \${msg}\`;
    tlList.appendChild(div);
    metLat.innerText = Math.floor(Math.random() * 50 + 20) + 'ms';
  }
  
  function incApi() {
    apiCount++;
    metApi.innerText = apiCount;
    metApi.classList.add('updated');
    setTimeout(() => metApi.classList.remove('updated'), 300);
  }

  async function activateNode(id) {
    const n = document.getElementById(id);
    if(n) {
      n.classList.add('active');
      srvCount++;
      metSrv.innerText = srvCount;
    }
    await sleep(200);
  }

  async function sendPacket(fromId, toId, rev = false) {
    // Generate a temporary packet element on the diagram track
    const track = document.getElementById('v3-diagram-track');
    const path = document.createElement('div');
    path.className = 'v3-path';
    track.insertBefore(path, document.getElementById(toId)); // Approximate placement for flex wrap
    
    const pkt = document.createElement('div');
    pkt.className = \`v3-packet \${rev ? 'rev' : 'fwd'}\`;
    path.appendChild(pkt);
    
    await sleep(600); // Packet travel time
    path.remove(); // Cleanup
  }

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  window.showCelebration = (time) => {
    celApis.innerText = apiCount;
    celTime.innerText = time;
    celNodes.innerText = srvCount;
    celOverlay.classList.add('active');
  };

  function loadScenario(scenKey) {
    if(currentScenario === scenKey) return;
    currentScenario = scenKey;
    
    // Reset state
    celOverlay.classList.remove('active');
    apiCount = 0; srvCount = 0;
    metApi.innerText = '0'; metSrv.innerText = '0'; metLat.innerText = '0ms';
    termBody.innerHTML = '<div class="log-line sys">System initialized. Awaiting user interaction...</div>';
    tlList.innerHTML = '';
    updateExpl('Interact with the phone to begin.', '-', '-');
    updateJSON({ status: "idle" });
    
    const sc = scenarios[scenKey];
    
    // Render Nodes
    diagramTrack.innerHTML = '';
    sc.nodes.forEach((n, i) => {
      const nd = document.createElement('div');
      nd.className = 'v3-node';
      nd.id = n.id;
      nd.innerHTML = \`<i>\${n.icon}</i><span>\${n.label}</span>\`;
      diagramTrack.appendChild(nd);
      // add static path line between nodes (flex will handle flow)
      if (i < sc.nodes.length - 1) {
        const line = document.createElement('div');
        line.className = 'v3-path';
        diagramTrack.appendChild(line);
      }
    });
    
    // Render Screens
    appScreen.innerHTML = '';
    sc.screens.forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'v3-screen ' + (i === 0 ? 'active' : 'exit');
      div.id = s.id;
      div.innerHTML = s.html;
      appScreen.appendChild(div);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadScenario(tab.getAttribute('data-scenario'));
    });
  });

  btnRestart.addEventListener('click', () => {
    currentScenario = null;
    const activeTab = document.querySelector('.v3-tab.active');
    loadScenario(activeTab.getAttribute('data-scenario'));
  });

  // Init
  loadScenario('kyc');
});
`;

fs.writeFileSync('main.js', newLogic);
