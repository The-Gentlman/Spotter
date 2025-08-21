import {
    Card,
    CardContent,
    Grid,
    Typography,
    LinearProgress,
    Box,
} from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import LoopIcon from "@mui/icons-material/Loop";

interface Props {
    drivingRemaining: number;
    onDutyRemaining: number;
    cycleRemaining: number;
}

export default function HOSSummaryCard({
    drivingRemaining,
    onDutyRemaining,
    cycleRemaining,
}: Props) {
    const getProgress = (remaining: number, max: number) =>
        Math.min((remaining / max) * 100, 100);

    const renderCard = (
        label: string,
        value: number,
        max: number,
        icon: React.ReactNode
    ) => (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                    {icon}
                    <Typography variant="subtitle2" color="text.secondary" ml={1}>
                        {label}
                    </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {value.toFixed(2)} {max ? `/ ${max}` : ""}
                </Typography>
                {max > 0 && (
                    <LinearProgress
                        variant="determinate"
                        value={getProgress(value, max)}
                        sx={{
                            height: 8,
                            borderRadius: 5,
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                {renderCard("Driving Hours Left", drivingRemaining, 11, (
                    <DriveEtaIcon color="primary" />
                ))}
            </Grid>
            <Grid item xs={12} sm={4}>
                {renderCard("On-Duty Window Left", onDutyRemaining, 14, (
                    <WorkHistoryIcon color="secondary" />
                ))}
            </Grid>
            <Grid item xs={12} sm={4}>
                {renderCard("Cycle Remaining", cycleRemaining, 0, (
                    <LoopIcon color="success" />
                ))}
            </Grid>
        </Grid>
    );
}
