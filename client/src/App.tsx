// src/App.tsx
"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Box,
  CircularProgress,
} from "@mui/material";
import type { Trip } from "./types/trip";
import { getTrips } from "./api/trip";
import CreateTripModal from "./components/CreateTripModal";
import TripsPage from "./routes/TripPage";
import { Route, Routes } from "react-router-dom";
import TripDetailPage from "./pages/trip/[id]";

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await getTrips();
      setTrips(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <>
      <CssBaseline />

      {/* App Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Trip Management
          </Typography>
          <CreateTripModal onCreated={loadTrips} />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<TripsPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
          </Routes>
        )}
      </Container>
    </>
  );
}
