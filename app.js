// app.js — robust loader + lottie + Handsontable integration

(function(){
  // Elements
  const input = document.getElementById('input-file');
  const handsontableContainer = document.getElementById('handsontable-container');
  const loadingContainer = document.getElementById('loading-container');
  const loadingText = document.getElementById('loading-text');

  // CSV URL (keep yours)
  const autoLoadUrl = "https://raw.githubusercontent.com/nonono100/no/refs/heads/test/Users_converted.csv";

  // Lottie path (cloudfront) — add a cache-bust query param below each load
  const lottieBase = "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBG-g6ahkAUGWpefWbx-D_9sQ8oWbvy6puuq78U2c4NUDFS/32b2ca3bcf2d1fb1/lottie.json";

  // Small helper to show loader and put body into 'night' only while loading
  function showLoader(text){
    console.log('[loader] showLoader:', text);
    if (loadingText) loadingText.textContent = text || 'Загрузка Индекса NFT-баттлов…';
    loadingContainer.style.display = 'flex';
    document.body.classList.add('night');
    loadingContainer.setAttribute('aria-hidden','false');
  }
  function hideLoader(){
    console.log('[loader] hideLoader');
    loadingContainer.style.display = 'none';
    document.body.classList.remove('night');
    loadingContainer.setAttribute('aria-hidden','true');
  }

  // Play Lottie (recreate each time to avoid frozen frame)
  function playLottie() {
    try {
      // destroy previous instance if present
      if (window.__lottieInstance) {
        try { window.__lottieInstance.destroy(); } catch(e){ console.warn('[lottie] destroy error', e); }
        window.__lottieInstance = null;
      }
      // cache bust the URL so browser fetches it fresh
      const url = lottieBase + '?_cb=' + Date.now();
      console.log('[lottie] loading', url);
      window.__lottieInstance = lottie.loadAnimation({
        container: document.getElementById('lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: url
      });
    } catch (err) {
      console.error('[lottie] failed to start', err);
    }
  }

  // Render CSV into Handsontable (keeps it simple)
  function renderCSVData(csvText) {
    try {
      console.log('[csv] parse start');
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      console.log('[csv] parse done — rows:', parsed.data.length, 'fields:', parsed.meta.fields.length);

      const headerTranslations = {
        headshot: "Фото",
        name: "Имя",
        accountAge: "Возраст аккаунта",
        "first-indexed": "Первый индекс",
        "last-indexed": "Последний индекс",
        UserId: "ID пользователя",
        "game stats.highest-indexed.worth": "Макс. стоимость",
        "game stats.unique-indexed": "Уникальные индексы",
        "game stats.total-index-worth": "Суммарная стоимость",
        "game stats.upgrades": "Улучшения",
      };
      const translatedHeaders = parsed.meta.fields.map(h => headerTranslations[h] || h);

      // prepare container
      handsontableContainer.innerHTML = '';
      handsontableContainer.style.display = 'block';
      handsontableContainer.classList.add('handsontable','fade-in');

      // create table
      Handsontable(handsontableContainer, {
        data: parsed.data,
        rowHeaders: true,
        colHeaders: translatedHeaders,
        columnSorting: true,
        width: '100%',
        stretchH: 'all',
        height: Math.min(800, window.innerHeight - 160), // reasonable default
        licenseKey: 'non-commercial-and-evaluation',
      });

      console.log('[table] rendered');
    } catch (err) {
      console.error('[renderCSVData] error', err);
      handsontableContainer.innerHTML = "<p style='color:red'>Error rendering CSV data</p>";
    }
  }

  // Load CSV with minimum display time for loader
  function loadCSVFromURL(url) {
    const started = performance.now();
    showLoader('Загрузка Индекса NFT-баттлов…');
    playLottie();

    console.log('[fetch] starting fetch of CSV', url);
    fetch(url, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(text => {
        const elapsed = performance.now() - started;
        const minMs = 3000; // 3 seconds minimum
        const wait = Math.max(0, minMs - elapsed);
        console.log('[fetch] loaded CSV; elapsed:', Math.round(elapsed), 'ms; waiting:', wait, 'ms before hiding loader');
        setTimeout(() => {
          try {
            hideLoader();
            // choose whether to keep night mode for table:
            // If you WANT dark rows in table, comment out the next line:
            document.body.classList.remove('night');

            renderCSVData(text);
          } catch (err) {
            console.error('[timeout->render] error', err);
            hideLoader();
          }
        }, wait);
      })
      .catch(err => {
        console.error('[fetch] error loading CSV', err);
        if (loadingContainer) loadingContainer.innerHTML = "<p style='color:red'>Ошибка загрузки CSV-файла.</p>";
      });
  }

  // Init on DOM ready
  function init() {
    try {
      console.log('[app] init');
      // If you want loader visible for manual-upload fallback too, call showLoader() elsewhere.
      if (autoLoadUrl) {
        loadCSVFromURL(autoLoadUrl);
      } else {
        // show file input so user can upload
        input.style.display = 'block';
        input.addEventListener('change', (ev) => {
          showLoader('Загрузка локального CSV…');
          playLottie();
          const f = ev.target.files && ev.target.files[0];
          if (!f) {
            hideLoader();
            return;
          }
          const r = new FileReader();
          r.onload = (e) => {
            setTimeout(()=>{
              hideLoader();
              renderCSVData(String(e.target.result || ''));
            }, 1000); // small delay so user sees loader
          };
          r.readAsText(f);
        });
      }
    } catch (err) {
      console.error('[init] fatal error', err);
      hideLoader();
    }
  }

  // run when DOM content is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
