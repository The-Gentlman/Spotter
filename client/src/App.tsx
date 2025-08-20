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
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import type { Trip } from "./types/trip";
import { getTrips } from "./api/trip";
import CreateTripModal from "./components/CreateTripModal";


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

          {/* 👇 “New Trip” button + modal inside */}
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
          <Paper>
            <List>
              {trips.map((trip, index) => (
                <Box key={trip.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${trip.fromLocation || "??"} → ${trip.toLocation || "??"}`}
                      secondary={`Driver: ${trip.driverName || "N/A"} | Status: ${trip.status}`}
                    />
                  </ListItem>
                  {index < trips.length - 1 && <Divider />}
                </Box>
              ))}
              {trips.length === 0 && (
                <ListItem>
                  <ListItemText primary="No trips yet. Create one!" />
                </ListItem>
              )}
            </List>
          </Paper>
        )}
      </Container>
    </>
  );
}
