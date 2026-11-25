/* Castix public display inventory; Google-managed consent messaging. */
(() => {
  'use strict';
  const config = Object.freeze({ enabled: true, minThemes: 5, client: 'ca-pub-8266760443476569', slot: '6838366232' });
  let requested = false;
  function supportedBrowser() {
    const tg = window.Telegram?.WebApp;
    const params = new URLSearchParams(location.search.slice(1) + '&' + location.hash.slice(1));
    return location.protocol === 'https:' && location.hostname === 'castix.siwane.xyz' &&
      !tg?.initData && (!tg?.platform || tg.platform === 'unknown') &&
      !Array.from(params.keys()).some(key => /^tgWebApp/i.test(key)) &&
      !/Telegram|WebView|; wv\)/i.test(navigator.userAgent);
  }
  // Public inventory only; Google tag handles its own consent messaging.
  function mount(container, { publicThemeCount = 0 } = {}) {
    if (!config.enabled || requested || !supportedBrowser() ||
        !Number.isInteger(publicThemeCount) || publicThemeCount < config.minThemes ||
        !(container instanceof HTMLElement) || !container.isConnected) return false;
    container.dataset.adState = 'pending';
    requested = true;
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = config.client;
    ad.dataset.adSlot = config.slot;
    ad.dataset.adFormat = 'auto';
    ad.dataset.fullWidthResponsive = 'true';
    const label = document.createElement("small");
    label.textContent = document.documentElement.lang === "ar" ? "إعلانات" : "Advertisements";
    container.append(label, ad);
    const observer = new MutationObserver(() => {
      if (ad.dataset.adStatus === 'unfilled') { observer.disconnect(); container.dataset.adState = 'unfilled'; container.hidden = true; }
      else if (ad.dataset.adStatus === 'filled') { container.dataset.adState = 'filled'; observer.disconnect(); }
    });
    observer.observe(ad, { attributes: true, attributeFilter: ['data-ad-status'] });
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + config.client;
    script.onload = () => { try { container.hidden = false; (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { observer.disconnect(); container.dataset.adState = 'error'; container.hidden = true; } };
    script.onerror = () => { observer.disconnect(); container.dataset.adState = 'error'; container.hidden = true; };
    document.head.append(script);
    return true;
  }
  // Google AdSense tag integrates with the published Google Privacy & Messaging CMP.
  // Do not fabricate consent or override Google consent signals.
  function prepare(container, count) {
    if (!config.enabled || !supportedBrowser() || count < config.minThemes || requested) return false;
    return mount(container, { publicThemeCount: count });
  }
  window.CastixAds = Object.freeze({ mount, prepare });
})();
