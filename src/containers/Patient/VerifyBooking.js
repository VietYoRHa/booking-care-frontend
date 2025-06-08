import { Component } from "react";
import { connect } from "react-redux";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import { FormattedMessage } from "react-intl";
import "./VerifyBooking.scss";

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifyStatus: false,
            errCode: 0,
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            const urlParams = new URLSearchParams(this.props.location.search);
            const token = urlParams.get("token");
            const doctorId = urlParams.get("id");
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId,
            });
            if (res && res.errCode === 0) {
                this.setState({
                    verifyStatus: true,
                    errCode: res.errCode,
                });
            } else {
                this.setState({
                    verifyStatus: true,
                    errCode: res && res.errCode ? res.errCode : -1,
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        let { verifyStatus, errCode } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="verify-email-container">
                    {verifyStatus === false ? (
                        <div>
                            <FormattedMessage id="patient.verify.loading" />
                        </div>
                    ) : (
                        <div>
                            {errCode === 0 ? (
                                <div className="info-booking">
                                    <FormattedMessage id="patient.verify.success" />
                                </div>
                            ) : (
                                <div className="info-booking">
                                    <FormattedMessage id="patient.verify.error" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
