(async function () {
  const byId = (id) => document.getElementById(id);

  function renderList(id, items) {
    const el = byId(id);
    if (!el) return;
    el.innerHTML = "";
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      el.appendChild(li);
    });
  }

  function rotateText(el, words) {
    if (!el || !Array.isArray(words) || words.length === 0) return;
    let i = 0;
    el.textContent = words[i];
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
    }, 2400);
  }

  const res = await fetch("content.json", { cache: "no-store" });
  const data = await res.json();

  byId("name").textContent = data.global.name;
  byId("footer-name").textContent = data.global.name;
  byId("kicker").textContent = data.home.kicker;
  byId("title-lead").textContent = data.home.titleLead;
  byId("welcome").textContent = data.home.welcome;
  rotateText(byId("title-rotate"), data.home.titleRotate);

  const highlights = byId("highlights");
  if (highlights) {
    highlights.innerHTML = "";
    data.home.highlights.forEach((h) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<h3>${h.title}</h3><p class="lead">${h.text}</p>`;
      highlights.appendChild(card);
    });
  }

  const aboutIntro = byId("about-intro");
  if (aboutIntro) aboutIntro.textContent = data.about.intro;
  const aboutFocus = byId("about-focus");
  if (aboutFocus) aboutFocus.textContent = data.about.focus;
  renderList("interests", data.about.interests);
  renderList("favourites", data.about.favourites);

  const portIntro = byId("portfolio-intro");
  if (portIntro) portIntro.textContent = data.portfolio.intro;
  const projects = byId("projects");
  if (projects) {
    projects.innerHTML = "";
    data.portfolio.projects.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<h3>${p.title}</h3><p class="lead">${p.description}</p><p><strong>Reflection:</strong> ${p.reflection}</p>`;
      projects.appendChild(card);
    });
  }

  const refIntro = byId("reflection-intro");
  if (refIntro) refIntro.textContent = data.reflection.intro;
  const refSkills = byId("reflection-skills");
  if (refSkills) refSkills.textContent = data.reflection.skills;
  const entries = byId("entries");
  if (entries) {
    entries.innerHTML = "";
    data.reflection.entries.forEach((e) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<h3>${e.title}</h3><p><strong>What did I learn?</strong> ${e.learned}</p><p><strong>What went well?</strong> ${e.wentWell}</p><p><strong>What was challenging?</strong> ${e.challenging}</p>`;
      entries.appendChild(card);
    });
  }

  const contact = byId("contact");
  if (contact) {
    contact.innerHTML = `<li>Email: ${data.global.email}</li><li>Phone: ${data.global.phone}</li><li>${data.global.school}</li><li>${data.global.grade}</li>`;
  }
})();
