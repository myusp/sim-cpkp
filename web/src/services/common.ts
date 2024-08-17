import { message } from 'antd';
import axios from 'axios';

// Membuat instance Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // ganti dengan base URL API Anda
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
    (error) => {
        // Jika response error
        if (error.response) {
            // Server merespon dengan status kode di luar 2xx
            const statusCode = error.response.status;

            // Tampilkan pesan error berdasarkan status code
            if (statusCode === 401) {
                message.error('Unauthorized! Please login again.');
            } else if (statusCode === 403) {
                message.error('Forbidden! You do not have permission to access this resource.');
            } else if (statusCode === 404) {
                message.error('Not Found! The resource you are looking for does not exist.');
            } else if (statusCode === 500) {
                message.error('Internal Server Error! Something went wrong on the server.');
            } else {
                message.error(`Error ${statusCode}: ${error.response.data.message || 'An error occurred'}`);
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
