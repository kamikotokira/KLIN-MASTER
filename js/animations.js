document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const name = element.dataset.animate || "fadeInUp";
      element.classList.add("animate__animated", "animate__" + name);
      if (element.dataset.delay) {
        element.style.animationDelay = element.dataset.delay + "ms";
      }
      observer.unobserve(element);
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
});
