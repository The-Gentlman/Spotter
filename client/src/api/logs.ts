import apiClient from "./client";
import type { DutySegment } from "../types/log";

export interface LogDay {
    id: number;
    trip: number;
    service_day: string; // YYYY-MM-DD
    off_duty: number;
    sleeper: number;
    driving: number;
    on_duty: number;
    cycle_remaining_hours: number;
    segments: DutySegment[];
    remarks?: string;
    [key: string]: unknown;
}

const API_BASE = "/log";

export async function updateLogStatusByTrip(
    tripId: number,
    id: number,
    newStatus: DutySegment["status"]
): Promise<LogDay> {
    const getRes = await apiClient.get<LogDay>(`${API_BASE}/${id}`);
    const log = getRes.data;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hh}:${mm}`;

    const segments = [...(log.segments || [])];

    if (segments.length > 0) {
        const last = segments[segments.length - 1];

        if (last.status === newStatus) {
            last.end = currentTime;
        } else {
            segments.push({
                start: currentTime,
                end: currentTime,
                status: newStatus,
            });
        }
    } else {
        segments.push({
            start: currentTime,
            end: currentTime,
            status: newStatus,
        });
    }

    const patchRes = await apiClient.patch<LogDay>(`${API_BASE}/${id}`, {
        trip: tripId,
        segments,
    });

    return patchRes.data;
}
