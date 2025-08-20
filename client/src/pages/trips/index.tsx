import { useState, useEffect } from "react";
import type { Trip } from "../../types/trip";
import { getTrips } from "../../api/trip";
import CreateTripModal from "../../components/CreateTripModal";

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
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h1>Trips</h1>
                <CreateTripModal onCreated={handleTripCreated} />
            </div>

            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        {trip.fromLocation} → {trip.toLocation} ({trip.status})
                    </li>
                ))}
            </ul>
        </div>
    );
}
