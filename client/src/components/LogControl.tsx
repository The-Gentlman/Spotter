// src/components/LogControls.tsx
import { Box, Button } from "@mui/material";

interface Props {
    onStatusChange: (status: string) => void;
}

export default function LogControls({ onStatusChange }: Props) {
    return (
        <Box display="flex" gap={1} flexWrap="wrap" marginTop={2}>
            <Button variant="contained" color="primary" onClick={() => onStatusChange("DRIVING")}>
                Start Driving
            </Button>
            <Button variant="contained" color="secondary" onClick={() => onStatusChange("ON_DUTY")}>
                On Duty
            </Button>
            <Button variant="contained" onClick={() => onStatusChange("OFF_DUTY")}>
                Off Duty
            </Button>
            <Button variant="contained" onClick={() => onStatusChange("SLEEPER")}>
                Sleeper Berth
            </Button>
        </Box>
    );
}
