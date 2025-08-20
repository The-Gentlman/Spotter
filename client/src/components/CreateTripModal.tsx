"use client";

import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Stack,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { Trip } from "../types/trip";
import { createTrip } from "../api/trip";


interface Props {
    onCreated?: () => void;
}

const defaultCenter: [number, number] = [39.8283, -98.5795]; // USA center


interface MapClickHandlerProps {
    onSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onSelect }: MapClickHandlerProps) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}
export default function CreateTripModal({ onCreated }: Props) {
    const [open, setOpen] = useState(false);

    const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
    const [toCoords, setToCoords] = useState<[number, number] | null>(null);

    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coDriver, setCoDriver] = useState("");
    const [carrier, setCarrier] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [trailerNumber, setTrailerNumber] = useState("");

    const [setting, setSetting] = useState<"start" | "end" | null>(null);

    // reverse geocoding using Nominatim (OpenStreetMap)
    const fetchLocationName = async (lat: number, lon: number): Promise<string> => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            return data.display_name || `${lat},${lon}`;
        } catch {
            return `${lat},${lon}`;
        }
    };

    const handleMapClick = async (e: any) => {
        const { lat, lng } = e.latlng;
        if (setting === "start") {
            setFromCoords([lat, lng]);
            setFromLocation(await fetchLocationName(lat, lng));
            setSetting(null);
        } else if (setting === "end") {
            setToCoords([lat, lng]);
            setToLocation(await fetchLocationName(lat, lng));
            setSetting(null);
        }
    };

    const handleSubmit = async () => {
        if (!fromCoords || !toCoords) return;

        const payload: Partial<Trip> = {
            fromLocation,
            toLocation,
            // coordinates as [lat, lng]
            fromCoordinates: fromCoords,
            toCoordinates: toCoords,
            title,
            description,
            coDriverName: coDriver,
            carrier,
            vehicleNumber,
            trailerNumber,
            status: "PENDING",
        };

        await createTrip(payload);
        if (onCreated) onCreated();
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCoDriver("");
        setCarrier("");
        setVehicleNumber("");
        setTrailerNumber("");
        setFromCoords(null);
        setToCoords(null);
        setFromLocation("");
        setToLocation("");
    };

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                New Trip
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="Co-Driver Name"
                            value={coDriver}
                            onChange={(e) => setCoDriver(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Carrier"
                            value={carrier}
                            onChange={(e) => setCarrier(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Vehicle Number"
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Trailer Number"
                            value={trailerNumber}
                            onChange={(e) => setTrailerNumber(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="From Location"
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="To Location"
                            value={toLocation}
                            onChange={(e) => setToLocation(e.target.value)}
                            fullWidth
                        />

                        <Box height={400} mt={2}>
                            <MapContainer
                                center={defaultCenter}
                                zoom={5}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <MapClickHandler
                                    onSelect={async (lat, lng) => {
                                        if (!fromCoords) {
                                            // first click = start point
                                            setFromCoords([lat, lng]);
                                            setFromLocation(await fetchLocationName(lat, lng));
                                        } else if (!toCoords) {
                                            // second click = end point
                                            setToCoords([lat, lng]);
                                            setToLocation(await fetchLocationName(lat, lng));
                                        } else {
                                            // both already set → reset and start again
                                            setFromCoords([lat, lng]);
                                            setFromLocation(await fetchLocationName(lat, lng));
                                            setToCoords(null);
                                            setToLocation("");
                                        }
                                    }}
                                />

                                {fromCoords && (
                                    <Marker position={fromCoords}>
                                        <Popup>Start: {fromLocation}</Popup>
                                    </Marker>
                                )}
                                {toCoords && (
                                    <Marker position={toCoords}>
                                        <Popup>Destination: {toLocation}</Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </Box>

                        <Box display="flex" gap={2} mt={2}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setSetting("start")}
                            >
                                Set Start on Map
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setSetting("end")}
                            >
                                Set Destination on Map
                            </Button>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!fromCoords || !toCoords}>
                        Create Trip
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
