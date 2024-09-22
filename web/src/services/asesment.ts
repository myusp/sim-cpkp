import { UserAssessmentCreateRequest, UserAssessmentListParams, UserAssessmentParams, UserAssessmentUpdateRequest } from "app-type/request";
import axiosInstance from "./common";
import { UserAssessmentListResponse, UserAssessmentResponse, UserAssessmentViewResponse, viewAssesmenHeadResponse } from "app-type/response";

// Fungsi untuk mengirimkan jawaban assessment
export const submitAssessment = async (data: UserAssessmentCreateRequest): Promise<UserAssessmentResponse> => {
    try {
        const resp = await axiosInstance.post<UserAssessmentResponse>('/api/assesment/create-answer', data);
        return resp.data
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
};

export const updateAssesment = async (data: UserAssessmentUpdateRequest): Promise<UserAssessmentResponse> => {
    try {
        const resp = await axiosInstance.post<UserAssessmentResponse>('/api/assesment/update-answer', data);
        return resp.data
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
};

export const listAssesmen = async (param: UserAssessmentListParams): Promise<UserAssessmentListResponse> => {
    try {
        const resp = await axiosInstance.get<UserAssessmentListResponse>('/api/assesment/list', {
            params: {
                ...param
            }
        });
        return resp.data
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
};

export const viewAssesmen = async (param: UserAssessmentParams): Promise<UserAssessmentViewResponse> => {
    try {
        const resp = await axiosInstance.get<UserAssessmentViewResponse>('/api/assesment/view/' + param.id);
        return resp.data
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
};

export const viewAssesmenHead = async (param: UserAssessmentParams): Promise<viewAssesmenHeadResponse> => {
    try {
        const resp = await axiosInstance.get<viewAssesmenHeadResponse>('/api/assesment/view-head/' + param.id);
        return resp.data
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
};

export type ListUserAsesmenStatusResponse = Array<{
    user: {
        email: string
        nama: string
    }
    asesmen?: {
        id: string
        skp_1: string
        skp_2: string
        skp_3: string
        skp_4: string
        skp_5: string
        skp_6: string
        email: string
    }
    status: boolean
}>


export const listUserAsesmenStatus = async (param: { ruanganRSId: string, rumahSakitId: string, tgl: string }): Promise<ListUserAsesmenStatusResponse> => {
    try {
        const resp = await axiosInstance.get<ListUserAsesmenStatusResponse>('/api/assesment/list-user-status', {
            params: {
                ...param
            }
        });
        return resp.data
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
};