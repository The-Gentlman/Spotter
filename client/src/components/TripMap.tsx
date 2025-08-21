import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

export interface TripMapProps {
    center?: [number, number];
    fromCoords?: [number, number] | null;
    toCoords?: [number, number] | null;
    onSelect?: (lat: number, lng: number, type: "from" | "to" | "reset") => void;
    readOnly?: boolean;
    onAddressUpdate?: (address: string, type: "from" | "to") => void;
    height?: string | number;
}

function MapClickHandler({
    onSelect,
    readOnly,
}: {
    onSelect?: (lat: number, lng: number) => void;
    readOnly?: boolean;
}) {
    useMapEvents({
        click(e) {
            if (!readOnly && onSelect) {
                onSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

export default function TripMap({
    center = [39.8283, -98.5795],
    fromCoords,
    toCoords,
    onSelect,
    readOnly = false,
    onAddressUpdate,
    height = 400,
}: TripMapProps) {
    const [fromAddress, setFromAddress] = useState("");
    const [toAddress, setToAddress] = useState("");

    const fetchLocationName = async (lat: number, lon: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            return data.display_name || `${lat}, ${lon}`;
        } catch {
            return `${lat}, ${lon}`;
        }
    };

    const handleSelect = async (lat: number, lng: number) => {
        if (onSelect) {
            if (!fromCoords) {
                const name = await fetchLocationName(lat, lng);
                setFromAddress(name);
                onAddressUpdate?.(name, "from");
                onSelect(lat, lng, "from");
            } else if (!toCoords) {
                const name = await fetchLocationName(lat, lng);
                setToAddress(name);
                onAddressUpdate?.(name, "to");
                onSelect(lat, lng, "to");
            } else {
                const name = await fetchLocationName(lat, lng);
                setFromAddress(name);
                setToAddress("");
                onAddressUpdate?.(name, "from");
                onSelect(lat, lng, "reset");
            }
        }
    };

    return (
        <div style={{ height }}>
            <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onSelect={handleSelect} readOnly={readOnly} />

                {fromCoords && (
                    <Marker position={fromCoords}>
                        <Popup>{fromAddress || "Start"}</Popup>
                    </Marker>
                )}
                {toCoords && (
                    <Marker position={toCoords}>
                        <Popup>{toAddress || "Destination"}</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
