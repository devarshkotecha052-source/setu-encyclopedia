import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // 2. Intersection Observer (Fade, Stagger, Counters)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('counter')) {
          animateCounter(entry.target);
          entry.target.classList.remove('counter');
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up, .stagger-item, .counter').forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isFloat = !Number.isInteger(target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        el.innerText = isFloat ? current.toFixed(1) : Math.ceil(current).toLocaleString();
        requestAnimationFrame(update);
      } else {
        el.innerText = (isFloat ? target.toFixed(1) : target.toLocaleString()) + (el.getAttribute('data-suffix') || '');
      }
    };
    update();
  }

  // 3. API Mock Console
  const runApiBtn = document.getElementById('run-api-btn');
  const apiResponse = document.getElementById('api-response');
  if (runApiBtn && apiResponse) {
    runApiBtn.addEventListener('click', () => {
      apiResponse.innerHTML = '<span style="color:#718096">Connecting to Setu API...</span>';
      setTimeout(() => {
        apiResponse.innerHTML = `{
  <span style="color:#42cacd">"status"</span>: <span style="color:#38a169">"success"</span>,
  <span style="color:#42cacd">"data"</span>: {
    <span style="color:#42cacd">"kyc_verified"</span>: <span style="color:#e53e3e">true</span>,
    <span style="color:#42cacd">"customer_id"</span>: <span style="color:#38a169">"SETU-88X9A"</span>,
    <span style="color:#42cacd">"latency_ms"</span>: <span style="color:#e53e3e">42</span>
  }
}`;
      }, 800);
    });
  }

  // 4. Before/After Slider (Friction)
  const slider = document.getElementById('friction-slider');
  const sliderImage = document.querySelector('.slider-after');
  if (slider && sliderImage) {
    slider.addEventListener('input', (e) => {
      sliderImage.style.clipPath = `polygon(0 0, ${e.target.value}% 0, ${e.target.value}% 100%, 0 100%)`;
    });
  }

  // 5. Founders Tabs
  const fTabs = document.querySelectorAll('.f-tab');
  const fBios = document.querySelectorAll('.f-bio');
  fTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      fTabs.forEach(t => t.classList.remove('active'));
      fBios.forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('bio-' + tab.getAttribute('data-target')).classList.add('active');
    });
  });

  // 6. Map Timeline Slider
  const mapSlider = document.getElementById('map-slider');
  const mapYear = document.getElementById('map-year');
  const mapPins = document.querySelectorAll('.map-pin');
  if (mapSlider && mapYear) {
    mapSlider.addEventListener('input', (e) => {
      const year = e.target.value;
      mapYear.innerText = year;
      mapPins.forEach(pin => {
        if (parseInt(pin.getAttribute('data-year')) <= year) {
          pin.style.opacity = '1';
          pin.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
          pin.style.opacity = '0';
          pin.style.transform = 'translate(-50%, -50%) scale(0.5)';
        }
      });
    });
  }

  // 7. Mouse Parallax (Hero)
  const hero = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.orb');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // 8. Business Model Canvas Expander
  document.querySelectorAll('.bmc-box').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('expanded');
    });
  });
});




// Experience Setu Simulation Logic
document.addEventListener('DOMContentLoaded', () => {
  const stepsData = [
    {
      title: "Step 1: User Initiates Request",
      what: "The customer begins a financial service request through a partner application.",
      why: "Every financial journey starts with a user action, such as checking account data or initiating a payment.",
      role: "Setu provides the SDKs and interface components to securely capture this intent.",
      tech: "POST /api/v1/init - The client initiates a secure TLS handshake with Setu.",
      node: 'customer',
      log: 'POST /api/v1/init\nUser clicked "Verify Bank"\nPayload: { userId: "CUST_99X" }'
    },
    {
      title: "Step 2: Consent Collection",
      what: "The user is prompted to grant permission for their data or payment to be processed.",
      why: "Consent is legally mandatory before accessing financial data under RBI's Account Aggregator framework.",
      role: "Setu provides a standardized, compliant consent screen that works seamlessly inside any app.",
      tech: "A cryptographically signed consent artifact is generated and stored for auditability.",
      node: 'customer',
      log: 'POST /api/v1/consent\nGenerating AA UI...\nUser approved OTP.'
    },
    {
      title: "Step 3: API Processing",
      what: "The request reaches Setu, is validated, and securely routed to the relevant bank.",
      why: "Banks have legacy systems that are difficult to query directly. Setu acts as a translation layer.",
      role: "Setu normalizes the diverse XML/SOAP structures of old banks into clean JSON for the app.",
      tech: "The API Gateway performs OAuth 2.0 auth and routes the payload.",
      node: 'setu',
      log: 'ROUTING via Setu Gateway...\nTranslating JSON -> ISO 8583\nForwarding to Partner Bank IP...'
    },
    {
      title: "Step 4: Bank Verification",
      what: "The partner bank verifies the request, performs required checks, and generates a response.",
      why: "The bank is the ultimate source of truth holding the user's funds or identity data.",
      role: "Setu maintains high-availability leased lines with banks to ensure 99.9% uptime during verification.",
      tech: "Core Banking Systems (CBS) process the transaction and return a payload.",
      node: 'bank',
      log: 'Processing at Core Banking System...\nAccount check: SUCCESS\nLatency: 142ms'
    },
    {
      title: "Step 5: Response Returned",
      what: "Setu receives the response, standardizes it, and sends it to the application for the customer to see.",
      why: "The customer needs immediate feedback on whether their action succeeded or failed.",
      role: "Setu handles all the complexity, allowing the app developer to simply read a 'success: true' JSON key.",
      tech: "A 200 OK HTTP response is fired via webhook back to the application.",
      node: 'setu',
      log: '200 OK\n{ "status": "VERIFIED", "timestamp": "2026-07-18" }\nFiring Webhook to App...'
    }
  ];

  const nodeRoles = {
    'customer': {
      title: 'Customer Application',
      desc: 'The front-end interface (like a fintech app or ecommerce checkout). Responsibilities include gathering user intent and displaying data. Security requires standard app-level encryption and TLS.'
    },
    'setu': {
      title: 'Setu API Gateway',
      desc: 'The translation bridge. Responsibilities include standardizing disparate bank APIs into clean JSON, managing API keys, handling consent artifacts, and maintaining 99.99% uptime.'
    },
    'bank': {
      title: 'Regulated Partner Bank',
      desc: 'The regulated entity (e.g. Axis, ICICI) that holds the actual capital and core user identity data. Required by RBI to expose endpoints via the Account Aggregator or UPI framework.'
    }
  };

  const pTabs = document.querySelectorAll('.p-tab');
  const pDesc = document.getElementById('persona-desc');
  const stepTracker = document.getElementById('step-tracker');
  const btnRunSim = document.getElementById('btn-run-sim');
  const btnNextStep = document.getElementById('btn-next-step');
  const btnRestart = document.getElementById('btn-restart');
  const gamification = document.getElementById('sim-gamification');
  const devLogs = document.getElementById('dev-logs');
  const vTabs = document.querySelectorAll('.v-tab');
  const views = document.querySelectorAll('.dash-body');
  
  const titleEl = document.getElementById('step-title');
  const whatEl = document.getElementById('desc-what');
  const whyEl = document.getElementById('desc-why');
  const roleEl = document.getElementById('desc-role');
  const techEl = document.getElementById('desc-tech');

  const modal = document.getElementById('node-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const closeModal = document.getElementById('close-modal');

  let isRunning = false;
  let currentStepIndex = 0;

  // Render tracker steps
  function renderSteps() {
    stepTracker.innerHTML = '';
    stepsData.forEach((step, index) => {
      const div = document.createElement('div');
      div.className = 'track-step';
      div.innerText = step.title;
      div.id = `step-${index}`;
      stepTracker.appendChild(div);
    });
  }

  // Node Modals
  document.querySelectorAll('.net-node').forEach(node => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      const type = node.id.split('-')[1];
      if (nodeRoles[type]) {
        modalTitle.innerText = nodeRoles[type].title;
        modalDesc.innerText = nodeRoles[type].desc;
        modal.classList.add('visible');
      }
    });
  });

  if (closeModal) {
    closeModal.addEventListener('click', () => modal.classList.remove('visible'));
  }

  vTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      vTabs.forEach(t => t.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('view-' + tab.getAttribute('data-view')).classList.add('active');
    });
  });

  function resetSim() {
    gamification.classList.remove('visible');
    devLogs.innerText = 'Waiting for simulation...';
    document.querySelectorAll('.track-step').forEach(el => {
      el.classList.remove('active', 'done');
    });
    
    // reset packets instantly without animation
    const p1 = document.getElementById('packet-1');
    const p2 = document.getElementById('packet-2');
    p1.className = 'packet-sim';
    p2.className = 'packet-sim';
    void p1.offsetWidth; // trigger reflow
    void p2.offsetWidth;
    
    document.querySelectorAll('.net-node').forEach(n => n.classList.remove('active'));
    
    titleEl.innerText = "Ready to start...";
    whatEl.innerText = "Click Start Guided Tour to begin the interactive journey.";
    whyEl.innerText = "";
    roleEl.innerText = "";
    techEl.innerText = "";
    
    btnRunSim.style.display = 'block';
    btnNextStep.style.display = 'none';
    btnNextStep.innerText = 'Next Step ➔';
    isRunning = false;
    currentStepIndex = 0;
  }

  btnRestart.addEventListener('click', () => {
    resetSim();
  });

  function playStep(index) {
    if(index >= stepsData.length) {
      gamification.classList.add('visible');
      btnNextStep.style.display = 'none';
      btnRunSim.style.display = 'block';
      isRunning = false;
      return;
    }

    const sData = stepsData[index];
    
    // Update tracker
    document.querySelectorAll('.track-step').forEach((el, i) => {
      el.classList.remove('active');
      if (i < index) el.classList.add('done');
    });
    document.getElementById(`step-${index}`).classList.add('active');
    
    // Update Guided Explanation text
    titleEl.innerText = sData.title;
    whatEl.innerText = sData.what;
    whyEl.innerText = sData.why;
    roleEl.innerText = sData.role;
    techEl.innerText = sData.tech;
    
    // Node highlighting and packet animation
    document.querySelectorAll('.net-node').forEach(n => n.classList.remove('active'));
    document.getElementById('node-' + sData.node).classList.add('active');
    
    // Reset packets before re-triggering animation
    const p1 = document.getElementById('packet-1');
    const p2 = document.getElementById('packet-2');
    p1.className = 'packet-sim';
    p2.className = 'packet-sim';
    void p1.offsetWidth;
    void p2.offsetWidth;

    if(index === 0) { p1.className = 'packet-sim animate-forward'; }
    if(index === 2) { p2.className = 'packet-sim animate-forward'; }
    if(index === 4) { p2.className = 'packet-sim animate-backward'; }
    
    // Update dev logs
    devLogs.innerText += '\n> ' + sData.log;
    devLogs.scrollTop = devLogs.scrollHeight;

    if (index === stepsData.length - 1) {
      btnNextStep.innerText = 'Finish Journey ✓';
    }
  }

  btnRunSim.addEventListener('click', () => {
    if(isRunning) return;
    isRunning = true;
    currentStepIndex = 0;
    
    devLogs.innerText = 'Initializing...\n';
    btnRunSim.style.display = 'none';
    btnNextStep.style.display = 'block';
    
    playStep(currentStepIndex);
  });

  btnNextStep.addEventListener('click', () => {
    currentStepIndex++;
    playStep(currentStepIndex);
  });

  // Init
  renderSteps();
  resetSim();
});
