// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

import { useEffect } from "react";

interface TripMapProps {
    from: [number, number]; // [lat, lng]
    to: [number, number];
    gasStations?: [number, number][]; // array of POIs
}

const TripMap: React.FC<TripMapProps> = ({ from, to, gasStations = [] }) => {
    useEffect(() => {
        const map = L.map("trip-map").setView(from, 6);

        // Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Routing Control
        L.Routing.control({
            waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
            routeWhileDragging: false,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: "#0077ff", weight: 5 }],
            },
            createMarker: function (i, waypoint, n) {
                const label = i === 0 ? "Start" : i === n - 1 ? "Destination" : "Stop";
                return L.marker(waypoint.latLng).bindPopup(label);
            },
        }).addTo(map);

        // Gas Station Markers
        gasStations.forEach((station, idx) => {
            L.marker(station, {
                icon: L.icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
                    iconSize: [24, 24],
                })
            }).addTo(map)
                .bindPopup(`Gas Station #${idx + 1}`);
        });

        return () => {
            map.remove();
        };
    }, [from, to, gasStations]);

    return <div id="trip-map" style={{ height: "500px", width: "100%" }} />;
};

export default TripMap;
