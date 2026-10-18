const cities = ["Abomey-Calavi", "Cotonou", "Porto-Novo", "Parakou", "Bohicon", "Ouidah", "Sèmè-Podji", "Kétou"];
const publicUniversities = [
  { name: "Université d'Abomey-Calavi", campus: "Campus d'Abomey-Calavi · Atlantique", city: "Abomey-Calavi", icon: "⌂" },
  { name: "Université de Parakou", campus: "Campus de Parakou · Borgou", city: "Parakou", icon: "✳" },
  { name: "UNSTIM", campus: "Sciences, technologies, ingénierie et mathématiques · Abomey", city: "Bohicon", icon: "⌘" },
  { name: "Université Nationale d'Agriculture", campus: "Campus de Kétou · Plateau", city: "Kétou", icon: "❋" }
];
const imageIds = [
  "photo-1600607687939-ce8a6c25118c", "photo-1600210492486-724fe5c67fb0", "photo-1600566753086-00f18fb6b3ea",
  "photo-1600607687920-4e2a09cf159d", "photo-1600566753190-17f0baa2a6c3", "photo-1600607687939-ce8a6c25118c",
  "photo-1600210492486-724fe5c67fb0", "photo-1600566753086-00f18fb6b3ea", "photo-1600607687920-4e2a09cf159d",
  "photo-1600566753190-17f0baa2a6c3"
];
const inventory = [
  ["Abomey-Calavi","Zogbadjè","Chambre","Chambre étudiante lumineuse proche du campus",35000,3,1,true],
  ["Abomey-Calavi","Arconville","Studio","Studio meublé avec terrasse privée",65000,1,1,true],
  ["Abomey-Calavi","Togbin","Appartement","Appartement familial calme et ventilé",120000,3,2,false],
  ["Abomey-Calavi","Bidossessi","Chambre","Chambre indépendante avec sanitaires",45000,2,1,true],
  ["Abomey-Calavi","Tankpè","Studio","Studio moderne dans une résidence sécurisée",300000,1,1,true,1],
  ["Abomey-Calavi","Akassato","Maison","Petite maison avec cour arborée",90000,2,2,false],
  ["Abomey-Calavi","Zogbadjè","Chambre","Chambre meublée à deux pas des amphis",40000,2,1,true],
  ["Abomey-Calavi","Godomey","Appartement","Appartement traversant avec balcon",105000,3,2,true],
  ["Abomey-Calavi","Fifadji-Calavi","Studio","Studio fonctionnel dans quartier calme",55000,1,1,false],
  ["Abomey-Calavi","Hêvié","Maison","Maison avec jardin et cuisine équipée",140000,4,2,true],
  ["Cotonou","Haie Vive","Studio","Studio cosy au cœur de la Haie Vive",95000,1,1,true],
  ["Cotonou","Fidjrossè","Appartement","Appartement lumineux proche de la plage",400000,3,2,true,1],
  ["Cotonou","Cadjèhoun","Chambre","Chambre indépendante, quartier central",60000,2,1,true],
  ["Cotonou","Akpakpa","Studio","Studio aéré dans résidence récente",70000,1,1,false],
  ["Cotonou","Agla","Appartement","Appartement 2 chambres avec cour",110000,3,2,true],
  ["Cotonou","Zogbo","Chambre","Chambre étudiante avec accès sécurisé",40000,2,1,true],
  ["Cotonou","Godomey-Togoudo","Maison","Maison familiale avec grande terrasse",130000,4,2,false],
  ["Cotonou","Gbegamey","Studio","Studio meublé proche des commodités",80000,1,1,true],
  ["Porto-Novo","Ouando","Chambre","Chambre calme près du centre-ville",30000,2,1,true],
  ["Porto-Novo","Tokpota","Appartement","Appartement familial au quartier Tokpota",320000,3,2,false,1],
  ["Porto-Novo","Avassa","Studio","Petit studio indépendant et ventilé",45000,1,1,true],
  ["Kétou","Centre-ville","Studio","Studio étudiant proche du campus",40000,1,1,true],
  ["Parakou","Tourou","Chambre","Chambre étudiante près du campus",30000,2,1,true],
  ["Parakou","Alaga","Appartement","Appartement spacieux avec balcon",80000,3,2,true],
  ["Parakou","Zongo","Studio","Studio pratique, quartier commerçant",50000,1,1,false],
  ["Bohicon","Centre-ville","Chambre","Chambre ventilée proche des transports",25000,2,1,true],
  ["Bohicon","Sodohomè","Appartement","Appartement tranquille avec cour",65000,3,2,false],
  ["Ouidah","Pahou","Studio","Studio lumineux dans quartier paisible",40000,1,1,true],
  ["Ouidah","Centre historique","Maison","Maison traditionnelle avec jardin",75000,3,2,false],
  ["Sèmè-Podji","Agblangandan","Chambre","Chambre à prix doux, accès indépendant",35000,2,1,true]
];
const descriptions = [
  "Un espace agréable et bien entretenu, idéal pour étudier ou se reposer. Commerces de proximité et transports accessibles dans le quartier.",
  "Un logement accueillant, pensé pour un quotidien confortable. Le propriétaire est disponible pour organiser une visite sur rendez-vous.",
  "Profitez d'une adresse pratique dans un quartier vivant, avec les commodités essentielles à proximité.",
  "Un cadre simple et lumineux qui offre l'essentiel pour s'installer sereinement au Bénin."
];
const demoListings = inventory.map((item, index) => {
  const [city, district, type, title, price, bedrooms, bathrooms, verified, roommateSlots = 0] = item;
  return {
    id: index + 1, city, district, type, title, price, bedrooms, bathrooms, verified,
    image: `https://images.unsplash.com/${imageIds[index % imageIds.length]}?auto=format&fit=crop&w=900&q=78`,
    description: descriptions[index % descriptions.length],
    deposit: price * 2, advance: price * 3, views: 84 + index * 17,
    area: 18 + (index % 6) * 8, available: true, demo: true, roommateSlots
  };
});
const ownerListings = JSON.parse(localStorage.getItem("studihome-owner-listings") || "[]");
let listings = [...demoListings, ...ownerListings];
const citySelect = document.querySelector("#filter-city");
const grid = document.querySelector("#listing-grid");
const money = amount => new Intl.NumberFormat("fr-FR").format(amount);
const favorites = new Set(JSON.parse(localStorage.getItem("studihome-favorites") || "[]"));
const viewed = new Set(JSON.parse(localStorage.getItem("studihome-viewed") || "[]"));
const colocationInterests = new Set(JSON.parse(localStorage.getItem("studihome-colocation-interests") || "[]"));
let visibleCount = 9;
let pendingColocationListingId = null;
let toastTimer;

function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2800);
}

function initializeCities() {
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.append(option);
  });
  document.querySelector("#city-scroller").innerHTML = cities.map(city => {
    const count = listings.filter(listing => listing.city === city).length;
    return `<button class="city-pill" data-city="${city}"><span>⌖</span>${city}<span class="city-count">${String(count).padStart(2, "0")}</span></button>`;
  }).join("");
}

function filteredListings() {
  const city = citySelect.value;
  const type = document.querySelector("#filter-type").value;
  const colocationOnly = document.querySelector("#filter-colocation").checked;
  const minValue = document.querySelector("#filter-budget-min").value.trim();
  const maxValue = document.querySelector("#filter-budget-max").value.trim();
  const minBudget = minValue === "" ? 0 : Number(minValue);
  const maxBudget = maxValue === "" ? Infinity : Number(maxValue);
  let results = listings.filter(listing =>
    (!city || listing.city === city) &&
    (!type || listing.type === type) &&
    (!colocationOnly || listing.roommateSlots > 0) &&
    (colocationOnly ? listing.price / (listing.roommateSlots + 1) : listing.price) >= minBudget &&
    (colocationOnly ? listing.price / (listing.roommateSlots + 1) : listing.price) <= maxBudget
  );
  const sort = document.querySelector("#sort-select").value;
  if (sort === "price-asc") results = [...results].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results = [...results].sort((a, b) => b.price - a.price);
  return results;
}

function cardMarkup(listing) {
  const status = listing.verified
    ? '<span class="badge verified">Vérifié</span>'
    : '<span class="badge pending">En attente</span>';
  return `<article class="listing-card" data-listing="${listing.id}" tabindex="0" aria-label="Voir ${escapeHtml(listing.title)}">
    <div class="card-photo"><img src="${listing.image}" alt="${escapeHtml(listing.title)}, ${escapeHtml(listing.district)}" loading="lazy"><div class="card-badges">${status}${listing.roommateSlots ? '<span class="badge colocation-badge">Coloc possible</span>' : ""}<span class="badge demo">Démo</span></div><button class="favorite-btn ${favorites.has(listing.id) ? "is-favorite" : ""}" data-favorite="${listing.id}" aria-label="${favorites.has(listing.id) ? "Retirer des favoris" : "Ajouter aux favoris"}" aria-pressed="${favorites.has(listing.id)}">${favorites.has(listing.id) ? "♥" : "♡"}</button></div>
    <div class="card-content"><div class="card-kicker"><span>${escapeHtml(listing.type)}</span><span>Disponible</span></div><h3>${escapeHtml(listing.title)}</h3><div class="card-location"><span>⌖</span>${escapeHtml(listing.district)}, ${escapeHtml(listing.city)}</div><div class="card-specs"><span><b>▧</b> ${listing.bedrooms} pièce${listing.bedrooms > 1 ? "s" : ""}</span><span><b>↔</b> ${listing.area} m²</span><span><b>◷</b> Dispo. maintenant</span></div><div class="card-foot"><div><div class="card-price">${money(listing.price)}<small>FCFA / mois</small></div>${listing.roommateSlots ? `<div class="card-fees coloc-price">≈ ${money(Math.ceil(listing.price / (listing.roommateSlots + 1)))} FCFA / personne à ${listing.roommateSlots + 1}</div>` : `<div class="card-fees">Caution : ${money(listing.deposit)} FCFA · Annonce fictive</div>`}</div><span class="card-arrow">↗</span></div></div>
  </article>`;
}

function renderListings() {
  const results = filteredListings();
  const shown = results.slice(0, visibleCount);
  grid.innerHTML = shown.map(cardMarkup).join("");
  document.querySelector("#result-count").textContent = `${results.length} logement${results.length === 1 ? "" : "s"}`;
  document.querySelector("#empty-state").classList.toggle("hidden", results.length > 0);
  grid.classList.toggle("hidden", results.length === 0);
  document.querySelector("#load-more").parentElement.classList.toggle("hidden", results.length <= visibleCount);
  document.querySelector("#load-more").textContent = `Découvrir les autres logements ↓`;
  const tags = [];
  if (citySelect.value) tags.push(citySelect.value);
  if (document.querySelector("#filter-type").value) tags.push(document.querySelector("#filter-type").value);
  const minBudget = document.querySelector("#filter-budget-min").value;
  const maxBudget = document.querySelector("#filter-budget-max").value;
  if (minBudget) tags.push(`Dès ${money(Number(minBudget))} FCFA / mois`);
  if (maxBudget) tags.push(`Jusqu'à ${money(Number(maxBudget))} FCFA / mois`);
  if (document.querySelector("#filter-colocation").checked) tags.push("Colocation · budget par personne");
  document.querySelector("#active-filters").innerHTML = tags.map(tag => `<span class="filter-tag">${tag}</span>`).join("");
  observeReveals();
}

function observeReveals() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll(".listing-card:not(.revealed)").forEach(card => observer.observe(card));
}

function renderUniversities() {
  document.querySelector("#university-grid").innerHTML = publicUniversities.map(university =>
    `<article class="university-card"><span>${university.icon}</span><h3>${university.name}</h3><p>${university.campus}</p><button data-campus="${university.city}">Voir les logements →</button></article>`
  ).join("");
}

function renderMap() {
  const map = document.querySelector("#benin-map");
  const housing = [
    ["Abomey-Calavi",203,62],["Cotonou",217,103],["Porto-Novo",250,115],["Parakou",195,203],
    ["Bohicon",226,262],["Ouidah",193,76],    ["Sèmè-Podji",267,136],["Kétou",280,189]
  ];
  const campuses = [
    ["UAC",207,72],["UP",197,214],["UNSTIM",224,271],["UNA",260,120]
  ];
  map.innerHTML = `<svg viewBox="0 0 420 410" role="presentation" aria-hidden="true">
    <path class="map-land" d="m167 18 69 4 7 22 22 11-3 36 12 20-7 25 8 18-10 22 6 29-11 18 6 20-12 26 4 24-16 23-3 33-19 20-3 20-19 2-5-18-12-10 2-28-12-17 5-23-11-20 6-24-11-20 7-22-12-20 7-27-9-25 7-22-11-23z"/>
    <path class="map-road" d="M198 55 210 115 195 205 220 265M209 115 251 121M197 205 221 265M190 80 211 115M220 265 224 325"/>
    <text x="24" y="368" fill="#8c9b8b" font-size="9" font-family="DM Sans">GOLFE DE GUINÉE</text>
    <text x="23" y="34" fill="#9eaa9e" font-size="8" font-family="DM Sans">BURKINA FASO</text>
    <text x="307" y="238" fill="#9eaa9e" font-size="8" font-family="DM Sans">NIGERIA</text>
    ${housing.map(([name,x,y]) => `<g class="map-pin" tabindex="0" role="button" aria-label="Logements à ${name}" data-map-city="${name}"><circle class="pin-halo" cx="${x}" cy="${y}" r="17"/><circle cx="${x}" cy="${y}" r="6"/><text x="${x+10}" y="${y+3}">${name}</text></g>`).join("")}
    ${campuses.map(([name,x,y]) => `<g class="map-pin campus"><circle class="pin-halo" cx="${x}" cy="${y}" r="14"/><circle cx="${x}" cy="${y}" r="4.5"/><text x="${x+9}" y="${y-6}">${name}</text></g>`).join("")}
  </svg>`;
}

function showListing(id) {
  const listing = listings.find(item => item.id === Number(id));
  if (!listing) return;
  listing.views += 1;
  if (listing.ownerEmail) {
    const savedListings = JSON.parse(localStorage.getItem("studihome-owner-listings") || "[]");
    localStorage.setItem("studihome-owner-listings", JSON.stringify(savedListings.map(item =>
      item.id === listing.id ? { ...item, views: listing.views } : item
    )));
  }
  viewed.add(listing.id);
  localStorage.setItem("studihome-viewed", JSON.stringify([...viewed]));
  const colocationDetails = listing.roommateSlots
    ? `<div class="colocation-detail"><strong>♧ Colocation ouverte</strong><p>Il reste ${listing.roommateSlots} place${listing.roommateSlots > 1 ? "s" : ""} pour partager ce logement. À deux, comptez environ <b>${money(Math.ceil(listing.price / (listing.roommateSlots + 1)))} FCFA par personne et par mois</b> (loyer partagé à parts égales, estimation de démonstration).</p></div>`
    : "";
  const colocationAction = listing.roommateSlots
    ? `<button class="button button-lime" data-colocation-interest="${listing.id}">${colocationInterests.has(listing.id) ? "✓ Intérêt enregistré" : "♧ Chercher un colocataire"}</button>`
    : "";
  document.querySelector("#listing-detail").innerHTML = `<div class="detail-image" style="background-image:url('${listing.image}')"></div><div class="detail-body"><div class="detail-top"><div><span class="badge ${listing.verified ? "verified" : "pending"}">${listing.verified ? "Vérifié" : "En attente de vérification"}</span><span class="badge demo">Démo</span><h2>${escapeHtml(listing.title)}</h2><div class="card-location"><span>⌖</span>${escapeHtml(listing.district)}, ${escapeHtml(listing.city)}</div></div><div class="detail-price">${money(listing.price)}<small>FCFA / mois</small></div></div><p class="detail-description">${escapeHtml(listing.description)} Logement de démonstration — les photos, prix, disponibilité et informations de localisation sont fictifs et ne constituent pas une offre réelle.</p><div class="detail-specs"><span>${escapeHtml(listing.type)}</span><span>${listing.bedrooms} pièce${listing.bedrooms > 1 ? "s" : ""}</span><span>${listing.area} m²</span><span>${listing.bathrooms} salle${listing.bathrooms > 1 ? "s" : ""} d'eau</span><span>Disponible</span><span>${listing.views} vues de démonstration</span></div>${colocationDetails}<div class="detail-costs"><div><small>Loyer mensuel</small><strong>${money(listing.price)} FCFA</strong></div><div><small>Caution indicative · 2 mois</small><strong>${money(listing.deposit)} FCFA</strong></div><div><small>Avance indicative · 3 mois</small><strong>${money(listing.advance)} FCFA</strong></div></div><div class="detail-actions">${colocationAction}<button class="button button-primary" data-visit="${listing.id}">Demander une visite ↗</button><button class="button button-outline" data-favorite="${listing.id}">${favorites.has(listing.id) ? "♥ Enregistré" : "♡ Ajouter aux favoris"}</button></div><p class="detail-disclaimer">Données et estimations fictives pour le prototype. Les frais indicatifs ne représentent pas une règle contractuelle. La mise en relation est simulée, sans contact réel entre utilisateurs.</p></div>`;
  document.querySelector("#listing-dialog").showModal();
}

function getProfile() {
  return JSON.parse(localStorage.getItem("studihome-profile") || "null");
}

function joinColocation(id) {
  const profile = getProfile();
  const listing = listings.find(item => item.id === Number(id));
  if (!listing || !listing.roommateSlots) {
    toast("Cette annonce ne propose pas de colocation.");
    return;
  }
  if (!profile) {
    pendingColocationListingId = listing.id;
    document.querySelector("#listing-dialog").close();
    openAuth("signup", "tenant");
    return;
  }
  if (profile.role !== "tenant") {
    toast("La recherche d’un colocataire est réservée aux comptes locataires.");
    return;
  }
  colocationInterests.add(listing.id);
  localStorage.setItem("studihome-colocation-interests", JSON.stringify([...colocationInterests]));
  const button = document.querySelector(`#listing-detail [data-colocation-interest="${listing.id}"]`);
  if (button) button.textContent = "✓ Intérêt enregistré";
  toast("Votre intérêt pour cette colocation est enregistré dans votre espace.");
}

function updateAccountButton() {
  document.querySelector("#account-button").classList.toggle("hidden", !getProfile());
}

function openDashboard() {
  const profile = getProfile();
  if (!profile) {
    toast("Créez un compte StudiHome pour accéder à votre espace.");
    return;
  }
  const isOwner = profile.role === "owner";
  const ownListings = listings.filter(listing => listing.ownerEmail === profile.email);
  const myColocationInterests = [...colocationInterests]
    .map(id => listings.find(listing => listing.id === Number(id)))
    .filter(Boolean);
  const dashboard = document.querySelector("#dashboard-content");
  dashboard.innerHTML = isOwner ? `
    <div class="dashboard-header"><span class="eyebrow">ESPACE PROPRIÉTAIRE</span><h2>Bonjour ${escapeHtml(profile.name)}.</h2><p>Suivez vos annonces et gérez vos logements depuis un seul endroit.</p></div>
    <div class="dashboard-stats"><article><small>Logements publiés</small><strong>${ownListings.length}</strong></article><article><small>Vues d'annonces (démo)</small><strong>${ownListings.reduce((sum, listing) => sum + listing.views, 0)}</strong></article><article><small>En attente de contrôle</small><strong>${ownListings.filter(listing => !listing.verified).length}</strong></article><article><small>Locations conclues</small><strong>0</strong></article></div>
    <div class="dashboard-columns"><section class="dashboard-panel"><h3>Ajouter un logement</h3><form id="property-form"><label class="form-label">Nom de l'annonce<input name="title" required maxlength="70" placeholder="Ex. Studio lumineux près du campus"></label><div class="property-row"><label class="form-label">Ville<select name="city" required>${cities.map(city => `<option>${city}</option>`).join("")}</select></label><label class="form-label">Quartier<input name="district" required maxlength="40" placeholder="Ex. Zogbadjè"></label></div><div class="property-row"><label class="form-label">Type<select name="type"><option>Chambre</option><option>Studio</option><option>Appartement</option><option>Maison</option></select></label><label class="form-label">Loyer mensuel<input name="price" type="number" min="1000" max="5000000" step="500" required placeholder="FCFA"></label></div><label class="owner-colocation-check"><input name="colocation" type="checkbox"><span>J'accepte une colocation (une place disponible)</span></label><button class="button button-primary" type="submit">Publier l'annonce ↗</button></form></section><section class="dashboard-panel"><h3>Mes annonces</h3>${ownListings.length ? ownListings.map(listing => `<div class="owner-listing"><span class="badge pending">En attente</span>${listing.roommateSlots ? '<span class="badge colocation-badge">Colocation acceptée</span>' : ""}<strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.district)}, ${escapeHtml(listing.city)} · ${money(listing.price)} FCFA / mois</small></div>`).join("") : '<p class="dashboard-empty">Vos annonces apparaîtront ici après publication.</p>'}</section></div>
    <p class="dashboard-note">Les vues et transactions sont des exemples de démonstration. Le badge « Vérifié » reste attribué uniquement après un contrôle réel.</p>` : `
    <div class="dashboard-header"><span class="eyebrow">ESPACE LOCATAIRE</span><h2>Bonjour ${escapeHtml(profile.name)}.</h2><p>Retrouvez vos recherches et de nouvelles idées de logements.</p></div>
    <div class="dashboard-stats"><article><small>Annonces consultées en ligne</small><strong>${viewed.size}</strong></article><article><small>Logements favoris</small><strong>${favorites.size}</strong></article><article><small>Visites physiques organisées</small><strong>0</strong></article><article><small>Vos nouvelles propositions</small><strong>${Math.min(3, listings.length)}</strong></article></div>
    <div class="dashboard-columns"><section class="dashboard-panel"><h3>Vos favoris</h3>${favorites.size ? [...favorites].map(id => listings.find(listing => listing.id === id)).filter(Boolean).map(listing => `<button class="tenant-listing" data-dashboard-listing="${listing.id}"><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.city)} · ${money(listing.price)} FCFA / mois</small></button>`).join("") : '<p class="dashboard-empty">Enregistrez un logement avec ♡ pour le retrouver ici.</p>'}</section><section class="dashboard-panel"><h3>Nouvelles propositions</h3>${listings.filter(listing => !viewed.has(listing.id)).slice(0, 3).map(listing => `<button class="tenant-listing" data-dashboard-listing="${listing.id}"><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.city)} · ${money(listing.price)} FCFA / mois</small></button>`).join("")}</section><section class="dashboard-panel"><h3>Colocations qui m'intéressent</h3>${myColocationInterests.length ? myColocationInterests.map(listing => `<button class="tenant-listing" data-dashboard-listing="${listing.id}"><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.city)} · environ ${money(Math.ceil(listing.price / (listing.roommateSlots + 1)))} FCFA / personne / mois</small></button>`).join("") : '<p class="dashboard-empty">Demandez à être mis en relation depuis la fiche d’un logement en colocation.</p>'}</section></div>
    <p class="dashboard-note">Les annonces proposées sont fictives. « Consultées en ligne » compte les fiches ouvertes ; ce chiffre ne représente pas les visites physiques.</p>`;
  document.querySelector("#dashboard-dialog").showModal();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function saveFavorite(id) {
  const listingId = Number(id);
  if (favorites.has(listingId)) {
    favorites.delete(listingId);
    toast("Logement retiré de vos favoris.");
  } else {
    favorites.add(listingId);
    toast("Logement ajouté à vos favoris.");
  }
  localStorage.setItem("studihome-favorites", JSON.stringify([...favorites]));
  renderListings();
  const detailButton = document.querySelector(`#listing-detail [data-favorite="${listingId}"]`);
  if (detailButton) detailButton.textContent = favorites.has(listingId) ? "♥ Enregistré" : "♡ Ajouter aux favoris";
}

function openAuth(mode = "signup", role = "tenant") {
  setAuthMode(mode);
  const roleInput = document.querySelector(`input[name="role"][value="${role}"]`);
  if (roleInput) roleInput.checked = true;
  document.querySelector("#auth-dialog").showModal();
}

function setAuthMode(mode) {
  const isLogin = mode === "login";
  document.querySelector("#auth-dialog").classList.toggle("auth-login", isLogin);
  document.querySelectorAll(".auth-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.mode === mode));
  document.querySelector("#auth-title").textContent = isLogin ? "Ravi de vous revoir." : "Bienvenue chez vous.";
  document.querySelector("#auth-subtitle").textContent = isLogin ? "Connectez-vous à votre espace StudiHome." : "Créez votre compte StudiHome en quelques instants.";
  document.querySelector("#auth-form [name='name']").required = !isLogin;
  document.querySelector(".name-field").classList.toggle("hidden", isLogin);
  document.querySelector("#auth-form [name='password']").autocomplete = isLogin ? "current-password" : "new-password";
  document.querySelector(".auth-submit").innerHTML = isLogin ? "Se connecter <span>↗</span>" : "Créer mon compte <span>↗</span>";
  document.querySelector("#auth-notice").textContent = "Prototype : vos informations restent dans cette session de démonstration.";
}

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  document.querySelector("#theme-toggle .theme-icon").textContent = dark ? "☼" : "☾";
  document.querySelector("#theme-toggle .theme-label").textContent = dark ? "Mode clair" : "Mode sombre";
  document.querySelector("#theme-toggle").setAttribute("aria-label", dark ? "Activer le thème clair" : "Activer le thème sombre");
  localStorage.setItem("studihome-theme", dark ? "dark" : "light");
}

initializeCities();
renderListings();
renderUniversities();
renderMap();
applyTheme(localStorage.getItem("studihome-theme") === "dark");
updateAccountButton();

document.querySelector("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  visibleCount = 30;
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#filter-colocation").addEventListener("change", () => {
  document.querySelector("#filter-budget-min").closest(".search-field").querySelector(".field-label").textContent =
    document.querySelector("#filter-colocation").checked ? "Budget / personne min." : "Budget mensuel min.";
  document.querySelector("#filter-budget-max").closest(".search-field").querySelector(".field-label").textContent =
    document.querySelector("#filter-colocation").checked ? "Budget / personne max." : "Budget mensuel max.";
});
document.querySelector("#find-colocation").addEventListener("click", () => {
  document.querySelector("#filter-colocation").checked = true;
  document.querySelector("#filter-colocation").dispatchEvent(new Event("change"));
  visibleCount = 30;
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
citySelect.addEventListener("change", () => {
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.city === citySelect.value));
});
document.querySelector("#sort-select").addEventListener("change", renderListings);
document.querySelector("#city-scroller").addEventListener("click", event => {
  const button = event.target.closest("[data-city]");
  if (!button) return;
  citySelect.value = citySelect.value === button.dataset.city ? "" : button.dataset.city;
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.city === citySelect.value));
  visibleCount = 30;
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#city-next").addEventListener("click", () => document.querySelector("#city-scroller").scrollBy({ left: 240, behavior: "smooth" }));
document.querySelector("#load-more").addEventListener("click", () => { visibleCount += 9; renderListings(); });
document.querySelector("#reset-filters").addEventListener("click", () => {
  document.querySelector("#search-form").reset();
  visibleCount = 9;
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.remove("selected"));
  renderListings();
});
document.querySelector("#listing-grid").addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) { event.stopPropagation(); saveFavorite(favoriteButton.dataset.favorite); return; }
  const card = event.target.closest("[data-listing]");
  if (card) showListing(card.dataset.listing);
});
document.querySelector("#listing-grid").addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-listing]")) {
    event.preventDefault();
    showListing(event.target.dataset.listing);
  }
});
document.querySelector("#listing-detail").addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) saveFavorite(favoriteButton.dataset.favorite);
  const visitButton = event.target.closest("[data-visit]");
  if (visitButton) {
    document.querySelector("#listing-dialog").close();
    openAuth("signup", "tenant");
    toast("Créez votre compte locataire pour demander une visite.");
  }
  const colocationButton = event.target.closest("[data-colocation-interest]");
  if (colocationButton) joinColocation(colocationButton.dataset.colocationInterest);
});
document.querySelector("#university-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-campus]");
  if (!button) return;
  citySelect.value = button.dataset.campus;
  visibleCount = 30;
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.city === citySelect.value));
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#benin-map").addEventListener("click", event => {
  const pin = event.target.closest("[data-map-city]");
  if (!pin) return;
  citySelect.value = pin.dataset.mapCity;
  visibleCount = 30;
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.city === citySelect.value));
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelectorAll("[data-auth]").forEach(button => button.addEventListener("click", () => openAuth(button.dataset.auth, button.dataset.role || "tenant")));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll(".auth-tab").forEach(tab => tab.addEventListener("click", () => setAuthMode(tab.dataset.mode)));
document.querySelector("#auth-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const loginMode = document.querySelector("#auth-dialog").classList.contains("auth-login");
  const email = String(form.get("email") || "").trim().toLowerCase();
  const savedProfile = getProfile();
  if (loginMode && (!savedProfile || savedProfile.email !== email)) {
    document.querySelector("#auth-dialog").close();
    toast("Compte de démonstration introuvable. Créez d'abord un compte.");
    return;
  }
  const profile = loginMode ? savedProfile : {
    name: String(form.get("name") || "Membre StudiHome").trim(),
    email,
    role: form.get("role") === "owner" ? "owner" : "tenant"
  };
  if (!loginMode) localStorage.setItem("studihome-profile", JSON.stringify(profile));
  const role = profile.role === "owner" ? "propriétaire" : "locataire";
  document.querySelector("#auth-dialog").close();
  event.currentTarget.reset();
  updateAccountButton();
  toast(loginMode ? "Connexion de démonstration réussie." : `Compte ${role} de démonstration créé.`);
  if (pendingColocationListingId) {
    const listingId = pendingColocationListingId;
    pendingColocationListingId = null;
    if (profile.role === "tenant") joinColocation(listingId);
    else toast("La recherche d’un colocataire est réservée aux comptes locataires.");
  }
  openDashboard();
});
document.querySelector("#account-button").addEventListener("click", openDashboard);
document.querySelector("#dashboard-content").addEventListener("submit", event => {
  if (event.target.id !== "property-form") return;
  event.preventDefault();
  const form = new FormData(event.target);
  const profile = getProfile();
  const price = Number(form.get("price"));
  const listing = {
    id: Date.now(), title: String(form.get("title")).trim(), city: String(form.get("city")),
    district: String(form.get("district")).trim(), type: String(form.get("type")), price,
    bedrooms: 1, bathrooms: 1, verified: false, demo: true, ownerEmail: profile.email,
    image: `https://images.unsplash.com/${imageIds[(listings.length + 3) % imageIds.length]}?auto=format&fit=crop&w=900&q=78`,
    description: "Annonce publiée depuis l'espace propriétaire de démonstration.",
    deposit: price * 2, advance: price * 3, views: 0, area: 24, available: true,
    roommateSlots: form.get("colocation") ? 1 : 0
  };
  const savedListings = JSON.parse(localStorage.getItem("studihome-owner-listings") || "[]");
  savedListings.push(listing);
  localStorage.setItem("studihome-owner-listings", JSON.stringify(savedListings));
  listings.unshift(listing);
  renderListings();
  openDashboard();
  toast("Annonce ajoutée ; son statut est « En attente de vérification ».");
});
document.querySelector("#dashboard-content").addEventListener("click", event => {
  const button = event.target.closest("[data-dashboard-listing]");
  if (!button) return;
  document.querySelector("#dashboard-dialog").close();
  showListing(button.dataset.dashboardListing);
});
document.querySelector("#theme-toggle").addEventListener("click", () => applyTheme(!document.body.classList.contains("dark")));
document.querySelector("#mobile-menu").addEventListener("click", event => {
  const menu = document.querySelector("#main-nav");
  const isOpen = menu.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("#main-nav a").forEach(link => link.addEventListener("click", () => {
  document.querySelector("#main-nav").classList.remove("open");
  document.querySelector("#mobile-menu").setAttribute("aria-expanded", "false");
}));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll(".search-section,.trust-section,.map-section,.university-section,.cta-section").forEach(element => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});
