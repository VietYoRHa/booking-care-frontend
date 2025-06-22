import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import { getDetailInfoDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils/constant";
import "./DetailDoctor.scss";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfo from "./DoctorExtraInfo";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
        };
    }

    async componentDidMount() {
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id,
            });
            let res = await getDetailInfoDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,
                });
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {}
    render() {
        let { detailDoctor, currentDoctorId } = this.state;
        let { language } = this.props;
        let nameVi = "";
        let nameEn = "";
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <div className="doctor-detail-wrapper">
                        <div className="intro-doctor">
                            <div
                                className="content-left"
                                style={{
                                    backgroundImage: `url(${
                                        detailDoctor && detailDoctor.image
                                            ? detailDoctor.image
                                            : ""
                                    })`,
                                }}
                            ></div>
                            <div className="content-right">
                                <div className="up">
                                    {language === LANGUAGES.VI
                                        ? nameVi
                                        : nameEn}
                                </div>
                                <div className="down">
                                    {detailDoctor &&
                                        detailDoctor.Doctor_Info &&
                                        detailDoctor.Doctor_Info
                                            .description && (
                                            <span>
                                                {
                                                    detailDoctor.Doctor_Info
                                                        .description
                                                }
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="schedule-doctor">
                            <div className="content-left">
                                <DoctorSchedule doctorId={currentDoctorId} />
                            </div>
                            <div className="content-right">
                                <DoctorExtraInfo doctorId={currentDoctorId} />
                            </div>
                        </div>
                    </div>
                    <div className="doctor-detail-wrapper striped-border-top">
                        <div className="detail-info-doctor">
                            {detailDoctor &&
                                detailDoctor.Doctor_Info &&
                                detailDoctor.Doctor_Info.contentHTML && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: detailDoctor.Doctor_Info
                                                .contentHTML,
                                        }}
                                    ></div>
                                )}
                        </div>
                    </div>
                </div>
                <HomeFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
