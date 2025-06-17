import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getAllSpecialty } from "../../../services/userService";
import { withRouter } from "react-router-dom";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import "./AllSpecialties.scss";
import LoadingOverlay from "react-loading-overlay";

class AllSpecialties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
            isLoading: false,
        };
    }

    async componentDidMount() {
        await this.fetchAllSpecialties();
    }

    fetchAllSpecialties = async () => {
        this.setState({ isLoading: true });
        try {
            let res = await getAllSpecialty();
            if (res && res.errCode === 0) {
                this.setState({
                    dataSpecialty: res.data ? res.data : [],
                });
            }
        } catch (error) {
            console.error("Error fetching specialties:", error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.id}`);
        }
    };

    render() {
        const { dataSpecialty, isLoading } = this.state;
        const { language } = this.props;

        return (
            <LoadingOverlay
                active={isLoading}
                spinner
                text="Đang tải dữ liệu..."
            >
                <div className="all-specialties-container">
                    <HomeHeader />

                    <div className="all-specialties-header">
                        <div className="container">
                            <h1 className="text-center">
                                <FormattedMessage
                                    id="patient.all-specialties.title"
                                    defaultMessage="Danh sách chuyên khoa"
                                />
                            </h1>
                            <p className="text-center description">
                                <FormattedMessage
                                    id="patient.all-specialties.sub-title"
                                    defaultMessage="Tìm và khám phá các chuyên khoa y tế phù hợp với nhu cầu của bạn"
                                />
                            </p>
                        </div>
                    </div>

                    <div className="all-specialties-body">
                        <div className="container">
                            <div className="row">
                                {dataSpecialty && dataSpecialty.length > 0 ? (
                                    dataSpecialty.map((item, index) => {
                                        return (
                                            <div
                                                className="col-md-4 col-sm-6 specialty-item"
                                                key={index}
                                            >
                                                <div
                                                    className="specialty-card"
                                                    onClick={() =>
                                                        this.handleViewDetailSpecialty(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <div
                                                        className="specialty-image"
                                                        style={{
                                                            backgroundImage: `url(${item.image})`,
                                                        }}
                                                    ></div>
                                                    <div className="specialty-info">
                                                        <h3 className="specialty-name">
                                                            {item.name}
                                                        </h3>
                                                        <div className="specialty-description">
                                                            {item.descriptionHTML && (
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: `${item.descriptionHTML.substring(
                                                                            0,
                                                                            100
                                                                        )}...`,
                                                                    }}
                                                                ></div>
                                                            )}
                                                        </div>
                                                        <div className="view-detail">
                                                            <span>
                                                                <FormattedMessage
                                                                    id="patient.all-specialties.view-detail"
                                                                    defaultMessage="Xem chi tiết"
                                                                />
                                                            </span>
                                                            <i className="fas fa-arrow-right"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-12 text-center no-data">
                                        <h3>
                                            <FormattedMessage
                                                id="patient.all-specialties.no-data"
                                                defaultMessage="Không có dữ liệu"
                                            />
                                        </h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <HomeFooter />
                </div>
            </LoadingOverlay>
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
    connect(mapStateToProps, mapDispatchToProps)(AllSpecialties)
);
