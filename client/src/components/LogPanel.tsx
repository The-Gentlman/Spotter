import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import type { LogDay } from "../types/log";
import ELDGrid from "./eld/ELDGrid";

interface Props {
    segments: LogDay[];
    offDuty: number;
    sleeper: number;
    driving: number;
    onDuty: number;
}

export default function LogsPanel({ segments, offDuty, sleeper, driving, onDuty }: Props) {
    return (
        <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>Driver’s Daily Log</Typography>

            <ELDGrid segments={segments} />

            <Table size="small" style={{ marginTop: 16 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Hours</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Off Duty</TableCell>
                        <TableCell align="right">{(offDuty / 60).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sleeper Berth</TableCell>
                        <TableCell align="right">{(sleeper / 60).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Driving</TableCell>
                        <TableCell align="right">{(driving / 60).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>On Duty (Not Driving)</TableCell>
                        <TableCell align="right">{(onDuty / 60).toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );
}
