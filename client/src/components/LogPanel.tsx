import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import WorkIcon from "@mui/icons-material/Work";
import type { LogDay } from "../types/log";
import ELDGrid from "./eld/ELDGrid";

interface Props {
    segments: LogDay[];
    offDuty: number;
    sleeper: number;
    driving: number;
    onDuty: number;
}

export default function LogsPanel({
    segments,
    offDuty,
    sleeper,
    driving,
    onDuty,
}: Props) {
    const rows = [
        {
            label: "Off Duty",
            value: offDuty,
            icon: <HotelIcon color="primary" />,
        },
        {
            label: "Sleeper Berth",
            value: sleeper,
            icon: <AirlineSeatIndividualSuiteIcon color="secondary" />,
        },
        {
            label: "Driving",
            value: driving,
            icon: <DriveEtaIcon color="error" />,
        },
        {
            label: "On Duty (Not Driving)",
            value: onDuty,
            icon: <WorkIcon color="warning" />,
        },
    ];

    const total =
        (offDuty + sleeper + driving + onDuty) / 60;

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
            }}
        >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Driver’s Daily Log
            </Typography>

            <Box mb={3}>
                <ELDGrid segments={segments} />
            </Box>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography fontWeight="bold">Status</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography fontWeight="bold">Hours</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, idx) => (
                        <TableRow
                            key={row.label}
                            sx={{
                                backgroundColor: idx % 2 === 0 ? "grey.50" : "white",
                            }}
                        >
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                    {row.icon}
                                    <Typography>{row.label}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                {(row.value / 60).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}

                    <TableRow sx={{ backgroundColor: "grey.100" }}>
                        <TableCell>
                            <Typography fontWeight="bold">Total</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography fontWeight="bold">{total.toFixed(2)}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );
}
