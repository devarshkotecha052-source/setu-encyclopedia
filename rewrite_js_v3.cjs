const fs = require('fs');

let js = fs.readFileSync('main.js', 'utf8');
const oldLogic = js.substring(js.indexOf('// Experience Setu Dual-Screen Simulation Logic'));

const newLogic = `
// Experience Setu Dual-Screen Simulation Logic
document.addEventListener('DOMContentLoaded', () => {
  const scenTabs = document.querySelectorAll('.scen-tab');
  const screenContainer = document.getElementById('app-screen-container');
  const path1 = document.getElementById('packet-1');
  const path2 = document.getElementById('packet-2');
  const nCustomer = document.getElementById('node-customer');
  const nSetu = document.getElementById('node-setu');
  const nBank = document.getElementById('node-bank');
  const bTitle = document.getElementById('step-title');
  const bWhat = document.getElementById('desc-what');
  const bWhy = document.getElementById('desc-why');
  const bRole = document.getElementById('desc-role');
  const bTech = document.getElementById('desc-tech');
  const dStatus = document.getElementById('dash-status');
  const dApis = document.getElementById('dash-apis');
  const dLat = document.getElementById('dash-latency');
  const liveChart = document.querySelector('.live-chart');
  
  const toast = document.getElementById('edu-toast');
  const toastMsg = document.getElementById('toast-msg');
  const gami = document.getElementById('sim-gamification');
  
  let currentScenario = 'kyc';
  let apiCount = 0;

  const scenarios = {
    kyc: {
      screens: [
        {
          id: 'kyc-1',
          html: \`
            <div class="app-header">CryptoX App</div>
            <div class="app-card">
              <h4 style="margin-bottom:8px;">Identity Verification</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">We need to verify your PAN before you can trade.</p>
              <input type="text" class="app-input" value="ABCDE1234F" readonly />
              <button class="app-btn" onclick="simTrigger('kyc', 1)">Verify PAN</button>
            </div>
          \`
        },
        {
          id: 'kyc-2',
          html: \`
            <div class="app-header">CryptoX App</div>
            <div class="app-card" style="text-align:center; padding: 48px 16px;">
              <div style="margin-bottom:16px; font-size:2rem;">⏳</div>
              <h4>Checking NSDL...</h4>
              <p style="font-size:0.85rem; color:#718096;">Please do not close this app.</p>
            </div>
          \`
        },
        {
          id: 'kyc-3',
          html: \`
            <div class="app-header">CryptoX App</div>
            <div class="app-card" style="text-align:center; padding: 48px 16px;">
              <div style="margin-bottom:16px; font-size:2rem; color:#38a169;">✓</div>
              <h4>KYC Verified</h4>
              <p style="font-size:0.85rem; color:#718096;">Welcome to CryptoX!</p>
              <button class="app-btn" style="margin-top:24px;" onclick="showSummary(2, '1.4s')">Start Trading</button>
            </div>
          \`
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('kyc-2');
          updateBackend('Authenticating...', 'The app sends the PAN to Setu.', 'Legally required for financial accounts.', 'Setu receives the request via SDK.', 'POST /kyc { pan: "ABCDE1234F" }');
          await runPacketSequence();
          transitionScreen('kyc-3');
          updateBackend('Success', 'The verified identity is displayed.', 'The customer can now trade.', 'Setu parsed the XML bank response into clean JSON.', '200 OK { valid: true }');
        }
      }
    },
    aa: {
      screens: [
        {
          id: 'aa-1',
          html: \`
            <div class="app-header">LendSmart</div>
            <div class="app-card">
              <h4 style="margin-bottom:8px;">Check Loan Eligibility</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">Securely connect your bank to fetch 6 months of statements.</p>
              <button class="app-btn" onclick="simTrigger('aa', 1)">Connect Bank via AA</button>
            </div>
          \`
        },
        {
          id: 'aa-2',
          html: \`
            <div class="app-header" style="font-size:1rem; color:#42cacd;">Setu AA Gateway</div>
            <div class="app-card">
              <h4 style="margin-bottom:8px;">Grant Consent</h4>
              <p style="font-size:0.8rem; margin-bottom:8px;"><strong>Data:</strong> 6 Months Bank Statement</p>
              <p style="font-size:0.8rem; margin-bottom:16px;"><strong>Purpose:</strong> Loan Underwriting</p>
              <button class="app-btn" style="background:#091016;" onclick="simTrigger('aa', 2)">Approve & Fetch Data</button>
            </div>
          \`
        },
        {
          id: 'aa-3',
          html: \`
            <div class="app-header">LendSmart</div>
            <div class="app-card" style="text-align:center;">
              <h4 style="color:#38a169;">Loan Approved!</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">Based on your HDFC statements, you are eligible for ₹5,00,000.</p>
              <button class="app-btn" onclick="showSummary(4, '3.2s')">Accept Offer</button>
            </div>
          \`
        }
      ],
      actions: {
        1: async () => {
          updateBackend('Requesting Consent Screen', 'App requests the Account Aggregator interface.', 'Required by RBI to access data.', 'Setu generates a secure, compliant webview.', 'GET /aa/consent-screen');
          await singlePacketToSetu();
          transitionScreen('aa-2');
          showToast('Consent ensures the customer remains in control of their financial data.');
        },
        2: async () => {
          updateBackend('Fetching Bank Data', 'User approved. Data is being pulled from HDFC.', 'Financial data is heavily encrypted.', 'Setu decrypts and standardizes the bank statement.', 'POST /aa/fetch');
          await runPacketSequence();
          transitionScreen('aa-3');
          showToast('Setu standardizes responses from different banks into a consistent JSON format.');
        }
      }
    },
    payment: {
      screens: [
        {
          id: 'pay-1',
          html: \`
            <div class="app-header">QuickPay</div>
            <div class="app-card">
              <h4 style="margin-bottom:8px;">Send Money</h4>
              <input type="text" class="app-input" value="₹5,000" readonly style="font-size: 1.5rem; font-weight: bold; text-align: center;" />
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px; text-align:center;">To: Merchant Store</p>
              <button class="app-btn" onclick="simTrigger('payment', 1)">Pay with UPI</button>
            </div>
          \`
        },
        {
          id: 'pay-2',
          html: \`
            <div class="app-header" style="font-size:1rem; color:#42cacd;">Setu Payment Gateway</div>
            <div class="app-card" style="text-align:center; padding: 48px 16px;">
              <div style="margin-bottom:16px; font-size:2rem;">⏳</div>
              <h4>Awaiting NPCI Auth...</h4>
              <p style="font-size:0.85rem; color:#718096;">Check your UPI App</p>
            </div>
          \`
        },
        {
          id: 'pay-3',
          html: \`
            <div class="app-header">QuickPay</div>
            <div class="app-card" style="text-align:center;">
              <div style="margin-bottom:16px; font-size:2rem; color:#38a169;">✓</div>
              <h4 style="color:#38a169;">Payment Successful</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">Txn ID: SETU987654321</p>
              <button class="app-btn" onclick="showSummary(3, '2.1s')">View Receipt</button>
            </div>
          \`
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('pay-2');
          updateBackend('Initiating UPI Collect', 'A UPI payment request is generated.', 'Required for real-time bank transfers.', 'Setu routes the transaction to NPCI.', 'POST /payments/upi-collect');
          showToast('Setu handles the complex UPI specifications so developers can just use a simple POST request.');
          await runPacketSequence();
          transitionScreen('pay-3');
          updateBackend('Payment Confirmed', 'The merchant app is notified of the success.', 'To finalize the checkout flow.', 'Setu receives the webhook and alerts the app.', 'WEBHOOK: { status: "PAID" }');
        }
      }
    }
  };
  
  // Expose to window for inline onclicks
  window.simTrigger = async (scen, actionId) => {
    document.querySelectorAll('.app-btn').forEach(b => b.classList.add('loading'));
    apiCount++;
    dApis.innerText = apiCount;
    dStatus.innerText = 'Processing';
    dStatus.style.color = '#d69e2e';
    liveChart.classList.add('active');
    
    await scenarios[scen].actions[actionId]();
    
    dStatus.innerText = 'Idle';
    dStatus.style.color = '#091016';
    liveChart.classList.remove('active');
  };

  window.showSummary = (apis, time) => {
    document.getElementById('sum-steps').innerText = apiCount;
    document.getElementById('sum-apis').innerText = apis;
    document.getElementById('sum-time').innerText = time;
    gami.classList.add('visible');
  };

  function transitionScreen(screenId) {
    const current = document.querySelector('.app-view.active');
    if (current) current.classList.replace('active', 'exit');
    
    const next = document.getElementById(screenId);
    if (next) {
      next.classList.remove('exit');
      next.classList.add('active');
    }
  }

  function updateBackend(title, what, why, role, tech) {
    bTitle.innerText = title;
    bWhat.innerText = what;
    bWhy.innerText = why;
    bRole.innerText = role;
    bTech.innerText = tech;
    dLat.innerText = Math.floor(Math.random() * 80 + 20) + 'ms';
  }

  function showToast(msg) {
    toastMsg.innerText = msg;
    toast.classList.add('visible');
    setTimeout(() => { toast.classList.remove('visible'); }, 4000);
  }

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function singlePacketToSetu() {
    nCustomer.classList.add('active');
    path1.className = 'packet-sim animate-forward';
    await sleep(1000);
    nSetu.classList.add('active');
    path1.className = 'packet-sim';
    await sleep(400);
    path1.className = 'packet-sim animate-backward';
    await sleep(1000);
    nCustomer.classList.remove('active');
    nSetu.classList.remove('active');
    path1.className = 'packet-sim';
  }

  async function runPacketSequence() {
    nCustomer.classList.add('active');
    path1.className = 'packet-sim animate-forward';
    await sleep(1000);
    
    nCustomer.classList.remove('active');
    nSetu.classList.add('active');
    path1.className = 'packet-sim';
    path2.className = 'packet-sim animate-forward';
    await sleep(1000);
    
    nSetu.classList.remove('active');
    nBank.classList.add('active');
    path2.className = 'packet-sim';
    await sleep(800); // Bank processing
    
    path2.className = 'packet-sim animate-backward';
    await sleep(1000);
    
    nBank.classList.remove('active');
    nSetu.classList.add('active');
    path2.className = 'packet-sim';
    path1.className = 'packet-sim animate-backward';
    await sleep(1000);
    
    nSetu.classList.remove('active');
    nCustomer.classList.add('active');
    path1.className = 'packet-sim';
    await sleep(500);
    nCustomer.classList.remove('active');
  }

  function loadScenario(scenKey) {
    gami.classList.remove('visible');
    apiCount = 0;
    dApis.innerText = '0';
    updateBackend('Waiting for interaction...', 'Use the smartphone on the left to begin.', '-', '-', '-');
    
    screenContainer.innerHTML = '';
    scenarios[scenKey].screens.forEach((sc, i) => {
      const div = document.createElement('div');
      div.className = 'app-view ' + (i === 0 ? 'active' : 'exit');
      div.id = sc.id;
      div.innerHTML = sc.html;
      screenContainer.appendChild(div);
    });
  }

  scenTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scenTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-scenario');
      if(scenarios[key]) loadScenario(key);
    });
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    const activeTab = document.querySelector('.scen-tab.active');
    loadScenario(activeTab.getAttribute('data-scenario'));
  });

  // Init
  loadScenario('kyc');
});
`;

fs.writeFileSync('main.js', js.replace(oldLogic, newLogic));
