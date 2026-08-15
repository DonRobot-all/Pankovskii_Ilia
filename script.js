// ══════════════════════════════════════════════════════════
// Мобильное меню
// ══════════════════════════════════════════════════════════
const navToggle = document.getElementById('navToggle');
const sidenav = document.getElementById('sidenav');
navToggle.addEventListener('click', () => {
  const open = sidenav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
sidenav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => sidenav.classList.remove('open'));
});

// ══════════════════════════════════════════════════════════
// Кнопка «Скачать PDF»
// ══════════════════════════════════════════════════════════
const pdfBtn = document.getElementById('pdfBtn');
if (pdfBtn){
  pdfBtn.addEventListener('click', () => window.print());
}

// ══════════════════════════════════════════════════════════
// Прогресс-бар чтения
// ══════════════════════════════════════════════════════════
const progressFill = document.getElementById('progressFill');
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressFill.style.width = pct + '%';
}

function revealIfNearBottom(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0 || scrollTop >= docHeight - 4){
    document.querySelectorAll('.section, .hero').forEach(sec => sec.classList.add('in-view'));
  }
}
window.addEventListener('scroll', () => { updateProgress(); revealIfNearBottom(); }, { passive: true });
window.addEventListener('resize', revealIfNearBottom);
updateProgress();
revealIfNearBottom();

// ══════════════════════════════════════════════════════════
// Подсветка активного пункта меню + анимация появления секций
// ══════════════════════════════════════════════════════════
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.sidenav-list a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = document.querySelector(`.sidenav-list a[href="#${id}"]`);
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      if (link){
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { rootMargin: '-35% 0px -20% 0px', threshold: 0 });

sections.forEach(sec => sectionObserver.observe(sec));

// ══════════════════════════════════════════════════════════
// Лайтбокс — увеличенный просмотр по клику на фото
// ══════════════════════════════════════════════════════════
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt){
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox(); // клик по тёмному фону, не по фото
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

const GALLERY_CONFIG = {
  expGallery: {
    items: [
      { src: 'assets/photos/Shistrik.jpg', alt: 'Фотография с конкурса' },
      { src: 'assets/photos/Shistrik2.jpg', alt: 'Фотография с конкурса' },
      { src: 'assets/photos/Shistrik3.jpg', alt: 'Фотография с конкурса' },
      { src: 'assets/photos/WRO1.jpg', alt: 'Фотография с конкурса' },
    ],
    emptyLabel: 'Фото с занятий и проектов скоро появятся здесь'
  },
  certGallery: {
    items: [
      { src: 'assets/certificates/Sert.jpg', alt: 'Сертификат'},
      { src: 'assets/certificates/Blag.jpg', alt: 'Благодарность'},
      { src: 'assets/certificates/Blag2.jpg', alt: 'Благодарность 2'},
      { src: 'assets/certificates/Blag3.jpg', alt: 'Благодарность 3'},
      { src: 'assets/diplomas/Deutsch.png', alt: 'Немецкий'},
      { src: 'assets/diplomas/Yandex.png', alt: 'Яндекс'},
    ],
    emptyLabel: 'Сканы дипломов и сертификатов скоро появятся здесь'
  }
};

function renderGallery(containerId, config){
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (config.items.length === 0){
    const ph = document.createElement('div');
    ph.className = 'gallery-item';
    ph.innerHTML = `<div class="gallery-placeholder">${config.emptyLabel}</div>`;
    container.appendChild(ph);
    return;
  }

  config.items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'gallery-item';
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || '';
    img.loading = 'lazy';
    img.addEventListener('click', () => openLightbox(item.src, item.alt));
    el.appendChild(img);
    container.appendChild(el);
  });
}

Object.entries(GALLERY_CONFIG).forEach(([containerId, config]) => {
  renderGallery(containerId, config);
});
