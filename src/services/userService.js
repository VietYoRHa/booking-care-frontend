import axios from "../axios";

const handleLoginApi = (email, password) => {
    return axios.post("/api/login", {
        email,
        password,
    });
};

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
    return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userId) => {
    return axios.delete("/api/delete-user/", { data: { id: userId } });
};

const editUserService = (data) => {
    return axios.put("/api/edit-user/", data);
};

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
};

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
};

const saveDetailDoctorService = (data) => {
    return axios.post("/api/save-info-doctor", data);
};

const getDetailInfoDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
};

const getExtraDoctorInfoById = (id) => {
    return axios.get(`/api/get-extra-doctor-info-by-id?id=${id}`);
};

const getProfileDoctorById = (id) => {
    return axios.get(`/api/get-profile-doctor-by-id?id=${id}`);
};

const saveBulkScheduleDoctor = (data) => {
    return axios.post("/api/bulk-create-schedule", data);
};

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(
        `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
    );
};

const postBookAppointment = (data) => {
    return axios.post("/api/patient-book-appointment", data);
};

export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctorsService,
    saveDetailDoctorService,
    getDetailInfoDoctor,
    getExtraDoctorInfoById,
    getProfileDoctorById,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    postBookAppointment,
};
