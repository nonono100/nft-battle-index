const input = document.getElementById('input-file');
const handsontableContainer = document.getElementById('handsontable-container');

// ✅ Your hosted CSV file URL
const autoLoadUrl = "https://raw.githubusercontent.com/nonono100/no/refs/heads/test/Users_converted.csv";

function renderCSVData(csvText) {
  const data = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  // 🔹 simple English→Russian dictionary (extend as needed)
  const headerTranslations = {
    "headshot": "Фото",
    "name": "Имя",
    "accountAge": "Возраст аккаунта",
    "first-indexed": "Первый индекс",
    "last-indexed": "Последний индекс",
    "UserId": "ID пользователя",
    "game stats.highest-indexed.worth": "Макс. стоимость",
    "game stats.unique-indexed": "Уникальные индексы",
    "game stats.total-index-worth": "Суммарная стоимость",
    "game stats.upgrades": "Улучшения",
    // ...add more here if you want full localization
  };

  // translate headers if we have them
  const translatedHeaders = data.meta.fields.map(
    h => headerTranslations[h] || h
  );

  handsontableContainer.innerHTML = '';
  handsontableContainer.className = '';

  const inputEl = document.querySelector('input');
  const sponsorEl = document.querySelector('.sponsors');
  if (inputEl) inputEl.remove();
  if (sponsorEl) sponsorEl.remove();

  Handsontable(handsontableContainer, {
    data: data.data,
    rowHeaders: true,
    colHeaders: translatedHeaders,  // use Russian/English mix
    columnSorting: true,
    width: '100%',
    licenseKey: 'non-commercial-and-evaluation',
  });
}


  // reset container
  handsontableContainer.innerHTML = '';
  handsontableContainer.className = '';
  const inputEl = document.querySelector('input');
  const sponsorEl = document.querySelector('.sponsors');
  if (inputEl) inputEl.remove();
  if (sponsorEl) sponsorEl.remove();

  Handsontable(handsontableContainer, {
    data: data.data,
    rowHeaders: true,
    colHeaders: data.meta.fields,
    columnSorting: true,
    width: '100%',
    licenseKey: 'non-commercial-and-evaluation',
  });
}

function loadCSVFromURL(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Failed to load CSV: " + response.statusText);
      return response.text();
    })
    .then(csvText => renderCSVData(csvText))
    .catch(err => {
      console.error(err);
      handsontableContainer.innerHTML = "<p style='color:red'>Error loading CSV file.</p>";
    });
}

// ✅ Automatically load from URL instead of file picker
if (autoLoadUrl) {
  loadCSVFromURL(autoLoadUrl);
} else {
  // Fallback: manual file upload
  input.onchange = function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      renderCSVData(e.target.result);
    };
    file && reader.readAsText(file);
  };
}


.catch(err => {
  console.error(err);
  handsontableContainer.innerHTML =
    "<p style='color:red'>Error loading CSV file. Please upload manually.</p>";
  document.getElementById("input-file").style.display = "block"; // show picker only if needed
});
