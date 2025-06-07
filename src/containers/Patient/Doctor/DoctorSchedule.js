import { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils/constant";
import "./DoctorSchedule.scss";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDates: [],
            allAvailableTime: [],
            isOpenModal: false,
            selectedTimeModal: {},
        };
    }

    componentDidMount() {
        let { language } = this.props;
        let arrDate = this.getDates(language);
        this.setState({
            allDates: arrDate,
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            let arrDate = this.getDates(this.props.language);
            this.setState({
                allDates: arrDate,
            });
        }
        if (prevProps.doctorId !== this.props.doctorId) {
            let { doctorId } = this.props;
            let { allDates } = this.state;
            let res = await getScheduleDoctorByDate(
                doctorId,
                allDates[0].value
            );
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                });
            }
        }
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    getDates = (language) => {
        let arrDate = [];
        let todayObject = {};
        const todayLabel = language === LANGUAGES.VI ? "Hôm nay" : "Today";
        const todayLabelDate =
            language === LANGUAGES.VI
                ? moment(new Date()).format("DD/MM")
                : moment(new Date()).locale("en").format("MM/DD");
        todayObject.label = `${todayLabel} - ${todayLabelDate}`;
        todayObject.value = moment(new Date()).startOf("day").valueOf();
        arrDate.push(todayObject);

        for (let i = 1; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                const labelVi = moment(new Date())
                    .add(i, "days")
                    .format("dddd - DD/MM");
                object.label = this.capitalizeFirstLetter(labelVi);
            } else {
                const labelEn = moment(new Date())
                    .add(i, "days")
                    .locale("en")
                    .format("ddd - MM/DD");
                object.label = this.capitalizeFirstLetter(labelEn);
            }
            object.value = moment(new Date())
                .add(i, "days")
                .startOf("day")
                .valueOf();
            arrDate.push(object);
        }

        return arrDate;
    };

    handleOnChangeSelect = async (event) => {
        let { doctorId } = this.props;
        if (doctorId && doctorId !== -1) {
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                });
            }
        }
    };

    handleOpenModal = (item) => {
        this.setState({
            isOpenModal: true,
            selectedTimeModal: item,
        });
    };

    handleCloseModal = () => {
        this.setState({
            isOpenModal: false,
            selectedTimeModal: {},
        });
    };

    render() {
        let { allDates, allAvailableTime, isOpenModal, selectedTimeModal } =
            this.state;
        let { language } = this.props;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select
                            onChange={(event) =>
                                this.handleOnChangeSelect(event)
                            }
                        >
                            {allDates &&
                                allDates.length > 0 &&
                                allDates.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>
                                            {item.label}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt">
                                <span>
                                    {" "}
                                    <FormattedMessage id="patient.detail-doctor.schedule" />
                                </span>
                            </i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime && allAvailableTime.length > 0 ? (
                                <>
                                    <div className="time-content-btn">
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay =
                                                language === LANGUAGES.VI
                                                    ? item.timeTypeData.valueVi
                                                    : item.timeTypeData.valueEn;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        this.handleOpenModal(
                                                            item
                                                        )
                                                    }
                                                    className={`btn btn-primary ${
                                                        language ===
                                                        LANGUAGES.VI
                                                            ? "btn-vi"
                                                            : "btn-en"
                                                    }`}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage id="patient.detail-doctor.choose" />{" "}
                                            <i className="far fa-hand-point-up"></i>{" "}
                                            <FormattedMessage id="patient.detail-doctor.book-free" />
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="no-schedule">
                                    <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModal}
                    handleCloseModal={this.handleCloseModal}
                    data={selectedTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
