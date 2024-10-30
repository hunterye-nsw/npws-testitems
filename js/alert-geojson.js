const alertGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": "alert-001",
                "dtmPublished": "2024-01-15T08:00:00Z",
                "dtmLastModified": "2024-01-16T14:30:00Z",
                "dtmLastReviewed": "2024-01-16T14:30:00Z",
                "reviewFrequency": "Daily",
                "dtmNextReview": "2024-01-17T14:30:00Z",
                "parentAlertId": null,
                "unpublishWithParentAlert": "Yes, automatically unpublish at same time as parent alert",
                "unpublishWithParentAlertDelayHours": 0,
                "alertType": "Bushfire",
                "alertSubTypeOther": null,
                "alertStatus": "Confirmed",
                "whenAlertApplies": "Now, or at a future date/time",
                "alertUpcomingStatus": "Confirmed",
                "alertReason": "Fire"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [151.2093, -33.8688],
                        [151.2193, -33.8688],
                        [151.2193, -33.8588],
                        [151.2093, -33.8588],
                        [151.2093, -33.8688]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "alert-002",
                "dtmPublished": "2024-01-16T09:00:00Z",
                "dtmLastModified": "2024-01-16T09:00:00Z",
                "dtmLastReviewed": "2024-01-16T09:00:00Z",
                "reviewFrequency": "Weekly",
                "dtmNextReview": "2024-01-23T09:00:00Z",
                "parentAlertId": "alert-001",
                "unpublishWithParentAlert": "Automatically unpublish, but with a delay",
                "unpublishWithParentAlertDelayHours": 24,
                "alertType": "Closure",
                "alertSubTypeOther": null,
                "alertStatus": "Confirmed",
                "whenAlertApplies": "Now, or at a future date/time",
                "alertUpcomingStatus": "Confirmed",
                "alertReason": "Fire"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [151.2093, -33.8688],
                        [151.2193, -33.8688],
                        [151.2193, -33.8588],
                        [151.2093, -33.8588],
                        [151.2093, -33.8688]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "alert-003",
                "dtmPublished": "2024-01-16T10:00:00Z",
                "dtmLastModified": "2024-01-16T10:00:00Z",
                "dtmLastReviewed": "2024-01-16T10:00:00Z",
                "reviewFrequency": "Monthly",
                "dtmNextReview": "2024-02-16T10:00:00Z",
                "parentAlertId": null,
                "unpublishWithParentAlert": "No, alert must be unpublished manually",
                "unpublishWithParentAlertDelayHours": 0,
                "alertType": "Safety warning",
                "alertSubTypeOther": "Dangerous cliff conditions",
                "alertStatus": "Predicted",
                "whenAlertApplies": "In future, based on specific conditions",
                "alertUpcomingStatus": "Predicted",
                "alertReason": "Extreme weather"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [151.2093, -33.8688]
            }
        }
    ]
};

// Function to validate alert GeoJSON
function validateAlertGeoJSON(geojson) {
    // Basic GeoJSON structure validation
    if (!geojson.type || geojson.type !== 'FeatureCollection') {
        throw new Error('Invalid GeoJSON: Must be a FeatureCollection');
    }

    // Validate each feature
    geojson.features.forEach((feature, index) => {
        // Required properties validation
        const required = [
            'dtmPublished',
            'dtmLastModified',
            'dtmLastReviewed',
            'reviewFrequency',
            'dtmNextReview',
            'alertType',
            'alertStatus',
            'whenAlertApplies'
        ];

        required.forEach(prop => {
            if (!feature.properties[prop]) {
                throw new Error(`Feature ${index}: Missing required property ${prop}`);
            }
        });

        // Validate review frequency
        const validReviewFrequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
        if (!validReviewFrequencies.includes(feature.properties.reviewFrequency)) {
            throw new Error(`Feature ${index}: Invalid review frequency`);
        }

        // Validate alert type
        const validAlertTypes = [
            'Closure',
            'Safety warning',
            'Notification',
            'NPWS fire ban',
            'Total fire ban',
            'Bushfire',
            'Hazard reduction burn',
            'Catastrophic fire danger rating'
        ];
        if (!validAlertTypes.includes(feature.properties.alertType)) {
            throw new Error(`Feature ${index}: Invalid alert type`);
        }
    });

    return true;
}

// Export the GeoJSON and validation function
export { alertGeoJSON, validateAlertGeoJSON }; 