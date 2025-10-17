const handsontableContainer = document.getElementById("handsontable-container");
const loadingContainer = document.getElementById("loading-container");

// ✅ Your hosted CSV file URL
const autoLoadUrl =
  "https://raw.githubusercontent.com/nonono100/no/refs/heads/test/Users_converted.csv";

// ✅ Initialize Lottie animation
lottie.loadAnimation({
  container: document.getElementById("lottie"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./lottie.json",
});

// --- NEW FUNCTION: Asynchronously parse CSV in the background ---
function parseCSV(url) {
  // This function returns a Promise that resolves with the parsed data
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,       // Stream the file directly from the URL
      header: true,         // Use the first row as headers
      skipEmptyLines: true,
      worker: true,         // ⭐ THIS IS THE KEY: Use a background worker thread
      complete: (results) => {
        resolve(results);   // When parsing is done, resolve the promise
      },
      error: (err) => {
        reject(err);        // If there's an error, reject the promise
      },
    });
  });
}

// --- NEW FUNCTION: Renders the Handsontable instance ---
function renderTable(data) {
handsontableContainer.style.display = "block";


  const headerTranslations = {
    headshot: "Фото",
    name: "Имя",
    accountAge: "Возраст аккаунта",
    "first-indexed": "Первый индекс",
    "last-indexed": "Последний индекс",
    UserId: "ID пользователя",
  };

  const translatedHeaders = data.meta.fields.map(
    (h) => headerTranslations[h] || h
  );
  
  // Create the Handsontable instance
  Handsontable(handsontableContainer, {
    data: data.data,
    rowHeaders: true,
    colHeaders: translatedHeaders,
    columnSorting: {
        initialConfig: {
            column: 1, // Index of the 'name' column (assuming it's the second data column)
            sortOrder: 'asc' // 'asc' for ascending (A-Z) or 'desc' for descending (Z-A)
        }
    },
    width: '100%',
    height: '100%',
    stretchH: 'all',
    licenseKey: "non-commercial-and-evaluation",
    // ... your image renderer from before goes here if you're using it
    columns: data.meta.fields.map(field => {
        if (field === 'headshot') {
          return {
            data: 'headshot',
            renderer: function(instance, td, row, col, prop, value, cellProperties) {
              
              // Only proceed if a value (URL) exists
              if (value) {
                const img = document.createElement('img');
                img.src = value; // ⭐ Use the URL directly from the CSV
                img.style.width = '40px';
                img.style.height = '40px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%'; // Keep the circular style
                
                Handsontable.dom.empty(td);
                td.appendChild(img);
              }
            }
          };
        }
        return { data: field };
      }),
    autoRowSize: false,
    rowHeights: 50,
  });
setTimeout(() => {
    loadingContainer.style.display = "none";
  }, 100);
  // Finally, hide the loader and show the table
  loadingContainer.style.display = "none";
  handsontableContainer.style.display = "block";
}

// --- MAIN EXECUTION LOGIC ---
async function main() {
  try {
    // 1. Define the minimum time the loader should be visible (e.g., 2500ms = 2.5s)
    const minimumWait = new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Start parsing the CSV in the background
    const parsingPromise = parseCSV(autoLoadUrl);

    // 3. Wait for BOTH the minimum time to pass AND the data to be ready
    const [parsedData] = await Promise.all([parsingPromise, minimumWait]);

    // 4. Once both are complete, render the table
    renderTable(parsedData);

  } catch (err) {
    console.error("Failed to load or parse CSV:", err);
    loadingContainer.innerHTML =
      "<p style='color:red'>Error loading CSV file.</p>";
  }
}

// Start the process
main();
