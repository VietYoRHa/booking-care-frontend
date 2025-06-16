import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils/constant";
import { getDetailInfoDoctor } from "../../../services/userService";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            // Markdown content
            contentMarkdown: "",
            contentHTML: "",
            selectedDoctor: "",
            description: "",
            listDoctors: [],
            hasOldData: false,
            // Extra information
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinics: [],
            listSpecialties: [],
            selectedPrice: "",
            selectedPayment: "",
            selectedProvince: "",
            selectedClinic: "",
            selectedSpecialty: "",
            note: "",
            clinicId: "",
            specialtyId: "",
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchRequiredDoctorInfo();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(
                this.props.allDoctors,
                "DOCTOR"
            );
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (prevProps.language !== this.props.language) {
            let { resPrice, resPayment, resProvince } =
                this.props.allRequiredDoctorInfo;
            let { allDoctors } = this.props;

            let dataSelect = this.buildDataInputSelect(allDoctors, "DOCTOR");
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
            let dataSelectPayment = this.buildDataInputSelect(
                resPayment,
                "PAYMENT"
            );
            let dataSelectProvince = this.buildDataInputSelect(
                resProvince,
                "PROVINCE"
            );
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
        if (
            prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo
        ) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
                this.props.allRequiredDoctorInfo;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
            let dataSelectPayment = this.buildDataInputSelect(
                resPayment,
                "PAYMENT"
            );
            let dataSelectProvince = this.buildDataInputSelect(
                resProvince,
                "PROVINCE"
            );
            let dataSelectSpecialty = this.buildDataInputSelect(
                resSpecialty,
                "SPECIALTY"
            );
            let dataSelectClinic = this.buildDataInputSelect(
                resClinic,
                "CLINIC"
            );
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listClinics: dataSelectClinic,
                listSpecialties: dataSelectSpecialty,
            });
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "DOCTOR") {
                inputData.forEach((item) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label =
                        language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                });
            }
            if (type === "PRICE") {
                inputData.forEach((item) => {
                    let object = {};
                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label =
                        language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
            if (type === "PAYMENT" || type === "PROVINCE") {
                inputData.forEach((item) => {
                    let object = {};
                    object.label =
                        language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
            if (type === "SPECIALTY" || type === "CLINIC") {
                inputData.forEach((item) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
            }
        }
        return result;
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        });
    };

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            // Extra information
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            selectedClinic: this.state.selectedClinic.value,
            selectedSpecialty: this.state.selectedSpecialty.value,
            note: this.state.note,
            action:
                hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
        });
    };

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        let {
            listPrice,
            listPayment,
            listProvince,
            listSpecialties,
            listClinics,
        } = this.state;
        const res = await getDetailInfoDoctor(selectedDoctor.value);
        if (
            res &&
            res.errCode === 0 &&
            res.data &&
            res.data.Doctor_Clinic_Specialty
        ) {
            let markdown = res.data.Doctor_Info;
            let selectedPrice = "",
                selectedPayment = "",
                selectedProvince = "",
                selectedSpecialty = "",
                selectedClinic = "",
                note = "";
            if (res.data.Doctor_Clinic_Specialty) {
                selectedPrice = listPrice.find(
                    (item) =>
                        item.value === res.data.Doctor_Clinic_Specialty.priceId
                );
                selectedPayment = listPayment.find(
                    (item) =>
                        item.value ===
                        res.data.Doctor_Clinic_Specialty.paymentId
                );
                selectedProvince = listProvince.find(
                    (item) =>
                        item.value ===
                        res.data.Doctor_Clinic_Specialty.provinceId
                );
                selectedSpecialty = listSpecialties.find(
                    (item) =>
                        item.value ===
                        res.data.Doctor_Clinic_Specialty.specialtyId
                );
                selectedClinic = listClinics.find(
                    (item) =>
                        item.value === res.data.Doctor_Clinic_Specialty.clinicId
                );
                note = res.data.Doctor_Clinic_Specialty.note;
            }
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
                note: note,
            });
        } else {
            this.setState({
                contentHTML: "",
                contentMarkdown: "",
                description: "",
                hasOldData: false,
                selectedPrice: "",
                selectedPayment: "",
                selectedProvince: "",
                selectedSpecialty: "",
                selectedClinic: "",
                note: "",
            });
        }
    };

    handleChangeSelectDoctorInfo = async (selectedOption, select) => {
        let stateName = select.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        });
    };

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        });
    };

    render() {
        let {
            hasOldData,
            selectedDoctor,
            selectedPrice,
            selectedPayment,
            selectedProvince,
            selectedClinic,
            selectedSpecialty,
            listPrice,
            listPayment,
            listProvince,
            listDoctors,
            listClinics,
            listSpecialties,
        } = this.state;

        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="row">
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.select-doctor" />
                        </label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={listDoctors}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.select-doctor" />
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.specialty" />
                        </label>
                        <Select
                            value={selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listSpecialties}
                            name="selectedSpecialty"
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.specialty" />
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.clinic" />
                        </label>
                        <Select
                            value={selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listClinics}
                            name="selectedClinic"
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.clinic" />
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.price" />
                        </label>
                        <Select
                            value={selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPrice}
                            name="selectedPrice"
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.price" />
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.payment" />
                        </label>
                        <Select
                            value={selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPayment}
                            name="selectedPayment"
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.payment" />
                            }
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.province" />
                        </label>
                        <Select
                            value={selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listProvince}
                            name="selectedProvince"
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.province" />
                            }
                        />
                    </div>
                    {/* <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.name-clinic" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "nameClinic")
                            }
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.address-clinic" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "addressClinic")
                            }
                            value={this.state.addressClinic}
                        />
                    </div> */}
                    <div className="col-12 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.note" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "note")
                            }
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.introduce" />
                        </label>
                        <textarea
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangeInput(event, "description")
                            }
                            value={this.state.description}
                        ></textarea>
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    onClick={this.handleSaveContentMarkdown}
                    className={
                        hasOldData === true
                            ? "save-content-doctor"
                            : "create-content-doctor"
                    }
                >
                    {hasOldData === true ? (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.save" />
                        </span>
                    ) : (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.add" />
                        </span>
                    )}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchRequiredDoctorInfo: () =>
            dispatch(actions.fetchRequiredDoctorInfo()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
