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
        return response.data;
    },
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("persist:user");
            if (window.location.pathname !== "/login") {
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                window.location.href = "/login";
            }
        }

        if (status === 403) {
            window.location.href = "/forbidden";
        }

        return Promise.reject(error);
    }
);

export default instance;
