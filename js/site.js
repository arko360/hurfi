/* Hurfi static site — plain JS, no Node/React */
(function () {
  const year = new Date().getFullYear();

  function path() {
    return (location.pathname.replace(/\\/g, "/") || "/").replace(/\/index\.html$/i, "/");
  }

  function isActive(href) {
    const p = path();
    if (href === "/" || href === "/index.html") {
      return p === "/" || p.endsWith("/html/") || p.endsWith("/html/index.html") || /\/index\.html$/i.test(p) && !p.includes("portfolio") && !p.includes("services");
    }
    return p.indexOf(href.replace(/\.html$/, "")) !== -1 || p.indexOf(href) !== -1;
  }

  function pageFile(name) {
    // All pages live flat in the same folder — no Node, no nested routes.
    if (name.startsWith("http") || name.startsWith("mailto") || name.startsWith("tel") || name.startsWith("#")) {
      return name;
    }
    if (name === "/" || name === "") return "index.html";
    return name.replace(/^\//, "");
  }

  const portfolioItems = [
    { href: "portfolio-website.html", label: "Website Development", desc: "High-converting B2B sites" },
    { href: "portfolio-seo.html", label: "SEO", desc: "Search visibility & rankings" },
    { href: "portfolio-branding.html", label: "Branding & Growth", desc: "Identity systems that scale" },
  ];

  function headerHTML() {
    const home = pageFile("index.html");
    const portfolio = pageFile("portfolio.html");
    const services = pageFile("services.html");
    const about = pageFile("about.html");
    const pricing = pageFile("pricing.html");
    const contact = pageFile("contact.html");
    const mark = pageFile("assets/icons/hurfi-mark.png");

    const pItems = portfolioItems
      .map(
        (item) => `
      <a href="${pageFile(item.href)}" role="menuitem">
        <strong>${item.label}</strong>
        <span>${item.desc}</span>
      </a>`
      )
      .join("");

    return `
<header class="site-header">
  <div class="header-shell container">
    <div class="header-glass">
      <a class="brand" href="${home}" aria-label="Hurfi home">
        <img src="${mark}" alt="" width="34" height="34" />
        <span>Hurfi</span>
      </a>
      <nav class="nav" id="site-nav" aria-label="Primary">
        <a href="${home}" class="${isActive("index.html") ? "is-active" : ""}">Home</a>
        <div class="nav-dropdown ${path().includes("portfolio") ? "is-active" : ""}" id="portfolio-dropdown">
          <a href="${portfolio}" class="nav-dropdown-trigger ${path().includes("portfolio") ? "is-active" : ""}" aria-haspopup="menu" aria-expanded="false">
            Portfolio
            <span class="caret" aria-hidden="true"></span>
          </a>
          <div class="nav-dropdown-menu" role="menu" aria-label="Portfolio categories">
            ${pItems}
          </div>
        </div>
        <a href="${services}" class="${path().includes("services") ? "is-active" : ""}">Services</a>
        <a href="${about}" class="${path().includes("about") ? "is-active" : ""}">About</a>
        <a href="${pricing}" class="${path().includes("pricing") ? "is-active" : ""}">Pricing</a>
        <a href="${contact}" class="${path().includes("contact") ? "is-active" : ""}">Contact</a>
      </nav>
      <div class="header-end">
        <button class="nav-toggle" type="button" id="nav-toggle" aria-expanded="false" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </div>
</header>`;
  }

  function footerHTML() {
    const mark = pageFile("assets/icons/hurfi-mark.png");
    return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a href="${pageFile("index.html")}" class="footer-logo">
        <img src="${mark}" alt="" />
        <span>Hurfi</span>
      </a>
      <p>Helping B2B brands build trusted international online presence — website, search, and growth systems connected.</p>
      <div class="socials">
        <a href="#" aria-label="LinkedIn">in</a>
        <a href="#" aria-label="X">X</a>
        <a href="#" aria-label="Instagram">ig</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <a href="${pageFile("portfolio-website.html")}">Website Development</a>
      <a href="${pageFile("portfolio-seo.html")}">SEO</a>
      <a href="${pageFile("services.html")}">Digital Marketing</a>
      <a href="${pageFile("portfolio-branding.html")}">Branding</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="${pageFile("about.html")}">About</a>
      <a href="${pageFile("portfolio.html")}">Portfolio</a>
      <a href="${pageFile("pricing.html")}">Pricing</a>
      <a href="${pageFile("contact.html")}">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Resources</h4>
      <a href="${pageFile("portfolio.html")}">Case Studies</a>
      <a href="${pageFile("contact.html")}">Strategy Call</a>
      <a href="${pageFile("about.html")}">Our Process</a>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <a href="mailto:hello@hurfi.com">hello@hurfi.com</a>
      <a href="tel:+10000000000">+1 (000) 000-0000</a>
      <p>Global · Remote-first</p>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© ${year} Hurfi. All rights reserved.</span>
    <div><a href="#">Privacy</a><a href="#">Terms</a></div>
  </div>
</footer>`;
  }

  function initShell() {
    const headerMount = document.getElementById("site-header");
    const footerMount = document.getElementById("site-footer");
    if (headerMount) headerMount.innerHTML = headerHTML();
    if (footerMount) footerMount.innerHTML = footerHTML();
    initNav();
    initHeaderScroll();
    initHeroExperience();
    initMagneticButtons(document);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
      if (e.key === "Escape") softClose();
    });

    if (toggle) {
      toggle.addEventListener("click", () => {
        const openNav = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", openNav ? "true" : "false");
        toggle.setAttribute("aria-label", openNav ? "Close menu" : "Open menu");
      });
    }
  }

  // Website portfolio cards — minimal showcase + slideshow
  window.HURFI_WEBSITES = [
    {
      slug: "ghorsajan",
      name: "Ghorsajan",
      url: "https://ghorsajan.com/",
      caseUrl: "case-ghorsajan.html",
      slides: [
        "portfolio-preview/slides/ghorsajan/01.webp",
        "portfolio-preview/slides/ghorsajan/02.webp",
        "portfolio-preview/slides/ghorsajan/03.jpg",
        "portfolio-preview/slides/ghorsajan/04.jpg",
        "portfolio-preview/slides/ghorsajan/05.webp",
      ],
    },
    {
      slug: "real-sign-bd",
      name: "Real Sign BD",
      url: "https://realsignbd.com/",
      caseUrl: "case-real-sign-bd.html",
      slides: [
        "portfolio-preview/slides/real-sign-bd/01.webp",
        "portfolio-preview/slides/real-sign-bd/02.webp",
        "portfolio-preview/slides/real-sign-bd/03.jpg",
        "portfolio-preview/slides/real-sign-bd/04.jpg",
        "portfolio-preview/slides/real-sign-bd/05.webp",
      ],
    },
    {
      slug: "gully-apparel",
      name: "Gully Apparel",
      url: "https://gullyapparel.store/",
      caseUrl: "case-gully-apparel.html",
      slides: [
        "portfolio-preview/slides/gully-apparel/01.webp",
        "portfolio-preview/slides/gully-apparel/02.webp",
        "portfolio-preview/slides/gully-apparel/03.jpg",
        "portfolio-preview/slides/gully-apparel/04.jpg",
        "portfolio-preview/slides/gully-apparel/05.webp",
      ],
    },
    {
      slug: "gozero-print",
      name: "Gozero Print",
      url: "https://gozeroprint.com/",
      caseUrl: "case-gozero-print.html",
      slides: [
        "portfolio-preview/slides/gozero-print/01.webp",
        "portfolio-preview/slides/gozero-print/02.webp",
        "portfolio-preview/slides/gozero-print/03.jpg",
        "portfolio-preview/slides/gozero-print/04.jpg",
        "portfolio-preview/slides/gozero-print/05.webp",
      ],
    },
    {
      slug: "zaiax",
      name: "Zaiax",
      url: "https://zaiax.com/",
      caseUrl: "case-zaiax.html",
      slides: [
        "portfolio-preview/slides/zaiax/01.webp",
        "portfolio-preview/slides/zaiax/02.webp",
        "portfolio-preview/slides/zaiax/03.jpg",
        "portfolio-preview/slides/zaiax/04.jpg",
        "portfolio-preview/slides/zaiax/05.webp",
      ],
    },
  ];

  function initWebsiteSlideshows(root) {
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root?.querySelectorAll(".wd-showcase").forEach((sc) => {
        sc.querySelectorAll(".wd-slide").forEach((s, idx) => s.classList.toggle("is-active", idx === 0));
      });
      return;
    }

    root.querySelectorAll(".wd-showcase").forEach((showcase) => {
      const slides = Array.from(showcase.querySelectorAll(".wd-slide"));
      if (slides.length < 2) return;
      let index = 0;
      let timer = null;

      const show = (next) => {
        slides[index].classList.remove("is-active");
        index = (next + slides.length) % slides.length;
        slides[index].classList.add("is-active");
      };

      const start = () => {
        stop();
        timer = window.setInterval(() => show(index + 1), 3500);
      };
      const stop = () => {
        if (timer) window.clearInterval(timer);
        timer = null;
      };

      showcase.addEventListener("pointerenter", stop);
      showcase.addEventListener("pointerleave", start);
      start();
    });
  }

  window.renderWebsiteGrid = function (mountId) {
    const el = document.getElementById(mountId);
    if (!el) return;

    el.innerHTML = window.HURFI_WEBSITES.map((p, i) => {
      const slides = (p.slides || []).map(
        (src, sIdx) => `
          <div class="wd-slide${sIdx === 0 ? " is-active" : ""}">
            <img
              src="${src}"
              alt="${p.name} preview ${sIdx + 1}"
              width="1200"
              height="800"
              loading="${i < 3 && sIdx === 0 ? "eager" : "lazy"}"
              decoding="async"
            />
          </div>`
      ).join("");

      return `
      <article class="wd-card">
        <a class="wd-showcase" href="${p.caseUrl || "case-" + p.slug + ".html"}" aria-label="${p.name} case study">
          ${slides}
        </a>
        <div class="wd-card-body">
          <h2>${p.name}</h2>
          <a class="btn btn-primary wd-btn" href="${p.url}" target="_blank" rel="noopener noreferrer">View Website<span class="btn-arrow">→</span></a>
        </div>
      </article>`;
    }).join("");

    initWebsiteSlideshows(el);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShell);
  } else {
    initShell();
  }
})();
