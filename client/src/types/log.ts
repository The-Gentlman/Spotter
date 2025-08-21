export interface LogDay {
    id: string;
    service_day: string;
    total_miles_driving: number;
    driving: number;
    on_duty: number;
    off_duty: number;
    sleeper: number;
    cycle_remaining_hours: number;
    has_violation: boolean;
    segments: DutySegment[];
}

export type DutySegment = {
    start: string | number;
    end: string | number;
    status: "OFF_DUTY" | "SLEEPER" | "DRIVING" | "ON_DUTY";
};
