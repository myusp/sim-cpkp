import { LoginRequest } from "app-type/request"
import { LoginResponse } from "app-type/response"
import axiosInstance from "./common";

export const loginService = async (req: LoginRequest): Promise<LoginResponse> => {
    try {
        // Make a POST request to the login endpoint
        const response = await axiosInstance.post<LoginResponse>('/api/auth/login', req);

        // Return the response data (which should be in the format of LoginResponse)
        return response.data;
    } catch (error) {
        // Handle error, either by rethrowing it or handling it accordingly
        console.error('Login service error:', error);
        throw error; // Rethrow the error so it can be handled by the caller
    }
};

