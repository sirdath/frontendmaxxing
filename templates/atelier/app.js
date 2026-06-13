const DEFAULT_SETTINGS = {
  brandName: "ATELIER",
  heroEyebrow: "Spring / Summer 2026",
  heroTitle: "Made for your\neveryday story.",
  accent: "#fff1b5",
  soft: "#c1dbe8",
  dark: "#43302e",
  productLayout: "atelier",
  displayFont: "Italiana",
  bodyFont: "DM Sans",
  customFontKey: "",
  customFontName: "",
  logoKey: "",
  videoKey: "",
};

const FONT_OPTIONS = [
  ["Italiana", '"Italiana", Georgia, serif'],
  ["DM Sans", '"DM Sans", Arial, sans-serif'],
  ["Georgia", 'Georgia, "Times New Roman", serif'],
  ["Garamond", 'Garamond, "Times New Roman", serif'],
  ["Baskerville", 'Baskerville, Georgia, serif'],
  ["Didot", 'Didot, "Bodoni MT", serif'],
  ["Bodoni MT", '"Bodoni MT", Didot, serif'],
  ["Palatino", '"Palatino Linotype", Palatino, serif'],
  ["Times New Roman", '"Times New Roman", Times, serif'],
  ["Arial", 'Arial, Helvetica, sans-serif'],
  ["Helvetica", 'Helvetica, Arial, sans-serif'],
  ["Futura", 'Futura, "Century Gothic", sans-serif'],
  ["Gill Sans", '"Gill Sans", "Trebuchet MS", sans-serif'],
  ["Avenir", 'Avenir, "Helvetica Neue", Arial, sans-serif'],
  ["Century Gothic", '"Century Gothic", Futura, sans-serif'],
  ["Verdana", 'Verdana, Geneva, sans-serif'],
  ["Trebuchet MS", '"Trebuchet MS", Arial, sans-serif'],
  ["Tahoma", 'Tahoma, Verdana, sans-serif'],
  ["Optima", 'Optima, "Segoe UI", sans-serif'],
  ["Courier New", '"Courier New", Courier, monospace'],
];

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Linen Column Dress",
    price: 119,
    category: "Dresses",
    color: "Buttermilk",
    description: "A long, easy linen silhouette with an open back.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "p2",
    name: "Powder Tailored Shirt",
    price: 78,
    category: "Tops",
    color: "Pastel blue",
    description: "A relaxed cotton shirt with a softly structured collar.",
    image: "https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "p3",
    name: "Sculpted Shoulder Bag",
    price: 94,
    category: "Bags",
    color: "Cocoa",
    description: "A compact everyday bag in softly grained vegan leather.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "p4",
    name: "Soft Leather Mule",
    price: 105,
    category: "Shoes",
    color: "Old burgundy",
    description: "An almond-toe mule with a low, walkable heel.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "p5",
    name: "Fluid Wrap Skirt",
    price: 86,
    category: "Dresses",
    color: "Chocolate",
    description: "A fluid midi skirt with an adjustable wrapped waist.",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "p6",
    name: "Fine Rib Cardigan",
    price: 69,
    category: "Tops",
    color: "Cream",
    description: "A close-fitting rib knit designed for effortless layering.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "p7",
    name: "Oval Signet Earrings",
    price: 42,
    category: "Accessories",
    color: "Gold",
    description: "Lightweight sculptural earrings with a brushed finish.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "p8",
    name: "Gathered Day Dress",
    price: 128,
    category: "Dresses",
    color: "Sky",
    description: "A light gathered dress with generous sleeves and hidden pockets.",
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=900&q=85",
    modelImage: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85",
  },
];

const CATALOG_ADDITIONS = [
  ["p9", "Asymmetric Draped Dress", 146, "Dresses", "Ink", "A softly draped midi dress cut with an asymmetric neckline."],
  ["p10", "Sheer Layering Dress", 132, "Dresses", "Smoke", "A weightless sheer layer designed to shift with movement."],
  ["p11", "Folded Cotton Shirt", 88, "Tops", "White", "Crisp cotton with a folded placket and an intentionally generous fit."],
  ["p12", "Deconstructed Poplin Top", 92, "Tops", "Chalk", "A clean poplin top with an offset hem and sculptural sleeve."],
  ["p13", "Open Knit Vest", 74, "Tops", "Oat", "An airy open knit with a soft, slightly oversized shape."],
  ["p14", "Twisted Jersey Bodysuit", 64, "Tops", "Burgundy", "Fluid jersey gathered into a twisted one-shoulder line."],
  ["p15", "Architectural Mini Bag", 118, "Bags", "Black", "A compact structured bag with a curved handle and magnetic closure."],
  ["p16", "Soft Fold Tote", 126, "Bags", "Cognac", "An unlined carryall that folds naturally around the body."],
  ["p17", "Knotted Evening Pouch", 82, "Bags", "Powder blue", "A softly padded pouch finished with a hand-tied handle."],
  ["p18", "East West Shoulder Bag", 112, "Bags", "Cream", "A slim shoulder shape with an adjustable sculpted strap."],
  ["p19", "Square Toe Slingback", 109, "Shoes", "Black", "A low slingback with a precise square toe and covered heel."],
  ["p20", "Woven Summer Flat", 89, "Shoes", "Natural", "A hand-finished woven flat set on a flexible leather sole."],
  ["p21", "Minimal Court Sneaker", 96, "Shoes", "Bone", "A pared-back leather sneaker with tonal laces and soft lining."],
  ["p22", "Sculpted Ankle Boot", 149, "Shoes", "Espresso", "A close ankle boot balanced on a curved architectural heel."],
  ["p23", "Brushed Cuff Bracelet", 48, "Accessories", "Silver", "A clean open cuff with a softly brushed surface."],
  ["p24", "Fine Chain Necklace", 54, "Accessories", "Gold", "A delicate adjustable chain with an irregular oval pendant."],
  ["p25", "Silk Column Scarf", 58, "Accessories", "Sky print", "A narrow silk scarf designed for the neck, hair or bag."],
  ["p26", "Oval Frame Sunglasses", 72, "Accessories", "Tortoise", "Slim oval frames with warm tinted lenses."],
  ["p27", "Fluid Tailored Trouser", 98, "Tops", "Stone", "A softly tailored trouser with a long fluid break."],
  ["p28", "Bias Satin Slip Dress", 138, "Dresses", "Old burgundy", "A bias-cut satin dress with a low back and fine straps."],
  ["p29", "Pleated Day Dress", 124, "Dresses", "Pastel blue", "A pleated midi silhouette with a light, floating sleeve."],
  ["p30", "Structured Mini Dress", 136, "Dresses", "Buttermilk", "A concise structured dress with a clean folded neckline."],
  ["p31", "Brushed Wool Overshirt", 128, "Tops", "Charcoal", "A relaxed unisex overshirt in soft brushed wool with clean patch pockets."],
  ["p32", "Wide Pleat Trouser", 108, "Tops", "Ink", "A fluid unisex trouser with deep front pleats and a generous full-length leg."],
  ["p33", "Cropped Studio Bomber", 142, "Tops", "Stone", "A lightly padded cropped bomber with a sculpted back and tonal hardware."],
  ["p34", "Soft Square Loafer", 116, "Shoes", "Espresso", "A supple leather loafer with a softly squared toe and low stacked heel."],
  ["p35", "Compact Curve Crossbody", 104, "Bags", "Old burgundy", "A curved crossbody bag with a slim adjustable strap and brushed metal closure."],
].map(([id, name, price, category, color, description], index) => {
  const imagePairs = [
    ["photo-1529139574466-a303027c1d8b", "photo-1490481651871-ab68de25d43d"],
    ["photo-1485230895905-ec40ba36b9bc", "photo-1539109136881-3be0616acf4b"],
    ["photo-1525507119028-ed4c629a60a3", "photo-1509631179647-0177331693ae"],
    ["photo-1551488831-00ddcb6c6bd3", "photo-1515886657613-9f3515b0c78f"],
    ["photo-1581044777550-4cfa60707c03", "photo-1550614000-4895a10e1bfd"],
    ["photo-1544441893-675973e31985", "photo-1537832816519-689ad163238b"],
    ["photo-1584917865442-de89df76afd3", "photo-1594223274512-ad4803739b7c"],
    ["photo-1548036328-c9fa89d128fa", "photo-1584917865442-de89df76afd3"],
    ["photo-1543163521-1bf539c55dd2", "photo-1596703263926-eb0762ee17e4"],
    ["photo-1542291026-7eec264c27ff", "photo-1596703263926-eb0762ee17e4"],
    ["photo-1535632066927-ab7c9ab60908", "photo-1635767798638-3e25273a8236"],
  ];
  const [primaryId, modelId] = imagePairs[index % imagePairs.length];
  return {
    id, name, price, category, color, description,
    image: `https://images.unsplash.com/${primaryId}?auto=format&fit=crop&w=1000&q=85`,
    modelImage: `https://images.unsplash.com/${modelId}?auto=format&fit=crop&w=1000&q=85`,
  };
});

DEFAULT_PRODUCTS.push(...CATALOG_ADDITIONS);

function localCatalogMedia(id) {
  const match = /^p([1-9]|[12]\d|3[0-5])$/.exec(id);
  if (!match) return null;
  const base = `assets/catalog/${id}`;
  return {
    image: `${base}/product.webp`,
    modelImage: `${base}/model.webp`,
    gallery: [
      `${base}/product.webp`,
      `${base}/model.webp`,
      `${base}/detail.webp`,
      `${base}/texture.webp`,
    ],
  };
}

DEFAULT_PRODUCTS.forEach((product) => Object.assign(product, localCatalogMedia(product.id)));

let settings = loadJSON("atelier-settings", DEFAULT_SETTINGS);
let products = loadJSON("atelier-products", DEFAULT_PRODUCTS);
let cart = loadJSON("atelier-cart", []);
let activeFilter = "All";
let searchTerm = "";
let objectUrls = [];
let selectedProductSize = "";
let customFontFace = null;
let adminProductSearch = "";
let adminCategoryFilter = "All";
let adminProductSort = "newest";

if (Number(localStorage.getItem("atelier-layout-version") || 1) < 2) {
  if (!settings.productLayout || settings.productLayout === "maison") {
    settings.productLayout = "atelier";
    localStorage.setItem("atelier-settings", JSON.stringify(settings));
  }
  localStorage.setItem("atelier-layout-version", "2");
}

if (Number(localStorage.getItem("atelier-catalog-version") || 1) < 2) {
  const currentIds = new Set(products.map((product) => product.id));
  products.push(...CATALOG_ADDITIONS.filter((product) => !currentIds.has(product.id)));
  localStorage.setItem("atelier-products", JSON.stringify(products));
  localStorage.setItem("atelier-catalog-version", "2");
}

if (Number(localStorage.getItem("atelier-catalog-version") || 1) < 3) {
  const currentIds = new Set(products.map((product) => product.id));
  products.push(...DEFAULT_PRODUCTS.filter((product) => !currentIds.has(product.id)));
  products = products.map((product) => {
    const media = localCatalogMedia(product.id);
    return media ? { ...product, ...media } : product;
  });
  localStorage.setItem("atelier-products", JSON.stringify(products));
  localStorage.setItem("atelier-catalog-version", "3");
}

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function loadJSON(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveData() {
  localStorage.setItem("atelier-settings", JSON.stringify(settings));
  localStorage.setItem("atelier-products", JSON.stringify(products));
  localStorage.setItem("atelier-cart", JSON.stringify(cart));
  const state = $("#saveState");
  if (state) {
    state.textContent = "Saving…";
    setTimeout(() => (state.textContent = "All changes saved"), 350);
  }
}

function openMediaDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("atelier-media", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeFile(file, key = crypto.randomUUID()) {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(file, key);
    tx.oncomplete = () => resolve(key);
    tx.onerror = () => reject(tx.error);
  });
}

async function getFileUrl(key) {
  if (!key) return "";
  const db = await openMediaDB();
  return new Promise((resolve) => {
    const request = db.transaction("files").objectStore("files").get(key);
    request.onsuccess = () => {
      if (!request.result) return resolve("");
      const url = URL.createObjectURL(request.result);
      objectUrls.push(url);
      resolve(url);
    };
    request.onerror = () => resolve("");
  });
}

async function deleteFile(key) {
  if (!key) return;
  const db = await openMediaDB();
  return new Promise((resolve) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").delete(key);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
}

async function mediaUrl(value) {
  if (!value) return "";
  return value.startsWith("http") || value.startsWith("assets/") ? value : getFileUrl(value);
}

function isStoredMediaKey(value) {
  return Boolean(value) && !value.startsWith("http") && !value.startsWith("assets/");
}

function waitForVideoFrame(video, timeoutMs = 15000) {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => finish(new Error("The video took too long to load.")), timeoutMs);
    const onReady = () => finish();
    const onError = () => {
      const detail = video.error?.message || "This video format cannot be decoded by the browser.";
      finish(new Error(detail));
    };
    function finish(error) {
      clearTimeout(timeout);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
      error ? reject(error) : resolve();
    }
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function resetHeroVideo() {
  const video = $("#heroVideo");
  video.pause();
  video.classList.remove("ready");
  video.hidden = true;
  video.removeAttribute("src");
  video.load();
  $("#heroFallback").hidden = false;
}

function setVideoStatus(message = "") {
  const status = $("#videoStatus");
  status.textContent = message;
  status.classList.toggle("visible", Boolean(message));
}

function applyTheme() {
  document.documentElement.style.setProperty("--accent", settings.accent);
  document.documentElement.style.setProperty("--soft", settings.soft);
  document.documentElement.style.setProperty("--ink", settings.dark);
  $("#headerBrand").textContent = settings.brandName;
  $(".footer-brand").textContent = settings.brandName;
  document.title = `${settings.brandName} — Independent Fashion`;
  $("#heroEyebrow").textContent = settings.heroEyebrow;
  $("#heroTitle").innerHTML = escapeHTML(settings.heroTitle).replace(/\n/g, "<br />");
  $("#brandNameInput").value = settings.brandName;
  $("#heroEyebrowInput").value = settings.heroEyebrow;
  $("#heroTitleInput").value = settings.heroTitle;
  $("#accentColor").value = settings.accent;
  $("#softColor").value = settings.soft;
  $("#darkColor").value = settings.dark;
}

function fontStack(name) {
  if (name === "Custom font") return '"Atelier Custom", sans-serif';
  return FONT_OPTIONS.find(([fontName]) => fontName === name)?.[1] || '"DM Sans", Arial, sans-serif';
}

function refreshFontSelects() {
  const customOption = settings.customFontKey
    ? `<option value="Custom font">Custom font — ${escapeHTML(settings.customFontName || "Uploaded TTF")}</option>`
    : "";
  const options = FONT_OPTIONS.map(([name, stack]) =>
    `<option value="${name}" style='font-family:${stack}'>${name}</option>`
  ).join("");
  ["displayFontSelect", "bodyFontSelect"].forEach((id) => {
    const select = $(`#${id}`);
    select.innerHTML = options + customOption;
  });
  $("#displayFontSelect").value = settings.displayFont || DEFAULT_SETTINGS.displayFont;
  $("#bodyFontSelect").value = settings.bodyFont || DEFAULT_SETTINGS.bodyFont;
  $("#customFontFileName").textContent = settings.customFontKey
    ? settings.customFontName || "Custom font active"
    : "No custom font uploaded";
  $("#removeCustomFont").hidden = !settings.customFontKey;
}

async function applyTypography() {
  if (customFontFace) {
    document.fonts.delete(customFontFace);
    customFontFace = null;
  }
  if (settings.customFontKey) {
    const fontUrl = await mediaUrl(settings.customFontKey);
    if (!fontUrl) return false;
    try {
      customFontFace = await new FontFace("Atelier Custom", `url("${fontUrl}") format("truetype")`).load();
      document.fonts.add(customFontFace);
    } catch (error) {
      console.error("Custom font could not be loaded:", error);
      return false;
    }
  }
  document.documentElement.style.setProperty("--display-font", fontStack(settings.displayFont));
  document.documentElement.style.setProperty("--body-font", fontStack(settings.bodyFont));
  refreshFontSelects();
  return true;
}

async function applyMedia() {
  const logo = $("#headerLogo");
  const logoUrl = await mediaUrl(settings.logoKey);
  logo.hidden = !logoUrl;
  $("#headerBrand").hidden = Boolean(logoUrl);
  if (logoUrl) {
    logo.src = logoUrl;
  } else {
    logo.removeAttribute("src");
  }
  $("#logoFileName").textContent = logoUrl ? "Custom logo active" : "No file selected";

  const video = $("#heroVideo");
  const videoUrl = await mediaUrl(settings.videoKey);
  if (videoUrl) {
    resetHeroVideo();
    setVideoStatus("");
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = videoUrl;
    video.hidden = false;
    const frameReady = waitForVideoFrame(video);
    video.load();
    $("#videoFileName").textContent = "Loading campaign video…";
    $("#removeVideo").hidden = false;
    try {
      await frameReady;
      await video.play();
      video.classList.add("ready");
      $("#videoFileName").textContent = "Campaign video active";
      return true;
    } catch (error) {
      resetHeroVideo();
      $("#videoFileName").textContent = "Video could not be played";
      setVideoStatus("This MP4 uses a codec your browser cannot play, or the file is damaged. Export it as H.264 video with AAC audio, then upload it again.");
      console.error("Hero video playback failed:", error);
      return false;
    }
  } else {
    resetHeroVideo();
    setVideoStatus("");
    $("#videoFileName").textContent = "Using campaign image";
    $("#removeVideo").hidden = true;
    return true;
  }
}

function escapeHTML(value = "") {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function formatPrice(value) {
  return new Intl.NumberFormat("en", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

async function renderProducts() {
  const grid = $("#productGrid");
  const filtered = products.filter((product) => {
    const matchesFilter = activeFilter === "All" || product.category === activeFilter;
    const haystack = `${product.name} ${product.category} ${product.color} ${product.description}`.toLowerCase();
    return matchesFilter && haystack.includes(searchTerm.toLowerCase());
  });
  const cards = await Promise.all(filtered.map(async (product, index) => {
    const primary = await mediaUrl(product.image);
    const model = await mediaUrl(product.modelImage || product.image);
    return `
      <article class="product-card" data-product-id="${product.id}" role="link" tabindex="0" aria-label="View ${escapeHTML(product.name)}">
        <div class="product-media">
          ${index < 2 ? '<span class="product-badge">New</span>' : ""}
          <img class="primary-image" src="${primary}" alt="${escapeHTML(product.name)}" loading="lazy" />
          <img class="model-image" src="${model}" alt="${escapeHTML(product.name)} worn on model" loading="lazy" />
          <button class="quick-add" data-add-cart="${product.id}" aria-label="Add ${escapeHTML(product.name)} to bag">+</button>
        </div>
        <div class="product-info">
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.color || product.category)}</p>
          <strong>${formatPrice(product.price)}</strong>
        </div>
      </article>`;
  }));
  grid.innerHTML = cards.join("");
  $("#emptyState").hidden = filtered.length > 0;
}

async function renderArrivalRail() {
  const featured = products.slice(0, 8);
  const cards = await Promise.all(featured.map(async (product) => `
    <article class="arrival-card" data-product-id="${product.id}" role="link" tabindex="0">
      <div class="arrival-image">
        <img src="${await mediaUrl(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" />
      </div>
      <p>${escapeHTML(product.name)}</p>
      <span>${formatPrice(product.price)}</span>
    </article>
  `));
  const firstSet = cards.join("");
  const duplicateSet = cards.map((card) =>
    card.replace('role="link" tabindex="0"', 'role="presentation" tabindex="-1" aria-hidden="true"')
  ).join("");
  $("#arrivalRail").innerHTML = `
    <div class="arrival-track">
      <div class="arrival-set">${firstSet}</div>
      <div class="arrival-set" aria-hidden="true">${duplicateSet}</div>
    </div>
  `;
}

function observeArrivalCarousel() {
  const section = $(".arrival-section");
  if (!section) return;
  if (!("IntersectionObserver" in window)) {
    section.classList.add("carousel-started");
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    section.classList.add("carousel-started");
    observer.disconnect();
  }, {
    threshold: 0.15,
  });
  observer.observe(section);
}

function productSizes(product) {
  if (product.category === "Shoes") return ["36", "37", "38", "39", "40", "41"];
  if (product.category === "Bags" || product.category === "Accessories") return ["One size"];
  return ["XS", "S", "M", "L", "XL"];
}

async function renderProductPageLegacy(product) {
  const page = $("#productPage");
  const productLayout = ["maison", "luisa", "mango"].includes(settings.productLayout) ? settings.productLayout : "maison";
  page.className = `product-page product-layout-${productLayout}`;
  const galleryValues = product.gallery?.length
    ? product.gallery
    : [product.image, product.modelImage || product.image];
  const galleryImages = await Promise.all(galleryValues.map(mediaUrl));
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const relatedCards = await Promise.all(related.map(async (item) => `
    <article class="related-card" data-product-id="${item.id}" role="link" tabindex="0">
      <img src="${await mediaUrl(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" />
      <div><span>${escapeHTML(item.name)}</span><strong>${formatPrice(item.price)}</strong></div>
    </article>
  `));
  selectedProductSize = "";
  page.innerHTML = `
    <div class="product-breadcrumb">
      <a href="#new">Shop</a><span>/</span><a href="#new" data-product-category="${escapeHTML(product.category)}">${escapeHTML(product.category)}</a><span>/</span><span>${escapeHTML(product.name)}</span>
    </div>
    <div class="product-detail-layout">
      <div class="product-gallery">
        ${galleryImages.map((source, index) => `
          <figure class="${index >= 2 ? "product-closeup" : ""}">
            <img src="${source}" alt="${escapeHTML(product.name)} ${["product view", "worn on model", "construction detail", "material close-up"][index] || "detail view"}" />
          </figure>
        `).join("")}
      </div>
      <aside class="purchase-panel">
        <p class="eyebrow">${escapeHTML(product.category)} · New collection</p>
        <div class="purchase-title"><h1>${escapeHTML(product.name)}</h1><strong>${formatPrice(product.price)}</strong></div>
        <p class="product-colour">${escapeHTML(product.color || "")}</p>
        <p class="product-description">${escapeHTML(product.description || "A considered piece selected for the new collection.")}</p>
        <div class="size-heading"><span>Select size</span><button type="button" data-size-guide>Size guide</button></div>
        <div class="size-grid">
          ${productSizes(product).map((size) => `<button type="button" data-product-size="${size}">${size}</button>`).join("")}
        </div>
        <button class="product-add-button" data-detail-add="${product.id}">Add to bag</button>
        <p class="delivery-note">Complimentary delivery over €100 · Returns within 14 days</p>
        <div class="product-accordions">
          <details open><summary>Product details</summary><p>${escapeHTML(product.description || "")} Designed for an easy fit and finished with careful internal construction.</p></details>
          <details><summary>Materials & care</summary><p>Care information is supplied by the shop owner for each listing. Follow the garment label for best results.</p></details>
          <details><summary>Delivery & returns</summary><p>Orders are prepared within 1–2 working days. Returns are accepted in original condition within 14 days.</p></details>
        </div>
      </aside>
    </div>
    <section class="related-section">
      <div><p class="eyebrow">Complete the edit</p><h2>You may also like</h2></div>
      <div class="related-grid">${relatedCards.join("")}</div>
    </section>
  `;
}

async function renderProductPage(product) {
  const page = $("#productPage");
  const productLayout = ["atelier", "maison", "luisa", "mango"].includes(settings.productLayout)
    ? settings.productLayout
    : "atelier";
  page.className = `product-page product-layout-${productLayout}`;

  const galleryValues = product.gallery?.length
    ? product.gallery
    : [product.image, product.modelImage || product.image];
  const galleryImages = await Promise.all(galleryValues.map(mediaUrl));
  const sizes = productSizes(product);
  const sizeButtons = sizes.map((size) =>
    `<button type="button" data-product-size="${size}">${size}</button>`
  ).join("");
  const accordionContent = `
    <div class="product-accordions">
      <details open><summary>Product details</summary><p>${escapeHTML(product.description || "")} Designed for an easy fit and finished with careful internal construction.</p></details>
      <details><summary>Materials & care</summary><p>Care information is supplied by the shop owner for each listing. Follow the garment label for best results.</p></details>
      <details><summary>Delivery & returns</summary><p>Orders are prepared within 1-2 working days. Returns are accepted in original condition within 14 days.</p></details>
    </div>
  `;

  const atelierLayout = `
    <div class="product-breadcrumb">
      <a href="#new">Shop</a><span>/</span><a href="#new" data-product-category="${escapeHTML(product.category)}">${escapeHTML(product.category)}</a><span>/</span><span>${escapeHTML(product.name)}</span>
    </div>
    <div class="product-detail-layout">
      <div class="product-gallery">
        ${galleryImages.map((source, index) => `
          <figure class="${index >= 2 ? "product-closeup" : ""}">
            <img src="${source}" alt="${escapeHTML(product.name)} ${["product view", "worn on model", "construction detail", "material close-up"][index] || "detail view"}" />
          </figure>
        `).join("")}
      </div>
      <aside class="purchase-panel">
        <p class="eyebrow">${escapeHTML(product.category)} &middot; New collection</p>
        <div class="purchase-title"><h1>${escapeHTML(product.name)}</h1><strong>${formatPrice(product.price)}</strong></div>
        <p class="product-colour">${escapeHTML(product.color || "")}</p>
        <p class="product-description">${escapeHTML(product.description || "")}</p>
        <div class="size-heading"><span>Select size</span><button type="button" data-size-guide>Size guide</button></div>
        <div class="size-grid">${sizeButtons}</div>
        <button class="product-add-button" data-detail-add="${product.id}">Add to bag</button>
        <p class="delivery-note">Complimentary delivery over &euro;100 &middot; Returns within 14 days</p>
        ${accordionContent}
      </aside>
    </div>
  `;

  const maisonLayout = `
    <div class="maison-product-shell">
      <div class="maison-thumbnails" aria-label="Product images">
        ${galleryImages.map((source, index) => `
          <button class="${index === 0 ? "active" : ""}" data-product-thumb="${source}" aria-label="View image ${index + 1}">
            <img src="${source}" alt="" />
          </button>
        `).join("")}
      </div>
      <div class="maison-stage">
        <img src="${galleryImages[0]}" data-main-product-image alt="${escapeHTML(product.name)}" />
      </div>
      <aside class="maison-info">
        <p class="maison-category">${escapeHTML(product.category)}</p>
        <h1>${escapeHTML(product.name)}</h1>
        <strong class="maison-price">${formatPrice(product.price)}</strong>
        <button class="maison-wishlist" aria-label="Add to wishlist">♡</button>
        <div class="maison-colour"><span class="colour-chip"></span><p>${escapeHTML(product.color || "")}</p></div>
        <div class="maison-buy">
          <button type="button" class="maison-size-guide" data-size-guide>Size guide</button>
          <select data-product-size-select aria-label="Select size">
            <option value="">Size</option>
            ${sizes.map((size) => `<option value="${size}">${size}</option>`).join("")}
          </select>
          <button class="product-add-button" data-detail-add="${product.id}">Add to bag</button>
        </div>
        <p class="maison-description">${escapeHTML(product.description || "")}</p>
        ${accordionContent}
      </aside>
    </div>
  `;

  const luisaLayout = `
    <div class="luisa-product-shell">
      <div class="luisa-stage"><img src="${galleryImages[0]}" alt="${escapeHTML(product.name)}" /></div>
      <aside class="luisa-commerce-panel">
        <button class="luisa-wishlist" aria-label="Add to wishlist">♡</button>
        <p class="luisa-brand">${settings.brandName}</p>
        <h1>${escapeHTML(product.name)}</h1>
        <strong class="luisa-price">${formatPrice(product.price)}</strong>
        <div class="luisa-rule"></div>
        <div class="luisa-colour-row"><span>Color<br>${escapeHTML(product.color || "")}</span><i></i></div>
        <div class="luisa-size-block"><span>Size</span><div class="luisa-size-grid">${sizeButtons}</div></div>
        <div class="luisa-buy-row">
          <div class="quantity-control"><button data-qty-minus>−</button><span data-qty-value>1</span><button data-qty-plus>+</button></div>
          <button class="product-add-button" data-detail-add="${product.id}">Add to Bag&nbsp;&nbsp; ${formatPrice(product.price)}</button>
        </div>
        <ul class="luisa-benefits">
          <li>Free 14 days returns</li><li>Free shipping on orders over &euro;100</li>
          <li>Express delivery available</li><li>Secure payments</li>
        </ul>
        ${accordionContent}
      </aside>
    </div>
    <div class="luisa-secondary-gallery">
      ${galleryImages.slice(1).map((source) => `<img src="${source}" alt="${escapeHTML(product.name)} detail" />`).join("")}
    </div>
  `;

  const mangoLayout = `
    <div class="mango-product-shell">
      <div class="mango-image-grid">
        <img src="${galleryImages[1] || galleryImages[0]}" alt="${escapeHTML(product.name)} worn view" />
        <img src="${galleryImages[0]}" alt="${escapeHTML(product.name)} product view" />
      </div>
      <aside class="mango-info">
        <p class="mango-exclusive">Online exclusive</p>
        <h1>${escapeHTML(product.name)}</h1>
        <strong>${formatPrice(product.price)}</strong>
        <div class="mango-colour-row"><span class="colour-chip"></span><p>${escapeHTML(product.color || "")}</p></div>
        <p class="mango-model-note">The model wears size S and is 176 cm tall.</p>
        <div class="mango-size-grid">${sizeButtons}</div>
        <button type="button" class="mango-size-guide" data-size-guide>Size guide</button>
        <div class="mango-add-row">
          <button class="product-add-button" data-detail-add="${product.id}">Add</button>
          <button class="mango-heart" aria-label="Add to wishlist">♡</button>
        </div>
        <button class="mango-look-button">View the look</button>
        <p class="mango-shipping">Free delivery to store</p>
        <p class="mango-description">${escapeHTML(product.description || "")} Made for an easy fit with considered finishing.</p>
        ${accordionContent}
      </aside>
    </div>
    <div class="mango-secondary-gallery">
      ${galleryImages.slice(2).map((source) => `<img src="${source}" alt="${escapeHTML(product.name)} detail" />`).join("")}
    </div>
  `;

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const relatedCards = await Promise.all(related.map(async (item) => `
    <article class="related-card" data-product-id="${item.id}" role="link" tabindex="0">
      <img src="${await mediaUrl(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" />
      <div><span>${escapeHTML(item.name)}</span><strong>${formatPrice(item.price)}</strong></div>
    </article>
  `));

  selectedProductSize = "";
  page.innerHTML = `
    ${{ atelier: atelierLayout, maison: maisonLayout, luisa: luisaLayout, mango: mangoLayout }[productLayout]}
    <section class="related-section">
      <div><p class="eyebrow">Complete the edit</p><h2>You may also like</h2></div>
      <div class="related-grid">${relatedCards.join("")}</div>
    </section>
  `;
}

async function handleRoute() {
  const match = location.hash.match(/^#product\/(.+)$/);
  if (!match) {
    document.body.classList.remove("product-view");
    $("#storefrontMain").hidden = false;
    $("#productPage").hidden = true;
    $("#siteHeader").classList.toggle("scrolled", scrollY > 160);
    document.title = `${settings.brandName} — Independent Fashion`;
    return;
  }
  const product = products.find((item) => item.id === decodeURIComponent(match[1]));
  if (!product) {
    location.hash = "new";
    return;
  }
  document.body.classList.add("product-view");
  $("#storefrontMain").hidden = true;
  $("#productPage").hidden = false;
  $("#siteHeader").classList.add("scrolled");
  await renderProductPage(product);
  document.title = `${product.name} — ${settings.brandName}`;
  window.scrollTo(0, 0);
}

function renderFilters() {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  $("#filters").innerHTML = categories.map((category) =>
    `<button class="filter-chip ${category === activeFilter ? "active" : ""}" data-filter="${category}">${category}</button>`
  ).join("");
}

async function renderAdminProducts() {
  const categories = ["All", ...new Set(products.map((product) => product.category).filter(Boolean))];
  $("#adminCategoryFilter").innerHTML = categories.map((category) =>
    `<option value="${escapeHTML(category)}">${category === "All" ? "All categories" : escapeHTML(category)}</option>`
  ).join("");
  if (!categories.includes(adminCategoryFilter)) adminCategoryFilter = "All";
  $("#adminCategoryFilter").value = adminCategoryFilter;

  const query = adminProductSearch.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = adminCategoryFilter === "All" || product.category === adminCategoryFilter;
    const searchable = `${product.name} ${product.category} ${product.color || ""} ${product.description || ""}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });
  const sorted = [...filtered].sort((a, b) => {
    if (adminProductSort === "name-asc") return a.name.localeCompare(b.name);
    if (adminProductSort === "name-desc") return b.name.localeCompare(a.name);
    if (adminProductSort === "price-asc") return Number(a.price) - Number(b.price);
    if (adminProductSort === "price-desc") return Number(b.price) - Number(a.price);
    return products.indexOf(a) - products.indexOf(b);
  });

  $("#adminProductCount").textContent = `${sorted.length} of ${products.length} product${products.length === 1 ? "" : "s"}`;
  $("#adminFilterSummary").textContent = adminCategoryFilter === "All"
    ? (query ? `Search: “${adminProductSearch.trim()}”` : "Showing all categories")
    : `${adminCategoryFilter}${query ? ` · “${adminProductSearch.trim()}”` : ""}`;

  const rows = await Promise.all(sorted.map(async (product) => {
    const image = await mediaUrl(product.image);
    return `
      <div class="admin-product-row">
        <img src="${image}" alt="" />
        <div><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(product.color || "")}</p></div>
        <span>${escapeHTML(product.category)}</span>
        <p>${formatPrice(product.price)}</p>
        <div class="row-actions">
          <button data-edit-product="${product.id}">Edit</button>
          <button data-delete-product="${product.id}">Delete</button>
        </div>
      </div>`;
  }));
  $("#productAdminList").innerHTML = rows.length
    ? rows.join("")
    : '<div class="empty-state"><p>No products match these filters.</p><button class="underlined-button" data-clear-admin-filters>Clear filters</button></div>';
}

async function renderCart() {
  const container = $("#cartItems");
  $("#cartCount").textContent = cart.length;
  const cartProducts = cart.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  if (!cartProducts.length) {
    container.innerHTML = '<div class="cart-empty"><div><p class="eyebrow">Nothing here yet</p><h3>Your bag is waiting.</h3></div></div>';
  } else {
    const lines = await Promise.all(cartProducts.map(async (product, index) => `
      <div class="cart-line">
        <img src="${await mediaUrl(product.image)}" alt="" />
        <div><h4>${escapeHTML(product.name)}</h4><p>${escapeHTML(product.color || product.category)}</p><p>${formatPrice(product.price)}</p></div>
        <button data-remove-cart="${index}" aria-label="Remove item">×</button>
      </div>`));
    container.innerHTML = lines.join("");
  }
  const subtotal = cartProducts.reduce((sum, product) => sum + Number(product.price), 0);
  $("#cartSubtotal").textContent = formatPrice(subtotal);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function addProductToCart(id) {
  cart.push(id);
  saveData();
  renderCart();
  showToast("Added to your bag");
}

function openAdmin(tab = "brand") {
  $("#adminShell").classList.add("open");
  $("#adminShell").setAttribute("aria-hidden", "false");
  document.body.classList.add("admin-open");
  selectAdminTab(tab);
  renderAdminProducts();
}

function closeAdmin() {
  $("#adminShell").classList.remove("open");
  $("#adminShell").setAttribute("aria-hidden", "true");
  document.body.classList.remove("admin-open");
}

function selectAdminTab(tab) {
  $$("[data-admin-tab]").forEach((button) => button.classList.toggle("active", button.dataset.adminTab === tab));
  $$("[data-admin-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.adminPanel === tab));
}

function syncProductLayoutControls() {
  const selected = settings.productLayout || "atelier";
  $$("[data-product-layout]").forEach((option) => {
    const active = option.dataset.productLayout === selected;
    option.classList.toggle("selected", active);
    option.setAttribute("aria-checked", String(active));
  });
}

function openProductDialog(product = null) {
  $("#productForm").reset();
  $("#productId").value = product?.id || "";
  $("#productDialogTitle").textContent = product ? "Edit product" : "Add a product";
  $("#productName").value = product?.name || "";
  $("#productPrice").value = product?.price || "";
  $("#productCategory").value = product?.category || "Dresses";
  $("#productColor").value = product?.color || "";
  $("#productDescription").value = product?.description || "";
  $("#productDialog").showModal();
}

async function deleteProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product || !confirm(`Delete “${product.name}”?`)) return;
  if (isStoredMediaKey(product.image)) await deleteFile(product.image);
  if (isStoredMediaKey(product.modelImage)) await deleteFile(product.modelImage);
  products = products.filter((item) => item.id !== id);
  cart = cart.filter((item) => item !== id);
  saveData();
  await Promise.all([renderProducts(), renderArrivalRail(), renderAdminProducts(), renderCart()]);
  renderFilters();
  showToast("Product deleted");
}

$("#adminOpen").addEventListener("click", () => openAdmin());
$("[data-open-admin]").addEventListener("click", () => openAdmin());
$("#adminClose").addEventListener("click", closeAdmin);
$$("[data-admin-tab]").forEach((button) => button.addEventListener("click", () => selectAdminTab(button.dataset.adminTab)));
$$("[data-product-layout]").forEach((option) => option.addEventListener("click", async () => {
  settings.productLayout = option.dataset.productLayout;
  saveData();
  syncProductLayoutControls();
  if (location.hash.startsWith("#product/")) await handleRoute();
  showToast(`${option.querySelector("strong").textContent} product layout selected`);
}));
["displayFontSelect", "bodyFontSelect"].forEach((id) => {
  $(`#${id}`).addEventListener("change", async (event) => {
    const key = id === "displayFontSelect" ? "displayFont" : "bodyFont";
    settings[key] = event.target.value;
    saveData();
    await applyTypography();
    showToast("Typography updated");
  });
});
$("#previewProductLayout").addEventListener("click", () => {
  closeAdmin();
  location.hash = `product/${encodeURIComponent(products[0].id)}`;
});
$("#addProductButton").addEventListener("click", () => openProductDialog());
$$("[data-close-product]").forEach((button) => button.addEventListener("click", () => $("#productDialog").close()));

$("#productForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = $("#productId").value || crypto.randomUUID();
  const existing = products.find((product) => product.id === id);
  const imageFile = $("#productImage").files[0];
  const modelFile = $("#productModelImage").files[0];
  if (!existing && !imageFile) {
    showToast("Please add a product photo");
    return;
  }
  const image = imageFile ? await storeFile(imageFile) : existing.image;
  const modelImage = modelFile ? await storeFile(modelFile) : (existing?.modelImage || image);
  if (imageFile && isStoredMediaKey(existing?.image)) await deleteFile(existing.image);
  if (modelFile && isStoredMediaKey(existing?.modelImage)) await deleteFile(existing.modelImage);
  const gallery = existing?.gallery?.length ? [...existing.gallery] : [image, modelImage];
  gallery[0] = image;
  gallery[1] = modelImage;
  const updated = {
    id,
    name: $("#productName").value.trim(),
    price: Number($("#productPrice").value),
    category: $("#productCategory").value,
    color: $("#productColor").value.trim(),
    description: $("#productDescription").value.trim(),
    image,
    modelImage,
    gallery,
  };
  products = existing ? products.map((product) => product.id === id ? updated : product) : [updated, ...products];
  saveData();
  $("#productDialog").close();
  renderFilters();
  await Promise.all([renderProducts(), renderArrivalRail(), renderAdminProducts()]);
  showToast(existing ? "Product updated" : "Product published");
});

$("#productAdminList").addEventListener("click", (event) => {
  const editId = event.target.dataset.editProduct;
  const deleteId = event.target.dataset.deleteProduct;
  if (editId) openProductDialog(products.find((product) => product.id === editId));
  if (deleteId) deleteProduct(deleteId);
  if (event.target.dataset.clearAdminFilters !== undefined) clearAdminProductFilters();
});

function clearAdminProductFilters() {
  adminProductSearch = "";
  adminCategoryFilter = "All";
  adminProductSort = "newest";
  $("#adminProductSearch").value = "";
  $("#adminProductSort").value = "newest";
  renderAdminProducts();
}

$("#adminProductSearch").addEventListener("input", (event) => {
  adminProductSearch = event.target.value;
  renderAdminProducts();
});
$("#adminCategoryFilter").addEventListener("change", (event) => {
  adminCategoryFilter = event.target.value;
  renderAdminProducts();
});
$("#adminProductSort").addEventListener("change", (event) => {
  adminProductSort = event.target.value;
  renderAdminProducts();
});
$("#clearAdminFilters").addEventListener("click", clearAdminProductFilters);

$("#productGrid").addEventListener("click", (event) => {
  const id = event.target.dataset.addCart;
  if (id) {
    event.stopPropagation();
    addProductToCart(id);
    return;
  }
  const card = event.target.closest("[data-product-id]");
  if (card) location.hash = `product/${encodeURIComponent(card.dataset.productId)}`;
});

document.addEventListener("click", (event) => {
  const thumbnail = event.target.closest("[data-product-thumb]");
  if (thumbnail) {
    const mainImage = $("[data-main-product-image]", $("#productPage"));
    if (mainImage) mainImage.src = thumbnail.dataset.productThumb;
    $$("[data-product-thumb]", $("#productPage")).forEach((button) => button.classList.toggle("active", button === thumbnail));
  }

  if (event.target.dataset.qtyMinus !== undefined || event.target.dataset.qtyPlus !== undefined) {
    const value = $("[data-qty-value]", $("#productPage"));
    const current = Number(value?.textContent || 1);
    if (value) value.textContent = String(event.target.dataset.qtyMinus !== undefined ? Math.max(1, current - 1) : current + 1);
  }

  const card = event.target.closest(".arrival-card, .related-card");
  if (card?.dataset.productId) location.hash = `product/${encodeURIComponent(card.dataset.productId)}`;

  const size = event.target.dataset.productSize;
  if (size) {
    selectedProductSize = size;
    $$("[data-product-size]", $("#productPage")).forEach((button) => button.classList.toggle("selected", button.dataset.productSize === size));
  }

  const detailId = event.target.dataset.detailAdd;
  if (detailId) {
    const product = products.find((item) => item.id === detailId);
    if (productSizes(product).length > 1 && !selectedProductSize) {
      showToast("Please select a size");
      return;
    }
    addProductToCart(detailId);
  }

  if (event.target.dataset.sizeGuide !== undefined) {
    showToast("Size guide content can be customized by the shop owner");
  }

  if (event.target.dataset.productCategory) {
    activeFilter = event.target.dataset.productCategory;
    renderFilters();
    renderProducts();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.dataset.productSizeSelect === undefined) return;
  selectedProductSize = event.target.value;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (event.target.closest("button, a, input, select, textarea")) return;
  const card = event.target.closest("[data-product-id]");
  if (!card) return;
  event.preventDefault();
  location.hash = `product/${encodeURIComponent(card.dataset.productId)}`;
});

$("#cartItems").addEventListener("click", (event) => {
  if (event.target.dataset.removeCart === undefined) return;
  cart.splice(Number(event.target.dataset.removeCart), 1);
  saveData();
  renderCart();
});

$("#filters").addEventListener("click", (event) => {
  if (!event.target.dataset.filter) return;
  activeFilter = event.target.dataset.filter;
  renderFilters();
  renderProducts();
});

$$(".category-card, .editorial-card").forEach((card) => card.addEventListener("click", () => {
  activeFilter = card.dataset.category;
  renderFilters();
  renderProducts();
}));

$("[data-reset-filter]").addEventListener("click", () => {
  activeFilter = "All";
  searchTerm = "";
  renderFilters();
  renderProducts();
});

$("#cartOpen").addEventListener("click", () => {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
});
$("[data-close-cart]").addEventListener("click", () => {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
});

$("#searchButton").addEventListener("click", () => {
  $("#searchOverlay").hidden = false;
  setTimeout(() => $("#searchInput").focus(), 0);
});
$("[data-close-search]").addEventListener("click", () => ($("#searchOverlay").hidden = true));
$("#searchInput").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  activeFilter = "All";
  renderFilters();
  renderProducts();
  if (searchTerm) {
    $("#searchOverlay").hidden = true;
    location.hash = "new";
  }
});

$("#menuButton").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$("#mainNav").addEventListener("click", () => $("#mainNav").classList.remove("open"));
window.addEventListener("scroll", () => {
  if (!document.body.classList.contains("product-view")) {
    $("#siteHeader").classList.toggle("scrolled", scrollY > 160);
  }
}, { passive: true });
window.addEventListener("hashchange", handleRoute);

["brandNameInput", "heroEyebrowInput", "heroTitleInput"].forEach((id) => {
  $(`#${id}`).addEventListener("input", (event) => {
    const key = { brandNameInput: "brandName", heroEyebrowInput: "heroEyebrow", heroTitleInput: "heroTitle" }[id];
    settings[key] = event.target.value || DEFAULT_SETTINGS[key];
    applyTheme();
    saveData();
  });
});

["accentColor", "softColor", "darkColor"].forEach((id) => {
  $(`#${id}`).addEventListener("input", (event) => {
    const key = { accentColor: "accent", softColor: "soft", darkColor: "dark" }[id];
    settings[key] = event.target.value;
    applyTheme();
    saveData();
  });
});

$("#logoInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  await deleteFile(settings.logoKey);
  settings.logoKey = await storeFile(file);
  saveData();
  await applyMedia();
  showToast("Logo updated");
});

$("#videoInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const extension = file.name.split(".").pop()?.toLowerCase();
  const supportedType = file.type === "video/mp4" || file.type === "video/webm" || extension === "mp4" || extension === "webm";
  if (!supportedType) {
    setVideoStatus("Please choose an MP4 or WebM video.");
    showToast("That video format is not supported");
    event.target.value = "";
    return;
  }
  const previousKey = settings.videoKey;
  let newKey = "";
  $("#videoFileName").textContent = "Saving video…";
  setVideoStatus("");
  try {
    newKey = await storeFile(file);
    settings.videoKey = newKey;
    saveData();
    const playable = await applyMedia();
    if (!playable) {
      await deleteFile(newKey);
      settings.videoKey = previousKey;
      saveData();
      await applyMedia();
      setVideoStatus("This MP4 uses a codec your browser cannot play. Export it as H.264 video with AAC audio, then upload it again.");
      showToast("Video format could not be played");
      return;
    }
    await deleteFile(previousKey);
    showToast("Campaign video updated");
  } catch (error) {
    await deleteFile(newKey);
    settings.videoKey = previousKey;
    saveData();
    await applyMedia();
    const quotaMessage = error?.name === "QuotaExceededError"
      ? "The video is too large for this browser’s local storage. Try a shorter or more compressed MP4."
      : "The video could not be saved. Please try a smaller H.264 MP4.";
    setVideoStatus(quotaMessage);
    showToast("Video upload failed");
    console.error("Hero video upload failed:", error);
  }
  event.target.value = "";
});

$("#customFontInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const isTtf = file.name.toLowerCase().endsWith(".ttf");
  if (!isTtf) {
    showToast("Please choose a .ttf font file");
    event.target.value = "";
    return;
  }
  const previous = {
    key: settings.customFontKey,
    name: settings.customFontName,
    display: settings.displayFont,
    body: settings.bodyFont,
  };
  let newKey = "";
  try {
    newKey = await storeFile(file);
    settings.customFontKey = newKey;
    settings.customFontName = file.name.replace(/\.ttf$/i, "");
    settings.displayFont = "Custom font";
    saveData();
    const loaded = await applyTypography();
    if (!loaded) throw new Error("Invalid TrueType font");
    await deleteFile(previous.key);
    showToast("Custom font uploaded");
  } catch (error) {
    await deleteFile(newKey);
    settings.customFontKey = previous.key;
    settings.customFontName = previous.name;
    settings.displayFont = previous.display;
    settings.bodyFont = previous.body;
    saveData();
    await applyTypography();
    showToast("That font file could not be loaded");
    console.error("Custom font upload failed:", error);
  }
  event.target.value = "";
});

$("#removeCustomFont").addEventListener("click", async () => {
  const previousKey = settings.customFontKey;
  if (settings.displayFont === "Custom font") settings.displayFont = DEFAULT_SETTINGS.displayFont;
  if (settings.bodyFont === "Custom font") settings.bodyFont = DEFAULT_SETTINGS.bodyFont;
  settings.customFontKey = "";
  settings.customFontName = "";
  await deleteFile(previousKey);
  saveData();
  await applyTypography();
  $("#customFontInput").value = "";
  showToast("Custom font removed");
});

$("#removeVideo").addEventListener("click", async () => {
  await deleteFile(settings.videoKey);
  settings.videoKey = "";
  saveData();
  await applyMedia();
  showToast("Campaign image restored");
});

$("#resetDemo").addEventListener("click", async () => {
  if (!confirm("Reset all branding, products and cart items to the original demo?")) return;
  const previousLogoKey = settings.logoKey;
  const previousVideoKey = settings.videoKey;
  const previousFontKey = settings.customFontKey;
  await Promise.all([
    deleteFile(previousLogoKey),
    deleteFile(previousVideoKey),
    deleteFile(previousFontKey),
  ]);
  settings = structuredClone(DEFAULT_SETTINGS);
  products = structuredClone(DEFAULT_PRODUCTS);
  cart = [];
  $("#logoInput").value = "";
  $("#videoInput").value = "";
  $("#customFontInput").value = "";
  adminProductSearch = "";
  adminCategoryFilter = "All";
  adminProductSort = "newest";
  $("#adminProductSearch").value = "";
  $("#adminProductSort").value = "newest";
  saveData();
  applyTheme();
  await applyTypography();
  syncProductLayoutControls();
  await applyMedia();
  renderFilters();
  await Promise.all([renderProducts(), renderArrivalRail(), renderAdminProducts(), renderCart()]);
  showToast("Demo restored");
});

$("#checkoutButton").addEventListener("click", () => showToast("Checkout can connect to Stripe or Shopify next"));
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.target.reset();
  showToast("You’re on the list");
});

window.addEventListener("beforeunload", () => objectUrls.forEach(URL.revokeObjectURL));

async function init() {
  applyTheme();
  if (!settings.displayFont) settings.displayFont = DEFAULT_SETTINGS.displayFont;
  if (!settings.bodyFont) settings.bodyFont = DEFAULT_SETTINGS.bodyFont;
  refreshFontSelects();
  await applyTypography();
  const layoutPreview = new URLSearchParams(location.search).get("layout");
  if (["atelier", "maison", "luisa", "mango"].includes(layoutPreview)) settings.productLayout = layoutPreview;
  if (!settings.productLayout) settings.productLayout = "atelier";
  syncProductLayoutControls();
  await applyMedia();
  renderFilters();
  await Promise.all([renderProducts(), renderArrivalRail(), renderAdminProducts(), renderCart()]);
  observeArrivalCarousel();
  await handleRoute();
  const adminView = new URLSearchParams(location.search).get("admin");
  if (adminView) {
    const tab = ["brand", "products", "product-layout", "typography"].includes(adminView) ? adminView : "brand";
    openAdmin(tab);
  }
}

init();
