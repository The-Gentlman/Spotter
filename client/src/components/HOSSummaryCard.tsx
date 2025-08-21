// src/components/HOSSummaryCard.tsx
import { Card, CardContent, Grid, Typography } from "@mui/material";

interface Props {
    drivingRemaining: number; // hours
    onDutyRemaining: number; // hours
    cycleRemaining: number; // hours
}

export default function HOSSummaryCard({ drivingRemaining, onDutyRemaining, cycleRemaining }: Props) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle2">Driving Hours Left</Typography>
                        <Typography variant="h6">{drivingRemaining.toFixed(2)} / 11</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle2">On-Duty Window Left</Typography>
                        <Typography variant="h6">{onDutyRemaining.toFixed(2)} / 14</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardContent>
                        <Typography variant="subtitle2">Cycle Remaining</Typography>
                        <Typography variant="h6">{cycleRemaining.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
