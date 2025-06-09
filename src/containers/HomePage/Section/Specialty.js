import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getAllSpecialty } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import "./Specialty.scss";
import { withRouter } from "react-router-dom";

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                data: res.data ? res.data : [],
            });
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.id}`);
        }
    };

    render() {
        let { data } = this.state;
        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.specialty" />
                        </span>
                        <button className="btn-section">
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {data &&
                                data.length > 0 &&
                                data.map((item, index) => {
                                    return (
                                        <div
                                            className="section-customize specialty-item"
                                            key={index}
                                            onClick={() =>
                                                this.handleViewDetailSpecialty(
                                                    item
                                                )
                                            }
                                        >
                                            <div
                                                className="bg-image section-specialty"
                                                style={{
                                                    backgroundImage: `url(${item.image})`,
                                                }}
                                            ></div>
                                            <div className="specialty-name">
                                                {item.name}
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
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
