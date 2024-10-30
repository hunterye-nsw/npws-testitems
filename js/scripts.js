import { initLeafletMap } from './leaflet-handler.js';
import { initOpenLayersMap } from './openlayers-handler.js';

let olInitialized = false;

// Initialize the default map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initLeafletMap();
});

// Map switching functionality
window.switchMap = function(type) {
    // Hide all maps
    document.querySelectorAll('.map-frame').forEach(frame => {
        frame.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected map
    switch(type) {
        case 'leaflet':
            document.getElementById('leaflet-map').style.display = 'block';
            document.querySelector('button[onclick="switchMap(\'leaflet\')"]').classList.add('active');
            break;
        case 'openlayers':
            document.getElementById('ol-map').style.display = 'block';
            document.querySelector('button[onclick="switchMap(\'openlayers\')"]').classList.add('active');
            if (!olInitialized) {
                initOpenLayersMap();
                olInitialized = true;
            }
            break;
        case 'maplibre':
            document.getElementById('maplibre-map').style.display = 'block';
            document.querySelector('button[onclick="switchMap(\'maplibre\')"]').classList.add('active');
            break;
        case 'geojsonio':
            document.getElementById('geojsonio-frame').style.display = 'block';
            document.querySelector('button[onclick="switchMap(\'geojsonio\')"]').classList.add('active');
            break;
    }
};

window.downloadGeoJSON = function() {
    const content = document.getElementById('geojson-display').value;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alerts.geojson';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}; 