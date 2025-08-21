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
    TextField,
} from "@mui/material";
import type { Trip } from "../../types/trip";
import { deleteTrip, getTrip, updateTrip } from "../../api/trip";
import TripRouteMap from "../../components/TripRoadMap";

const TripDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
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

    useEffect(() => {
        if (!id) return;
        getTrip(Number(id))
            .then((data) => {
                setTrip(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trip:", err);
                setLoading(false);
            });
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

            {/* Update Dialog */}
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
                <TripRouteMap
                    from={trip.fromCoordinates}
                    to={trip.toCoordinates}
                />
            </Box>
        </div>
    );
};

export default TripDetailPage;
