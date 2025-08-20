import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, CircularProgress, Paper, Box, Button } from "@mui/material";
import type { Trip } from "../../types/trip";
import { deleteTrip, getTrip } from "../../api/trip";

const TripDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [openUpdate, setOpenUpdate] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!trip) return;
        const confirmed = window.confirm("Are you sure you want to delete this trip?");
        if (!confirmed) return;
        try {
            await deleteTrip(Number(id));
            navigate("/trips");
        } catch (err) {
            console.error("Delete error:", err);
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

            <Paper style={{ padding: 20 }}>
                <Typography><strong>Driver:</strong> {trip.driver}</Typography>
                <Typography><strong>From:</strong> {trip.fromLocation}</Typography>
                <Typography><strong>To:</strong> {trip.toLocation}</Typography>
                <Typography><strong>Start Date:</strong> {trip.startDate}</Typography>
                <Typography><strong>End Date:</strong> {trip.endDate}</Typography>
                <Typography><strong>Status:</strong> {trip.status}</Typography>
            </Paper>
            <Box mb={2} display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={() => setOpenUpdate(true)}>
                    Update
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>
            </Box>
        </div>
    );
};

export default TripDetailPage;
