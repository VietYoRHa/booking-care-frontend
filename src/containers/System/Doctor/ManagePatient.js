import { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { getListPatientForDoctor } from "../../../services/userService";
import { APPOINTMENT_STATUS, LANGUAGES } from "../../../utils";
import ModalConfirmUser from "./ModalConfirmUser";
import moment from "moment";
import _ from "lodash";
import { FormattedMessage } from "react-intl";

class ManagePatient extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            currentDate: new Date(),
            data: {},
            isOpenModal: false,
            dataConfirm: {},
        };
    }

    async componentDidMount() {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formattedDate = currentDate.setHours(0, 0, 0, 0);
        this.getListPatient(user.id, formattedDate);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
        }
    }

    refetchListPatient = () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formattedDate = currentDate.setHours(0, 0, 0, 0);
        this.getListPatient(user.id, formattedDate);
    };

    handleOnChangeDatePicker = (date) => {
        let { user } = this.props;
        let formattedDate = date[0].setHours(0, 0, 0, 0);
        this.getListPatient(user.id, formattedDate);
        this.setState({
            currentDate: date[0],
        });
    };

    getListPatient = async (doctorId, formattedDate) => {
        let res = await getListPatientForDoctor({
            doctorId: doctorId,
            date: formattedDate,
        });
        if (res && res.errCode === 0) {
            this.setState({
                data: res.data ? res.data : {},
            });
        }
    };

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    buildTimeBooking = (data) => {
        let { language } = this.props;
        if (data && !_.isEmpty(data)) {
            let date = this.capitalizeFirstLetter(
                language === LANGUAGES.VI
                    ? moment.unix(+data.date / 1000).format("dddd - DD/MM/YYYY")
                    : moment
                          .unix(+data.date / 1000)
                          .locale("en")
                          .format("dddd - MM/DD/YYYY")
            );
            let time =
                language === LANGUAGES.VI
                    ? data.patientTimeTypeData.valueVi
                    : data.patientTimeTypeData.valueEn;
            return `${time} - ${date}`;
        }
        return ``;
    };

    buildPatientName = (data) => {
        let { language } = this.props;
        if (data && !_.isEmpty(data)) {
            let nameVi = `${data.patientData.lastName} ${data.patientData.firstName}`;
            let nameEn = `${data.patientData.firstName} ${data.patientData.lastName}`;
            return language === LANGUAGES.VI ? nameVi : nameEn;
        }
        return ``;
    };

    buildDoctorName = () => {
        let { language, user } = this.props;
        if (user && !_.isEmpty(user)) {
            return language === LANGUAGES.VI
                ? `${user.lastName} ${user.firstName}`
                : `${user.firstName} ${user.lastName}`;
        }
        return ``;
    };

    handleConfirm = (item, statusId) => {
        let data = {
            id: item.id,
            doctorId: item.doctorId,
            patientId: item.patientId,
            fullName: this.buildPatientName(item),
            email: item.patientData.email,
            date: item.date,
            timeType: item.timeType,
            timeString: this.buildTimeBooking(item),
            doctorName: this.buildDoctorName(),
            statusId: statusId,
            language: this.props.language,
        };
        this.setState({
            isOpenModal: true,
            dataConfirm: data,
        });
    };

    toggleModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
            dataConfirm: {},
        });
    };

    render() {
        let { data, isOpenModal, dataConfirm } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="manage-patient-container">
                    <div className="title">
                        <FormattedMessage id="manage-patient.title" />
                    </div>
                    <div className="manage-patient-body row">
                        <div className="col-4 form-group">
                            <label>
                                <FormattedMessage id="manage-patient.choose-date" />
                            </label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                            />
                        </div>
                        <div className="col-12">
                            <table id="TableManage">
                                <tbody>
                                    <tr>
                                        <th>
                                            <FormattedMessage id="manage-patient.time" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="manage-patient.patient-name" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="manage-patient.phone-number" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="manage-patient.address" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="manage-patient.gender" />
                                        </th>
                                        <th>
                                            <FormattedMessage id="manage-patient.reason" />
                                        </th>
                                        <th></th>
                                    </tr>
                                    {data && data.length > 0 ? (
                                        data.map((item, index) => {
                                            let nameVi = `${item.patientData.lastName} ${item.patientData.firstName}`;
                                            let nameEn = `${item.patientData.firstName} ${item.patientData.lastName}`;
                                            let genderLabel =
                                                language === LANGUAGES.VI
                                                    ? item.patientData
                                                          .genderData.valueVi
                                                    : item.patientData
                                                          .genderData.valueEn;
                                            let timeLabel =
                                                language === LANGUAGES.VI
                                                    ? item.patientTimeTypeData
                                                          .valueVi
                                                    : item.patientTimeTypeData
                                                          .valueEn;
                                            return (
                                                <tr key={index}>
                                                    <td>{timeLabel}</td>
                                                    <td>
                                                        {language ===
                                                        LANGUAGES.VI
                                                            ? nameVi
                                                            : nameEn}
                                                    </td>
                                                    <td>
                                                        {
                                                            item.patientData
                                                                .phoneNumber
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            item.patientData
                                                                .address
                                                        }
                                                    </td>
                                                    <td>{genderLabel}</td>
                                                    <td>{item.reason}</td>

                                                    <td>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() =>
                                                                this.handleConfirm(
                                                                    item,
                                                                    APPOINTMENT_STATUS.DONE
                                                                )
                                                            }
                                                        >
                                                            <FormattedMessage id="manage-patient.confirm" />
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary ml-4"
                                                            onClick={() =>
                                                                this.handleConfirm(
                                                                    item,
                                                                    APPOINTMENT_STATUS.CANCEL
                                                                )
                                                            }
                                                        >
                                                            <FormattedMessage id="manage-patient.deny" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <FormattedMessage id="manage-patient.no-data" />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ModalConfirmUser
                    isOpen={isOpenModal}
                    toggle={this.toggleModal}
                    dataConfirm={dataConfirm}
                    refetchListPatient={this.refetchListPatient}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
