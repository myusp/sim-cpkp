import { notification } from 'antd';
import axios, { AxiosError } from 'axios';

// Membuat instance Axios
const axiosInstance = axios.create({
    // baseURL: 'http://localhost:3000', // ganti dengan base URL API Anda
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000, // waktu timeout request (opsional)
});

// Menambahkan interceptor untuk menambahkan header Authorization sebelum request dikirim
axiosInstance.interceptors.request.use(
    (config) => {
        // Ambil token dari localStorage
        const token = localStorage.getItem('token'); // ganti 'token' dengan kunci yang sesuai

        if (token) {
            // Jika token ada, tambahkan ke header Authorization
            config.headers['Authorization'] = `Bearer ${JSON.parse(token)}`;
        }
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';

        return config;
    },
    (error) => {
        // Handle error request sebelum dikirim
        return Promise.reject(error);
    }
);

// Menambahkan interceptor untuk menangani response errors
axiosInstance.interceptors.response.use(
    (response) => {
        // Jika response sukses (status 2xx), langsung kembalikan response
        return response;
    },
    (error: AxiosError<{ error?: string, message?: string }>) => {
        // Jika response error
        // console.log("error",error)
        // notification.error({ message: "erro" })
        if (error.response) {
            // Server merespon dengan status kode di luar 2xx
            const statusCode = error.response.status;

            // Tampilkan pesan error berdasarkan status code
            if (statusCode === 401) {
                notification.error({ message: 'Unauthorized! Please login again.' });
            } else if (statusCode === 403) {
                notification.error({ message: 'Forbidden! You do not have permission to access this resource.' });
            } else if (statusCode === 404) {
                notification.error({ message: 'Not Found! The resource you are looking for does not exist.' });
            } else if (statusCode === 500) {
                // window.alert(error)
                notification.error({ message: error.response.data?.error || 'Internal Server Error! Something went wrong on the server.' });
            } else {
                notification.error({ message: `Error ${statusCode}: ${error.response.data?.message || 'An error occurred'}` });
            }

            // Atau, Anda bisa menggunakan console.log
            console.error(`Error ${statusCode}:`, error.response.data);
        } else if (error.request) {
            // Request telah dikirim tetapi tidak ada respons
            console.error('No response received:', error.request);
        } else {
            // Error lain, misalnya masalah setting request
            console.error('Request error:', error.message);
        }

        // Tetap menolak promise agar bisa ditangani oleh pemanggil
        return Promise.reject(error);
    }
);

export default axiosInstance;
