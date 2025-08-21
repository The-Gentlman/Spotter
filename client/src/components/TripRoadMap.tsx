// components/TripRouteMap.tsx
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useEffect } from "react";

interface TripRouteMapProps {
    from: [number, number];
    to: [number, number];
}

function Routing({ from, to }: TripRouteMapProps) {
    const map = useMap();

    useEffect(() => {
        if (!from || !to) return;

        const control = L.Routing.control({
            waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
        }).addTo(map);

        control.on("routesfound", function (e: any) {
            const coordinates = e.routes[0].coordinates;
            const lats = coordinates.map((c: any) => c.lat);
            const lngs = coordinates.map((c: any) => c.lng);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);

            const gasStationsQuery = `
                [out:json];
                node["amenity"="fuel"](${minLat},${minLng},${maxLat},${maxLng});
                out;
            `;

            fetch(
                `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
                    gasStationsQuery
                )}`
            )
                .then((res) => res.json())
                .then((data) => {
                    data.elements.forEach((el: any) => {
                        if (el.lat && el.lon) {
                            L.marker([el.lat, el.lon], {
                                icon: L.icon({
                                    iconUrl:
                                        "https://cdn-icons-png.flaticon.com/512/149/149060.png",
                                    iconSize: [25, 25],
                                }),
                            })
                                .bindPopup(el.tags?.name || "Gas Station")
                                .addTo(map);
                        }
                    });
                });
        });

        return () => {
            map.removeControl(control);
        };
    }, [map, from, to]);

    return null;
}

export default function TripRouteMap({ from, to }: TripRouteMapProps) {
    return (
        <div style={{ height: 400 }}>
            <MapContainer
                center={from}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Routing from={from} to={to} />
            </MapContainer>
        </div>
    );
}
