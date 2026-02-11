(function () {
  function get(obj, path) {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  function fillText(data) {
    document.querySelectorAll('[data-text]').forEach((el) => {
      const v = get(data, el.dataset.text);
      if (v !== undefined && v !== null) el.textContent = v;
    });
  }

  function fillLists(data) {
    document.querySelectorAll('[data-list]').forEach((el) => {
      let items = get(data, el.dataset.list);
      if (el.dataset.list === 'contact.full') {
        items = [`Email: ${data.global.email}`, `Phone: ${data.global.phone}`];
      }
      if (!Array.isArray(items)) items = [];
      el.innerHTML = '';
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        el.appendChild(li);
      });
    });
  }

  function fillCardLists(data) {
    document.querySelectorAll('[data-card-list]').forEach((el) => {
      const items = get(data, el.dataset.cardList);
      if (!Array.isArray(items)) return;
      el.innerHTML = '';
      items.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `<h3>${item.title || ''}</h3><p>${item.text || ''}</p>`;
        el.appendChild(card);
      });
    });
  }

  function rotateWords(data) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-rotate]').forEach((el) => {
      const words = get(data, el.dataset.rotate);
      if (!Array.isArray(words) || words.length === 0) return;
      let i = 0;
      el.textContent = words[0];
      if (reduce || words.length < 2) return;
      setInterval(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
      }, 2200);
    });
  }

  function buildPortfolio(data) {
    const mount = document.getElementById('portfolio-list');
    if (!mount) return;
    mount.innerHTML = '';
    (data.portfolio.projects || []).forEach((p) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p><p><strong>Reflection:</strong> ${p.reflection}</p>`;
      mount.appendChild(card);
    });
  }

  function buildReflections(data) {
    const mount = document.getElementById('reflection-list');
    if (!mount) return;
    mount.innerHTML = '';
    (data.reflection.entries || []).forEach((e) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `<h3>${e.title}</h3><p><strong>What did I learn?</strong> ${e.learned}</p><p><strong>What went well?</strong> ${e.wentWell}</p><p><strong>What was challenging?</strong> ${e.challenging}</p>`;
      mount.appendChild(card);
    });
  }

  function footer(data) {
    document.querySelectorAll('[data-template="footer"]').forEach((el) => {
      el.textContent = `${data.global.name} • ${data.global.course} • ${data.global.email}`;
    });
  }

  async function init() {
    const res = await fetch('content.json', { cache: 'no-store' });
    const data = await res.json();
    fillText(data);
    fillLists(data);
    fillCardLists(data);
    rotateWords(data);
    buildPortfolio(data);
    buildReflections(data);
    footer(data);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
