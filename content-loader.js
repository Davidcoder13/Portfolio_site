(function () {
  function get(obj, path) {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  function setText(data) {
    document.querySelectorAll('[data-text]').forEach((el) => {
      const value = get(data, el.dataset.text);
      if (value !== undefined && value !== null) {
        el.textContent = value;
      }
    });
  }

  function setList(data) {
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

  function setPills(data) {
    document.querySelectorAll('[data-pill-list]').forEach((el) => {
      let items = get(data, el.dataset.pillList);
      if (!Array.isArray(items)) {
        items = [data.global.grade, data.global.school, data.global.course].filter(Boolean);
      }

      el.innerHTML = '';
      items.forEach((item) => {
        const span = document.createElement('span');
        span.className = 'meta-pill';
        span.textContent = item;
        el.appendChild(span);
      });
    });
  }

  function setCards(data) {
    document.querySelectorAll('[data-card-list]').forEach((el) => {
      const items = get(data, el.dataset.cardList);
      if (!Array.isArray(items)) return;

      el.innerHTML = '';
      items.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = item.title || '';

        const text = document.createElement('p');
        text.className = 'lead';
        text.textContent = item.text || '';

        card.appendChild(title);
        card.appendChild(text);
        el.appendChild(card);
      });
    });
  }

  function rotateWords(data) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('[data-rotate]').forEach((el) => {
      const words = get(data, el.dataset.rotate);
      if (!Array.isArray(words) || words.length === 0) return;

      let index = 0;
      el.textContent = words[index];
      if (reduced || words.length < 2) return;

      setInterval(() => {
        index = (index + 1) % words.length;
        el.textContent = words[index];
      }, 2300);
    });
  }

  function buildPortfolio(data) {
    const mount = document.getElementById('portfolio-list');
    if (!mount) return;

    mount.innerHTML = '';
    const projects = data.portfolio && Array.isArray(data.portfolio.projects) ? data.portfolio.projects : [];

    projects.forEach((project) => {
      const card = document.createElement('article');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = project.title || '';

      const description = document.createElement('p');
      description.className = 'lead';
      description.textContent = project.description || '';

      const reflection = document.createElement('p');
      reflection.className = 'lead';
      reflection.innerHTML = `<strong>Reflection:</strong> ${project.reflection || ''}`;

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(reflection);
      mount.appendChild(card);
    });
  }

  function buildReflections(data) {
    const mount = document.getElementById('reflection-list');
    if (!mount) return;

    mount.innerHTML = '';
    const entries = data.reflection && Array.isArray(data.reflection.entries) ? data.reflection.entries : [];

    entries.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = entry.title || '';

      const learned = document.createElement('p');
      learned.className = 'lead';
      learned.innerHTML = `<strong>What did I learn?</strong> ${entry.learned || ''}`;

      const wentWell = document.createElement('p');
      wentWell.className = 'lead';
      wentWell.innerHTML = `<strong>What went well?</strong> ${entry.wentWell || ''}`;

      const challenging = document.createElement('p');
      challenging.className = 'lead';
      challenging.innerHTML = `<strong>What was challenging?</strong> ${entry.challenging || ''}`;

      card.appendChild(title);
      card.appendChild(learned);
      card.appendChild(wentWell);
      card.appendChild(challenging);
      mount.appendChild(card);
    });
  }

  function setFooter(data) {
    document.querySelectorAll('[data-template="footer"]').forEach((el) => {
      el.textContent = `${data.global.name} • ${data.global.course} • ${data.global.email}`;
    });
  }

  async function init() {
    try {
      const response = await fetch('content.json', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();

      setText(data);
      setList(data);
      setPills(data);
      setCards(data);
      rotateWords(data);
      buildPortfolio(data);
      buildReflections(data);
      setFooter(data);
    } catch (error) {
      console.error('Failed to load content.', error);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
