// Experience Setu Dual-Screen Simulation Logic (V4 - Interactive Step-by-Step)
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .stagger-item').forEach(el => {
    observer.observe(el);
  });

  const tabs = document.querySelectorAll('.v3-tab:not(.disabled)');
  const appScreen = document.getElementById('v3-app-screen');
  const diagramTrack = document.getElementById('v3-diagram-track');
  
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
  const btnNext = document.getElementById('btn-next-step');
  
  let currentScenario = null;
  let apiCount = 0;
  let startTime = 0;
  let srvCount = 0;
  let nextStepResolver = null;

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
          html: `
            <div class="v3-app-header">CryptoX</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px;">Identity Verification</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">We need to verify your PAN before you can trade.</p>
              <label style="font-size: 0.75rem; color: #4a5568; font-weight: bold; margin-bottom: 4px; display: block;">Permanent Account Number</label>
              <input type="text" class="v3-input" value="ABCDE1234F" readonly />
              <button class="v3-btn" onclick="simTrigger('kyc', 1)">Verify PAN securely</button>
            </div>
          `
        },
        {
          id: 'kyc-2',
          html: `
            <div class="v3-app-header">CryptoX</div>
            <div class="v3-app-card" style="padding: 32px 20px;">
              <div class="skeleton-line" style="width: 60%;"></div>
              <div class="skeleton-line" style="width: 100%;"></div>
              <div class="skeleton-line" style="width: 80%;"></div>
              <p style="font-size:0.85rem; color:#718096; margin-top:24px; text-align:center;">Verifying with NSDL...</p>
            </div>
          `
        },
        {
          id: 'kyc-3',
          html: `
            <div class="v3-app-header">CryptoX</div>
            <div class="v3-app-card" style="text-align:center; padding: 40px 20px;">
              <div style="font-size:3rem; color:#38a169; margin-bottom:16px;">✓</div>
              <h4>Identity Verified</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">Welcome to CryptoX! Your account is fully activated.</p>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('234ms')">Go to Portfolio</button>
            </div>
          `
        }
      ],
      actions: {
        1: async () => {
          startTime = Date.now();
          transitionScreen('kyc-2');
          
          updateExpl('App validates input', 'Basic frontend sanity check before calling servers.', '-');
          await activateNode('n-app');
          await waitNext();
          
          updateExpl('App calls backend', 'Secure server-to-server communication ensures secrets aren\'t exposed.', 'Setu expects traffic only from verified backend servers.');
          await sendPacket('n-app', 'n-srv');
          await activateNode('n-srv');
          await waitNext();
          
          updateExpl('Routing to Setu', 'The app uses Setu SDK to trigger KYC verify.', 'Setu Gateway ingests the request via a simple REST API.');
          await sendPacket('n-srv', 'n-gw');
          await activateNode('n-gw');
          incApi();
          await waitNext();
          
          updateExpl('Authentication Layer', 'Ensuring the app is an authorized Setu partner before touching sensitive data.', 'Setu Auth verifies JWT tokens and rate limits the request.');
          await sendPacket('n-gw', 'n-auth');
          await activateNode('n-auth');
          await waitNext();
          
          updateExpl('Protocol Translation', 'Setu maps the simple JSON request to NSDL\'s complex XML format.', 'API Router formats the request and securely transmits it to the government.');
          await sendPacket('n-auth', 'n-rout');
          await activateNode('n-rout');
          await waitNext();
          
          updateExpl('NSDL Verification', 'The official government database checks if the PAN is valid and active.', 'Setu orchestrates the connection and waits for the upstream response.');
          await sendPacket('n-rout', 'n-nsdl');
          await activateNode('n-nsdl');
          await waitNext();
          
          updateExpl('Response Normalization', 'NSDL returns raw XML which is hard to parse.', 'Setu standardizes the XML back into a clean, predictable JSON response.');
          document.getElementById('n-nsdl').classList.add('success');
          await sendPacket('n-nsdl', 'n-rout', true);
          await sendPacket('n-rout', 'n-auth', true);
          await sendPacket('n-auth', 'n-gw', true);
          await waitNext();
          
          updateExpl('Success', 'The app receives the clear boolean result and updates the UI instantly.', 'End of Setu orchestration for this request.');
          await sendPacket('n-gw', 'n-srv', true);
          await sendPacket('n-srv', 'n-app', true);
          
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
          html: `
            <div class="v3-app-header">LendSmart</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px;">Loan Eligibility</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">We need 6 months of bank statements to assess your loan.</p>
              <button class="v3-btn" onclick="simTrigger('aa', 1)">Link Bank Account</button>
            </div>
          `
        },
        {
          id: 'aa-2',
          html: `
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
          `
        },
        {
          id: 'aa-3',
          html: `
            <div class="v3-app-header">LendSmart</div>
            <div class="v3-app-card" style="padding: 32px 20px;">
               <div class="skeleton-line" style="width: 100%;"></div>
               <div class="skeleton-line" style="width: 80%;"></div>
               <p style="font-size:0.85rem; color:#718096; margin-top:24px; text-align:center;">Decrypting Bank Data...</p>
            </div>
          `
        },
        {
          id: 'aa-4',
          html: `
            <div class="v3-app-header">LendSmart</div>
            <div class="v3-app-card" style="text-align:center;">
              <h4 style="color:#38a169;">Approved: ₹5,00,000</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">Based on your healthy cash flows, you are pre-approved!</p>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('412ms')">Accept Loan</button>
            </div>
          `
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('aa-2');
          updateExpl('Request Consent', 'App requests the Account Aggregator interface.', 'Setu generates a secure RBI-compliant webview (visible on the phone).');
          await activateNode('n-app');
          await sendPacket('n-app', 'n-gw');
          await activateNode('n-gw');
          await sendPacket('n-gw', 'n-cons');
          await activateNode('n-cons');
          incApi();
        },
        2: async () => {
          transitionScreen('aa-3');
          updateExpl('Data Fetch Triggered', 'User approved the consent. We must now retrieve the actual bank data.', 'Setu acts as the Financial Information User (FIU) on behalf of LendSmart.');
          await waitNext();
          
          await sendPacket('n-cons', 'n-fiu');
          await activateNode('n-fiu');
          await sendPacket('n-fiu', 'n-fip');
          await activateNode('n-fip');
          incApi();
          
          updateExpl('Bank Packing Data', 'The user\'s bank (FIP) queries its core banking system for 6 months of statements.', 'Setu securely polls or waits for a webhook from the bank.');
          await waitNext();
          
          updateExpl('Data Decryption', 'The bank statement is returned heavily encrypted to prevent tampering.', 'Setu decrypts it locally and parses the raw ISO formats into clean JSON.');
          document.getElementById('n-fip').classList.add('success');
          await sendPacket('n-fip', 'n-fiu', true);
          await sendPacket('n-fiu', 'n-gw', true);
          await sendPacket('n-gw', 'n-app', true);
          await waitNext();
          
          updateExpl('Underwriting Complete', 'LendSmart runs its underwriting rules on the decrypted JSON.', '-');
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
          html: `
            <div class="v3-app-header">QuickPay</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px; text-align:center;">Send to Merchant</h4>
              <input type="text" class="v3-input" value="₹2,500" readonly style="font-size:1.5rem; text-align:center; font-weight:bold;" />
              <button class="v3-btn" onclick="simTrigger('payment', 1)">Pay Securely</button>
            </div>
          `
        },
        {
          id: 'pay-2',
          html: `
            <div class="v3-app-header">QuickPay</div>
            <div class="v3-app-card" style="text-align:center; padding: 32px 20px;">
               <div class="skeleton-line" style="width: 100%;"></div>
               <div class="skeleton-line" style="width: 60%;"></div>
               <p style="font-size:0.85rem; color:#718096; margin-top:24px;">Please authorize on your UPI app...</p>
            </div>
          `
        },
        {
          id: 'pay-3',
          html: `
            <div class="v3-app-header">QuickPay</div>
            <div class="v3-app-card" style="text-align:center;">
              <div style="font-size:3rem; color:#38a169; margin-bottom:16px;">✓</div>
              <h4 style="color:#38a169;">Payment Success</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">Transaction SETU12345 confirmed.</p>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('1.2s')">View Receipt</button>
            </div>
          `
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('pay-2');
          updateExpl('UPI Collect Initiated', 'A payment request is triggered to the user\'s VPA (UPI ID).', 'Setu abstracts away the complex UPI spec via a single REST API call.');
          await activateNode('n-app');
          await sendPacket('n-app', 'n-gw');
          await activateNode('n-gw');
          incApi();
          await waitNext();
          
          updateExpl('NPCI Routing', 'The request travels to the central NPCI switch.', 'Setu translates the REST API call into ISO standard banking messages that NPCI requires.');
          await sendPacket('n-gw', 'n-upi');
          await activateNode('n-upi');
          await sendPacket('n-upi', 'n-npci');
          await activateNode('n-npci');
          await waitNext();
          
          updateExpl('Webhook Confirmation', 'The user opened their GPay/PhonePe and entered their PIN.', 'Setu receives the async webhook from NPCI and instantly notifies the merchant.');
          document.getElementById('n-npci').classList.add('success');
          await sendPacket('n-npci', 'n-upi', true);
          await sendPacket('n-upi', 'n-gw', true);
          await sendPacket('n-gw', 'n-app', true);
          
          transitionScreen('pay-3');
        }
      }
    },
    statement: {
      nodes: [
        { id: 'n-app', icon: '📱', label: 'MoneyView' },
        { id: 'n-gw', icon: '⚡', label: 'Setu API' },
        { id: 'n-parser', icon: '📄', label: 'Statement Parser' },
        { id: 'n-engine', icon: '⚙️', label: 'Categorization' }
      ],
      screens: [
        {
          id: 'stat-1',
          html: `
            <div class="v3-app-header">MoneyView</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px;">Upload Statement</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">Upload your PDF e-statement to analyze your spending.</p>
              <button class="v3-btn" onclick="simTrigger('statement', 1)">Upload statement.pdf</button>
            </div>
          `
        },
        {
          id: 'stat-2',
          html: `
            <div class="v3-app-header">MoneyView</div>
            <div class="v3-app-card" style="padding: 32px 20px;">
               <div class="skeleton-line" style="width: 100%;"></div>
               <div class="skeleton-line" style="width: 80%;"></div>
               <p style="font-size:0.85rem; color:#718096; margin-top:24px; text-align:center;">Extracting transactions...</p>
            </div>
          `
        },
        {
          id: 'stat-3',
          html: `
            <div class="v3-app-header">MoneyView</div>
            <div class="v3-app-card">
              <h4 style="color:#38a169;">Insights Ready</h4>
              <div style="display:flex; justify-content:space-between; margin-top:16px; padding-bottom:8px; border-bottom:1px solid #e2e8f0;">
                <span style="font-size:0.8rem; font-weight:600;">Food & Dining</span>
                <span style="font-size:0.8rem; color:#e53e3e;">-₹12,400</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-top:8px; padding-bottom:8px; border-bottom:1px solid #e2e8f0;">
                <span style="font-size:0.8rem; font-weight:600;">Salary</span>
                <span style="font-size:0.8rem; color:#38a169;">+₹85,000</span>
              </div>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('1.5s')">View Full Report</button>
            </div>
          `
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('stat-2');
          updateExpl('File Upload', 'The user uploads a password-protected PDF bank statement.', 'Setu securely ingests the file via API.');
          await activateNode('n-app');
          await sendPacket('n-app', 'n-gw');
          await activateNode('n-gw');
          incApi();
          await waitNext();
          
          updateExpl('PDF Parsing', 'The PDF is a visual document, not structured data.', 'Setu\'s proprietary parser reads the document structure, applies the password, and extracts raw transaction strings.');
          await sendPacket('n-gw', 'n-parser');
          await activateNode('n-parser');
          await waitNext();
          
          updateExpl('ML Categorization', 'Raw strings like "UPI-SWIGGY-1234" need context.', 'Setu\'s AI engine categorizes it as "Food & Dining" and detects if it\'s a credit or debit.');
          await sendPacket('n-parser', 'n-engine');
          await activateNode('n-engine');
          await waitNext();
          
          updateExpl('Insights Delivery', 'The app receives perfectly structured JSON data.', 'Setu formats the machine learning output into clean, ready-to-use JSON.');
          document.getElementById('n-engine').classList.add('success');
          await sendPacket('n-engine', 'n-parser', true);
          await sendPacket('n-parser', 'n-gw', true);
          await sendPacket('n-gw', 'n-app', true);
          
          transitionScreen('stat-3');
        }
      }
    },
    loan: {
      nodes: [
        { id: 'n-app', icon: '📱', label: 'CreditApp' },
        { id: 'n-gw', icon: '⚡', label: 'Setu Bureau' },
        { id: 'n-cibil', icon: '📊', label: 'CIBIL / Experian' }
      ],
      screens: [
        {
          id: 'loan-1',
          html: `
            <div class="v3-app-header">CreditApp</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px;">Check Score</h4>
              <p style="font-size:0.85rem; color:#718096; margin-bottom:16px;">We need your consent to fetch your credit report.</p>
              <button class="v3-btn" onclick="simTrigger('loan', 1)">Fetch Credit Score</button>
            </div>
          `
        },
        {
          id: 'loan-2',
          html: `
            <div class="v3-app-header">CreditApp</div>
            <div class="v3-app-card" style="padding: 32px 20px;">
               <div class="skeleton-line" style="width: 100%;"></div>
               <p style="font-size:0.85rem; color:#718096; margin-top:24px; text-align:center;">Querying Bureaus...</p>
            </div>
          `
        },
        {
          id: 'loan-3',
          html: `
            <div class="v3-app-header">CreditApp</div>
            <div class="v3-app-card" style="text-align:center;">
              <div style="font-size:3rem; color:#38a169; margin-bottom:8px;">785</div>
              <h4 style="color:#1a202c;">Excellent Score</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">You have no defaults in the last 3 years.</p>
              <button class="v3-btn" style="margin-top:24px;" onclick="showCelebration('290ms')">Apply for Card</button>
            </div>
          `
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('loan-2');
          updateExpl('Bureau Query', 'The app requests a credit pull.', 'Setu routes the request to the appropriate credit bureau (CIBIL, Experian, Equifax).');
          await activateNode('n-app');
          await sendPacket('n-app', 'n-gw');
          await activateNode('n-gw');
          incApi();
          await waitNext();
          
          updateExpl('Data Retrieval', 'The credit bureau searches its database.', 'Setu handles the legacy XML/SOAP protocols used by the bureaus securely.');
          await sendPacket('n-gw', 'n-cibil');
          await activateNode('n-cibil');
          await waitNext();
          
          updateExpl('Scoring', 'Bureau returns the report.', 'Setu parses the massive legacy file into a simple, developer-friendly JSON object containing the score.');
          document.getElementById('n-cibil').classList.add('success');
          await sendPacket('n-cibil', 'n-gw', true);
          await sendPacket('n-gw', 'n-app', true);
          
          transitionScreen('loan-3');
        }
      }
    },
    identity: {
      nodes: [
        { id: 'n-app', icon: '📱', label: 'Onboarder' },
        { id: 'n-gw', icon: '⚡', label: 'Setu API' },
        { id: 'n-uidai', icon: '👁️', label: 'UIDAI / Aadhaar' }
      ],
      screens: [
        {
          id: 'id-1',
          html: `
            <div class="v3-app-header">Onboarder</div>
            <div class="v3-app-card">
              <h4 style="margin-bottom:8px;">Aadhaar OKYC</h4>
              <input type="text" class="v3-input" value="1234 5678 9012" readonly />
              <button class="v3-btn" onclick="simTrigger('identity', 1)">Send OTP</button>
            </div>
          `
        },
        {
          id: 'id-2',
          html: `
            <div class="v3-app-header">Onboarder</div>
            <div class="v3-app-card" style="padding: 32px 20px;">
               <div class="skeleton-line" style="width: 100%;"></div>
               <p style="font-size:0.85rem; color:#718096; margin-top:24px; text-align:center;">Contacting UIDAI...</p>
            </div>
          `
        },
        {
          id: 'id-3',
          html: `
            <div class="v3-app-header">Onboarder</div>
            <div class="v3-app-card" style="text-align:center;">
              <h4 style="color:#38a169;">OTP Sent</h4>
              <p style="font-size:0.85rem; color:#718096; margin-top:8px;">Enter the 6-digit OTP sent to your linked mobile.</p>
              <input type="text" class="v3-input" placeholder="------" style="text-align:center; letter-spacing:4px; font-weight:bold;" />
              <button class="v3-btn" onclick="showCelebration('340ms')">Verify</button>
            </div>
          `
        }
      ],
      actions: {
        1: async () => {
          transitionScreen('id-2');
          updateExpl('OTP Request', 'The app requests an Aadhaar OTP generation.', 'Setu securely routes the Aadhaar number to the UIDAI infrastructure.');
          await activateNode('n-app');
          await sendPacket('n-app', 'n-gw');
          await activateNode('n-gw');
          incApi();
          await waitNext();
          
          updateExpl('UIDAI Dispatch', 'UIDAI validates the Aadhaar number and dispatches an SMS.', 'Setu waits for the UIDAI confirmation of SMS dispatch.');
          await sendPacket('n-gw', 'n-uidai');
          await activateNode('n-uidai');
          await waitNext();
          
          updateExpl('Success', 'The user receives the OTP.', 'Setu forwards the success state to the app to show the OTP input screen.');
          document.getElementById('n-uidai').classList.add('success');
          await sendPacket('n-uidai', 'n-gw', true);
          await sendPacket('n-gw', 'n-app', true);
          
          transitionScreen('id-3');
        }
      }
    }
  };
  
  // Core Functions
  window.simTrigger = async (scen, actionId) => {
    document.querySelectorAll('.v3-btn').forEach(b => b.disabled = true);
    
    // Enable the "Next Step" button for manual advancing
    btnNext.style.display = 'block';
    btnNext.disabled = false;
    
    await scenarios[scen].actions[actionId]();
    
    // Disable Next after flow finishes
    btnNext.style.display = 'none';
    document.querySelectorAll('.v3-btn').forEach(b => b.disabled = false);
  };

  // The step-by-step halting mechanism
  function waitNext() {
    return new Promise(resolve => {
      nextStepResolver = resolve;
    });
  }
  
  btnNext.addEventListener('click', () => {
    if (nextStepResolver) {
      let r = nextStepResolver;
      nextStepResolver = null; // Consume
      r();
    }
  });

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
    
    // Flash effect to draw attention
    explWhat.parentElement.style.animation = 'none';
    explWhat.parentElement.offsetHeight; /* trigger reflow */
    explWhat.parentElement.style.animation = 'pulse 0.5s ease';
  }

  function incApi() {
    apiCount++;
    metApi.innerText = apiCount;
    metApi.classList.add('updated');
    setTimeout(() => metApi.classList.remove('updated'), 300);
    metLat.innerText = Math.floor(Math.random() * 50 + 20) + 'ms';
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
    const track = document.getElementById('v3-diagram-track');
    const path = document.createElement('div');
    path.className = 'v3-path';
    track.insertBefore(path, document.getElementById(toId)); 
    
    const pkt = document.createElement('div');
    pkt.className = `v3-packet ${rev ? 'rev' : 'fwd'}`;
    path.appendChild(pkt);
    
    await sleep(600);
    path.remove();
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
    btnNext.style.display = 'none';
    if(nextStepResolver) { nextStepResolver(); nextStepResolver = null; }
    
    apiCount = 0; srvCount = 0;
    metApi.innerText = '0'; metSrv.innerText = '0'; metLat.innerText = '0ms';
    updateExpl('Interact with the phone to begin.', '-', '-');
    
    const sc = scenarios[scenKey];
    
    // Render Nodes
    diagramTrack.innerHTML = '';
    sc.nodes.forEach((n, i) => {
      const nd = document.createElement('div');
      nd.className = 'v3-node';
      nd.id = n.id;
      nd.innerHTML = `<i>${n.icon}</i><span>${n.label}</span>`;
      diagramTrack.appendChild(nd);
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

// Geography & Scale Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
  const geoSlider = document.getElementById('geo-year-slider');
  const hubs = document.querySelectorAll('.geo-hub');
  const chips = document.querySelectorAll('.geo-chip');
  
  const infoTitle = document.getElementById('geo-info-title');
  const infoYear = document.getElementById('geo-info-year');
  const infoDesc = document.getElementById('geo-info-desc');
  const networkLayer = document.querySelector('.layer-network');
  
  const ecoNodes = document.querySelectorAll('.geo-eco-node');
  const ecoExpl = document.getElementById('eco-expl');
  
  const hubData = {
    blr: {
      title: "Bengaluru",
      badge: "Headquarters (2018)",
      desc: "Setu's birthplace and core engineering hub. Our platform operations, product development, and primary API routing infrastructure reside here."
    },
    bom: {
      title: "Mumbai",
      badge: "Financial Hub (2019)",
      desc: "Direct connections to India's major partner banks, NBFCs, and financial institutions ensuring sub-100ms latency for critical transactions."
    },
    del: {
      title: "Delhi",
      badge: "Govt Stack (2020)",
      desc: "Crucial routing node for India Stack integrations including UIDAI (Aadhaar OKYC), NSDL (PAN Verification), and DigiLocker."
    },
    hyd: {
      title: "Hyderabad",
      badge: "Fintech Hub (2021)",
      desc: "Supporting the massive influx of fintech partners, lending startups, and wealth-tech apps utilizing Setu's APIs."
    },
    maa: {
      title: "Chennai",
      badge: "AA Hub (2022)",
      desc: "Primary node handling the massive data loads for Account Aggregator decryption, machine learning categorization, and insights."
    }
  };
  
  const ecoData = {
    citizen: "The end consumer requesting a financial service (e.g., applying for a loan, making a payment).",
    fintech: "The consumer-facing application (e.g., Groww, CRED) that integrates Setu's APIs to offer the service.",
    setu: "The orchestration engine. Setu translates the app's request, handles security/routing, and standardizes responses.",
    stack: "India's digital public infrastructure (Aadhaar, UPI, Account Aggregator) securely providing identity and data.",
    bank: "The regulated financial institution providing the underlying capital, account, or credit."
  };

  // 1. Timeline Logic
  if(geoSlider) {
    geoSlider.addEventListener('input', (e) => {
      const year = parseInt(e.target.value);
      
      hubs.forEach(hub => {
        const hubYear = parseInt(hub.getAttribute('data-year'));
        if(year >= hubYear) {
          hub.classList.remove('hidden-by-year');
        } else {
          hub.classList.add('hidden-by-year');
        }
      });
      
      // If network layer is enabled via chips, hide it before 2019
      if(networkLayer && !networkLayer.classList.contains('hidden-by-layer')) {
        networkLayer.style.opacity = year >= 2019 ? '1' : '0';
      }
      
      infoTitle.innerText = "Ecosystem Growth";
      infoYear.innerText = "Year " + year;
      
      if(year === 2018) infoDesc.innerText = "Setu founded in Bengaluru. Initial infrastructure laid down.";
      if(year === 2019) infoDesc.innerText = "Expansion into Mumbai to connect with partner banks and NBFCs.";
      if(year === 2020) infoDesc.innerText = "Integration with Delhi's UIDAI and NSDL government stacks.";
      if(year === 2021) infoDesc.innerText = "Hyderabad node opens to support massive fintech startup volume.";
      if(year >= 2022) infoDesc.innerText = "Chennai node handles the Account Aggregator revolution. Full India routing active.";
    });
  }
  
  // 2. Map Hub Hover/Click
  hubs.forEach(hub => {
    hub.addEventListener('mouseenter', () => {
      const id = hub.getAttribute('data-hub');
      const data = hubData[id];
      if(data) {
        infoTitle.innerText = data.title;
        infoYear.innerText = data.badge;
        infoDesc.innerText = data.desc;
        infoTitle.style.animation = 'none';
        infoTitle.offsetHeight; 
        infoTitle.style.animation = 'pulse 0.5s ease';
      }
    });
  });
  
  // 3. Layer Toggles
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const layer = chip.getAttribute('data-layer');
      const isActive = chip.classList.contains('active');
      
      if(layer === 'network' && networkLayer) {
        if(isActive && parseInt(geoSlider.value) >= 2019) {
          networkLayer.style.opacity = '1';
          networkLayer.classList.remove('hidden-by-layer');
        } else {
          networkLayer.style.opacity = '0';
          networkLayer.classList.add('hidden-by-layer');
        }
      } else {
        document.querySelectorAll('.layer-' + layer).forEach(el => {
          if(isActive) el.classList.remove('hidden-by-layer');
          else el.classList.add('hidden-by-layer');
        });
      }
    });
  });
  
  // 4. Ecosystem Diagram Hover
  ecoNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const id = node.getAttribute('data-eco');
      ecoExpl.innerText = ecoData[id] || "Hover over any node above to understand its responsibility in the value chain.";
    });
    node.addEventListener('mouseleave', () => {
      ecoExpl.innerText = "Hover over any node above to understand its responsibility in the value chain.";
    });
  });

});
