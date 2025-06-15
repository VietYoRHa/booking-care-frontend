import { USER_ROLES } from "../utils";

const authService = {
    // Lưu token vào localStorage
    setToken: (token) => {
        localStorage.setItem("accessToken", token);
    },

    // Lấy token từ localStorage
    getToken: () => {
        return localStorage.getItem("accessToken");
    },

    // Xóa token khi logout
    removeToken: () => {
        localStorage.removeItem("accessToken");
    },

    parseJwt: (token) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join("")
            );

            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    },

    checkRole: (requiredRole) => {
        const token = authService.getToken();
        if (!token) return false;

        const decodedToken = authService.parseJwt(token);
        if (!decodedToken) return false;

        // Kiểm tra xem token có thuộc tính roleId không
        // Giả sử roleId đã được thêm vào payload khi tạo token ở backend
        return decodedToken.roleId === requiredRole;
    },

    // Kiểm tra xem người dùng có phải là admin không
    isAdmin: () => {
        return authService.checkRole(USER_ROLES.ADMIN); // R1 là roleId của admin
    },

    // Kiểm tra xem người dùng có phải là bác sĩ không
    isDoctor: () => {
        return authService.checkRole(USER_ROLES.DOCTOR); // R2 là roleId của bác sĩ
    },

    // Kiểm tra xem người dùng có phải là bệnh nhân không
    isPatient: () => {
        return authService.checkRole(USER_ROLES.PATIENT); // R3 là roleId của bệnh nhân
    },
};

export default authService;
