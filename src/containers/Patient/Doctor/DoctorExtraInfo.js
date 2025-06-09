import { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils/constant";
import "./DoctorExtraInfo.scss";
import { FormattedMessage } from "react-intl";
import { getExtraDoctorInfoById } from "../../../services/userService";
import NumberFormat from "react-number-format";

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetail: false,
            extraInfo: {},
        };
    }

    async componentDidMount() {
        if (this.props.doctorId === -1) return;
        let res = await getExtraDoctorInfoById(this.props.doctorId);
        if (res && res.errCode === 0) {
            this.setState({
                extraInfo: res.data,
            });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.doctorId !== this.props.doctorId) {
            let res = await getExtraDoctorInfoById(this.props.doctorId);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data,
                });
            }
        }
    }

    handleShowDetail = (isShow) => {
        this.setState({
            isShowDetail: isShow,
        });
    };

    render() {
        let { isShowDetail, extraInfo } = this.state;
        let { language } = this.props;
        return (
            <div className="doctor-extra-info-container">
                <div className="content-up">
                    <div className="text-address">
                        <FormattedMessage id="patient.extra-doctor-info.address" />
                    </div>
                    <div className="name-clinic">
                        {extraInfo && extraInfo.nameClinic
                            ? extraInfo.nameClinic
                            : ""}
                    </div>
                    <div className="detail-address">
                        {extraInfo && extraInfo.addressClinic
                            ? extraInfo.addressClinic
                            : ""}
                    </div>
                </div>
                <div className="content-down">
                    {isShowDetail === false ? (
                        <div className="short-info">
                            <FormattedMessage id="patient.extra-doctor-info.price" />{" "}
                            {extraInfo &&
                                extraInfo.priceTypeData &&
                                language === LANGUAGES.VI && (
                                    <NumberFormat
                                        value={extraInfo.priceTypeData.valueVi}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        suffix={"VND"}
                                    />
                                )}{" "}
                            {extraInfo &&
                                extraInfo.priceTypeData &&
                                language === LANGUAGES.EN && (
                                    <NumberFormat
                                        value={extraInfo.priceTypeData.valueEn}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        suffix={"$"}
                                    />
                                )}{" "}
                            <span
                                className="more-detail"
                                onClick={() => this.handleShowDetail(true)}
                            >
                                <FormattedMessage id="patient.extra-doctor-info.more-detail" />
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="title-price">
                                <FormattedMessage id="patient.extra-doctor-info.price" />
                                :
                            </div>
                            <div className="detail-info">
                                <div className="price">
                                    <span className="left">
                                        <FormattedMessage id="patient.extra-doctor-info.price" />
                                    </span>
                                    <span className="right">
                                        {extraInfo &&
                                            extraInfo.priceTypeData &&
                                            language === LANGUAGES.VI && (
                                                <NumberFormat
                                                    value={
                                                        extraInfo.priceTypeData
                                                            .valueVi
                                                    }
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    suffix={"VND"}
                                                />
                                            )}{" "}
                                        {extraInfo &&
                                            extraInfo.priceTypeData &&
                                            language === LANGUAGES.EN && (
                                                <NumberFormat
                                                    value={
                                                        extraInfo.priceTypeData
                                                            .valueEn
                                                    }
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    suffix={"$"}
                                                />
                                            )}
                                    </span>
                                </div>
                                <div className="note">
                                    {extraInfo && extraInfo.note
                                        ? extraInfo.note
                                        : ""}
                                </div>
                            </div>
                            <div className="payment">
                                <FormattedMessage id="patient.extra-doctor-info.payment" />
                                :{" "}
                                {extraInfo &&
                                extraInfo.paymentTypeData &&
                                language === LANGUAGES.VI
                                    ? extraInfo.paymentTypeData.valueVi
                                    : ""}
                                {extraInfo &&
                                extraInfo.paymentTypeData &&
                                language === LANGUAGES.EN
                                    ? extraInfo.paymentTypeData.valueEn
                                    : ""}
                            </div>
                            <div className="hide-price">
                                <span
                                    onClick={() => this.handleShowDetail(false)}
                                >
                                    <FormattedMessage id="patient.extra-doctor-info.hide-detail" />
                                </span>
                            </div>
                        </>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
