import { useState, useEffect } from "react";
import type { Trip } from "../../types/trip";
import { getTrips } from "../../api/trip";
import CreateTripModal from "../../components/CreateTripModal";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Chip,
    Grid
} from "@mui/material";
import { DirectionsBus, ArrowForward, Directions } from "@mui/icons-material";

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getTrips();
            setTrips(data);
        })();
    }, []);

    const handleTripCreated = async () => {
        const data = await getTrips();
        setTrips(data);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
            >
                <Typography variant="h5" fontWeight="bold">
                    Trips
                </Typography>
                <CreateTripModal onCreated={handleTripCreated} />
            </Stack>

            {trips.length === 0 ? (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 4,
                        textAlign: "center",
                        color: "text.secondary",
                        borderRadius: 2,
                    }}
                >
                    <Directions sx={{ fontSize: 40, mb: 1, color: "grey.500" }} />
                    <Typography>No trips yet</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {trips.map((trip) => (
                        <Grid item xs={12} md={6} lg={4} key={trip.id}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <DirectionsBus color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {trip.title || `Trip #${trip.id}`}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ color: "text.secondary" }}
                                >
                                    <Typography variant="body2">{trip.fromLocation}</Typography>
                                    <ArrowForward fontSize="small" />
                                    <Typography variant="body2">{trip.toLocation}</Typography>
                                </Stack>

                                <Chip
                                    label={trip.status}
                                    size="small"
                                    color={
                                        trip.status === "active"
                                            ? "success"
                                            : trip.status === "planned"
                                                ? "warning"
                                                : "default"
                                    }
                                    sx={{ alignSelf: "flex-start" }}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
