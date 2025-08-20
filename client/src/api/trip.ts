import type { Trip } from "../types/trip";
import apiClient from "./client";

export const getTrips = async (): Promise<Trip[]> => {
    const res = await apiClient.get<Trip[]>("/trip");
    return res.data;
};

export const getTrip = async (id: number): Promise<Trip> => {
    const res = await apiClient.get<Trip>(`/trip/${id}`);
    return res.data;
};

export const createTrip = async (payload: Partial<Trip>): Promise<Trip> => {
    const res = await apiClient.post<Trip>("/trip", payload);
    return res.data;
};

export const updateTrip = async (
    id: number,
    data: Partial<Trip>
): Promise<Trip> => {
    const res = await apiClient.put<Trip>(`/trip/${id}`, data);
    return res.data;
};

export const deleteTrip = async (id: number): Promise<void> => {
    await apiClient.delete(`/trip/${id}`);
};
