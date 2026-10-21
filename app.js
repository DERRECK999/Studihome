const publicUniversities = [
  { name: "Université d'Abomey-Calavi (UAC)", campus: "Campus universitaire · Abomey-Calavi", campusId: "uac", icon: "⌂" },
  { name: "ENEAM", campus: "École Nationale d'Économie Appliquée et de Management · UAC", campusId: "eneam", icon: "⌘" }
];
const imageIds = [
  "photo-1600607687939-ce8a6c25118c", "photo-1600210492486-724fe5c67fb0", "photo-1600566753086-00f18fb6b3ea",
  "photo-1600607687920-4e2a09cf159d", "photo-1600566753190-17f0baa2a6c3", "photo-1600607687939-ce8a6c25118c",
  "photo-1600210492486-724fe5c67fb0", "photo-1600566753086-00f18fb6b3ea", "photo-1600607687920-4e2a09cf159d",
  "photo-1600566753190-17f0baa2a6c3"
];
const neighborhoods = ["Zogbadjè", "Arconville", "Tankpè", "Bidossessi", "Calavi Kpota"];
const listingSeeds = [
  ["Chambre","Chambre étudiante ventilée",55000,6,8,4,6,true,false,0],
  ["Chambre","Chambre indépendante avec douche",70000,9,11,6,8,true,true,0],
  ["Studio","Studio simple près des amphis",100000,8,10,5,7,true,false,0],
  ["Studio","Studio avec coin cuisine",125000,12,14,8,10,false,true,0],
  ["Studio","Studio lumineux en cour partagée",160000,15,17,10,12,true,true,1],
  ["Appartement","Appartement deux pièces à partager",360000,18,20,12,14,true,true,1],
  ["Chambre","Chambre meublée, accès sécurisé",85000,5,7,4,5,false,true,0],
  ["Studio","Studio avec terrasse privée",190000,20,22,13,15,true,false,0]
];
const inventory = neighborhoods.flatMap((district, neighborhoodIndex) =>
  listingSeeds.map(([type, title, basePrice, walkUac, zemUac, walkEneam, zemEneam, waterIncluded, electricityIncluded, roommateSlots], seedIndex) => ({
    city: "Abomey-Calavi", district, type,
    title: `${title} — ${district}`,
    price: basePrice + neighborhoodIndex * 5000,
    bedrooms: type === "Chambre" ? 1 : type === "Appartement" ? 2 : 1,
    bathrooms: type === "Appartement" ? 2 : 1,
    verified: (seedIndex + neighborhoodIndex) % 3 !== 0,
    walkUac: walkUac + neighborhoodIndex * 2,
    zemUac: zemUac + Math.floor(neighborhoodIndex / 2),
    walkEneam: walkEneam + neighborhoodIndex * 2,
    zemEneam: zemEneam + Math.floor(neighborhoodIndex / 2),
    waterIncluded: (waterIncluded + neighborhoodIndex) % 2 === 0,
    electricityIncluded: electricityIncluded && neighborhoodIndex % 2 === 0,
    roommateSlots
  }))
);
const descriptions = [
  "Un espace agréable et bien entretenu, idéal pour étudier ou se reposer. Commerces de proximité et transports accessibles dans le quartier.",
  "Un logement accueillant, pensé pour un quotidien confortable. Le propriétaire est disponible pour organiser une visite sur rendez-vous.",
  "Profitez d'une adresse pratique dans un quartier vivant, avec les commodités essentielles à proximité.",
  "Un cadre simple et lumineux qui offre l'essentiel pour s'installer sereinement au Bénin."
];
const moderation = JSON.parse(localStorage.getItem("studihome-moderation") || "{}");
const demoListings = inventory.map((item, index) => {
  const { city, district, type, title, price, bedrooms, bathrooms, verified, roommateSlots, walkUac, zemUac, walkEneam, zemEneam, waterIncluded, electricityIncluded } = item;
  return {
    id: index + 1, city, district, type, title, price, bedrooms, bathrooms, verified,
    image: `https://images.unsplash.com/${imageIds[index % imageIds.length]}?auto=format&fit=crop&w=900&q=78`,
    description: `${descriptions[index % descriptions.length]} ${type === "Chambre" ? "Une solution pratique pour un étudiant." : type === "Appartement" ? "Plusieurs pièces, adaptées au partage." : "Un espace indépendant avec coin de vie."} UAC : ${walkUac + Math.floor(index / listingSeeds.length) * 2} min à pied ; ENEAM : ${walkEneam + Math.floor(index / listingSeeds.length) * 2} min à pied. ${waterIncluded ? "Eau comprise dans le loyer." : "Eau à la charge du locataire."} ${electricityIncluded ? "Électricité comprise." : "Électricité à prévoir."}`,
    deposit: price * 2, advance: price * 3, views: 84 + index * 17,
    area: 18 + (index % 6) * 8, available: true, demo: true, roommateSlots,
    distances: { uac: { walk: walkUac, zem: zemUac }, eneam: { walk: walkEneam, zem: zemEneam } },
    waterIncluded, electricityIncluded,
    ownerName: ["Résidence Les Palmiers", "Maison Calavi", "Hôte StudiHome"][index % 3],
    ownerPhone: "",
    rating: null, reviewCount: 0
  };
});
const ownerListings = JSON.parse(localStorage.getItem("studihome-owner-listings") || "[]");
let listings = [...ownerListings, ...demoListings]
  .map(listing => ({ ...listing, ...(moderation[String(listing.id)] || {}) }))
  .filter(listing => listing.city === "Abomey-Calavi");
const grid = document.querySelector("#listing-grid");
const money = amount => new Intl.NumberFormat("fr-FR").format(amount);
const favorites = new Set(JSON.parse(localStorage.getItem("studihome-favorites") || "[]"));
const viewed = new Set(JSON.parse(localStorage.getItem("studihome-viewed") || "[]"));
const colocationInterests = new Set(JSON.parse(localStorage.getItem("studihome-colocation-interests") || "[]"));
const visitRequests = JSON.parse(localStorage.getItem("studihome-visit-requests") || "[]");
const transactions = JSON.parse(localStorage.getItem("studihome-transactions") || "[]");
const reviews = JSON.parse(localStorage.getItem("studihome-reviews") || "[]");
const users = JSON.parse(localStorage.getItem("studihome-users") || "[]");
let visibleCount = 9;
let pendingColocationListingId = null;
let pendingVisitListingId = null;
let pendingPaymentListingId = null;
let toastTimer;

function toast(message) {
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2800);
}

function initializeCities() {
  const districts = [...new Set(listings.map(listing => listing.district))];
  const districtSelect = document.querySelector("#filter-district");
  districts.forEach(district => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.append(option);
  });
  document.querySelector("#city-scroller").innerHTML = districts.map(district => {
    const count = listings.filter(listing => listing.district === district).length;
    return `<button class="city-pill" data-district="${escapeHtml(district)}"><span>⌖</span>${escapeHtml(district)}<span class="city-count">${String(count).padStart(2, "0")}</span></button>`;
  }).join("");
}

function filteredListings() {
  const district = document.querySelector("#filter-district").value;
  const campus = document.querySelector("#filter-campus").value;
  const transport = document.querySelector("#filter-transport").value;
  const maxDistanceValue = document.querySelector("#filter-distance").value;
  const maxDistance = maxDistanceValue ? Number(maxDistanceValue) : Infinity;
  const includeWater = document.querySelector("#filter-water").checked;
  const includeElectricity = document.querySelector("#filter-electricity").checked;
  const type = document.querySelector("#filter-type").value;
  const colocationOnly = document.querySelector("#filter-colocation").checked;
  const minValue = document.querySelector("#filter-budget-min").value.trim();
  const maxValue = document.querySelector("#filter-budget-max").value.trim();
  const minBudget = minValue === "" ? 0 : Number(minValue);
  const maxBudget = maxValue === "" ? Infinity : Number(maxValue);
  let results = listings.filter(listing =>
    (!district || listing.district === district) &&
    (!type || listing.type === type) &&
    listing.city === "Abomey-Calavi" &&
    (listing.active !== false) &&
    (listing.distances?.[campus]?.[transport] ?? Infinity) <= maxDistance &&
    (!includeWater || listing.waterIncluded) &&
    (!includeElectricity || listing.electricityIncluded) &&
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
  const campus = document.querySelector("#filter-campus").value;
  const campusName = campus === "eneam" ? "ENEAM" : "UAC";
  const distance = listing.distances?.[campus]?.walk ?? listing.distances?.uac?.walk ?? "—";
  const publishedReviews = reviews.filter(review => review.listingId === listing.id && review.approved);
  const rating = publishedReviews.length
    ? `★ ${(publishedReviews.reduce((sum, review) => sum + review.rating, 0) / publishedReviews.length).toFixed(1)} · ${publishedReviews.length} avis`
    : "Pas encore d'avis";
  return `<article class="listing-card" data-listing="${listing.id}" tabindex="0" aria-label="Voir ${escapeHtml(listing.title)}">
    <div class="card-photo"><img src="${listing.image}" alt="${escapeHtml(listing.title)}, ${escapeHtml(listing.district)}" loading="lazy"><div class="card-badges">${status}${listing.roommateSlots ? '<span class="badge colocation-badge">Coloc possible</span>' : ""}<span class="badge demo">Démo</span></div><button class="favorite-btn ${favorites.has(listing.id) ? "is-favorite" : ""}" data-favorite="${listing.id}" aria-label="${favorites.has(listing.id) ? "Retirer des favoris" : "Ajouter aux favoris"}" aria-pressed="${favorites.has(listing.id)}">${favorites.has(listing.id) ? "♥" : "♡"}</button></div>
    <div class="card-content"><div class="card-kicker"><span>${escapeHtml(listing.type)}</span><span>${rating}</span></div><h3>${escapeHtml(listing.title)}</h3><div class="card-location"><span>⌖</span>${escapeHtml(listing.district)}, Abomey-Calavi</div><div class="card-specs"><span><b>▧</b> ${listing.bedrooms} pièce${listing.bedrooms > 1 ? "s" : ""}</span><span><b>↔</b> ${listing.area} m²</span><span><b>◷</b> ${distance} min à pied ${campusName}</span></div><div class="card-amenities">${listing.waterIncluded ? "<span>Eau incluse</span>" : ""}${listing.electricityIncluded ? "<span>Électricité incluse</span>" : ""}</div><div class="card-foot"><div><div class="card-price">${money(listing.price)}<small>FCFA / mois</small></div>${listing.roommateSlots ? `<div class="card-fees coloc-price">≈ ${money(Math.ceil(listing.price / (listing.roommateSlots + 1)))} FCFA / personne à ${listing.roommateSlots + 1}</div>` : `<div class="card-fees">Caution : ${money(listing.deposit)} FCFA · Annonce fictive</div>`}</div><span class="card-arrow">↗</span></div></div>
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
  if (document.querySelector("#filter-district").value) tags.push(document.querySelector("#filter-district").value);
  if (document.querySelector("#filter-distance").value) tags.push(`${document.querySelector("#filter-distance").value} min ${document.querySelector("#filter-transport").value === "walk" ? "à pied" : "en zem"} · ${document.querySelector("#filter-campus").selectedOptions[0].textContent}`);
  if (document.querySelector("#filter-type").value) tags.push(document.querySelector("#filter-type").value);
  const minBudget = document.querySelector("#filter-budget-min").value;
  const maxBudget = document.querySelector("#filter-budget-max").value;
  if (minBudget) tags.push(`Dès ${money(Number(minBudget))} FCFA / mois`);
  if (maxBudget) tags.push(`Jusqu'à ${money(Number(maxBudget))} FCFA / mois`);
  if (document.querySelector("#filter-colocation").checked) tags.push("Colocation · budget par personne");
  if (document.querySelector("#filter-water").checked) tags.push("Eau incluse");
  if (document.querySelector("#filter-electricity").checked) tags.push("Électricité incluse");
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
    `<article class="university-card"><span>${university.icon}</span><h3>${university.name}</h3><p>${university.campus}</p><button data-campus="${university.campusId}">Voir les logements à proximité →</button></article>`
  ).join("");
}

function renderMap() {
  const map = document.querySelector("#benin-map");
  const districts = [
    ["Zogbadjè",92,92],["Arconville",265,104],["Tankpè",315,236],
    ["Bidossessi",125,280],["Calavi Kpota",250,330]
  ];
  map.innerHTML = `<svg viewBox="0 0 420 410" role="presentation" aria-hidden="true">
    <path class="map-land" d="M76 105 130 46 236 42 341 89 372 177 339 291 274 359 146 348 55 279 34 184z"/>
    <path class="map-road" d="M75 170 153 155 230 177 315 149M105 262 179 217 250 233 318 207M152 66 176 155 179 217 224 322"/>
    <text x="128" y="28" fill="#536d42" font-size="10" font-weight="700" font-family="DM Sans">ABOMEY-CALAVI · ZONE ÉTUDIANTE</text>
    ${districts.map(([name,x,y]) => `<g class="map-pin" tabindex="0" role="button" aria-label="Voir les annonces à ${name}" data-map-district="${name}"><circle class="pin-halo" cx="${x}" cy="${y}" r="20"/><circle cx="${x}" cy="${y}" r="7"/><text x="${x+13}" y="${y+4}">${name}</text></g>`).join("")}
    <g class="map-pin campus"><circle class="pin-halo" cx="195" cy="163" r="22"/><circle cx="195" cy="163" r="9"/><text x="208" y="157">UAC</text></g>
    <g class="map-pin campus"><circle class="pin-halo" cx="224" cy="190" r="18"/><circle cx="224" cy="190" r="7"/><text x="237" y="194">ENEAM</text></g>
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
  const profile = getProfile();
  const visitRequest = visitRequests.find(request => request.listingId === listing.id && request.tenantEmail === profile?.email && request.contactReleased);
  const campus = document.querySelector("#filter-campus").value;
  const route = listing.distances?.[campus] || listing.distances?.uac;
  const colocationDetails = listing.roommateSlots
    ? `<div class="colocation-detail"><strong>♧ Colocation ouverte</strong><p>Il reste ${listing.roommateSlots} place${listing.roommateSlots > 1 ? "s" : ""} pour partager ce logement. À deux, comptez environ <b>${money(Math.ceil(listing.price / (listing.roommateSlots + 1)))} FCFA par personne et par mois</b> (loyer partagé à parts égales, estimation de démonstration).</p></div>`
    : "";
  const colocationAction = listing.roommateSlots
    ? `<button class="button button-lime" data-colocation-interest="${listing.id}">${colocationInterests.has(listing.id) ? "✓ Intérêt enregistré" : "♧ Chercher un colocataire"}</button>`
    : "";
  const contactStatus = visitRequest
    ? `<div class="contact-release"><strong>Demande acceptée · contact débloqué</strong><p>${listing.ownerPhone ? `Propriétaire : ${escapeHtml(listing.ownerPhone)}` : "Annonce de démonstration : aucun numéro de téléphone réel n'est associé."}</p></div>`
    : `<p class="contact-locked">Les coordonnées du propriétaire restent masquées jusqu'à l'acceptation de votre demande de visite.</p>`;
  const reviewList = reviews.filter(review => review.listingId === listing.id && review.approved);
  const visitButtonText = visitRequests.some(request => request.listingId === listing.id && request.tenantEmail === profile?.email)
    ? "Demande de visite envoyée ✓" : "Demander une visite ↗";
  document.querySelector("#listing-detail").innerHTML = `
    <div class="detail-image" style="background-image:url('${listing.image}')"></div>
    <div class="detail-body">
      <div class="detail-top"><div><span class="badge ${listing.verified ? "verified" : "pending"}">${listing.verified ? "Vérifié" : "En attente de vérification"}</span><span class="badge demo">Démo</span><h2>${escapeHtml(listing.title)}</h2><div class="card-location"><span>⌖</span>${escapeHtml(listing.district)}, Abomey-Calavi</div></div><div class="detail-price">${money(listing.price)}<small>FCFA / mois</small></div></div>
      <p class="detail-description">${escapeHtml(listing.description)} Logement de démonstration. Photos, prix et informations indicatifs à confirmer avant toute visite.</p>
      <div class="detail-specs"><span>${escapeHtml(listing.type)}</span><span>${listing.bedrooms} pièce${listing.bedrooms > 1 ? "s" : ""}</span><span>${listing.area} m²</span><span>${listing.bathrooms} salle${listing.bathrooms > 1 ? "s" : ""} d'eau</span><span>${listing.views} consultations démo</span></div>
      <div class="detail-specs campus-distance"><span>UAC : ${listing.distances?.uac?.walk ?? "—"} min à pied · ${listing.distances?.uac?.zem ?? "—"} min en zem</span><span>ENEAM : ${listing.distances?.eneam?.walk ?? "—"} min à pied · ${listing.distances?.eneam?.zem ?? "—"} min en zem</span></div>
      <div class="detail-specs"><span>${listing.waterIncluded ? "✓ Eau incluse" : "Eau non incluse"}</span><span>${listing.electricityIncluded ? "✓ Électricité incluse" : "Électricité non incluse"}</span>${listing.roommateSlots ? `<span>Colocation · ${listing.roommateSlots} place disponible</span>` : ""}</div>
      ${colocationDetails}
      <div class="detail-costs"><div><small>Loyer mensuel</small><strong>${money(listing.price)} FCFA</strong></div><div><small>Caution indicative</small><strong>${money(listing.deposit)} FCFA</strong></div><div><small>Avance indicative</small><strong>${money(listing.advance)} FCFA</strong></div></div>
      <div class="detail-actions">${colocationAction}<button class="button button-primary" data-visit="${listing.id}">${visitButtonText}</button><button class="button button-outline" data-reserve="${listing.id}">Réserver avec Mobile Money</button><button class="button button-outline" data-favorite="${listing.id}">${favorites.has(listing.id) ? "♥ Enregistré" : "♡ Ajouter aux favoris"}</button></div>
      ${contactStatus}
      <div id="payment-options"></div>
      <div class="review-preview"><strong>Avis locataires</strong>${reviewList.length ? reviewList.map(review => `<p>★ ${review.rating}/5 · ${escapeHtml(review.comment)}</p>`).join("") : "<p>Pas encore d'avis publiés.</p>"}</div>
      <p class="detail-disclaimer">Prototype de démonstration : demandes, coordonnées, avis et paiements Mobile Money ne sont pas transmis ni exécutés réellement. Aucun frais n'est prélevé.</p>
    </div>`;
  const dialog = document.querySelector("#listing-dialog");
  if (!dialog.open) dialog.showModal();
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

function createVisitRequest(id, profile) {
  const listing = listings.find(item => item.id === Number(id));
  if (!listing) return;
  const existing = visitRequests.find(request => request.listingId === listing.id && request.tenantEmail === profile.email);
  if (existing) {
    toast("Votre demande de visite est déjà enregistrée.");
    return;
  }
  visitRequests.push({
    id: Date.now(), listingId: listing.id, tenantEmail: profile.email, tenantName: profile.name,
    ownerEmail: listing.ownerEmail || "", status: "pending", contactReleased: false, createdAt: new Date().toISOString()
  });
  localStorage.setItem("studihome-visit-requests", JSON.stringify(visitRequests));
  toast("Demande envoyée. Les coordonnées seront partagées après confirmation du propriétaire.");
}

function openReservationForm(id) {
  const listing = listings.find(item => item.id === Number(id));
  if (!listing) return;
  const profile = getProfile();
  if (!profile) {
    pendingPaymentListingId = listing.id;
    document.querySelector("#listing-dialog").close();
    openAuth("signup", "tenant");
    return;
  }
  if (profile.role !== "tenant") {
    toast("La réservation est réservée aux comptes locataires.");
    return;
  }
  document.querySelector("#payment-options").innerHTML = `
    <form class="payment-form" id="payment-form" data-listing-id="${listing.id}">
      <strong>Réservation de démonstration · ${money(listing.deposit)} FCFA</strong>
      <label class="form-label">Mode de paiement simulé<select name="provider"><option>MTN MoMo</option><option>Moov Money</option></select></label>
      <p>Aucun paiement réel n'est effectué et aucun frais n'est prélevé. Commission estimée pour l'administration (10 % du premier loyer) : ${money(Math.ceil(listing.price * 0.1))} FCFA.</p>
      <button class="button button-primary" type="submit">Simuler une réservation</button>
    </form>`;
}

function saveReservation(event) {
  event.preventDefault();
  const form = event.target;
  const profile = getProfile();
  const listing = listings.find(item => item.id === Number(form.dataset.listingId));
  if (!profile || profile.role !== "tenant" || !listing) {
    toast("Connectez-vous avec un compte locataire pour continuer.");
    return;
  }
  if (transactions.some(transaction => transaction.listingId === listing.id && transaction.tenantEmail === profile.email)) {
    toast("Une réservation pour ce logement est déjà enregistrée.");
    return;
  }
  const data = new FormData(form);
  transactions.push({
    id: Date.now(), listingId: listing.id, tenantEmail: profile.email, ownerEmail: listing.ownerEmail || "",
    provider: String(data.get("provider")), amount: listing.deposit,
    commission: Math.ceil(listing.price * 0.1), status: "simulation-pending", leaseStatus: "pending",
    createdAt: new Date().toISOString()
  });
  localStorage.setItem("studihome-transactions", JSON.stringify(transactions));
  form.innerHTML = "<strong>Réservation simulée enregistrée.</strong><p>Aucun transfert Mobile Money n'a été effectué. Le statut est visible dans votre espace locataire et la console admin.</p>";
  toast("Simulation enregistrée. Aucun paiement réel n'a été déclenché.");
}

function approveVisitRequest(id) {
  const request = visitRequests.find(item => item.id === Number(id));
  if (!request) return;
  const listing = listings.find(item => item.id === request.listingId);
  if (!listing) return;
  request.status = "accepted";
  request.contactReleased = true;
  localStorage.setItem("studihome-visit-requests", JSON.stringify(visitRequests));
  toast(listing.ownerPhone ? "Visite confirmée ; le contact du propriétaire est maintenant visible au locataire." : "Visite confirmée. Cette annonce démo n'a pas de numéro réel.");
  openDashboard();
}

function openReviewForm(listingId) {
  document.querySelector("#review-form [name='listingId']").value = String(listingId);
  document.querySelector("#review-dialog").showModal();
}

function submitReview(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const listingId = Number(data.get("listingId"));
  const profile = getProfile();
  const eligible = transactions.some(transaction =>
    transaction.listingId === listingId && transaction.tenantEmail === profile?.email && transaction.leaseStatus === "concluded"
  );
  if (!eligible) {
    toast("Un avis est possible après confirmation de la location.");
    return;
  }
  reviews.push({
    id: Date.now(), listingId, tenantEmail: profile.email, tenantName: profile.name,
    rating: Number(data.get("rating")), comment: String(data.get("comment")).trim(),
    approved: false, createdAt: new Date().toISOString()
  });
  localStorage.setItem("studihome-reviews", JSON.stringify(reviews));
  document.querySelector("#review-dialog").close();
  event.currentTarget.reset();
  toast("Avis transmis à l'administration pour modération.");
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
  const ownerVisits = visitRequests.filter(request => ownListings.some(listing => listing.id === request.listingId));
  const ownerTransactions = transactions.filter(transaction => transaction.ownerEmail === profile.email);
  const myColocationInterests = [...colocationInterests]
    .map(id => listings.find(listing => listing.id === Number(id)))
    .filter(Boolean);
  const myVisits = visitRequests.filter(request => request.tenantEmail === profile.email);
  const myTransactions = transactions.filter(transaction => transaction.tenantEmail === profile.email);
  const dashboard = document.querySelector("#dashboard-content");
  dashboard.innerHTML = isOwner ? `
    <div class="dashboard-header"><span class="eyebrow">ESPACE PROPRIÉTAIRE · INSCRIPTION GRATUITE</span><h2>Bonjour ${escapeHtml(profile.name)}.</h2><p>Publier est gratuit. StudiHome ne prélève une commission que si une location aboutit ; aucune commission réelle n'est appliquée dans ce prototype.</p></div>
    <div class="dashboard-stats"><article><small>Logements publiés</small><strong>${ownListings.length}</strong></article><article><small>Consultations d'annonces</small><strong>${ownListings.reduce((sum, listing) => sum + (listing.views || 0), 0)}</strong></article><article><small>Demandes de visite</small><strong>${ownerVisits.length}</strong></article><article><small>Locations conclues</small><strong>${ownerTransactions.filter(transaction => transaction.leaseStatus === "concluded").length}</strong></article></div>
    <div class="dashboard-columns owner-dashboard-columns">
      <section class="dashboard-panel"><h3>Publier gratuitement</h3><form id="property-form">
        <label class="form-label">Titre de l'annonce<input name="title" required maxlength="70" placeholder="Ex. Studio lumineux près de l'UAC"></label>
        <div class="property-row"><label class="form-label">Quartier<select name="district">${neighborhoods.map(district => `<option>${district}</option>`).join("")}</select></label><label class="form-label">Type<select name="type"><option>Chambre</option><option>Studio</option><option>Appartement</option></select></label></div>
        <div class="property-row"><label class="form-label">Loyer mensuel (FCFA)<input name="price" type="number" min="1000" max="5000000" step="500" required placeholder="Ex. 120000"></label><label class="form-label">Téléphone du propriétaire<input name="ownerPhone" type="tel" required maxlength="24" placeholder="+229 01 …"></label></div>
        <div class="property-row"><label class="form-label">UAC · minutes à pied<input name="walkUac" type="number" min="1" max="90" value="10" required></label><label class="form-label">UAC · minutes en zem<input name="zemUac" type="number" min="1" max="60" value="5" required></label></div>
        <div class="property-row"><label class="form-label">ENEAM · minutes à pied<input name="walkEneam" type="number" min="1" max="90" value="12" required></label><label class="form-label">ENEAM · minutes en zem<input name="zemEneam" type="number" min="1" max="60" value="7" required></label></div>
        <label class="owner-colocation-check"><input name="waterIncluded" type="checkbox"><span>Eau comprise dans le loyer</span></label>
        <label class="owner-colocation-check"><input name="electricityIncluded" type="checkbox"><span>Électricité comprise dans le loyer</span></label>
        <label class="owner-colocation-check"><input name="colocation" type="checkbox"><span>J'accepte un colocataire (1 place libre)</span></label>
        <div class="photo-tips"><strong>Conseils photos</strong><p>Photographiez chaque pièce en journée, rangez l'espace et montrez les accès et équipements. Besoin d'aide pour plusieurs logements ? Contactez l'équipe StudiHome.</p></div>
        <button class="button button-primary" type="submit">Publier mon annonce gratuitement ↗</button>
      </form></section>
      <section class="dashboard-panel"><h3>Mes logements</h3>${ownListings.length ? ownListings.map(listing => `<div class="owner-listing"><span class="badge ${listing.verified ? "verified" : "pending"}">${listing.verified ? "Vérifié" : "En attente de vérification"}</span><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.district)} · ${money(listing.price)} FCFA / mois · ${listing.views || 0} consultations</small></div>`).join("") : '<p class="dashboard-empty">Publiez gratuitement votre premier logement.</p>'}
      <h3 class="dashboard-subheading">Demandes de visite</h3>${ownerVisits.length ? ownerVisits.map(request => { const listing = listings.find(item => item.id === request.listingId); return `<div class="owner-listing"><strong>${escapeHtml(request.tenantName)} · ${escapeHtml(listing?.title || "Logement")}</strong><small>${request.status === "accepted" ? "Visite confirmée · coordonnées débloquées" : "En attente de votre réponse"}</small>${request.status !== "accepted" ? `<button class="button button-outline" data-owner-approve-visit="${request.id}">Confirmer la visite et partager mon numéro</button>` : ""}</div>`; }).join("") : '<p class="dashboard-empty">Les demandes des étudiants apparaîtront ici.</p>'}</section>
    </div><p class="dashboard-note">Les annonces de lancement sont des exemples. Les frais, commissions ou paiements ne sont pas prélevés par cette démo.</p>` : `
    <div class="dashboard-header"><span class="eyebrow">ESPACE LOCATAIRE</span><h2>Bonjour ${escapeHtml(profile.name)}.</h2><p>Retrouvez vos recherches et de nouvelles idées de logements.</p></div>
    <div class="dashboard-stats"><article><small>Fiches consultées en ligne</small><strong>${viewed.size}</strong></article><article><small>Favoris</small><strong>${favorites.size}</strong></article><article><small>Demandes de visite</small><strong>${myVisits.length}</strong></article><article><small>Réservations MoMo simulées</small><strong>${myTransactions.length}</strong></article></div>
    <div class="dashboard-columns">
      <section class="dashboard-panel"><h3>Mes demandes de visite</h3>${myVisits.length ? myVisits.map(request => { const listing = listings.find(item => item.id === request.listingId); return `<div class="owner-listing"><strong>${escapeHtml(listing?.title || "Logement")}</strong><small>${request.status === "accepted" ? "Visite confirmée" : "En attente du propriétaire"}</small>${request.contactReleased ? `<small>Contact débloqué : ${escapeHtml(listing?.ownerPhone || "aucun numéro réel sur cette annonce démo")}</small>` : ""}</div>`; }).join("") : '<p class="dashboard-empty">Demandez une visite depuis une annonce pour suivre son avancement ici.</p>'}</section>
      <section class="dashboard-panel"><h3>Mes réservations</h3>${myTransactions.length ? myTransactions.map(transaction => { const listing = listings.find(item => item.id === transaction.listingId); return `<div class="owner-listing"><strong>${escapeHtml(listing?.title || "Logement")} · ${escapeHtml(transaction.provider)}</strong><small>${money(transaction.amount)} FCFA · ${transaction.status === "confirmed" ? "Paiement confirmé (simulation)" : "Simulation en attente de validation admin"}</small>${transaction.leaseStatus === "concluded" ? `<button class="button button-outline" data-write-review="${listing.id}">Laisser un avis après location</button>` : ""}</div>`; }).join("") : '<p class="dashboard-empty">Aucune réservation pour le moment.</p>'}</section>
      <section class="dashboard-panel"><h3>Mes favoris</h3>${favorites.size ? [...favorites].map(id => listings.find(listing => listing.id === id)).filter(Boolean).map(listing => `<button class="tenant-listing" data-dashboard-listing="${listing.id}"><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.district)} · ${money(listing.price)} FCFA / mois</small></button>`).join("") : '<p class="dashboard-empty">Enregistrez un logement avec ♡ pour le retrouver ici.</p>'}</section>
      <section class="dashboard-panel"><h3>Nouvelles propositions près de l'UAC</h3>${listings.filter(listing => listing.active !== false && !viewed.has(listing.id)).slice(0, 3).map(listing => `<button class="tenant-listing" data-dashboard-listing="${listing.id}"><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.district)} · ${money(listing.price)} FCFA / mois</small></button>`).join("")}</section>
      <section class="dashboard-panel"><h3>Colocations qui m'intéressent</h3>${myColocationInterests.length ? myColocationInterests.map(listing => `<button class="tenant-listing" data-dashboard-listing="${listing.id}"><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.district)} · environ ${money(Math.ceil(listing.price / (listing.roommateSlots + 1)))} FCFA / personne / mois</small></button>`).join("") : '<p class="dashboard-empty">Demandez à être mis en relation depuis la fiche d’un logement en colocation.</p>'}</section>
    </div><p class="dashboard-note">Les parcours de paiement et les annonces de lancement sont des simulations, sans transfert d'argent réel.</p>`;
  const dialog = document.querySelector("#dashboard-dialog");
  if (!dialog.open) dialog.showModal();
}

function openAdminDashboard() {
  const pendingListings = listings.filter(listing => listing.active !== false && !listing.verified);
  const pendingTransactions = transactions.filter(transaction => transaction.status === "simulation-pending");
  const pendingReviews = reviews.filter(review => !review.approved);
  const dashboard = document.querySelector("#dashboard-content");
  dashboard.innerHTML = `
    <div class="dashboard-header"><span class="eyebrow">CONSOLE D'ADMINISTRATION · PROTOTYPE</span><h2>Suivi de StudiHome.</h2><p>Modérez les annonces, suivez les demandes et contrôlez les simulations de réservation.</p></div>
    <div class="admin-warning"><strong>Mode démo non sécurisé</strong><p>Cette console est accessible à tous dans ce prototype local. Aucun droit d'accès ni opération de paiement n'est réellement sécurisé. Une version publique devra appliquer des rôles côté serveur.</p></div>
    <div class="dashboard-stats"><article><small>Annonces actives</small><strong>${listings.filter(listing => listing.active !== false).length}</strong></article><article><small>À vérifier</small><strong>${pendingListings.length}</strong></article><article><small>Utilisateurs inscrits démo</small><strong>${users.length}</strong></article><article><small>Réservations MoMo simulées</small><strong>${transactions.length}</strong></article></div>
    <div class="dashboard-columns admin-columns">
      <section class="dashboard-panel"><h3>Annonces à modérer</h3>${pendingListings.length ? pendingListings.map(listing => `<div class="owner-listing"><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.district)} · ${money(listing.price)} FCFA / mois · ${listing.demo ? "démo" : "propriétaire"}</small><div class="admin-actions"><button class="button button-outline" data-admin-verify="${listing.id}">Vérifier</button><button class="button button-outline" data-admin-hide="${listing.id}">Suspendre</button></div></div>`).join("") : '<p class="dashboard-empty">Aucune annonce en attente.</p>'}</section>
      <section class="dashboard-panel"><h3>Réservations et commissions estimées</h3>${transactions.length ? transactions.map(transaction => { const listing = listings.find(item => item.id === transaction.listingId); return `<div class="owner-listing"><strong>${escapeHtml(listing?.title || "Logement")} · ${escapeHtml(transaction.provider)}</strong><small>Caution simulée : ${money(transaction.amount)} FCFA · Commission estimée : ${money(transaction.commission)} FCFA</small><small>Statut : ${escapeHtml(transaction.status)} · ${escapeHtml(transaction.leaseStatus)}</small>${transaction.status === "simulation-pending" ? `<button class="button button-outline" data-admin-payment="${transaction.id}">Confirmer simulation</button>` : ""}${transaction.status === "confirmed" && transaction.leaseStatus !== "concluded" ? `<button class="button button-outline" data-admin-conclude="${transaction.id}">Marquer location conclue</button>` : ""}</div>`; }).join("") : '<p class="dashboard-empty">Aucune transaction de démonstration.</p>'}</section>
      <section class="dashboard-panel"><h3>Demandes de visite · ${visitRequests.length}</h3>${visitRequests.length ? visitRequests.map(request => { const listing = listings.find(item => item.id === request.listingId); return `<div class="owner-listing"><strong>${escapeHtml(request.tenantName)} · ${escapeHtml(listing?.title || "Logement")}</strong><small>${escapeHtml(request.status)} · contact ${request.contactReleased ? "débloqué" : "masqué"}</small></div>`; }).join("") : '<p class="dashboard-empty">Aucune demande reçue.</p>'}</section>
      <section class="dashboard-panel"><h3>Avis à modérer · ${pendingReviews.length}</h3>${pendingReviews.length ? pendingReviews.map(review => `<div class="owner-listing"><strong>${review.rating}/5 · ${escapeHtml(review.tenantName)}</strong><small>${escapeHtml(review.comment)}</small><button class="button button-outline" data-admin-review="${review.id}">Publier l'avis</button></div>`).join("") : '<p class="dashboard-empty">Aucun avis en attente.</p>'}</section>
      <section class="dashboard-panel"><h3>Comptes de démonstration · ${users.length}</h3>${users.length ? users.map(user => `<div class="owner-listing"><strong>${escapeHtml(user.name)} · ${user.role === "owner" ? "Propriétaire" : "Locataire"}</strong><small>${escapeHtml(user.email)}</small></div>`).join("") : '<p class="dashboard-empty">Aucun compte de démonstration créé.</p>'}</section>
    </div>`;
  const dialog = document.querySelector("#dashboard-dialog");
  if (!dialog.open) dialog.showModal();
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
  const minBudget = Number(document.querySelector("#filter-budget-min").value || 150000);
  const maxBudget = Number(document.querySelector("#filter-budget-max").value || 500000);
  if (minBudget > maxBudget) {
    toast("Le budget minimum ne peut pas dépasser le budget maximum.");
    return;
  }
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
document.querySelector("#filter-district").addEventListener("change", () => {
  const district = document.querySelector("#filter-district").value;
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.district === district));
});
document.querySelector("#sort-select").addEventListener("change", renderListings);
document.querySelector("#city-scroller").addEventListener("click", event => {
  const button = event.target.closest("[data-district]");
  if (!button) return;
  const districtSelect = document.querySelector("#filter-district");
  districtSelect.value = districtSelect.value === button.dataset.district ? "" : button.dataset.district;
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.district === districtSelect.value));
  visibleCount = 30;
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#city-next").addEventListener("click", () => document.querySelector("#city-scroller").scrollBy({ left: 240, behavior: "smooth" }));
document.querySelector("#load-more").addEventListener("click", () => { visibleCount += 9; renderListings(); });
document.querySelector("#reset-filters").addEventListener("click", () => {
  document.querySelector("#search-form").reset();
  visibleCount = 9;
  document.querySelector("#filter-colocation").dispatchEvent(new Event("change"));
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.district === document.querySelector("#filter-district").value));
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
    const profile = getProfile();
    if (!profile) {
      pendingVisitListingId = Number(visitButton.dataset.visit);
      document.querySelector("#listing-dialog").close();
      openAuth("signup", "tenant");
      return;
    }
    if (profile.role !== "tenant") {
      toast("La demande de visite est réservée aux comptes locataires.");
      return;
    }
    createVisitRequest(visitButton.dataset.visit, profile);
    showListing(visitButton.dataset.visit);
  }
  const colocationButton = event.target.closest("[data-colocation-interest]");
  if (colocationButton) joinColocation(colocationButton.dataset.colocationInterest);
  const reserveButton = event.target.closest("[data-reserve]");
  if (reserveButton) openReservationForm(reserveButton.dataset.reserve);
});
document.querySelector("#listing-detail").addEventListener("submit", event => {
  if (event.target.id === "payment-form") saveReservation(event);
});
document.querySelector("#university-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-campus]");
  if (!button) return;
  document.querySelector("#filter-campus").value = button.dataset.campus;
  document.querySelector("#filter-distance").value = "15";
  visibleCount = 30;
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#benin-map").addEventListener("click", event => {
  const pin = event.target.closest("[data-map-district]");
  if (!pin) return;
  document.querySelector("#filter-district").value = pin.dataset.mapDistrict;
  visibleCount = 30;
  document.querySelectorAll(".city-pill").forEach(pill => pill.classList.toggle("selected", pill.dataset.district === pin.dataset.mapDistrict));
  renderListings();
  document.querySelector("#logements").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelectorAll("[data-admin]").forEach(button => button.addEventListener("click", openAdminDashboard));
document.querySelectorAll("[data-auth]").forEach(button => button.addEventListener("click", () => openAuth(button.dataset.auth, button.dataset.role || "tenant")));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll(".auth-tab").forEach(tab => tab.addEventListener("click", () => setAuthMode(tab.dataset.mode)));
document.querySelector("#review-form").addEventListener("submit", submitReview);
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
  if (!loginMode) {
    localStorage.setItem("studihome-profile", JSON.stringify(profile));
    if (!users.some(user => user.email === profile.email)) users.push(profile);
    localStorage.setItem("studihome-users", JSON.stringify(users));
  }
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
  if (pendingVisitListingId) {
    const listingId = pendingVisitListingId;
    pendingVisitListingId = null;
    if (profile.role === "tenant") createVisitRequest(listingId, profile);
    else toast("La demande de visite est réservée aux comptes locataires.");
  }
  if (pendingPaymentListingId) {
    const listingId = pendingPaymentListingId;
    pendingPaymentListingId = null;
    if (profile.role === "tenant") {
      showListing(listingId);
      openReservationForm(listingId);
      return;
    } else toast("La réservation est réservée aux comptes locataires.");
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
  const walkUac = Number(form.get("walkUac"));
  const zemUac = Number(form.get("zemUac"));
  const walkEneam = Number(form.get("walkEneam"));
  const zemEneam = Number(form.get("zemEneam"));
  const listing = {
    id: Date.now(), title: String(form.get("title")).trim(), city: "Abomey-Calavi",
    district: String(form.get("district")).trim(), type: String(form.get("type")), price,
    bedrooms: 1, bathrooms: 1, verified: false, demo: true, ownerEmail: profile.email,
    ownerName: profile.name, ownerPhone: String(form.get("ownerPhone")).trim(),
    image: `https://images.unsplash.com/${imageIds[(listings.length + 3) % imageIds.length]}?auto=format&fit=crop&w=900&q=78`,
    description: "Annonce publiée depuis l'espace propriétaire de démonstration.",
    deposit: price * 2, advance: price * 3, views: 0, area: 24, available: true,
    roommateSlots: form.get("colocation") ? 1 : 0,
    distances: { uac: { walk: walkUac, zem: zemUac }, eneam: { walk: walkEneam, zem: zemEneam } },
    waterIncluded: Boolean(form.get("waterIncluded")),
    electricityIncluded: Boolean(form.get("electricityIncluded")), active: true
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
  const visitButton = event.target.closest("[data-owner-approve-visit]");
  if (visitButton) {
    approveVisitRequest(visitButton.dataset.ownerApproveVisit);
    return;
  }
  const button = event.target.closest("[data-dashboard-listing]");
  if (button) {
    document.querySelector("#dashboard-dialog").close();
    showListing(button.dataset.dashboardListing);
    return;
  }
  const reviewButton = event.target.closest("[data-write-review]");
  if (reviewButton) {
    openReviewForm(reviewButton.dataset.writeReview);
    return;
  }
  const verifyButton = event.target.closest("[data-admin-verify]");
  const hideButton = event.target.closest("[data-admin-hide]");
  if (verifyButton || hideButton) {
    const id = Number((verifyButton || hideButton).dataset.adminVerify || (verifyButton || hideButton).dataset.adminHide);
    const listing = listings.find(item => item.id === id);
    if (!listing) return;
    if (verifyButton) listing.verified = true;
    if (hideButton) listing.active = false;
    moderation[String(id)] = { verified: listing.verified, active: listing.active };
    localStorage.setItem("studihome-moderation", JSON.stringify(moderation));
    if (listing.ownerEmail) {
      const saved = JSON.parse(localStorage.getItem("studihome-owner-listings") || "[]");
      localStorage.setItem("studihome-owner-listings", JSON.stringify(saved.map(item => item.id === id ? { ...item, verified: listing.verified, active: listing.active } : item)));
    }
    openAdminDashboard();
    renderListings();
    toast(verifyButton ? "Annonce vérifiée." : "Annonce suspendue.");
    return;
  }
  const paymentButton = event.target.closest("[data-admin-payment]");
  if (paymentButton) {
    const transaction = transactions.find(item => item.id === Number(paymentButton.dataset.adminPayment));
    if (!transaction) return;
    transaction.status = "confirmed";
    localStorage.setItem("studihome-transactions", JSON.stringify(transactions));
    openAdminDashboard();
    toast("Simulation marquée comme confirmée ; aucun paiement réel n'a eu lieu.");
    return;
  }
  const concludeButton = event.target.closest("[data-admin-conclude]");
  if (concludeButton) {
    const transaction = transactions.find(item => item.id === Number(concludeButton.dataset.adminConclude));
    if (!transaction) return;
    transaction.leaseStatus = "concluded";
    localStorage.setItem("studihome-transactions", JSON.stringify(transactions));
    openAdminDashboard();
    toast("Location marquée comme conclue dans la démo.");
    return;
  }
  const approveReviewButton = event.target.closest("[data-admin-review]");
  if (approveReviewButton) {
    const review = reviews.find(item => item.id === Number(approveReviewButton.dataset.adminReview));
    if (!review) return;
    review.approved = true;
    localStorage.setItem("studihome-reviews", JSON.stringify(reviews));
    openAdminDashboard();
    renderListings();
    toast("Avis publié.");
  }
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
