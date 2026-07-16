/* Hurfi static site — behavior only. Header, footer, and content live in HTML. */
(function () {
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initShell() {
    const main = document.querySelector("main");
    if (main && !main.id) main.id = "main-content";
    initNav();
    initHeaderScroll();
    initHeroExperience();
    initValuesSection();
    initMagneticButtons(document);
    initStrategyForm();
    const grid = document.getElementById("website-grid");
    if (grid) initWebsiteShowcase(grid);
  }

  function initStrategyForm() {
    const form = document.getElementById("strategy-form");
    const success = document.getElementById("book-success");
    if (!form || !success) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const honey = form.querySelector(".hp-field");
      if (honey && honey.value) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const lines = [];
      data.forEach((value, key) => {
        if (key === "company_website") return;
        lines.push(key + ": " + value);
      });

      const subject = encodeURIComponent("Hurfi strategy call request");
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = "mailto:hello@hurfi.com?subject=" + subject + "&body=" + body;
      form.hidden = true;
      success.hidden = false;
      success.focus?.();
      success.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    });
  }

  function initValuesSection() {
    const values = document.querySelector("[data-values]");
    const cta = document.querySelector("[data-cta]");
    if (!values && !cta) return;

    if (prefersReducedMotion()) {
      if (values) values.classList.add("is-inview");
      return;
    }

    if (values && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(values);
    } else if (values) {
      values.classList.add("is-inview");
    }

    initSoftParallax(values, ".values-orb, .values-spark, .values-connectors", 6);
    initSoftParallax(cta, ".cta-orb, .cta-btn-glow, .cta-flow, .cta-dot", 4);
  }

  function initSoftParallax(root, selector, strength) {
    if (!root) return;
    const layers = Array.from(root.querySelectorAll(selector));
    if (!layers.length) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const max = strength || 5;

    const render = () => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      layers.forEach((el, i) => {
        const depth = ((i % 4) + 1) * 0.9;
        el.style.translate = (currentX * depth).toFixed(2) + "px " + (currentY * depth).toFixed(2) + "px";
      });
      raf = requestAnimationFrame(render);
    };

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * max;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * max;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(render);

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(render);
      },
      { passive: true }
    );
  }

  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    const mount = document.getElementById("site-header");
    if (!header) return;

    let raf = 0;
    let lastTone = "light";

    const syncSpacer = () => {
      const h = Math.ceil(header.getBoundingClientRect().height);
      if (h > 0) {
        const value = h + "px";
        document.documentElement.style.setProperty("--header-offset", value);
        if (mount) mount.style.setProperty("--header-offset", value);
      }
    };

    const sampleTone = () => {
      const probeY = Math.min(window.innerHeight * 0.12, 88);
      const x = Math.min(window.innerWidth - 24, Math.max(24, window.innerWidth * 0.5));
      const el = document.elementFromPoint(x, probeY);
      if (!el || header.contains(el)) return lastTone;

      let node = el;
      for (let i = 0; i < 8 && node; i++) {
        if (node.matches && node.matches(".cta-band-inner, .site-footer, .cta-band, .pf-cta-band, .wd-cta, [data-tone='dark']")) {
          return "dark";
        }
        if (node.matches && node.matches(".hero, .values, .trust-bar, [data-tone='blue'], .page-hero, .portfolio-viewport, .cat-hero")) {
          return "blue";
        }
        node = node.parentElement;
      }

      const bg = window.getComputedStyle(el).backgroundColor;
      const m = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) {
        const r = +m[1];
        const g = +m[2];
        const b = +m[3];
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        if (lum < 0.35) return "dark";
        if (b > r + 15 && b > 160) return "blue";
      }
      return "light";
    };

    const update = () => {
      raf = 0;
      const scrolled = window.scrollY > 10;
      header.classList.toggle("is-scrolled", scrolled);
      const tone = scrolled ? sampleTone() : "light";
      if (tone !== lastTone) {
        lastTone = tone;
        header.setAttribute("data-tone", tone);
      }
      syncSpacer();
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      syncSpacer();
      onScroll();
    }, { passive: true });
  }

  function initHeroExperience() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    requestAnimationFrame(() => {
      hero.classList.add("is-ready");
    });

    if (prefersReducedMotion()) {
      hero.querySelectorAll("[data-count]").forEach((el) => {
        const target = el.getAttribute("data-count") || "0";
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "%";
        el.textContent = prefix + target + suffix;
      });
      return;
    }

    initHeroParallax();
    initHeroCounter(hero);
  }

  function initHeroParallax() {
    const stage = document.querySelector("[data-visual]");
    if (!stage) return;

    const layers = Array.from(stage.querySelectorAll(".dash-card, .node, .dash-pill"));
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      layers.forEach((el, i) => {
        const depth = ((i % 5) + 1) * 1.2;
        el.style.translate = (currentX * depth).toFixed(2) + "px " + (currentY * depth).toFixed(2) + "px";
      });
      raf = requestAnimationFrame(render);
    };

    const onMove = (event) => {
      const rect = stage.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(render);

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(render);
      },
      { passive: true }
    );
  }

  function initHeroCounter(hero) {
    hero.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.getAttribute("data-count")) || 0;
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "%";
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      setTimeout(() => requestAnimationFrame(tick), 400);
    });
  }

  function initMagneticButtons(scope) {
    if (!scope || prefersReducedMotion()) return;
    scope.querySelectorAll(".magnetic").forEach((btn) => {
      if (btn.dataset.magneticBound) return;
      btn.dataset.magneticBound = "1";
      const strength = 10;
      btn.addEventListener("pointermove", (event) => {
        const rect = btn.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
        btn.style.setProperty("--mx", x.toFixed(2) + "px");
        btn.style.setProperty("--my", y.toFixed(2) + "px");
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    });
  }

  function initNav() {
    const nav = document.getElementById("site-nav");
    const toggle = document.getElementById("nav-toggle");
    const dropdown = document.getElementById("portfolio-dropdown");
    if (!nav || !dropdown) return;

    let leaveLock = false;
    let closeTimer = null;

    const blurFocus = () => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && dropdown.contains(active)) active.blur();
    };

    const softClose = () => {
      leaveLock = false;
      dropdown.classList.remove("is-open");
      dropdown.classList.add("is-closing");
      blurFocus();
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => dropdown.classList.remove("is-closing"), 280);
      const trigger = dropdown.querySelector(".nav-dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    };

    const closeUntilLeave = () => {
      leaveLock = true;
      dropdown.classList.remove("is-open");
      dropdown.classList.add("is-closing");
      blurFocus();
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => dropdown.classList.remove("is-closing"), 280);
      const trigger = dropdown.querySelector(".nav-dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      if (leaveLock) return;
      clearTimeout(closeTimer);
      dropdown.classList.remove("is-closing");
      dropdown.classList.add("is-open");
      const trigger = dropdown.querySelector(".nav-dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    };

    dropdown.addEventListener("mouseenter", open);
    dropdown.addEventListener("mouseleave", () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        leaveLock = false;
        dropdown.classList.remove("is-open", "is-closing");
        blurFocus();
        const trigger = dropdown.querySelector(".nav-dropdown-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }, 140);
    });

    dropdown.querySelectorAll(".nav-dropdown-menu a").forEach((a) => {
      a.addEventListener("click", () => closeUntilLeave());
    });

    document.addEventListener("pointerdown", (e) => {
      if (!dropdown.contains(e.target)) softClose();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      softClose();
      if (toggle && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });

    if (toggle) {
      toggle.addEventListener("click", () => {
        const openNav = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", openNav ? "true" : "false");
        toggle.setAttribute("aria-label", openNav ? "Close menu" : "Open menu");
      });
    }
  }

  function preloadImage(src) {
    if (!src || preloadImage._cache[src]) return;
    preloadImage._cache[src] = true;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }
  preloadImage._cache = Object.create(null);

  function ensureImgSrc(img) {
    if (!img) return;
    const src = img.getAttribute("data-src");
    if (src && !img.getAttribute("src")) {
      img.setAttribute("src", src);
      img.removeAttribute("data-src");
    }
  }

  function createWebsiteCardController(card) {
    const showcase = card.querySelector(".wd-showcase");
    if (!showcase) return null;

    const scrollImg = showcase.querySelector(".wd-scroll-layer img");
    const reduce = prefersReducedMotion();
    let raf = 0;
    let hovering = false;
    let peekDone = false;
    let scrollY = 0;
    let scrollDir = 1;
    let lastTs = 0;
    let destroyed = false;

    const measureFrame = () => showcase.clientHeight || showcase.getBoundingClientRect().height;

    const setScrollY = (y) => {
      scrollY = y;
      if (scrollImg) scrollImg.style.setProperty("--sy", (-scrollY).toFixed(1) + "px");
    };

    const maxScroll = () => {
      if (!scrollImg) return 0;
      return Math.max(0, scrollImg.offsetHeight - measureFrame());
    };

    const stopScrollLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (scrollImg) scrollImg.style.willChange = "auto";
    };

    const loadScrollImage = () =>
      new Promise((resolve) => {
        if (!scrollImg) {
          resolve(false);
          return;
        }
        ensureImgSrc(scrollImg);
        if (scrollImg.complete && scrollImg.naturalHeight > 0) {
          resolve(true);
          return;
        }
        const done = () => resolve(scrollImg.naturalHeight > 0);
        scrollImg.addEventListener("load", done, { once: true });
        scrollImg.addEventListener("error", () => resolve(false), { once: true });
        window.setTimeout(() => resolve(scrollImg.naturalHeight > 0), 1200);
      });

    const startHoverScroll = async () => {
      if (reduce || !scrollImg) return;
      const ok = await loadScrollImage();
      if (!ok || !hovering || destroyed) return;
      showcase.classList.add("is-scrolling");
      scrollImg.style.willChange = "transform";
      setScrollY(0);
      scrollDir = 1;
      lastTs = 0;

      const tick = (ts) => {
        if (!hovering || destroyed) return;
        if (!lastTs) lastTs = ts;
        const dt = Math.min(0.05, (ts - lastTs) / 1000);
        lastTs = ts;
        const max = maxScroll();
        if (max <= 1) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const progress = scrollY / max;
        const edge = progress < 0.12 ? progress / 0.12 : progress > 0.88 ? (1 - progress) / 0.12 : 1;
        const ease = 0.45 + 0.55 * Math.max(0.2, edge);
        const speed = Math.max(28, measureFrame() * 0.18) * ease;
        scrollY += scrollDir * speed * dt;
        if (scrollY >= max) {
          scrollY = max;
          scrollDir = -1;
        } else if (scrollY <= 0) {
          scrollY = 0;
          scrollDir = 1;
        }
        setScrollY(scrollY);
        raf = requestAnimationFrame(tick);
      };

      stopScrollLoop();
      scrollImg.style.willChange = "transform";
      raf = requestAnimationFrame(tick);
    };

    const endHoverScroll = () => {
      stopScrollLoop();
      showcase.classList.remove("is-scrolling");
      setScrollY(0);
    };

    const runPeek = async () => {
      if (peekDone || reduce || !scrollImg || hovering) return;
      peekDone = true;
      const ok = await loadScrollImage();
      if (!ok || hovering || destroyed) return;
      showcase.classList.add("is-scrolling");
      scrollImg.style.willChange = "transform";
      setScrollY(0);
      const duration = 1500;
      const startAt = performance.now();
      const tick = (now) => {
        if (destroyed || hovering) {
          showcase.classList.remove("is-scrolling");
          setScrollY(0);
          if (scrollImg) scrollImg.style.willChange = "auto";
          return;
        }
        const t = Math.min(1, (now - startAt) / duration);
        setScrollY(maxScroll() * 0.4 * Math.sin(t * Math.PI));
        if (t < 1) raf = requestAnimationFrame(tick);
        else {
          showcase.classList.remove("is-scrolling");
          setScrollY(0);
          if (scrollImg) scrollImg.style.willChange = "auto";
        }
      };
      stopScrollLoop();
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      hovering = true;
      startHoverScroll();
    };
    const onLeave = () => {
      hovering = false;
      endHoverScroll();
    };

    showcase.addEventListener("pointerenter", onEnter);
    showcase.addEventListener("pointerleave", onLeave);

    return {
      peek: runPeek,
      destroy() {
        destroyed = true;
        hovering = false;
        stopScrollLoop();
        showcase.removeEventListener("pointerenter", onEnter);
        showcase.removeEventListener("pointerleave", onLeave);
      },
    };
  }

  function initWebsiteShowcase(root) {
    if (!root) return;
    const cards = Array.from(root.querySelectorAll(".wd-card"));
    const controllers = cards.map((card) => createWebsiteCardController(card)).filter(Boolean);
    root._wdControllers = controllers;

    if (prefersReducedMotion()) return;

    let peeked = false;
    const kickoff = () => {
      if (peeked) return;
      peeked = true;
      controllers.forEach((c, i) => window.setTimeout(() => c.peek(), i * 120));
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            kickoff();
            io.disconnect();
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
      );
      io.observe(root);
    } else {
      kickoff();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShell);
  } else {
    initShell();
  }
})();
