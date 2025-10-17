const input = document.getElementById("input-file");
const handsontableContainer = document.getElementById("handsontable-container");
const loadingContainer = document.getElementById("loading-container");

// ✅ Your hosted CSV file URL
const autoLoadUrl =
  "https://raw.githubusercontent.com/nonono100/no/refs/heads/test/Users_converted.csv";

// ✅ Initialize Lottie animation
const animation = lottie.loadAnimation({
  container: document.getElementById("lottie"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./lottie.json", // your local animation file
});

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

  // hide loading animation, show table
  loadingContainer.style.display = "none";
  handsontableContainer.style.display = "block";

  handsontableContainer.innerHTML = "";

  Handsontable(handsontableContainer, {
    data: data.data,
    rowHeaders: true,
    colHeaders: translatedHeaders,
    columnSorting: true,
    width: "100%",
    licenseKey: "non-commercial-and-evaluation",
  });
}

function loadCSVFromURL(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok)
        throw new Error("Failed to load CSV: " + response.statusText);
      return response.text();
    })
    .then((csvText) => renderCSVData(csvText))
    .catch((err) => {
      console.error(err);
      loadingContainer.innerHTML =
        "<p style='color:red'>Error loading CSV file.</p>";
    });
}

// ✅ Auto-load CSV or allow manual upload
if (autoLoadUrl) {
  loadCSVFromURL(autoLoadUrl);
} else {
  input.style.display = "block";
  input.onchange = function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      renderCSVData(e.target.result);
    };
    file && reader.readAsText(file);
  };
}
