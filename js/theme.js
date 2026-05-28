// Dark/Light Mode Manager for ElectionGuide India

(function () {
  // Apply theme immediately to prevent light-flash
  const storedTheme = localStorage.getItem('theme') || 'light';
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcons();
  setupLanguageSelector();
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Switch theme logic
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  updateThemeIcons();

  // Custom event so specific pages (like dashboard chart) can listen and redraw
  window.dispatchEvent(new Event('themeChanged'));

  if (typeof showToast === 'function') {
    const activeLang = localStorage.getItem('voterLang') || 'en';
    const text = isDark ?
      (activeLang === 'hi' ? "डार्क मोड सक्रिय" : "Dark Mode Activated") :
      (activeLang === 'hi' ? "लाइट मोड सक्रिय" : "Light Mode Activated");
    showToast(text, 'info');
  }
}

// Update sun/moon icons
function updateThemeIcons() {
  const headerLogo = document.getElementById('header-logo');
  const footerLogo = document.getElementById('footer-logo');
  const themeInput = document.getElementById('input');

  const isDark = document.documentElement.classList.contains('dark');

  if (themeInput) {
    themeInput.checked = isDark;
  }

  // Swapping logos based on theme
  if (headerLogo) {
    headerLogo.src = isDark ? 'eci-logo-white.svg' : 'eci-logo-white.png';
  }
  if (footerLogo) {
    footerLogo.src = isDark ? 'eci-logo-white.svg' : 'eci-logo-white.png';
  }
}

// Translation & Language Selection System
function setupLanguageSelector() {
  // Find language dropdown
  const langSelect = document.getElementById('language-select');
  if (!langSelect) return;

  // Load saved language
  const savedLang = storage.getLanguage();
  langSelect.value = savedLang;

  // Setup Google Translate
  initGoogleTranslateWidget();

  // Translate on load
  translatePageElements(savedLang);

  // Listen for changes
  langSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    storage.saveLanguage(lang);
    translatePageElements(lang);
    syncGoogleTranslate(lang);
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Custom event to update page-specific texts
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));

    if (typeof showToast === 'function') {
      const msgs = {
        en: "Language changed to English",
        hi: "भाषा बदलकर हिंदी की गई",
        ta: "மொழி தமிழாக மாற்றப்பட்டது",
        ml: "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി",
        kn: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ"
      };
      showToast(msgs[lang] || msgs.en, 'success');
    }
  });
}

// Translates DOM elements with data-i18n attributes safely preserving icons and children
function translatePageElements(lang) {
  const transDict = electionData.translations[lang] || electionData.translations.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (transDict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', transDict[key]);
      } else {
        // Safe translation: only replace text nodes to preserve nested icons (like Lucide <i> tags)
        let hasTextNode = false;
        for (let child of el.childNodes) {
          if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
            child.textContent = transDict[key];
            hasTextNode = true;
            break;
          }
        }
        // If there was no direct text node (e.g. whitespace only), try to translate a nested span if present
        if (!hasTextNode) {
          const spanText = el.querySelector('span');
          if (spanText) {
            spanText.innerText = transDict[key];
          } else {
            // Fallback for simple elements with no children
            el.innerText = transDict[key];
          }
        }
      }
    }
  });
}

// Dynamic Google Translate Integration
function initGoogleTranslateWidget() {
  // Create hidden translate container if missing
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  // Setup global callback
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,hi,ta,ml,kn',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');

    // After loading, make sure it reflects active lang choice if not English
    const currentLang = storage.getLanguage();
    if (currentLang !== 'en') {
      setTimeout(() => {
        const select = document.querySelector('select.goog-te-combo');
        if (select) {
          select.value = currentLang;
          select.dispatchEvent(new Event('change'));
        }
      }, 500);
    }
  };

  // Add Google Translate script
  if (!document.querySelector('script[src*="translate.google.com"]')) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }
}

function syncGoogleTranslate(lang) {
  // Delete cookie to clear previous state
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";

  if (lang !== 'en') {
    const cookieVal = `/en/${lang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`;
  }

  const selectEl = document.querySelector('select.goog-te-combo');
  if (selectEl) {
    selectEl.value = lang;
    selectEl.dispatchEvent(new Event('change'));
  } else {
    // Fallback page refresh to let Google Translate initialize with the updated cookie
    setTimeout(() => {
      const selectRetry = document.querySelector('select.goog-te-combo');
      if (selectRetry) {
        selectRetry.value = lang;
        selectRetry.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    }, 800);
  }
}

