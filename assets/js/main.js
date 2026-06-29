(() => {
  const PROJECT_TAG_LIBRARY = {
    TEMP_TAG: '#tag',
    Industrial_Design: '#工业设计',
    Product_Design: '#产品设计',
    Innovative_Design: '#创新设计',
    Emotion_aware_nteraction: '#情绪感知交互',
    Assistive_Interaction: '#辅助交互',
    Wearable_Sensing_System: '#可穿戴感知系统',
  };

  const PROJECTS = [
    {
      img: 'assets/images/p1.png',
      titleKey: 'projects.item1.title',
      descKey: 'projects.item1.desc',
      tags: [
        PROJECT_TAG_LIBRARY.Emotion_aware_nteraction,
        PROJECT_TAG_LIBRARY.Assistive_Interaction,
        PROJECT_TAG_LIBRARY.Wearable_Sensing_System,
      ],
      link: 'pages/projects/project1.html',
    },
    {
      img: 'assets/images/preparing.png',
      titleKey: 'projects.item2.title',
      descKey: 'projects.item2.desc',
      tags: [
        PROJECT_TAG_LIBRARY.TEMP_TAG,
        PROJECT_TAG_LIBRARY.TEMP_TAG,
        PROJECT_TAG_LIBRARY.TEMP_TAG,
        PROJECT_TAG_LIBRARY.TEMP_TAG,
      ],
      link: 'pages/projects/project2.html',
    },
    {
      img: 'assets/images/preparing.png',
      titleKey: 'projects.item3.title',
      descKey: 'projects.item3.desc',
      tags: [
        PROJECT_TAG_LIBRARY.TEMP_TAG,
        PROJECT_TAG_LIBRARY.TEMP_TAG,
        PROJECT_TAG_LIBRARY.TEMP_TAG,
        PROJECT_TAG_LIBRARY.TEMP_TAG,
        PROJECT_TAG_LIBRARY.TEMP_TAG,
      ],
      link: 'pages/projects/project3.html',
    },
  ];

  const CONTACT_LINKS = [
    { icon: 'fab fa-weixin', key: 'contact.weixin', link: '#' },
    { icon: 'fas fa-envelope', key: 'contact.envelope', link: 'mailto:123456789@qq.com' },
    { icon: 'fas fa-phone', key: 'contact.phone', link: 'tel:13800138000' },
    { icon: 'fas fa-globe', key: 'contact.globe', link: 'https://my.bjut.edu.cn/page/site/index' },
  ];

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function clear(el) {
    if (!el) return;
    el.innerHTML = '';
  }

  function t(key) {
    return window.i18n?.get ? window.i18n.get(key) : key;
  }

  function renderSpanTags(tags, className) {
    if (!Array.isArray(tags)) return '';
    return tags.map((tag) => `<span class="${className}">${tag}</span>`).join('');
  }

  function renderProjectTags(tags) {
    if (!Array.isArray(tags)) return '';
    return `<div class="project-tags">${renderSpanTags(tags, 'project-tag')}</div>`;
  }

  function initThemeToggle() {
    const toggleBtn = qs('.theme-toggle');
    const htmlEl = document.documentElement;
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);

    toggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      console.log(`[Theme] Switched to ${newTheme}`);
    });
  }

  function initLangToggle() {
    const toggleBtn = qs('.lang-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const current = window.i18n.currentLang();
      const next = current === 'en' ? 'zh' : 'en';
      console.log(`[Lang] Switching to ${next}...`);
      window.i18n.changeLang(next);
    });
  }

  function initProjects() {
    const grid = qs('.projects-grid');
    if (!grid) return;
    clear(grid);

    PROJECTS.forEach((project) => {
      const tagsHtml = renderProjectTags(project.tags);

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="project-thumbnail-wrapper">
          <img src="${project.img}" alt="${t('projects.imgAlt')}" class="project-thumbnail">
        </div>
        <div class="project-info">
          <h3>${t(project.titleKey)}</h3>
          <p>${t(project.descKey)}</p>
          ${tagsHtml}
          <a href="${project.link}" class="project-link">${t('projects.viewDetail')}</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function initContactLinks() {
    const container = qs('.intro-contact-links');
    if (!container) return;
    clear(container);

    CONTACT_LINKS.forEach((contact) => {
      const label = t(contact.key);
      const item = document.createElement('a');
      item.className = 'intro-contact-link';
      item.href = contact.link;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
      item.title = label;
      item.setAttribute('aria-label', label);
      item.innerHTML = `<i class="${contact.icon}"></i>`;
      container.appendChild(item);
    });
  }

  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        let target;
        try {
          target = qs(href);
        } catch {
          return;
        }

        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  function initRevealMotion() {
    const targets = [
      ...qsa('.project-detail-card'),
      ...qsa('.projects-grid .card'),
      ...qsa('.opensource-grid .os-card'),
      ...qsa('.timeline-container .timeline-item'),
      ...qsa('.skills-wrapper .skill-category'),
    ];

    if (!targets.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targets.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${(index % 6) * 60}ms`);
    });

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    targets.forEach((el) => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLangToggle();
    initSmoothScroll();
  });

  window.addEventListener('i18nLoaded', () => {
    console.log('[main] i18n loaded, rendering content...');
    initProjects();
    initContactLinks();
    initRevealMotion();
  });
})();
