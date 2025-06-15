import axios from "axios";
import _ from "lodash";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        const { data } = response;
        return response.data;
    },
    (error) => {
        // Xử lý các lỗi phổ biến liên quan đến JWT
        const status = error.response ? error.response.status : null;

        // Nếu token hết hạn hoặc không hợp lệ (401 Unauthorized)
        if (status === 401) {
            localStorage.removeItem("accessToken");
            // Nếu đang ở trang yêu cầu đăng nhập, chuyển về trang login
            if (window.location.pathname !== "/login") {
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                window.location.href = "/login";
            }
        }

        // Nếu không có quyền truy cập (403 Forbidden)
        if (status === 403) {
            window.location.href = "/forbidden";
        }

        return Promise.reject(error);
    }
);

export default instance;
