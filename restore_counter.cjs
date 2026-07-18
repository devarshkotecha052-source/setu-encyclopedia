const fs = require('fs');

const counterLogic = `
document.addEventListener('DOMContentLoaded', () => {
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('counter')) {
          animateCounter(entry.target);
          entry.target.classList.remove('counter');
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.counter').forEach(el => observer.observe(el));
});
`;

let js = fs.readFileSync('main.js', 'utf8');
fs.writeFileSync('main.js', js + '\n' + counterLogic);
