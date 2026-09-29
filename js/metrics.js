'use strict';

const sendEvent = (eventName, parameters = {}) => {
  if (typeof gtag === 'function') {
    gtag('event', eventName, parameters);
  }
};

// 1. Клик по пункту меню
document.querySelectorAll('nav a, header a').forEach((link) => {
  link.addEventListener('click', () => {
    sendEvent('nav_click', {
      link_text: link.textContent.trim(),
      link_url: link.href
    });
  });
});

// 2. Визит по UTM-ссылке
const params = new URLSearchParams(window.location.search);
const utmSource = params.get('utm_source');
const utmMedium = params.get('utm_medium');
const utmCampaign = params.get('utm_campaign');

if (utmSource || utmMedium || utmCampaign) {
  sendEvent('utm_visit', {
    utm_source: utmSource || '(not set)',
    utm_medium: utmMedium || '(not set)',
    utm_campaign: utmCampaign || '(not set)',
    landing_page: window.location.href
  });
}

// 3. Посещение страницы не менее 30 секунд
setTimeout(() => {
  sendEvent('read_30s', {
    page_location: window.location.href,
    page_title: document.title
  });
}, 30000);

// 4. Ошибка проверки формы
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('invalid', () => {
    sendEvent('form_error', {
      form_id: form.id || '(no id)',
      page_location: window.location.href
    });
  }, true);
});
