(function () {
  function getValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  function setTextContent(data) {
    document.querySelectorAll("[data-text]").forEach((el) => {
      const value = getValue(data, el.dataset.text);
      if (value !== undefined && value !== null) {
        el.textContent = value;
        if (value === "") {
          el.classList.add("is-empty");
        } else {
          el.classList.remove("is-empty");
        }
      }
    });
  }

  function setListContent(data) {
    document.querySelectorAll("[data-list]").forEach((el) => {
      let list = getValue(data, el.dataset.list);
      if (!Array.isArray(list)) {
        list = [];
      }

      if (el.dataset.list === "about.contact" && list.length === 0) {
        const email = data.global && data.global.email ? `Email: ${data.global.email}` : null;
        const phone = data.global && data.global.phone ? `Phone: ${data.global.phone}` : null;
        list = [email, phone].filter(Boolean);
      }

      el.innerHTML = "";
      list.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        el.appendChild(li);
      });
    });
  }

  function setPillLists(data) {
    document.querySelectorAll("[data-pill-list]").forEach((el) => {
      let list = getValue(data, el.dataset.pillList);
      if (!Array.isArray(list)) {
        list = [];
      }

      if (el.dataset.pillList === "home.meta") {
        const grade = data.global && data.global.grade ? data.global.grade : null;
        const school = data.global && data.global.school ? data.global.school : null;
        if (grade && !list.includes(grade)) list.push(grade);
        if (school && !list.includes(school)) list.push(school);
      }

      el.innerHTML = "";
      list.forEach((item) => {
        const span = document.createElement("span");
        span.className = "meta-pill";
        span.textContent = item;
        el.appendChild(span);
      });
    });
  }

  function setCardLists(data) {
    document.querySelectorAll("[data-card-list]").forEach((el) => {
      const list = getValue(data, el.dataset.cardList);
      if (!Array.isArray(list)) {
        return;
      }
      el.innerHTML = "";
      list.forEach((item) => {
        const card = document.createElement("article");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = item.title || "";

        const text = document.createElement("p");
        text.textContent = item.text || "";

        card.appendChild(title);
        card.appendChild(text);
        el.appendChild(card);
      });
    });
  }

  function setRotatingText(data) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-rotate]").forEach((el) => {
      let words = getValue(data, el.dataset.rotate);
      if (typeof words === "string") {
        words = [words];
      }
      if (!Array.isArray(words) || words.length === 0) {
        return;
      }

      let index = 0;
      el.textContent = words[index];
      if (words.length < 2 || prefersReduced) {
        return;
      }

      setInterval(() => {
        el.classList.add("is-fading");
        setTimeout(() => {
          index = (index + 1) % words.length;
          el.textContent = words[index];
          el.classList.remove("is-fading");
        }, 350);
      }, 2600);
    });
  }

  function buildPortfolioSections(data) {
    const container = document.getElementById("portfolio-sections");
    if (!container || !data.portfolio || !Array.isArray(data.portfolio.units)) {
      return;
    }

    container.innerHTML = "";

    if (data.portfolio.units.length === 0) {
      const section = document.createElement("section");
      section.className = "section";

      const title = document.createElement("h2");
      title.className = "section-title";
      title.textContent = data.portfolio.emptyTitle || "Portfolio Under Construction";

      const subtitle = document.createElement("p");
      subtitle.className = "section-subtitle";
      subtitle.textContent = data.portfolio.emptyMessage || "";

      const grid = document.createElement("div");
      grid.className = "grid";

      const card = document.createElement("article");
      card.className = "card construction-card";

      const tag = document.createElement("div");
      tag.className = "construction-tag";
      tag.textContent = "Under Construction";

      const cardTitle = document.createElement("h3");
      cardTitle.textContent = "Projects Coming Soon";

      const cardText = document.createElement("p");
      cardText.textContent = "Check back after the next assignment to see new work.";

      card.appendChild(tag);
      card.appendChild(cardTitle);
      card.appendChild(cardText);
      grid.appendChild(card);

      section.appendChild(title);
      section.appendChild(subtitle);
      section.appendChild(grid);
      container.appendChild(section);
      return;
    }

    data.portfolio.units.forEach((unit) => {
      const section = document.createElement("section");
      section.className = "section";

      const title = document.createElement("h2");
      title.className = "section-title";
      title.textContent = unit.title || "";

      const subtitle = document.createElement("p");
      subtitle.className = "section-subtitle";
      subtitle.textContent = unit.subtitle || "";

      const grid = document.createElement("div");
      grid.className = "grid";

      if (Array.isArray(unit.projects)) {
        unit.projects.forEach((project) => {
          const card = document.createElement("article");
          card.className = "card";

          const cardTitle = document.createElement("h3");
          cardTitle.textContent = project.title || "";

          const desc = document.createElement("p");
          desc.textContent = project.description || "";

          const reflection = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = "Reflection:";
          reflection.appendChild(strong);
          reflection.appendChild(document.createTextNode(` ${project.reflection || ""}`));

          card.appendChild(cardTitle);
          card.appendChild(desc);
          card.appendChild(reflection);
          grid.appendChild(card);
        });
      }

      section.appendChild(title);
      section.appendChild(subtitle);
      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function buildReflectionEntries(data) {
    const container = document.getElementById("reflection-entries");
    if (!container || !data.reflection || !Array.isArray(data.reflection.entries)) {
      return;
    }

    container.innerHTML = "";

    if (data.reflection.entries.length === 0) {
      const item = document.createElement("article");
      item.className = "timeline-item construction-card";

      const tag = document.createElement("div");
      tag.className = "construction-tag";
      tag.textContent = "Under Construction";

      const title = document.createElement("h4");
      title.textContent = data.reflection.emptyTitle || "Reflection Under Construction";

      const message = document.createElement("p");
      message.textContent = data.reflection.emptyMessage || "Reflection entries will be added later.";

      item.appendChild(tag);
      item.appendChild(title);
      item.appendChild(message);
      container.appendChild(item);
      return;
    }

    data.reflection.entries.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "timeline-item";

      const title = document.createElement("h4");
      title.textContent = entry.title || "";

      const learned = document.createElement("p");
      learned.innerHTML = `<strong>What did I learn?</strong> ${entry.learned || ""}`;

      const wentWell = document.createElement("p");
      wentWell.innerHTML = `<strong>What went well?</strong> ${entry.wentWell || ""}`;

      const challenging = document.createElement("p");
      challenging.innerHTML = `<strong>What was challenging?</strong> ${entry.challenging || ""}`;

      item.appendChild(title);
      item.appendChild(learned);
      item.appendChild(wentWell);
      item.appendChild(challenging);
      container.appendChild(item);
    });
  }

  async function init() {
    try {
      const response = await fetch("content.json", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setTextContent(data);
      setListContent(data);
      setPillLists(data);
      setCardLists(data);
      setRotatingText(data);
      buildPortfolioSections(data);
      buildReflectionEntries(data);
    } catch (error) {
      console.error("Failed to load content.json", error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
