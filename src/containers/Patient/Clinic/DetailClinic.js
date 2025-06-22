import { Component } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailClinicById } from "../../../services/userService";
import _ from "lodash";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailClinic extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            arrDoctorId: [],
            detailClinic: {},
        };
    }

    async componentDidMount() {
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            let res = await getDetailClinicById({
                id: id,
            });
            console.log(res);

            if (res && res.errCode === 0) {
                let arrId = [];
                if (res.data && !_.isEmpty(res.data)) {
                    let arr = res.data.doctor;
                    if (arr && arr.length > 0) {
                        arr.forEach((item) => {
                            arrId.push(item.doctorId);
                        });
                    }
                }

                this.setState({
                    detailClinic: res.data,
                    arrDoctorId: arrId,
                });
            }
        }
    }

    render() {
        let { arrDoctorId, detailClinic } = this.state;

        return (
            <>
                <div className="detail-clinic-container">
                    <HomeHeader />
                    <div className="detail-clinic-body">
                        <div className="detail-clinic-name">
                            <h2>{detailClinic && detailClinic.name}</h2>
                            <p>
                                <b>Địa chỉ:</b>{" "}
                                {detailClinic && detailClinic.address}
                            </p>
                        </div>
                        <div className="description-clinic">
                            {detailClinic && detailClinic.descriptionHTML && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: detailClinic.descriptionHTML,
                                    }}
                                ></div>
                            )}
                        </div>

                        {arrDoctorId &&
                            arrDoctorId.length > 0 &&
                            arrDoctorId.map((item, index) => {
                                return (
                                    <div className="doctor" key={index}>
                                        <div className="doctor__content-left">
                                            <div className="profile-doctor">
                                                <ProfileDoctor
                                                    doctorId={item}
                                                    isShowDoctorDescription={
                                                        true
                                                    }
                                                    isShowDetailLink={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="doctor__content-right">
                                            <div className="doctor-schedule">
                                                <DoctorSchedule
                                                    doctorId={item}
                                                />
                                            </div>
                                            <div className="doctor-extra-info">
                                                <DoctorExtraInfo
                                                    doctorId={item}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
