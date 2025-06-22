import { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import "./BookingModal.scss";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { zodValidate } from "../../../../utils/validate/validate";
import { createBookingSchema } from "../../../../utils/validate/bookingSchema";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            reason: "",
            dateOfBirth: "",
            doctorId: "",
            genders: [],
            selectedGender: "",
            timeType: "",
            isLoading: false,
        };
    }

    async componentDidMount() {
        this.props.fetchGenderStart();
        let { data } = this.props;
        let doctorId = data.doctorId;
        let timeType = data.timeType;
        this.setState({
            doctorId: doctorId,
            timeType: timeType,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGenderSelect(this.props.genders),
            });
        }
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buildDataGenderSelect(this.props.genders),
            });
        }
        if (prevProps.data !== this.props.data) {
            let { data } = this.props;
            let doctorId = data.doctorId;
            let timeType = data.timeType;
            this.setState({
                doctorId: doctorId,
                timeType: timeType,
            });
        }
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = value;
        this.setState({
            ...stateCopy,
        });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            dateOfBirth: date[0],
        });
    };

    buildDataGenderSelect = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.forEach((item) => {
                let object = {};
                object.label =
                    language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    };

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption,
        });
    };

    handleConfirmBooking = async () => {
        let { data } = this.props;
        let dateOfBirth = new Date(this.state.dateOfBirth).getTime() || "";
        let timeString = this.buildTimeBooking(this.props.data);
        let doctorName = this.buildDoctorName(this.props.data);
        let fullName = this.state.fullName.trim();
        let firstName = fullName.split(" ").slice(-1).join(" ");
        let lastName = fullName.split(" ").slice(0, -1).join(" ");

        let formObject = {
            full_name: this.state.fullName,
            phone_number: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date_of_birth: dateOfBirth,
            gender: this.state.selectedGender.value,
        };

        const bookingSchema = createBookingSchema();
        let validate = zodValidate(bookingSchema, formObject);
        if (!validate.isValid) {
            toast.error(validate.errors[0].message);
            return;
        }

        try {
            this.setState({ isLoading: true });
            let res = await postBookAppointment({
                fullName: this.state.fullName,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: this.state.phoneNumber,
                email: this.state.email,
                address: this.state.address,
                reason: this.state.reason,
                date: data.date,
                dateOfBirth: dateOfBirth,
                doctorId: this.state.doctorId,
                selectedGender: this.state.selectedGender.value,
                timeType: this.state.timeType,
                language: this.props.language,
                timeString: timeString,
                doctorName: doctorName,
            });
            if (res && res.errCode === 0) {
                this.props.handleCloseModal();
                toast.success(<FormattedMessage id="toast.success.booking" />);
            } else {
                toast.error(<FormattedMessage id="toast.error.booking" />);
            }
        } catch (error) {
            toast.error(<FormattedMessage id="toast.error.common" />);
        } finally {
            this.setState({ isLoading: false });
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
                    ? data.timeTypeData.valueVi
                    : data.timeTypeData.valueEn;
            return `${time} - ${date}`;
        }
        return ``;
    };

    buildDoctorName = (data) => {
        let { language } = this.props;
        if (data && !_.isEmpty(data)) {
            return language === LANGUAGES.VI
                ? `${data.doctorData.lastName} ${data.doctorData.firstName}`
                : `${data.doctorData.firstName} ${data.doctorData.lastName}`;
        }
        return ``;
    };

    render() {
        let { isOpenModal, handleCloseModal, data } = this.props;
        let {
            fullName,
            phoneNumber,
            email,
            address,
            reason,
            dateOfBirth,
            genders,
            selectedGender,
        } = this.state;
        const doctorId = data && !_.isEmpty(data) ? data.doctorId : "";
        return (
            <Modal
                isOpen={isOpenModal}
                className={"booking-modal-container"}
                size="lg"
                centered={true}
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span className="right" onClick={handleCloseModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-info">
                            <ProfileDoctor
                                data={data}
                                doctorId={doctorId}
                                isShowPrice={true}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.full-name" />
                                </label>
                                <input
                                    className="form-control"
                                    value={fullName}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "fullName"
                                        )
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phone-number" />
                                </label>
                                <input
                                    className="form-control"
                                    value={phoneNumber}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "phoneNumber"
                                        )
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.email" />
                                </label>
                                <input
                                    className="form-control"
                                    value={email}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(event, "email")
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address" />
                                </label>
                                <input
                                    className="form-control"
                                    value={address}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "address"
                                        )
                                    }
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason" />
                                </label>
                                <input
                                    className="form-control"
                                    value={reason}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "reason"
                                        )
                                    }
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.date-of-birth" />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={dateOfBirth}
                                    maxDate={new Date().setHours(0, 0, 0, 0)}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.genders" />
                                </label>
                                <Select
                                    value={selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button
                            className="btn btn-primary"
                            onClick={() => this.handleConfirmBooking()}
                            disabled={this.state.isLoading}
                        >
                            <FormattedMessage id="patient.booking-modal.confirm" />
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleCloseModal}
                        >
                            <FormattedMessage id="patient.booking-modal.cancel" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
