/* Castix ads — Monetag (Telegram Mini Apps SDK).
   Safe by default: nothing is loaded unless CASTIX_ADS_ENABLED === true AND the page runs
   inside Telegram. The public website never requests ads. Ads never block a feature:
   if the SDK is missing or fails, CastixAds.reward() resolves true so the user continues. */
window.CastixAds = (() => {
  const ZONE = '12374961', FN = 'show_' + ZONE;
  let loading;
  const enabled = () => window.CASTIX_ADS_ENABLED === true && !!window.Telegram?.WebApp?.initData;
  function load() {
    if (!enabled()) return Promise.resolve(false);
    if (typeof window[FN] === 'function') return Promise.resolve(true);
    return loading ||= new Promise(resolve => {
      const s = document.createElement('script');
      s.src = 'https://libtl.com/sdk.js'; s.dataset.zone = ZONE; s.dataset.sdk = FN;
      s.onload = () => resolve(typeof window[FN] === 'function');
      s.onerror = () => resolve(false);
      document.head.append(s);
    });
  }
  /* Rewarded interstitial: user chooses to watch; resolves true when they may continue.
     Resolves false only if the user dismissed an ad that was actually shown. */
  async function reward(ymid) {
    if (!(await load())) return true;
    try { await window[FN](ymid ? { ymid: String(ymid) } : undefined); return true; }
    catch (e) { return !!(e && /no.?ad|not.?found|timeout|error/i.test(String(e.message || e))); }
  }
  /* Optional gentle in-app interstitials (activate the "In-app Interstitial" format in Monetag first). */
  async function start() {
    if (!(await load())) return;
    try { window[FN]({ type: 'inApp', inAppSettings: { frequency: 2, capping: 0.5, interval: 120, timeout: 60, everyPage: false } }); } catch (e) {}
  }
  /* Called right before a theme download. Never blocks the download: at most one ad per 3 minutes,
     gives up after 12 s, and any failure simply lets the download continue. */
  async function beforeDownload(id) {
    if (!enabled()) return;
    let last = 0; try { last = +localStorage.getItem('castix-ad-ts') || 0; } catch (e) {}
    if (Date.now() - last < 180000) return;
    try { localStorage.setItem('castix-ad-ts', String(Date.now())); } catch (e) {}
    await Promise.race([reward(id).catch(() => true), new Promise(r => setTimeout(r, 12000))]);
  }
  /* Sponsored card shown inside the catalog (Telegram only). Looks like a theme card, clearly labelled.
     Tapping it shows a rewarded interstitial the user chose to watch. Hidden if ads are unavailable. */
  function mount(root, tr) {
    if (!enabled() || root.querySelector('.castix-sponsored')) return;
    const sections = root.querySelectorAll('.catalog-section'); if (sections.length < 2) return;
    const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x) n.textContent = x; return n; };
    const card = el('section', 'castix-sponsored'); card.hidden = true;
    const tag = el('small', '', tr('Sponsored', 'إعلان ممول'));
    const title = el('strong', '', tr('Support Castix', 'ادعم Castix'));
    const text = el('p', '', tr('Watch a short ad to keep themes free for everyone.', 'شاهد إعلاناً قصيراً لتبقى التصاميم مجانية للجميع.'));
    const b = el('button', 'primary', tr('Watch ad', 'شاهد الإعلان')); b.type = 'button';
    b.onclick = async () => {
      b.disabled = true;
      const ok = await reward('card');
      b.textContent = ok ? tr('Thank you ❤', 'شكراً لك ❤') : tr('Watch ad', 'شاهد الإعلان'); b.disabled = ok;
    };
    card.append(tag, title, text, b);
    sections[Math.min(1, sections.length - 2)].after(card);
    load().then(ok => { if (ok && card.isConnected) card.hidden = false; else card.remove(); });
  }
  return { reward, beforeDownload, start, mount, enabled };
})();
