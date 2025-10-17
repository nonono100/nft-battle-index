const input = document.getElementById("input-file");
const handsontableContainer = document.getElementById("handsontable-container");
const loadingContainer = document.getElementById("loading-container");

const autoLoadUrl =
  "https://raw.githubusercontent.com/nonono100/no/refs/heads/test/Users_converted.csv";

// --- Reset & play Lottie every load ---
function playLottie() {
  if (window.animation) {
    window.animation.destroy();
  }
  window.animation = lottie.loadAnimation({
    container: document.getElementById("lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path:
      "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBG-g6ahkAUGWpefWbx-D_9sQ8oWbvy6puuq78U2c4NUDFS/32b2ca3bcf2d1fb1/lottie.json",
  });
}
playLottie();

function renderCSVData(csvText) {
  const data = Papa.parse(csvText, { header: true, skipEmptyLines: true });

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

  const translatedHeaders = data.meta.fields.map(
    (h) => headerTranslations[h] || h
  );

  handsontableContainer.innerHTML = "";

  Handsontable(handsontableContainer, {
    data: data.data,
    rowHeaders: true,
    colHeaders: translatedHeaders,
    columnSorting: true,
    width: "100%",
    height: "auto",
    stretchH: "all",
    licenseKey: "non-commercial-and-evaluation",
  });
}

function loadCSVFromURL(url) {
  const startTime = performance.now();
  fetch(url, { cache: "no-store" })
    .then((response) => {
      if (!response.ok)
        throw new Error("Failed to load CSV: " + response.statusText);
      return response.text();
    })
    .then((csvText) => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, 3000 - elapsed); // 3s minimum
      setTimeout(() => {
        loadingContainer.style.display = "none";
        document.body.style.background = "#fff";
        handsontableContainer.style.display = "block";
        renderCSVData(csvText);
      }, remaining);
    })
    .catch((err) => {
      console.error(err);
      loadingContainer.innerHTML =
        "<p style='color:red'>Ошибка загрузки CSV-файла.</p>";
    });
}

// --- Auto or manual load ---
if (autoLoadUrl) {
  loadCSVFromURL(autoLoadUrl);
} else {
  input.style.display = "block";
  input.onchange = function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = (e) => renderCSVData(e.target.result);
    file && reader.readAsText(file);
  };
}
