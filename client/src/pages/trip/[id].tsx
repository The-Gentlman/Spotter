import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Chip,
    Stack,
    Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Trip } from "../../types/trip";
import { deleteTrip, getTrip, updateTrip } from "../../api/trip";
import type { DutySegment } from "../../types/log";
import { updateLogStatusByTrip } from "../../api/logs";
import HOSSummaryCard from "../../components/HOSSummaryCard";
import LogsPanel from "../../components/LogPanel";
import TripRouteMap from "../../components/TripRoadMap";
import LogControls from "../../components/LogControl";



const TripDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [logDay, setLogDay] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [formData, setFormData] = useState<Partial<Trip>>({});
    const navigate = useNavigate();

    const statusColors: Record<Trip["status"], "default" | "info" | "success" | "error" | "warning"> = {
        PENDING: "warning",
        IN_PROGRESS: "info",
        COMPLETED: "success",
        CANCELLED: "error",
    };

    const handleDelete = async () => {
        if (!trip) return;
        if (!window.confirm("Are you sure you want to delete this trip?")) return;
        try {
            await deleteTrip(Number(id));
            navigate("/trips");
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleOpenUpdate = () => {
        if (trip) {
            setFormData({
                title: trip.title,
                description: trip.description,
                fromLocation: trip.fromLocation,
                toLocation: trip.toLocation,
                coDriverName: trip.coDriverName || "",
            });
        }
        setOpenUpdate(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!id) return;
        try {
            const updated = await updateTrip(Number(id), formData);
            setTrip(updated);
            setOpenUpdate(false);
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const handleStatusChange = async (status: DutySegment["status"]) => {
        if (!trip || !logDay) return;

        try {
            const updatedLog = await updateLogStatusByTrip(
                Number(trip.id),
                logDay.id,
                status
            );
            setLogDay({ ...updatedLog });
            setTrip((prev) => {
                if (!prev) return prev;

                const updatedLogs = prev.logs.map((l) =>
                    String(l.id) === String(updatedLog.id) ? { ...updatedLog } : l
                );
                return {
                    ...prev,
                    logs: [...updatedLogs],
                };
            });
        } catch (err) {
            console.error("Status change error:", err);
        }
    };

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const tripData = await getTrip(Number(id));
                setTrip(tripData);

                if (Array.isArray(tripData.logs) && tripData.logs.length > 0) {
                    const today = new Date().toISOString().split("T")[0];
                    const todayLog =
                        tripData.logs.find((log: any) => log.date === today) ||
                        tripData.logs[0];
                    setLogDay(todayLog);
                }
            } catch (err) {
                console.error("Error fetching trip:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <Box p={3} textAlign="center">
                <CircularProgress />
            </Box>
        );
    }

    if (!trip) {
        return (
            <Box p={3}>
                <Typography variant="h6">Trip not found.</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Trip #{trip.id}
                </Typography>
                <Chip
                    label={trip.status.replace("_", " ")}
                    color={statusColors[trip.status]}
                    sx={{ fontWeight: 600 }}
                />
            </Box>

            {/* Trip Info */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                <Stack spacing={1.5} divider={<Divider />}>
                    <Box display="flex" gap={1} alignItems="center">
                        <DirectionsCarIcon color="action" />
                        <Typography>
                            <strong>Vehicle:</strong> {trip.vehicleNumber || "N/A"}
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <PersonIcon color="action" />
                        <Typography>
                            <strong>Driver:</strong> {trip.driver}
                        </Typography>
                        {trip.coDriverName && (
                            <Typography sx={{ ml: 2 }}>
                                <strong>Co-Driver:</strong> {trip.coDriverName}
                            </Typography>
                        )}
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <MapIcon color="action" />
                        <Typography>
                            <strong>From:</strong> {trip.fromLocation}
                        </Typography>
                        <Typography sx={{ ml: 2 }}>
                            <strong>To:</strong> {trip.toLocation}
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <LocationOnIcon color="action" />
                        <Typography>
                            <strong>Total Miles:</strong> {trip.totalMileage ?? 0}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Actions */}
            <Box mb={3} display="flex" gap={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleOpenUpdate}
                >
                    Update
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </Box>

            {/* Update Dialog */}
            <Dialog
                open={openUpdate}
                onClose={() => setOpenUpdate(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Update Trip</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            value={formData.title || ""}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            multiline
                            minRows={2}
                            value={formData.description || ""}
                            onChange={handleChange}
                        />
                        <TextField
                            label="From Location"
                            name="fromLocation"
                            fullWidth
                            value={formData.fromLocation || ""}
                            onChange={handleChange}
                        />
                        <TextField
                            label="To Location"
                            name="toLocation"
                            fullWidth
                            value={formData.toLocation || ""}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Co-Driver"
                            name="coDriverName"
                            fullWidth
                            value={formData.coDriverName || ""}
                            onChange={handleChange}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Map */}
            <Box mt={3}>
                <TripRouteMap
                    from={trip.fromCoordinates}
                    to={trip.toCoordinates}
                />
            </Box>

            {/* HOS Data */}
            {logDay && (
                <Box mt={4}>
                    <HOSSummaryCard
                        drivingRemaining={Math.max(0, (660 - (logDay.driving ?? 0)) / 60)}
                        onDutyRemaining={Math.max(0, (840 - (logDay.on_duty ?? 0)) / 60)}
                        cycleRemaining={Number(logDay.cycle_remaining_hours ?? 0)}
                    />
                    <Box mt={2}>
                        <LogsPanel
                            segments={logDay.segments || []}
                            offDuty={logDay.off_duty ?? 0}
                            sleeper={logDay.sleeper ?? 0}
                            driving={logDay.driving ?? 0}
                            onDuty={logDay.on_duty ?? 0}
                        />
                        <LogControls onStatusChange={handleStatusChange} />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default TripDetailPage;
