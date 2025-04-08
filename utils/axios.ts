import axios from 'axios';

const axiosServices = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 1000 * 60, // 타임아웃 1분으로 설정 (조정 가능)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosServices.interceptors.request.use(
  (config) => {
    // x-auth-not-required 헤더가 있으면 인증을 건너뛰는 로직
    const authHeader = config.headers['x-auth-not-required'];
    if (authHeader) return config;

    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';

    // 요청 데이터와 파라미터에서 boolean 값을 string으로 변환
    const data = config.params || config.data;
    if (data) {
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === 'boolean') {
          data[key] = data[key].toString();
        }
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosServices.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 발생 시 토큰을 갱신하는 로직
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Token refresh logic
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosServices.post('/refresh-token', {
          refreshToken,
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        // 토큰 갱신 후 원래의 요청을 재시도
        return axiosServices(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰이 실패한 경우 로그인 페이지로 이동
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // 네트워크 에러 처리
    if (!error.response) {
      return Promise.reject({
        message: 'Network Error. Please check your internet connection.',
        status: 'NETWORK_ERROR',
      });
    }

    return Promise.reject(error); // 그 외의 에러는 그대로 반환
  }
);

export default axiosServices;
