import { Component } from "react";
import { connect } from "react-redux";
import "./AdminManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils/constant";
import DatePicker from "../../../components/Input/DatePicker";
import { toast } from "react-toastify";
import _ from "lodash";
import {
    getScheduleDoctorByDate,
    saveBulkScheduleDoctor,
} from "../../../services/userService";

class AdminManageSchedule extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: "",
            rangeTime: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map((item) => ({ ...item, isSelected: false }));
            }
            this.setState({
                rangeTime: data,
            });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    };

    handleChangeSelect = async (selectedDoctor) => {
        let data = this.props.allScheduleTime;
        if (data && data.length > 0) {
            data = data.map((item) => ({ ...item, isSelected: false }));
        }
        this.setState({
            selectedDoctor: selectedDoctor,
            rangeTime: data,
            currentDate: "",
        });
    };

    handleOnChangeDatePicker = async (date) => {
        let selectedDate = date[0].setHours(0, 0, 0, 0);
        let res = await getScheduleDoctorByDate(
            this.state.selectedDoctor.value,
            selectedDate
        );
        if (res && res.errCode === 0) {
            let { rangeTime } = this.state;
            let newRangeTime = [];
            if (rangeTime && rangeTime.length > 0) {
                newRangeTime = rangeTime.map((item) => {
                    item.isSelected = false;
                    let isSelected = res.data.some(
                        (schedule) => schedule.timeType === item.keyMap
                    );
                    if (isSelected) {
                        item.isSelected = true;
                    }
                    return item;
                });
            }
            this.setState({
                currentDate: new Date(selectedDate),
                rangeTime: newRangeTime,
            });
        }
    };

    handleClickButtonTime = (item) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((time) => {
                if (time.id === item.id) {
                    time.isSelected = !time.isSelected;
                }
                return time;
            });
            this.setState({
                rangeTime,
            });
        }
    };

    handleSaveSchedule = async () => {
        let { selectedDoctor, currentDate, rangeTime } = this.state;
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Vui long chọn bác sĩ!");
            return;
        }
        if (!currentDate) {
            toast.error("Vui lòng chọn ngày!");
            return;
        }
        let result = [];

        let formattedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(
                (item) => item.isSelected === true
            );
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.forEach((item) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = item.keyMap;
                    result.push(object);
                });
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formattedDate,
        });

        if (res && res.errCode === 0) {
            toast.success("Lưu lịch khám thành công");
        } else {
            toast.error(res.errMessage);
        }
    };

    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;

        return (
            <div className="manage-schedule-container">
                <div className="m-s-title title">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="manage-schedule.choose-doctor" />
                            </label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="manage-schedule.choose-date" />
                            </label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={new Date().setHours(0, 0, 0, 0)}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime &&
                                rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            key={index}
                                            className={
                                                item.isSelected
                                                    ? "btn btn-schedule active "
                                                    : "btn btn-schedule"
                                            }
                                            onClick={() =>
                                                this.handleClickButtonTime(item)
                                            }
                                        >
                                            {language === LANGUAGES.VI
                                                ? item.valueVi
                                                : item.valueEn}
                                        </button>
                                    );
                                })}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminManageSchedule);
