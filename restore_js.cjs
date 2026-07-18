const fs = require('fs');

const missingLogic = `
document.addEventListener('DOMContentLoaded', () => {
  // 4. Before/After Slider (Friction)
  const slider = document.getElementById('friction-slider');
  const sliderImage = document.querySelector('.slider-after');
  if (slider && sliderImage) {
    sliderImage.style.clipPath = \`polygon(0 0, \${slider.value}% 0, \${slider.value}% 100%, 0 100%)\`;
    slider.addEventListener('input', (e) => {
      sliderImage.style.clipPath = \`polygon(0 0, \${e.target.value}% 0, \${e.target.value}% 100%, 0 100%)\`;
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
      const targetId = 'bio-' + tab.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if(targetEl) targetEl.classList.add('active');
    });
  });

  // 8. Business Model Canvas Expander
  document.querySelectorAll('.bmc-box').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('expanded');
    });
  });
});
`;

let js = fs.readFileSync('main.js', 'utf8');
fs.writeFileSync('main.js', js + '\n' + missingLogic);
