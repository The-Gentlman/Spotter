import { useEffect, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { getTrips } from "../api/trip";
import type { Trip } from "../types/trip";
import { Typography } from "@mui/material";
import DataTable from "../components/Layout/DataTable";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "driverName", headerName: "Driver", width: 220 },
    { field: "fromLocation", headerName: "From", width: 150 },
    { field: "toLocation", headerName: "To", width: 150 },
    { field: "startDate", headerName: "Start", width: 140 },
    { field: "endDate", headerName: "End", width: 140 },
    { field: "status", headerName: "Status", width: 140 },
];

const TripsPage = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTrips()
            .then((data) => {
                setTrips(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trips:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Trips
            </Typography>
            <DataTable rows={trips} columns={columns} loading={loading} />
        </div>
    );
};

export default TripsPage;
