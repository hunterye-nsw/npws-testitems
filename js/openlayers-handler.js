let olMap;
let source;
let vector;
let draw;
let modify;
let snap;

function initOpenLayersMap() {
    // Create vector source for features
    source = new ol.source.Vector();

    // Create vector layer
    vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    // Initialize the map
    olMap = new ol.Map({
        target: 'ol-map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            vector
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([151.2093, -33.8688]), // Sydney coordinates
            zoom: 10
        })
    });

    // Add drawing interaction
    const typeSelect = document.createElement('select');
    typeSelect.innerHTML = `
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
        <option value="Circle">Circle</option>
    `;
    typeSelect.style.cssText = 'position: absolute; top: 10px; left: 10px; z-index: 1000;';
    document.getElementById('ol-map').appendChild(typeSelect);

    function addInteractions() {
        draw = new ol.interaction.Draw({
            source: source,
            type: typeSelect.value
        });
        olMap.addInteraction(draw);
        snap = new ol.interaction.Snap({ source: source });
        olMap.addInteraction(snap);

        // Update GeoJSON output when feature is added
        draw.on('drawend', function(e) {
            updateOLGeoJSONOutput();
        });
    }

    // Handle interaction changes
    typeSelect.onchange = function() {
        olMap.removeInteraction(draw);
        olMap.removeInteraction(snap);
        addInteractions();
    };

    // Add modify interaction
    modify = new ol.interaction.Modify({ source: source });
    olMap.addInteraction(modify);
    modify.on('modifyend', updateOLGeoJSONOutput);

    // Add initial interactions
    addInteractions();

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete Selected';
    deleteButton.style.cssText = 'position: absolute; top: 10px; left: 150px; z-index: 1000;';
    document.getElementById('ol-map').appendChild(deleteButton);

    // Add select interaction for deletion
    const select = new ol.interaction.Select();
    olMap.addInteraction(select);

    deleteButton.onclick = function() {
        const selectedFeatures = select.getFeatures();
        selectedFeatures.forEach(feature => {
            source.removeFeature(feature);
        });
        selectedFeatures.clear();
        updateOLGeoJSONOutput();
    };
}

function updateOLGeoJSONOutput() {
    const features = source.getFeatures();
    const geojson = new ol.format.GeoJSON();
    const featuresGeoJSON = geojson.writeFeaturesObject(features, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
    document.getElementById('geojson-display').value = JSON.stringify(featuresGeoJSON, null, 2);
}

export { initOpenLayersMap }; 