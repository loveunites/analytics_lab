'use strict';
// Google Tag устанавливается отдельно в head каждой HTML-страницы.
(() => {
  const leadForm = document.querySelector('#lead-form');
  if (!leadForm) return;
  const params = new URLSearchParams(window.location.search);
  const defaults = {utm_source:'direct', utm_medium:'none', utm_campaign:'not_set'};
  for (const [key, fallback] of Object.entries(defaults)) {
    leadForm.elements.namedItem(key).value = params.get(key)?.trim() || fallback;
  }
  const requestId = leadForm.elements.namedItem('request_id');
  leadForm.addEventListener('submit', event => {
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(leadForm.action)) {
      event.preventDefault();
      document.querySelector('#form-status').textContent = 'Сначала укажите URL опубликованного Apps Script Web App.';
      return;
    }
    if (!requestId.value) requestId.value = 'REQ-' + crypto.randomUUID().toUpperCase();
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {lead_source:'contact_form'});
    }
    document.querySelector('#form-status').textContent =
      'POST отправляется. Подтвердите сохранение по request_id в таблице: ' + requestId.value;
  });
  leadForm.addEventListener('reset', () => {
    setTimeout(() => {
      requestId.value = '';
      for (const [key, fallback] of Object.entries(defaults)) {
        leadForm.elements.namedItem(key).value = params.get(key)?.trim() || fallback;
      }
      document.querySelector('#form-status').textContent = 'Можно заполнить новую заявку.';
    }, 0);
  });
})();

const programCta = document.querySelector('#program-cta');
if (programCta) {
  programCta.addEventListener('click', () => {
    document.querySelector('#program-preview').hidden = false;
    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', {
        button_name: 'program',
        page_section: 'hero'
      });
    }
  });
}

