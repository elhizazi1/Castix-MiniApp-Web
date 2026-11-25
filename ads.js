/* Castix display inventory. Disabled until public inventory and consent are ready. */
(() => {
  'use strict';
  const config = Object.freeze({ enabled: false, minThemes: 5, client: 'ca-pub-8266760443476569', slot: '6838366232' });
  let requested = false;
  function supportedBrowser() {
    const tg = window.Telegram?.WebApp;
    const params = new URLSearchParams(location.search.slice(1) + '&' + location.hash.slice(1));
    return location.protocol === 'https:' && location.hostname === 'castix.siwane.xyz' &&
      !tg?.initData && (!tg?.platform || tg.platform === 'unknown') &&
      !Array.from(params.keys()).some(key => /^tgWebApp/i.test(key)) &&
      !/Telegram|WebView|; wv\)/i.test(navigator.userAgent);
  }
  // Call only from a future public catalog after a certified CMP permits an ad request.
  function mount(container, { publicThemeCount = 0, cmpAllowsRequest = false } = {}) {
    if (!config.enabled || requested || !supportedBrowser() || cmpAllowsRequest !== true ||
        !Number.isInteger(publicThemeCount) || publicThemeCount < config.minThemes ||
        !(container instanceof HTMLElement) || !container.isConnected || !container.getClientRects().length) return false;
    requested = true;
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = config.client;
    ad.dataset.adSlot = config.slot;
    ad.dataset.adFormat = 'auto';
    ad.dataset.fullWidthResponsive = 'true';
    container.append(ad);
    const observer = new MutationObserver(() => {
      if (ad.dataset.adStatus === 'unfilled') { observer.disconnect(); container.hidden = true; }
      else if (ad.dataset.adStatus === 'filled') observer.disconnect();
    });
    observer.observe(ad, { attributes: true, attributeFilter: ['data-ad-status'] });
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + config.client;
    script.onload = () => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { observer.disconnect(); container.hidden = true; } };
    script.onerror = () => { observer.disconnect(); container.hidden = true; };
    document.head.append(script);
    return true;
  }
  // Fail closed: a verified CMP integration must supply permission before mount.
  // No Google script is loaded by this preparation build.
  function prepare(container, count) {
    if (!config.enabled || !supportedBrowser() || count < config.minThemes || requested) return false;
    // Reserved for a verified CMP adapter; never infer consent from its presence.
    return false;
  }
  window.CastixAds = Object.freeze({ mount, prepare });
})();
