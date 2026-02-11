(function () {
  function get(data, path, fallback = "") {
    const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), data);
    return value === undefined || value === null ? fallback : value;
  }

  function text(el, value) {
    el.textContent = value;
  }

  function renderList(selector, items) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = "";
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function renderCards(selector, cards) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = "";
    (cards || []).forEach((card) => {
      const article = document.createElement("article");
      article.className = "card";
      article.innerHTML = `<h3>${card.title || ""}</h3><p>${card.text || ""}</p>`;
      container.appendChild(article);
    });
  }

  function rotateText(el, words) {
    if (!el || !Array.isArray(words) || words.length === 0) return;
    let i = 0;
    text(el, words[0]);
    if (words.length < 2) return;
    setInterval(() => {
      i = (i + 1) % words.length;
      text(el, words[i]);
    }, 2200);
  }

  function renderPortfolio(units) {
    const root = document.getElementById("portfolio-sections");
    if (!root) return;
    root.innerHTML = "";

    (units || []).forEach((unit) => {
      const section = document.createElement("section");
      section.className = "section";
      const projects = (unit.projects || [])
        .map(
          (project) => `<article class="card"><h3>${project.title || ""}</h3><p>${project.description || ""}</p><p><strong>Reflection:</strong> ${project.reflection || ""}</p></article>`
        )
        .join("");
      section.innerHTML = `
        <h2 class="section-title">${unit.title || ""}</h2>
        <p class="section-subtitle">${unit.subtitle || ""}</p>
        <div class="grid">${projects || '<article class="card"><p>Projects will be added soon.</p></article>'}</div>
      `;
      root.appendChild(section);
    });
  }

  function renderReflections(entries) {
    const root = document.getElementById("reflection-entries");
    if (!root) return;
    root.innerHTML = "";

    (entries || []).forEach((entry) => {
      const article = document.createElement("article");
      article.className = "card";
      article.innerHTML = `
        <h3>${entry.title || ""}</h3>
        <p><strong>What did I learn?</strong> ${entry.learned || ""}</p>
        <p><strong>What went well?</strong> ${entry.wentWell || ""}</p>
        <p><strong>What was challenging?</strong> ${entry.challenging || ""}</p>
      `;
      root.appendChild(article);
    });
  }

  async function init() {
    const response = await fetch("content.json", { cache: "no-store" });
    const data = await response.json();

    document.querySelectorAll("[data-global-name]").forEach((el) => text(el, get(data, "global.name")));
    document.querySelectorAll("[data-course]").forEach((el) => text(el, get(data, "global.course")));

    const kicker = document.querySelector("[data-home-kicker]");
    if (kicker) text(kicker, get(data, "home.kicker"));

    const heroLead = document.querySelector("[data-home-hero-lead]");
    if (heroLead) text(heroLead, get(data, "home.heroLead"));

    rotateText(document.querySelector("[data-home-hero-rotate]"), get(data, "home.heroRotate", []));

    const homeWelcome = document.querySelector("[data-home-welcome]");
    if (homeWelcome) text(homeWelcome, get(data, "home.welcome"));

    const primary = document.querySelector("[data-home-primary]");
    if (primary) text(primary, get(data, "home.primaryButton"));

    const secondary = document.querySelector("[data-home-secondary]");
    if (secondary) text(secondary, get(data, "home.secondaryButton"));

    renderCards("[data-home-highlights]", get(data, "home.highlights", []));

    const aboutIntro = document.querySelector("[data-about-intro]");
    if (aboutIntro) text(aboutIntro, get(data, "about.intro"));

    const aboutFocus = document.querySelector("[data-about-focus]");
    if (aboutFocus) text(aboutFocus, get(data, "about.focus"));

    renderList("[data-about-interests]", get(data, "about.interests", []));
    renderList("[data-about-favourites]", get(data, "about.favourites", []));
    renderList("[data-about-accomplishments]", get(data, "about.accomplishments", []));
    renderList("[data-about-goals]", get(data, "about.goals", []));
    renderList("[data-about-contact]", [
      `Email: ${get(data, "global.email")}`,
      `Phone: ${get(data, "global.phone")}`
    ]);

    const portfolioIntro = document.querySelector("[data-portfolio-intro]");
    if (portfolioIntro) text(portfolioIntro, get(data, "portfolio.intro"));

    const portfolioPlan = document.querySelector("[data-portfolio-plan]");
    if (portfolioPlan) text(portfolioPlan, get(data, "portfolio.yearPlan"));

    renderPortfolio(get(data, "portfolio.units", []));

    const reflectionIntro = document.querySelector("[data-reflection-intro]");
    if (reflectionIntro) text(reflectionIntro, get(data, "reflection.intro"));

    const reflectionSkills = document.querySelector("[data-reflection-skills]");
    if (reflectionSkills) text(reflectionSkills, get(data, "reflection.skills"));

    renderReflections(get(data, "reflection.entries", []));
  }

  document.addEventListener("DOMContentLoaded", init);
})();
