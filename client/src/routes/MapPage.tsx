import TripMap from "../components/TripMap";

const MapPage = () => {
    // Example: Shiraz → Tehran
    const from: [number, number] = [29.5918, 52.5837];
    const to: [number, number] = [35.6892, 51.3890];

    const gasStations: [number, number][] = [
        [31.0, 52.0],
        [33.5, 51.2],
        [34.5, 51.5],
    ];

    return (
        <div style={{ padding: 20 }}>
            <h1>Trip Map</h1>
            <TripMap from={from} to={to} gasStations={gasStations} />
        </div>
    );
};

export default MapPage;
