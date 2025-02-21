// Initialisation de la carte
var map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Ajout du contrôle de localisation
targetLocation = null;
map.locate({setView: true, maxZoom: 16});
map.on('locationfound', function(e) {
    targetLocation = e.latlng;
    L.marker(e.latlng).addTo(map).bindPopup('Vous êtes ici').openPopup();
});

// Ajout du bouton pour réinitialiser la vue
var resetButton = L.control({position: 'topright'});
resetButton.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.innerHTML = '<button id="reset-map" title="Réinitialiser la vue">🔄</button>';
    div.onclick = function() { map.setView([48.8566, 2.3522], 13); };
    return div;
};
resetButton.addTo(map);

// Chargement des données GeoJSON
var geojsonLayer = L.geoJSON(semader, {
    onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
            showSidebar(e, feature.properties);
        });
    }
}).addTo(map);

map.fitBounds(geojsonLayer.getBounds());


// Ajout du contrôle de recherche
var searchControl = new L.Control.Search({
    layer: geojsonLayer,
    propertyName: 'Libelle',
    marker: false,
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 17);
    }
}).addTo(map);

// Gestion du panneau latéral
function showSidebar(e, properties) {
    let sidebar = document.getElementById('sidebar');
    let sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML = `<h3>Informations</h3>`;
    Object.entries(properties).forEach(([key, value]) => {
        sidebarContent.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
    });

    // Ajout du bouton "Y aller"
    let navigateButton = document.createElement('button');
    navigateButton.id = 'navigate-button';
    navigateButton.innerText = 'Y aller';
    navigateButton.onclick = function() {
        if (e.latlng) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            let url;

            if (/android/i.test(userAgent)) {
                url = `geo:${lat},${lng}?q=${lat},${lng}`;
            } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                url = `maps://maps.apple.com/?daddr=${lat},${lng}`;
            } else {
                url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            }

            window.location.href = url;
        }
    };
    sidebarContent.appendChild(navigateButton);
    
    sidebar.classList.add('show');
}

document.getElementById('close-sidebar').addEventListener('click', function() {
    document.getElementById('sidebar').classList.remove('show');
});

// Ajout du mode sombre
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});
