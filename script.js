
const autoTypeWords = ["Akshay Kumar"];
const autoTypeElem = document.querySelector('.auto-type');
let typeIdx = 0, charIdx = 0, typeDelay = 90, eraseDelay = 50, typing = true;

function typeHero() {
  if (typing && charIdx < autoTypeWords[typeIdx].length) {
    autoTypeElem.textContent += autoTypeWords[typeIdx][charIdx++];
    setTimeout(typeHero, typeDelay);
  } else if (!typing && charIdx > 0) {
    autoTypeElem.textContent = autoTypeElem.textContent.slice(0, --charIdx);
    setTimeout(typeHero, eraseDelay);
  } else {
    typing = !typing;
    setTimeout(typeHero, 700);
  }
}
if (autoTypeElem) typeHero();


document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    const hash = this.getAttribute('href');
    if (hash && hash.startsWith('#') && document.querySelector(hash)) {
      e.preventDefault();
      document.querySelector(hash).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function activateAOS() {
  document.querySelectorAll('.aos-fade').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('aos-active');
    }
  });
}
window.addEventListener('scroll', activateAOS);
window.addEventListener('load', activateAOS);

document.querySelectorAll('.hover-3d').forEach(card => {
  card.addEventListener('mousemove', e => {
    const { width, height, left, top } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotY = ((x / width) - 0.5) * 16;
    const rotX = ((y / height) - 0.5) * -16;
    card.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.09)`;
    card.style.boxShadow = `0 10px 32px var(--cyan), 0 2px 20px var(--purple)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

const bgShapes = document.querySelectorAll('.shape');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  bgShapes.forEach((shape, i) => {
    shape.style.transform = `translateY(${scrollY / (8 + i*4)}px) scale(1.1) rotate(${scrollY/(13+i*3)}deg)`;
  });
});

