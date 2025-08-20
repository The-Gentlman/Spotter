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
}
