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
    Grid,
    Typography,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Trip } from "../types/trip";
import { createTrip } from "../api/trip";
import { getUsers } from "../api/users";
import type { User } from "../types/user";

interface Props {
    onCreated?: () => void;
}

const defaultCenter: [number, number] = [39.8283, -98.5795];

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

    const [driverId, setDriverId] = useState<number | null>(null);
    const [drivers, setDrivers] = useState<User[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState(false);

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

    useEffect(() => {
        if (open) {
            setLoadingDrivers(true);
            getUsers()
                .then((res) => setDrivers(res))
                .finally(() => setLoadingDrivers(false));
        }
    }, [open]);

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

    const handleSubmit = async () => {
        if (!fromCoords || !toCoords || !driverId) return;

        const payload: Partial<Trip> = {
            driverId,
            fromLocation,
            toLocation,
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
        setDriverId(null);
    };

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                New Trip
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} mt={1}>
                        {/* Trip Info */}
                        <Typography variant="subtitle1" fontWeight="bold">
                            Trip Info
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={drivers}
                                    getOptionLabel={(option) => option.fullName || ""}
                                    loading={loadingDrivers}
                                    onChange={(_, val) => setDriverId(val ? val.id : null)}
                                    sx={{ width: "100%" }} // ✅ make it full width
                                    renderOption={(props, option) => (
                                        <li {...props} style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                                            {option.fullName}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Driver"
                                            fullWidth
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: { fontSize: "0.95rem", paddingY: "6px" }, // ✅ slightly larger text
                                                endAdornment: (
                                                    <>
                                                        {loadingDrivers ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>

                        {/* Vehicle Info */}
                        <Typography variant="subtitle1" fontWeight="bold">
                            Vehicle Info
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Carrier"
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Co-Driver Name"
                                    value={coDriver}
                                    onChange={(e) => setCoDriver(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Vehicle Number"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Trailer Number"
                                    value={trailerNumber}
                                    onChange={(e) => setTrailerNumber(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        {/* Locations */}
                        <Typography variant="subtitle1" fontWeight="bold">
                            Locations
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="From Location"
                                    value={fromLocation}
                                    onChange={(e) => setFromLocation(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="To Location"
                                    value={toLocation}
                                    onChange={(e) => setToLocation(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

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
                                            setFromCoords([lat, lng]);
                                            setFromLocation(await fetchLocationName(lat, lng));
                                        } else if (!toCoords) {
                                            setToCoords([lat, lng]);
                                            setToLocation(await fetchLocationName(lat, lng));
                                        } else {
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
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!fromCoords || !toCoords || !driverId}
                    >
                        Create Trip
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
