import { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils/constant";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import { withRouter } from "react-router-dom";

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileData: {},
        };
    }

    async componentDidMount() {
        let id = this.props.doctorId;
        let data = await this.getProfileDoctor(id);
        this.setState({
            profileData: data,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.doctorId !== this.props.doctorId) {
            let id = this.props.doctorId;
            let data = this.getProfileDoctor(id);
        }
    }

    getProfileDoctor = async (id) => {
        let data = {};
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                data = res.data;
            }
        }
        return data;
    };

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    renderTimeBooking = (data) => {
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
            return (
                <>
                    <div>
                        {time} - {date}
                    </div>
                    <div>
                        <FormattedMessage id="patient.extra-doctor-info.free-booking" />
                    </div>
                </>
            );
        }
        return <></>;
    };

    handleViewDetailDoctor = (doctorId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctorId}`);
        }
    };

    render() {
        let { profileData } = this.state;
        let {
            doctorId,
            language,
            isShowDoctorDescription,
            data,
            isShowDetailLink,
            isShowPrice,
        } = this.props;
        let nameVi = "";
        let nameEn = "";
        if (profileData && profileData.positionData) {
            nameVi = `${profileData.positionData.valueVi}, ${profileData.lastName} ${profileData.firstName}`;
            nameEn = `${profileData.positionData.valueEn}, ${profileData.firstName} ${profileData.lastName}`;
        }
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left">
                        <div
                            className="content-left__image"
                            style={{
                                backgroundImage: `url(${
                                    profileData && profileData.image
                                        ? profileData.image
                                        : ""
                                })`,
                            }}
                        />
                        {isShowDetailLink === true && (
                            <div
                                className="view-detail-doctor"
                                onClick={() =>
                                    this.handleViewDetailDoctor(doctorId)
                                }
                            >
                                <FormattedMessage id="patient.extra-doctor-info.more" />
                            </div>
                        )}
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className="down">
                            {isShowDoctorDescription === true ? (
                                <>
                                    {profileData &&
                                        profileData.Doctor_Info &&
                                        profileData.Doctor_Info.description && (
                                            <span>
                                                {
                                                    profileData.Doctor_Info
                                                        .description
                                                }
                                            </span>
                                        )}
                                </>
                            ) : (
                                <>{this.renderTimeBooking(data)}</>
                            )}
                        </div>
                        {isShowPrice === true && (
                            <div className="price">
                                <span className="left">
                                    <FormattedMessage id="patient.extra-doctor-info.price" />
                                    :{" "}
                                </span>
                                <span className="right">
                                    {profileData &&
                                        profileData.Doctor_Clinic_Specialty &&
                                        language === LANGUAGES.VI && (
                                            <NumberFormat
                                                value={
                                                    profileData
                                                        .Doctor_Clinic_Specialty
                                                        .priceTypeData.valueVi
                                                }
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                suffix={"VND"}
                                            />
                                        )}{" "}
                                    {profileData &&
                                        profileData.Doctor_Clinic_Specialty &&
                                        language === LANGUAGES.EN && (
                                            <NumberFormat
                                                value={
                                                    profileData
                                                        .Doctor_Clinic_Specialty
                                                        .priceTypeData.valueEn
                                                }
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                suffix={"$"}
                                            />
                                        )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor)
);
