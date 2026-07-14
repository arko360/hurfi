(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const stage = document.querySelector("[data-visual]");
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  stage.classList.add("is-live");
  const layers = stage.querySelectorAll(".viz-card, .node");

  const onMove = (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    layers.forEach((el, index) => {
      const depth = (index % 5) + 1;
      const tx = x * depth * 8;
      const ty = y * depth * 6;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  };

  const onLeave = () => {
    layers.forEach((el) => {
      el.style.transform = "";
    });
  };

  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
})();
