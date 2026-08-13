const LV_PHONE = "522723569215";

document.body.classList.add("loading");

const loadingScreen = document.getElementById("loading-screen");
const startedAt = Date.now();

function hideLoader() {
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, 1700 - elapsed);
  window.setTimeout(() => {
    loadingScreen?.classList.add("is-hidden");
    document.body.classList.remove("loading");
    revealHashTarget();
  }, remaining);
}

function revealHashTarget() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  target.querySelectorAll("[data-reveal]").forEach((item) => item.classList.add("is-visible"));
  window.setTimeout(() => target.scrollIntoView({ block: "start" }), 80);
}

window.addEventListener("load", hideLoader);
window.setTimeout(hideLoader, 3600);

document.getElementById("year").textContent = new Date().getFullYear();

const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");
const waToggle = document.getElementById("waToggle");
const waMenu = document.getElementById("waMenu");
const toTop = document.getElementById("toTop");

function updateScrollState() {
  const active = window.scrollY > 40;
  siteHeader?.classList.toggle("is-scrolled", active);
  toTop?.classList.toggle("is-visible", window.scrollY > 700);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

navToggle?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

waToggle?.addEventListener("click", () => {
  waMenu?.classList.toggle("is-open");
});

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.55 });

counters.forEach((counter) => counterObserver.observe(counter));

function createParticles(field) {
  const amount = field.classList.contains("particle-soft") ? 18 : 32;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < amount; i += 1) {
    const particle = document.createElement("span");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.setProperty("--duration", `${5 + Math.random() * 8}s`);
    particle.style.setProperty("--delay", `${Math.random() * -9}s`);
    particle.style.opacity = String(.22 + Math.random() * .65);
    fragment.appendChild(particle);
  }

  field.appendChild(fragment);
}

document.querySelectorAll(".particle-field").forEach(createParticles);

const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(contactForm);
  const nombre = String(form.get("nombre") || "").trim();
  const telefono = String(form.get("telefono") || "").trim();
  const area = String(form.get("area") || "").trim();
  const mensaje = String(form.get("mensaje") || "").trim();

  const text = [
    "Hola, quiero solicitar asesoria con LV Asesoria Financiera y Juridica.",
    nombre ? `Nombre: ${nombre}` : "",
    telefono ? `Telefono: ${telefono}` : "",
    area ? `Tipo de asesoria: ${area}` : "",
    mensaje ? `Mensaje: ${mensaje}` : ""
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${LV_PHONE}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

document.addEventListener("click", (event) => {
  if (!waMenu?.classList.contains("is-open")) return;
  if (event.target.closest(".wa-float")) return;
  waMenu.classList.remove("is-open");
});
