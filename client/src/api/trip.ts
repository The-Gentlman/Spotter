import type { Trip } from "../types/trip";
import apiClient from "./client";

export const getTrips = async (): Promise<Trip[]> => {
    const res = await apiClient.get<Trip[]>("/trip");
    return res.data;
};

export const getTrip = async (tripId: number): Promise<Trip> => {
    const res = await apiClient.get<Trip>(`/trip/${tripId}`);
    return res.data;
};

export const createTrip = async (payload: Partial<Trip>): Promise<Trip> => {
    const res = await apiClient.post<Trip>("/trip", payload);
    return res.data;
};

export const updateTrip = async (
    tripId: number,
    payload: Partial<Trip>
): Promise<Trip> => {
    const res = await apiClient.patch<Trip>(`/trip/${tripId}`, payload);
    return res.data;
};

export const deleteTrip = async (tripId: number): Promise<void> => {
    await apiClient.delete(`/trip/${tripId}`);
};
