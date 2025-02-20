var geojsonLayer;
var currentCoordinates;
var searchControl;

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([48.8566, 2.3522], 13); // Centered on Paris, for example

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    geojsonLayer = L.geoJSON(semader, {
        onEachFeature: onEachFeature
    }).addTo(map);

    // Zoom to the geojsonLayer bounds
    map.fitBounds(geojsonLayer.getBounds());

    // Add Leaflet Search control
    searchControl = new L.Control.Search({
        layer: geojsonLayer,
        propertyName: 'Libellā', // Specify the property to search by (e.g., 'name')
        marker: false,
        moveToLocation: function(latlng, title, map) {
            // Set the view to the searched location
            map.setView(latlng, 17); // Adjust zoom level if needed
        }
    });
    
});

function showPopup(e, properties) {
    currentCoordinates = e.latlng;
    let infoBox = document.getElementById('info-box');
    let overlay = document.getElementById('popup-overlay');
    if (infoBox) {
        infoBox.remove();
    }
    if (overlay) {
        overlay.remove();
    }
    infoBox = createPopupContent(properties);
    overlay = createOverlay();
    document.body.appendChild(overlay);
    document.body.appendChild(infoBox);
    infoBox.classList.add('show');
    overlay.classList.add('show');
}

function hidePopup() {
    let infoBox = document.getElementById('info-box');
    let overlay = document.getElementById('popup-overlay');
    if (infoBox) {
        infoBox.classList.remove('show');
        setTimeout(() => infoBox.remove(), 300); // Matches the transition duration
    }
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300); // Matches the transition duration
    }
}

function onEachFeature(feature, layer) {
    layer.on('click', function (e) {
        showPopup(e, feature.properties);
    });
}

function createPopupContent(properties) {
    const infoBox = document.createElement('div');
    infoBox.id = 'info-box';
    infoBox.className = 'popup';

    const title = document.createElement('div');
    title.className = 'popup-header';
    title.innerText = 'Point Information';
    infoBox.appendChild(title);

    const pointInfo = document.createElement('div');
    pointInfo.className = 'popup-content';
    let propertiesHtml = '';
    for (const [key, value] of Object.entries(properties)) {
        propertiesHtml += `<strong>${key}</strong>: ${value}<br>`;
    }
    pointInfo.innerHTML = propertiesHtml;
    infoBox.appendChild(pointInfo);

    const navigateButton = document.createElement('button');
    navigateButton.id = 'navigate-button';
    navigateButton.innerText = 'Navigate';
    infoBox.appendChild(navigateButton);

    navigateButton.addEventListener('click', () => {
        if (currentCoordinates) {
            const lat = currentCoordinates.lat;
            const lng = currentCoordinates.lng;
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
    });

    return infoBox;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';
    overlay.className = 'popup-overlay';
    overlay.addEventListener('click', hidePopup);
    return overlay;
}
