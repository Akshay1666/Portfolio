const root = document.documentElement;
const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const savedTheme = localStorage.getItem("portfolio-theme");
root.dataset.theme = savedTheme || "dark";

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateThemeLabel() {
  const isDark = root.dataset.theme === "dark";
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

updateThemeLabel();
refreshIcons();

const autoTypeWords = ["Akshay Kumar"];
const autoTypeElem = document.querySelector(".auto-type");
let typeIdx = 0;
let charIdx = 0;
let typing = true;

function typeHero() {
  if (!autoTypeElem || prefersReducedMotion) {
    if (autoTypeElem) autoTypeElem.textContent = autoTypeWords[0];
    return;
  }

  const currentWord = autoTypeWords[typeIdx];
  if (typing && charIdx < currentWord.length) {
    autoTypeElem.textContent += currentWord[charIdx];
    charIdx += 1;
    window.setTimeout(typeHero, 90);
    return;
  }

  if (!typing && charIdx > 0) {
    autoTypeElem.textContent = autoTypeElem.textContent.slice(0, -1);
    charIdx -= 1;
    window.setTimeout(typeHero, 50);
    return;
  }

  typing = !typing;
  window.setTimeout(typeHero, typing ? 420 : 1200);
}

typeHero();

function setNavState() {
  nav?.classList.toggle("is-scrolled", window.scrollY > 12);
}

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  refreshIcons();
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = hash ? document.querySelector(hash) : null;

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      history.pushState(null, "", hash);
    }

    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      refreshIcons();
    }
  });
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeLabel();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
);

document.querySelectorAll(".reveal, .skill-category").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
  revealObserver.observe(el);
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => activeObserver.observe(section));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  if (prefersReducedMotion) return;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.addEventListener("pointermove", (event) => {
  if (prefersReducedMotion) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 12;
  const y = (event.clientY / window.innerHeight - 0.5) * 12;
  document.querySelector(".aurora")?.style.setProperty("transform", `translate(${x}px, ${y}px)`);
});

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 650);
  });
});

const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    projectCards.forEach((card) => {
      const tags = card.dataset.tags || "";
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    if (formStatus) formStatus.textContent = "Please fill out every field with a valid email address.";
    return;
  }

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

  if (formStatus) formStatus.textContent = "Opening your email app with the message ready.";
  window.location.href = `mailto:akshaychoudhary1666@gmail.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});
