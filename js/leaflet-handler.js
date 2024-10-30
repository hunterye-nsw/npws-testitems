import { alertGeoJSON, validateAlertGeoJSON } from './alert-geojson.js';

let leafletMap;
let drawnItems;

function initLeafletMap() {
    // Initialize the map centered on NSW
    leafletMap = L.map('leaflet-map').setView([-33.8688, 151.2093], 10);

    // Add OpenStreetMap as the basemap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Initialize the FeatureGroup to store editable layers
    drawnItems = new L.FeatureGroup();
    leafletMap.addLayer(drawnItems);

    // Initialize the draw control with all drawing tools
    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            polyline: true,
            rectangle: true,
            circle: true,
            marker: true,
            circlemarker: false
        }
    });
    leafletMap.addControl(drawControl);

    // Add the alerts to the map with styling
    L.geoJSON(alertGeoJSON, {
        style: function(feature) {
            // Style based on alert type
            switch(feature.properties.alertType) {
                case 'Bushfire':
                    return {
                        color: "#ff0000",
                        weight: 2,
                        fillOpacity: 0.4,
                        fillColor: "#ff3333"
                    };
                case 'Closure':
                    return {
                        color: "#ff6600",
                        weight: 2,
                        fillOpacity: 0.4,
                        fillColor: "#ff8533"
                    };
                default:
                    return {
                        color: "#3388ff",
                        weight: 2,
                        fillOpacity: 0.4,
                        fillColor: "#6699ff"
                    };
            }
        },
        pointToLayer: function(feature, latlng) {
            // Custom marker for point features
            if (feature.geometry.type === "Point") {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        },
        onEachFeature: function(feature, layer) {
            // Add popup with alert information
            const props = feature.properties;
            layer.bindPopup(`
                <h3>Alert: ${props.alertType}</h3>
                <p>Status: ${props.alertStatus}</p>
                <p>Published: ${new Date(props.dtmPublished).toLocaleString()}</p>
                <p>Next Review: ${new Date(props.dtmNextReview).toLocaleString()}</p>
                <p>Reason: ${props.alertReason}</p>
                ${props.alertSubTypeOther ? `<p>Details: ${props.alertSubTypeOther}</p>` : ''}
            `);
        }
    }).addTo(leafletMap);

    // Event handlers for drawing
    leafletMap.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
        updateGeoJSONOutput();
    });

    leafletMap.on(L.Draw.Event.EDITED, function (e) {
        updateGeoJSONOutput();
    });

    leafletMap.on(L.Draw.Event.DELETED, function (e) {
        updateGeoJSONOutput();
    });
}

function updateGeoJSONOutput() {
    const geoJSONData = drawnItems.toGeoJSON();
    document.getElementById('geojson-display').value = JSON.stringify(geoJSONData, null, 2);
}

export { initLeafletMap }; 