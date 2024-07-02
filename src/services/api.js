import axios from 'axios';

const baseURL = 'http://ec2-43-201-150-178.ap-northeast-2.compute.amazonaws.com:8081';

const api = axios.create({
    baseURL: baseURL,
    timeout: 10000, 
});

// 요청 인터셉터 설정: 헤더에 토큰 추가
api.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
