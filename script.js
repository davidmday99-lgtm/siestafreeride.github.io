// Microsoft Clarity analytics for Siesta Free Ride.
(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r);
  t.async = 1;
  t.src = `https://www.clarity.ms/tag/${i}`;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, 'clarity', 'script', 'y71ndwnq8q');

// Google Analytics 4 for Siesta Free Ride.
(function (window, document, measurementId) {
  const googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(googleTag);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
})(window, document, 'G-909TD54W5S');

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');

// Add a consistent Beaches submenu without duplicating markup across every page.
const beachesLink = nav
  ? [...nav.children].find((item) => item.matches('a') && item.textContent.trim().toLowerCase() === 'beaches')
  : null;

if (beachesLink) {
  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown';
  beachesLink.before(dropdown);
  dropdown.append(beachesLink);

  const dropdownToggle = document.createElement('button');
  dropdownToggle.className = 'nav-dropdown-toggle';
  dropdownToggle.type = 'button';
  dropdownToggle.setAttribute('aria-expanded', 'false');
  dropdownToggle.setAttribute('aria-label', 'Show Beaches links');
  dropdownToggle.innerHTML = '<span aria-hidden="true">▾</span>';
  dropdown.append(dropdownToggle);

  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'nav-dropdown-menu';
  dropdownMenu.innerHTML = `
    <a href="${beachesLink.href}"><span>Explore</span>Beach guide</a>
    <a href="${beachesLink.href.split('#')[0]}#live-views"><span>Watch</span>Live beach views</a>
  `;
  dropdown.append(dropdownMenu);

  let dropdownPinned = false;
  let dropdownCloseTimer;

  dropdown.addEventListener('mouseenter', () => {
    window.clearTimeout(dropdownCloseTimer);
    dropdown.classList.add('open');
  });

  dropdown.addEventListener('mouseleave', () => {
    if (dropdownPinned) return;
    dropdownCloseTimer = window.setTimeout(() => {
      dropdown.classList.remove('open');
    }, 250);
  });

  dropdownToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdownPinned = !dropdownPinned;
    dropdown.classList.toggle('open', dropdownPinned);
    dropdownToggle.setAttribute('aria-expanded', String(dropdownPinned));
  });

  document.addEventListener('click', (event) => {
    if (dropdown.contains(event.target)) return;
    dropdownPinned = false;
    dropdown.classList.remove('open');
    dropdownToggle.setAttribute('aria-expanded', 'false');
  });
}

toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  nav.classList.remove('open');
  nav.querySelector('.nav-dropdown')?.classList.remove('open');
  nav.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-expanded', 'false');
});

window.addEventListener('pageshow', () => {
  nav?.classList.remove('open');
  nav?.querySelector('.nav-dropdown')?.classList.remove('open');
  nav?.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-expanded', 'false');
});

const footerQuickLinks = [...document.querySelectorAll('.footer-label')]
  .find((label) => label.textContent.trim().toLowerCase() === 'quick links')
  ?.parentElement;

if (footerQuickLinks) {
  footerQuickLinks.classList.add('footer-quick-links');
  const isDailyReport = window.location.pathname.includes('/blog/');
  const prefix = isDailyReport ? '../' : '';

  if (!footerQuickLinks.querySelector('a[href$="photos.html"]')) {
    const photosLink = document.createElement('a');
    photosLink.href = `${prefix}photos.html`;
    photosLink.textContent = 'Photos';
    const advertiseLink = [...footerQuickLinks.querySelectorAll('a')]
      .find((link) => link.textContent.trim().toLowerCase() === 'advertise');
    const bookLink = [...footerQuickLinks.querySelectorAll('a')]
      .find((link) => link.textContent.trim().toLowerCase() === 'book a ride');
    footerQuickLinks.insertBefore(photosLink, advertiseLink || bookLink || null);
  }

  if (!footerQuickLinks.querySelector('.footer-save')) {
    const saveLink = document.createElement('a');
    saveLink.className = 'footer-save';
    saveLink.href = `${prefix}contact.html#save-contact`;
    saveLink.textContent = 'Save Contact';
    footerQuickLinks.append(saveLink);
  }

  if (document.querySelector('.advertise-page')) {
    const footerTop = footerQuickLinks.closest('.footer-top');
    const partners = document.querySelector('.site-footer .partners');
    footerTop?.classList.add('footer-top-compact');
    footerQuickLinks.classList.add('section-shell', 'footer-quick-row');
    partners?.insertAdjacentElement('afterend', footerQuickLinks);
  }
}
