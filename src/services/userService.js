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

const saveScheduleDoctor = (data) => {
    return axios.post("/api/create-schedule", data);
};

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(
        `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
    );
};

const getListPatientForDoctor = (data) => {
    return axios.get(
        `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`
    );
};

const postBookAppointment = (data) => {
    return axios.post("/api/patient-book-appointment", data);
};

const postVerifyBookAppointment = (data) => {
    return axios.post("/api/verify-book-appointment", data);
};

const postCompleteAppointment = (data) => {
    return axios.post("/api/complete-appointment", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const postCancelAppointment = (data) => {
    return axios.post("/api/cancel-appointment", data);
};

const createNewSpecialty = (data) => {
    return axios.post("/api/create-new-specialty", data);
};

const getAllSpecialty = () => {
    return axios.get("/api/get-all-specialty");
};

const editSpecialty = (data) => {
    return axios.put("/api/edit-specialty", data);
};

const deleteSpecialty = (specialtyId) => {
    return axios.delete("/api/delete-specialty", { data: { id: specialtyId } });
};

const getDetailSpecialtyById = (data) => {
    return axios.get(
        `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
    );
};

const createNewClinic = (data) => {
    return axios.post("/api/create-new-clinic", data);
};

const getAllClinic = () => {
    return axios.get("/api/get-all-clinic");
};

const editClinic = (data) => {
    return axios.put("/api/edit-clinic", data);
};

const deleteClinic = (clinicId) => {
    return axios.delete("/api/delete-clinic", { data: { id: clinicId } });
};

const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};

const searchEverything = (keyword) => {
    return axios.get(`/api/search?keyword=${encodeURIComponent(keyword)}`);
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
    saveScheduleDoctor,
    getScheduleDoctorByDate,
    getListPatientForDoctor,
    postBookAppointment,
    postVerifyBookAppointment,
    postCompleteAppointment,
    postCancelAppointment,
    createNewSpecialty,
    getAllSpecialty,
    editSpecialty,
    deleteSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinic,
    editClinic,
    deleteClinic,
    getDetailClinicById,
    searchEverything,
};
