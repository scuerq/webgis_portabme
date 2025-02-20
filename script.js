var geojsonLayer;
var currentCoordinates;

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
});

function showPopup(e, properties) {
    currentCoordinates = e.latlng;
    let infoBox = document.getElementById('info-box');
    if (infoBox) {
        infoBox.remove();
    }
    infoBox = createPopupContent(properties);
    infoBox.classList.remove('hidden');
}

function onEachFeature(feature, layer) {
    layer.on('click', function (e) {
        showPopup(e, feature.properties);
    });
}

function createPopupContent(properties) {
    const infoBox = document.createElement('div');
    infoBox.id = 'info-box';
    infoBox.className = 'hidden';

    const title = document.createElement('h2');
    title.innerText = 'Point Information';
    infoBox.appendChild(title);

    const pointInfo = document.createElement('div');
    pointInfo.id = 'point-info';
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

    document.body.appendChild(infoBox);
    return infoBox;
}
