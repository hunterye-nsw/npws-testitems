import { alertGeoJSON, validateAlertGeoJSON } from './alert-geojson.js';

let mapboxMap;
let drawControl;

function initMapboxMap() {
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // You'll need to replace this

    mapboxMap = new mapboxgl.Map({
        container: 'mapbox-map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [151.2093, -33.8688], // Sydney coordinates
        zoom: 10
    });

    // Add draw controls
    const MapboxDraw = new mapboxgl.Draw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
            point: true,
            line_string: true
        },
        // Customize the styles for different alert types
        styles: [
            {
                'id': 'gl-draw-polygon',
                'type': 'fill',
                'filter': ['all', ['==', '$type', 'Polygon']],
                'paint': {
                    'fill-color': '#ff0000',
                    'fill-opacity': 0.4
                }
            },
            {
                'id': 'gl-draw-polygon-stroke',
                'type': 'line',
                'filter': ['all', ['==', '$type', 'Polygon']],
                'paint': {
                    'line-color': '#ff0000',
                    'line-width': 2
                }
            }
        ]
    });

    mapboxMap.addControl(MapboxDraw);
    drawControl = MapboxDraw;

    mapboxMap.on('load', () => {
        // Add existing alerts as a source
        mapboxMap.addSource('alerts', {
            type: 'geojson',
            data: alertGeoJSON
        });

        // Add polygon layer for alerts
        mapboxMap.addLayer({
            'id': 'alerts-fill',
            'type': 'fill',
            'source': 'alerts',
            'paint': {
                'fill-color': [
                    'match',
                    ['get', 'alertType'],
                    'Bushfire', '#ff0000',
                    'Closure', '#ff6600',
                    '#3388ff'
                ],
                'fill-opacity': 0.4
            },
            'filter': ['==', '$type', 'Polygon']
        });

        // Add point layer for alerts
        mapboxMap.addLayer({
            'id': 'alerts-points',
            'type': 'circle',
            'source': 'alerts',
            'paint': {
                'circle-radius': 8,
                'circle-color': '#ff7800',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#000'
            },
            'filter': ['==', '$type', 'Point']
        });

        // Add popups
        mapboxMap.on('click', ['alerts-fill', 'alerts-points'], (e) => {
            const props = e.features[0].properties;
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <h3>Alert: ${props.alertType}</h3>
                    <p>Status: ${props.alertStatus}</p>
                    <p>Published: ${new Date(props.dtmPublished).toLocaleString()}</p>
                    <p>Next Review: ${new Date(props.dtmNextReview).toLocaleString()}</p>
                    <p>Reason: ${props.alertReason}</p>
                    ${props.alertSubTypeOther ? `<p>Details: ${props.alertSubTypeOther}</p>` : ''}
                `)
                .addTo(mapboxMap);
        });
    });

    // Handle drawing events
    mapboxMap.on('draw.create', updateGeoJSONOutput);
    mapboxMap.on('draw.delete', updateGeoJSONOutput);
    mapboxMap.on('draw.update', updateGeoJSONOutput);
}

function updateGeoJSONOutput() {
    const data = drawControl.getAll();
    document.getElementById('geojson-display').value = JSON.stringify(data, null, 2);
}

export { initMapboxMap }; 