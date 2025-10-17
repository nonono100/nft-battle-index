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
  // Basic fields
  headshot: "Фото",
  name: "Имя",
  accountAge: "Возраст аккаунта",
  "first-indexed": "Первый индекс",
  "last-indexed": "Последний индекс",
  UserId: "ID пользователя",
  
  // Game stats - top level
  "game stats.worth": "Стоимость",
  "game stats.Heart": "Сердце",
  "game stats.unique-indexed": "Уникальные индексы",
  "game stats.total-index-worth": "Общая стоимость индекса",
  "game stats.upgrades": "Улучшения",
  "game stats.best-drop": "Лучший дроп",
  "game stats.best-drop-worth": "Стоимость лучшего дропа",
  "game stats.cases": "Кейсы",
  "game stats.highest-stars": "Максимум звёзд",
  
  // All highest-indexed items (add more as needed)
  "game stats.highest-indexed.worth": "Стоимость (Высший индекс)",
  "game stats.highest-indexed.Heart": "Сердце (Высший индекс)",
  "game stats.highest-indexed.Heroic Helmet (Cyberpunk)": "Героический Шлем (Киберпанк)",
  "game stats.highest-indexed.Fresh Socks (Billie Jean)": "Свежие Носки (Билли Джин)",
  "game stats.highest-indexed.Party Sparkler": "Праздничный Блеск",
  "game stats.highest-indexed.Lush Bouquet": "Пышный Букет",
  "game stats.highest-indexed.Lol Pop": "Лол Поп",
  "game stats.highest-indexed.Diamond": "Алмаз",
  "game stats.highest-indexed.Bunny Muffin (Gold)": "Кролик Маффин (Золото)",
  "game stats.highest-indexed.Desk Calendar": "Настольный Календарь",
  "game stats.highest-indexed.Gem Signet (Old Bronze)": "Печать Драгоценного Камня (Старая Бронза)",
  "game stats.highest-indexed.Ring": "Кольцо",
  "game stats.highest-indexed.Lol Pop (Gold Star)": "Лол Поп (Золотая Звезда)",
  "game stats.highest-indexed.None": "Нет",
  "game stats.highest-indexed.Jelly Bunny": "Желейный Кролик",
  "game stats.highest-indexed.Astral Shard (Crystal Punk)": "Астральный Осколок (Кристальный Панк)",
  "game stats.highest-indexed.Artisan Brick (Gold Block)": "Ремесленный Кирпич (Золотой Блок)",
  "game stats.highest-indexed.Evil Eye (8 Ball)": "Злой Глаз (8 Шаров)",
  "game stats.highest-indexed.Snake Box": "Коробка Со Змеёй",
  "game stats.highest-indexed.Cupid Charm (Crystal Clear)": "Амулет Купидона (Кристально Чистый)",
  "game stats.highest-indexed.Mighty Arm (Body Builder)": "Могучая Рука (Культурист)",
  "game stats.highest-indexed.Evil Eye": "Злой Глаз",
  "game stats.highest-indexed.Genie Lamp (Lava Lamp)": "Лампа Джина (Лавовая Лампа)",
  "game stats.highest-indexed.Precious Peach (Yin Yang)": "Драгоценный Персик (Инь Ян)",
  "game stats.highest-indexed.Gem Signet (Death Star)": "Печать Драгоценного Камня (Звезда Смерти)",
  "game stats.highest-indexed.Eternal Candle (Bubble Bath)": "Вечная Свеча (Пузырьковая Ванна)",
  "game stats.highest-indexed.Toy Bear (Fazbear)": "Плюшевый Мишка (Фазбер)",
  "game stats.highest-indexed.Lunar Snake": "Лунная Змея",
  "game stats.highest-indexed.Toy Bear (Dark Knight)": "Плюшевый Мишка (Тёмный Рыцарь)",
  "game stats.highest-indexed.Durov's Cap (Tron)": "Кепка Дурова (Трон)",
  "game stats.highest-indexed.Bonded Ring (Cat Bed)": "Связанное Кольцо (Кошачья Кровать)",
  "game stats.highest-indexed.Gem Signet (Amethyst)": "Печать Драгоценного Камня (Аметист)",
  "game stats.highest-indexed.Low Rider": "Лоу-Райдер",
  "game stats.highest-indexed.Low Rider (Neon Nitro)": "Лоу-Райдер (Неон Нитро)",
  "game stats.highest-indexed.Crystal Ball (Druid Circle)": "Хрустальный Шар (Круг Друидов)",
  "game stats.highest-indexed.Artisan Brick (USBrick)": "Ремесленный Кирпич (УСКирпич)",
  "game stats.highest-indexed.Sakura Flower": "Цветок Сакуры",
  "game stats.highest-indexed.Jack in the box (Aliens)": "Джек в коробке (Инопланетяне)",
  "game stats.highest-indexed.Electric Skull (Terminator)": "Электрический Череп (Терминатор)",
  "game stats.highest-indexed.Hanging Star (This Is Fine)": "Висящая Звезда (Это Нормально)",
  "game stats.highest-indexed.Ion Gem (Prismatic)": "Ионный Драгоценный Камень (Призматический)",
  "game stats.highest-indexed.Artisan Brick (Gold Bar)": "Ремесленный Кирпич (Золотой Слиток)",
  "game stats.highest-indexed.Resistance Dog": "Собака Сопротивления",
  "game stats.highest-indexed.Spy Agaric": "Шпионский Агарик",
  "game stats.highest-indexed.Clover Pin (Corrupted)": "Булавка Клевера (Поддельная)",
  "game stats.highest-indexed.Mighty Arm (Gladiator)": "Могучая Рука (Гладиатор)",
  "game stats.highest-indexed.Diamond Ring (Black Hole)": "Бриллиантовое Кольцо (Чёрная Дыра)",
  "game stats.highest-indexed.Rose": "Роза",
  "game stats.highest-indexed.Love Potion (Banana)": "Любовное Зелье (Банан)",
  "game stats.highest-indexed.Artisan Brick (Bomb Planted)": "Ремесленный Кирпич (Бомба Установлена)",
  "game stats.highest-indexed.Astral Shard (Bogartite)": "Астральный Осколок (Богартит)",
  "game stats.highest-indexed.Heart Locket (Shield of Sun)": "Сердечный Медальон (Щит Солнца)",
  "game stats.highest-indexed.Flying Broom": "Летающая Метла",
  "game stats.highest-indexed.Holiday Drink": "Праздничный Напиток",
  "game stats.highest-indexed.Precious Peach (Angelic)": "Драгоценный Персик (Ангельский)",
  "game stats.highest-indexed.Hex Pox": "Проклятие Гекса",
  "game stats.highest-indexed.Heroic Helmet (Frozen Aegis)": "Героический Шлем (Ледяной Эгида)",
  "game stats.highest-indexed.Mad Pumpkin (Daredevil)": "Бешеная Тыква (Смельчак)",
  "game stats.highest-indexed.Durov's Cap (RGB Glitch)": "Кепка Дурова (RGB Глюк)",
  "game stats.highest-indexed.Love Candle (Golden Glow)": "Свеча Любви (Золотое Сияние)",
  "game stats.highest-indexed.Heroic Helmet": "Героический Шлем",
  "game stats.highest-indexed.Light Sword": "Световой Меч",
  "game stats.highest-indexed.Loot Bag (Conductor)": "Мешок Добычи (Дирижёр)",
  "game stats.highest-indexed.Mini Oscar (Fiery-Hot)": "Мини Оскар (Огненно-Горячий)",
  "game stats.highest-indexed.Durov's Cap (Sunrise)": "Кепка Дурова (Рассвет)",
  "game stats.highest-indexed.Gem Signet (8 Bit Diamond)": "Печать Драгоценного Камня (8-Бит Алмаз)",
  "game stats.highest-indexed.Hanging Star": "Висящая Звезда",
  "game stats.highest-indexed.Rocket": "Ракета",
  "game stats.highest-indexed.Loot Bag (Crypto Byte)": "Мешок Добычи (Крипто Байт)",
  "game stats.highest-indexed.Durov's Cap (Honey Bee)": "Кепка Дурова (Медоносная Пчела)",
  "game stats.highest-indexed.Pet Snake": "Домашняя Змея",
  "game stats.highest-indexed.Perfume Bottle": "Флакон Духов",
  "game stats.highest-indexed.Plush Pepe (Amalgam)": "Плюшевый Пепе (Амальгама)",
  "game stats.highest-indexed.Artisan Brick (Fight Club)": "Ремесленный Кирпич (Клуб Борцов)",
  "game stats.highest-indexed.Mighty Arm (Crystal Fist)": "Могучая Рука (Кристальный Кулак)",
  "game stats.highest-indexed.Nail Bracelet (Interstellar)": "Браслет Гвоздей (Межзвёздный)",
  "game stats.highest-indexed.Snoop Dogg": "Снуп Дог",
  "game stats.highest-indexed.Durov's Cap (Falcon)": "Кепка Дурова (Сокол)",
  "game stats.highest-indexed.Gift": "Подарок",
  "game stats.highest-indexed.Valentine Box": "Коробка Валентина",
  "game stats.highest-indexed.Star Notepad": "Звёздный Блокнот",
  "game stats.highest-indexed.Genie Lamp (Cat Spirit)": "Лампа Джина (Кошачий Дух)",
  "game stats.highest-indexed.Cupid Charm (Dryad Heart)": "Амулет Купидона (Сердце Дриады)",
  "game stats.highest-indexed.Nail Bracelet (Cat Person)": "Браслет Гвоздей (Кошачий Человек)",
  "game stats.highest-indexed.Hanging Star (Black Hole)": "Висящая Звезда (Чёрная Дыра)",
  "game stats.highest-indexed.Ionic Dryer": "Ионная Сушилка",
  "game stats.highest-indexed.Jolly Chimp": "Весёлый Шимпанзе",
  "game stats.highest-indexed.Flowers": "Цветы",
  "game stats.highest-indexed.Astral Shard (Nectarite)": "Астральный Осколок (Нектарит)",
  "game stats.highest-indexed.Scared Cat (Obelisk)": "Испуганный Кот (Обелиск)",
  "game stats.highest-indexed.Hypno Lollipop": "Гипно Леденец",
  "game stats.highest-indexed.Easter Egg (Creeper)": "Пасхальное Яйцо (Крипер)",
  "game stats.highest-indexed.Durov's Cap (Shadow)": "Кепка Дурова (Тень)",
  "game stats.highest-indexed.Neko Helmet": "Шлем Неко",
  "game stats.highest-indexed.Jester Hat": "Шляпа Шута",
  "game stats.highest-indexed.Artisan Brick (Cash Roll)": "Ремесленный Кирпич (Рулон Деньгами)",
  "game stats.highest-indexed.Mad Pumpkin (Frostbite)": "Бешеная Тыква (Обморожение)",
  "game stats.highest-indexed.Gem Signet": "Печать Драгоценного Камня",
  "game stats.highest-indexed.Mad Pumpkin": "Бешеная Тыква",
  "game stats.highest-indexed.Xmax Stocking": "Ёлочный Чулок",
  "game stats.highest-indexed.Heart Locket (Delegram)": "Сердечный Медальон (Делеграм)",
  "game stats.highest-indexed.Bonded Ring (Duckling)": "Связанное Кольцо (Утёнок)",
  "game stats.highest-indexed.Swicc Watch": "Часы Свиц",
  "game stats.highest-indexed.Witch Hat": "Ведьмина Шляпа",
  "game stats.highest-indexed.Astral Shard (Eve's Apple)": "Астральный Осколок (Яблоко Евы)",
  "game stats.highest-indexed.Tama Gadget": "Гаджет Тама",
  "game stats.highest-indexed.Love Potion (Ice Queen)": "Любовное Зелье (Ледяная Королева)",
  "game stats.highest-indexed.Sakura Flower (Sunflower)": "Цветок Сакуры (Подсолнух)",
  "game stats.highest-indexed.Cupid Charm": "Амулет Купидона",
  "game stats.highest-indexed.Kissed Frog (Lava Leap)": "Поцелованная Лягушка (Лавовый Прыжок)",
  "game stats.highest-indexed.Plush Pepe (Poison Dart)": "Плюшевый Пепе (Ядовитый Дротик)",
  "game stats.highest-indexed.Heart Locket (Neptune)": "Сердечный Медальон (Нептун)",
  "game stats.highest-indexed.Precious Peach (Bubbling Blue)": "Драгоценный Персик (Бурлящий Голубой)",
  "game stats.highest-indexed.Berry Box": "Ягодная Коробка",
  "game stats.highest-indexed.Cupid Charm (Pepe Love)": "Амулет Купидона (Любовь Пепе)",
  "game stats.highest-indexed.Mighty Arm": "Могучая Рука",
  "game stats.highest-indexed.Loot Bag (City Life)": "Мешок Добычи (Городская Жизнь)",
  "game stats.highest-indexed.Toy Bear": "Плюшевый Мишка",
  "game stats.highest-indexed.Astral Shard": "Астральный Осколок",
  "game stats.highest-indexed.Gem Signet (Elven Shade)": "Печать Драгоценного Камня (Эльфийская Тень)",
  "game stats.highest-indexed.Bonded Ring (Rainbow)": "Связанное Кольцо (Радуга)",
  "game stats.highest-indexed.Electric Skull (Half Alive)": "Электрический Череп (Полуживой)",
  "game stats.highest-indexed.Heart Locket (Synthwave)": "Сердечный Медальон (Синтвейв)",
  "game stats.highest-indexed.Durov's Cap (Sky High)": "Кепка Дурова (Небо Высоко)",
  "game stats.highest-indexed.Magic Potion (Gold Medal)": "Волшебное Зелье (Золотая Медаль)",
  "game stats.highest-indexed.Low Rider (Gold Rush)": "Лоу-Райдер (Золотая Лихорадка)",
  "game stats.highest-indexed.Precious Peach (Rich Green)": "Драгоценный Персик (Богатый Зелёный)",
  "game stats.highest-indexed.Swicc Watch (Day Trader)": "Часы Свиц (Дневной Трейдер)",
  "game stats.highest-indexed.Ionic Dryer (Arc Reactor)": "Ионная Сушилка (Реактор Дуги)",
  "game stats.highest-indexed.Gigner Cookie": "Печенье Гигнер",
  "game stats.highest-indexed.Precious Peach (Crypto Orange)": "Драгоценный Персик (Крипто Апельсин)",
  "game stats.highest-indexed.Sakura Flower (Flowey)": "Цветок Сакуры (Цветаш)",
  "game stats.highest-indexed.Jolly Chimp (Retro Cartoon)": "Весёлый Шимпанзе (Ретро Мультфильм)",
  "game stats.highest-indexed.Scared Cat (Cathulhu)": "Испуганный Кот (Катулху)",
  "game stats.highest-indexed.Nail Bracelet (Crypto Gem)": "Браслет Гвоздей (Крипто Драгоценный Камень)",
  "game stats.highest-indexed.Swiss Watch (Memory Flash)": "Швейцарские Часы (Вспышка Памяти)",
  "game stats.highest-indexed.Record Player": "Проигрыватель Пластинок",
  "game stats.highest-indexed.Bow Tie (Velvet Gold)": "Галстук-бабочка (Бархатное Золото)",
  "game stats.highest-indexed.Scared Cat": "Испуганный Кот",
  "game stats.highest-indexed.Durov's Cap (Fun Time)": "Кепка Дурова (Время Веселья)",
  "game stats.highest-indexed.Heroic Helmet (Black Thorn)": "Героический Шлем (Чёрный Шип)",
  "game stats.highest-indexed.Bow Tie (Dark Lord)": "Галстук-бабочка (Тёмный Лорд)",
  "game stats.highest-indexed.Gem Signet (Black Lotus)": "Печать Драгоценного Камня (Чёрный Лотос)",
  "game stats.highest-indexed.Record Player (Dark Noir)": "Проигрыватель Пластинок (Тёмный Нуар)",
  "game stats.highest-indexed.Signet Ring (Obsidian)": "Печатное Кольцо (Обсидиан)",
  "game stats.highest-indexed.Heart Locket (Mecha Love)": "Сердечный Медальон (Меха Любовь)",
  "game stats.highest-indexed.Loot Bag (Pepe Bag)": "Мешок Добычи (Пепе Мешок)",
  "game stats.highest-indexed.Plush Pepe (Aqua Plush)": "Плюшевый Пепе (Аква Плюш)",
  "game stats.highest-indexed.Durov's Cap (Neon)": "Кепка Дурова (Неон)",
  "game stats.highest-indexed.Nail Bracelet (Moon Cat)": "Браслет Гвоздей (Лунный Кот)",
  "game stats.highest-indexed.Heart Locket (Trapped Heart)": "Сердечный Медальон (Захваченное Сердце)",
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
            column: 14, // Index of the 'name' column (assuming it's the second data column)
            sortOrder: 'desc' // 'asc' for ascending (A-Z) or 'desc' for descending (Z-A)
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
