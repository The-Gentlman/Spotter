import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Typography,
    CircularProgress,
    Paper,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";
import type { Trip } from "../../types/trip";
import { deleteTrip, getTrip, updateTrip } from "../../api/trip";
import TripRouteMap from "../../components/TripRoadMap";
import HOSSummaryCard from "../../components/HOSSummaryCard";
import LogsPanel from "../../components/LogPanel";
import LogControls from "../../components/LogControl";
import { updateLogStatusByTrip } from "../../api/logs";
import type { DutySegment } from "../../types/log";

const TripDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [logDay, setLogDay] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [formData, setFormData] = useState<Partial<Trip>>({});
    const navigate = useNavigate();

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
                    String(l.id) === String(updatedLog.id)
                        ? { ...updatedLog }
                        : l
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
                    const todayLog = tripData.logs.find((log: any) => log.date === today) || tripData.logs[0];
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
            <div style={{ padding: 20 }}>
                <CircularProgress />
            </div>
        );
    }

    if (!trip) {
        return (
            <div style={{ padding: 20 }}>
                <Typography variant="h6">Trip not found.</Typography>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Trip Detail - {trip.id}
            </Typography>

            <Paper style={{ padding: 20, marginBottom: 20 }}>
                <Typography><strong>Title:</strong> {trip.title}</Typography>
                <Typography><strong>Driver:</strong> {trip.driver}</Typography>
                <Typography><strong>Co-Driver:</strong> {trip.coDriverName || "N/A"}</Typography>
                <Typography><strong>From:</strong> {trip.fromLocation}</Typography>
                <Typography><strong>To:</strong> {trip.toLocation}</Typography>
                <Typography><strong>Status:</strong> {trip.status}</Typography>
            </Paper>

            <Box mb={2} display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={handleOpenUpdate}>
                    Update
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>
            </Box>

            <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Trip</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        fullWidth
                        value={formData.title || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        minRows={2}
                        value={formData.description || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="From Location"
                        name="fromLocation"
                        fullWidth
                        value={formData.fromLocation || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="To Location"
                        name="toLocation"
                        fullWidth
                        value={formData.toLocation || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Co-Driver"
                        name="coDriverName"
                        fullWidth
                        value={formData.coDriverName || ""}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Box mt={3}>
                <TripRouteMap from={trip.fromCoordinates} to={trip.toCoordinates} />
            </Box>

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
        </div>
    );
};

export default TripDetailPage;
