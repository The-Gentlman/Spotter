import type { LogDay } from "./log";

export interface Trip {
    id: number;
    startDate: string;
    title: string;
    description: string;
    endDate: string | null;
    driverName: string;
    coDriverName: string;
    carrier: string;
    vehicleNumber: string;
    trailerNumber: string;
    fromLocation: string;
    fromCoordinates: [number, number];
    toCoordinates: [number, number];
    toLocation: string;
    homeTerminalAddress: string;
    mainOfficeAddress: string;
    totalMilesToday: number;
    totalMileage: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    logs: LogDay[];
}
