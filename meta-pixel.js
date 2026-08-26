// Meta Pixel consent and loading for Siesta Free Ride.
(() => {
  const PIXEL_ID = '1055880024080450';
  const CONSENT_KEY = 'sfr_meta_pixel_consent_v1';
  const BANNER_ID = 'sfr-meta-consent';

  let pixelLoaded = false;

  function hasGlobalPrivacyControl() {
    return navigator.globalPrivacyControl === true;
  }

  function getConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // The visitor can still make a choice for the current page view.
    }
  }

  function loadPixel() {
    if (pixelLoaded || hasGlobalPrivacyControl()) return;
    pixelLoaded = true;

    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function ensureStyles() {
    if (document.getElementById('sfr-meta-consent-styles')) return;
    const style = document.createElement('style');
    style.id = 'sfr-meta-consent-styles';
    style.textContent = `
      #${BANNER_ID} {
        position: fixed;
        z-index: 2147483647;
        right: 18px;
        bottom: 18px;
        width: min(440px, calc(100vw - 36px));
        box-sizing: border-box;
        padding: 18px;
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 16px;
        background: #132f3b;
        color: #fff;
        box-shadow: 0 18px 50px rgba(0,0,0,.32);
        font: 15px/1.5 Inter, Arial, sans-serif;
      }
      #${BANNER_ID}[hidden] { display: none; }
      #${BANNER_ID} strong { display: block; margin-bottom: 5px; font-size: 17px; }
      #${BANNER_ID} p { margin: 0 0 14px; color: rgba(255,255,255,.88); }
      #${BANNER_ID} a { color: #ffd34e; }
      #${BANNER_ID} .sfr-meta-actions { display: flex; flex-wrap: wrap; gap: 9px; }
      #${BANNER_ID} button {
        min-height: 42px;
        padding: 9px 16px;
        border: 1px solid rgba(255,255,255,.42);
        border-radius: 999px;
        background: transparent;
        color: #fff;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      #${BANNER_ID} button[data-choice="accept"] {
        border-color: #ffd34e;
        background: #ffd34e;
        color: #132f3b;
      }
      .sfr-privacy-choices {
        margin-left: .45rem;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-decoration: underline;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  function createBanner() {
    let banner = document.getElementById(BANNER_ID);
    if (banner) return banner;

    ensureStyles();
    banner = document.createElement('section');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Advertising privacy choices');
    banner.innerHTML = `
      <strong>Your privacy choices</strong>
      <p>We use the Meta Pixel to understand website visits and show more relevant Facebook and Instagram ads. You can accept or decline this advertising tracking. <a href="/privacy.html">Privacy policy</a>.</p>
      <div class="sfr-meta-actions">
        <button type="button" data-choice="accept">Accept</button>
        <button type="button" data-choice="decline">Decline</button>
      </div>
    `;

    banner.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-choice]');
      if (!button) return;
      const choice = button.dataset.choice;
      setConsent(choice);
      banner.hidden = true;
      if (choice === 'accept') loadPixel();
    });

    document.body.appendChild(banner);
    return banner;
  }

  function showBanner() {
    if (hasGlobalPrivacyControl()) return;
    const banner = createBanner();
    banner.hidden = false;
    banner.querySelector('button')?.focus({ preventScroll: true });
  }

  function addPrivacyChoicesControl() {
    const footer = document.querySelector('.footer-bottom, footer, .site-footer');
    if (!footer || footer.querySelector('.sfr-privacy-choices')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sfr-privacy-choices';
    button.textContent = 'Privacy choices';
    button.addEventListener('click', showBanner);
    footer.appendChild(button);
  }

  function initialize() {
    addPrivacyChoicesControl();
    if (hasGlobalPrivacyControl()) return;

    const consent = getConsent();
    if (consent === 'accept') {
      loadPixel();
    } else if (consent !== 'decline') {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
