import type { User } from "../types/user";
import apiClient from "./client";

export const getUsers = async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>("/users/search");
    return res.data;
};
