import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import type { Trip } from "./types/trip";
import { getTrips } from "./api/trip";
import CreateTripModal from "./components/CreateTripModal";
import TripsPage from "./routes/TripPage";
import { Route, Routes } from "react-router-dom";
import TripDetailPage from "./pages/trip/[id]";

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ bgcolor: "background.paper" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "text.primary" }}
          >
            Trip Management
          </Typography>
          <CreateTripModal
            onCreated={loadTrips}
            triggerButton={
              <IconButton color="primary">
                <AddCircleOutline />
              </IconButton>
            }
          />
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={6}
            color="text.secondary"
          >
            <CircularProgress />
            <Typography variant="body2" mt={2}>
              Loading trips...
            </Typography>
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
