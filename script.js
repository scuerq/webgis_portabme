var geojsonLayer;

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([48.8566, 2.3522], 13); // Centered on Paris, for example

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const infoBox = document.getElementById('info-box');
    const pointInfo = document.getElementById('point-info');
    const navigateButton = document.getElementById('navigate-button');
    let currentCoordinates = null;

    function onEachFeature(feature, layer) {
        layer.on('click', function (e) {
            currentCoordinates = e.latlng;
            pointInfo.innerHTML = `<strong>${feature.properties.name}</strong><br>${feature.properties.description}`;
            infoBox.classList.remove('hidden');
        });
    }

    geojsonLayer=L.geoJSON(semader, {
        onEachFeature: onEachFeature
    }).addTo(map);

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
});
