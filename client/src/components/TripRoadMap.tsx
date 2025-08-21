// components/TripRouteMap.tsx
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Box,
    Skeleton,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import RefreshIcon from "@mui/icons-material/Refresh";

// --- Routing Component ---
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
        out;`;

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

// --- Main Component ---
export default function TripRouteMap({ from, to }: TripRouteMapProps) {
    const [loading, setLoading] = useState(false);

    const handleReload = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
            }}
        >
            <CardHeader
                avatar={<MapIcon color="primary" />}
                title="Direction"
                titleTypographyProps={{ variant: "h6" }}
                action={
                    <IconButton onClick={handleReload} title="به‌روزرسانی مسیر">
                        <RefreshIcon />
                    </IconButton>
                }
                sx={{
                    bgcolor: "background.default",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            />

            <CardContent sx={{ p: 0, height: 400 }}>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                ) : (
                    <Box sx={{ height: "100%", width: "100%" }}>
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
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
