let hcaptchaWidgetId = null;

  function renderHCaptcha(size) {
    const container = document.getElementById('hcaptcha');
      if (hcaptchaWidgetId !== null) {
    try {
      hcaptcha.remove(hcaptchaWidgetId);
    } catch (e) {
      console.warn("Failed to remove hCaptcha widget:", e);
    }
    hcaptchaWidgetId = null;
  }
    container.innerHTML = ''; // clear existing
    hcaptchaWidgetId = hcaptcha.render('hcaptcha', {
      sitekey: '3c4c7004-54bc-4b54-ac4a-cf5a6e5eeb28',
      size: size
    });
  }

  function resizeHCaptcha() {
    let size = window.innerWidth <= 385 ? 'compact' : 'normal';
    renderHCaptcha(size);
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeHCaptcha, 100);
  });
  window.addEventListener('DOMContentLoaded', () => {
    resizeHCaptcha()
    window.resizeBy(0,0.1)
  })