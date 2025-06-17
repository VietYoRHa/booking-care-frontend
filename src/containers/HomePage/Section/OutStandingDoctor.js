import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils/constant";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
        };
    }

    componentDidMount() {
        this.props.getTopDoctor(10);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                arrDoctors: this.props.topDoctors,
            });
        }
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    };

    handleViewAllDoctors = () => {
        if (this.props.history) {
            this.props.history.push(`/all-doctors`);
        }
    };

    render() {
        let { arrDoctors } = this.state;
        let { language } = this.props;

        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.outstanding-doctor" />
                        </span>
                        <button
                            className="btn-section"
                            onClick={this.handleViewAllDoctors}
                        >
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {arrDoctors &&
                                arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                    return (
                                        <div
                                            className="section-customize"
                                            key={index}
                                            onClick={() =>
                                                this.handleViewDetailDoctor(
                                                    item
                                                )
                                            }
                                        >
                                            <div className="customize-border">
                                                <div className="outer-bg">
                                                    <div
                                                        className="bg-image section-outstanding-doctor"
                                                        style={{
                                                            backgroundImage: `url(${item.image})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="position text-center">
                                                    <div>
                                                        {language ===
                                                        LANGUAGES.VI
                                                            ? nameVi
                                                            : nameEn}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctors: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getTopDoctor: (limit) => dispatch(actions.fetchTopDoctor(limit)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
