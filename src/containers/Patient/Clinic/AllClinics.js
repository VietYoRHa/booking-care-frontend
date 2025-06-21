import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router-dom";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import "./AllClinics.scss";
import LoadingOverlay from "react-loading-overlay";

class AllClinics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
            isLoading: false,
        };
    }

    async componentDidMount() {
        await this.fetchAllClinics();
    }

    fetchAllClinics = async () => {
        this.setState({ isLoading: true });
        try {
            let res = await getAllClinic();
            if (res && res.errCode === 0) {
                this.setState({
                    dataClinics: res.data ? res.data : [],
                });
            }
        } catch (error) {
            console.error("Error fetching clinics:", error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    };

    render() {
        const { dataClinics, isLoading } = this.state;
        const { language } = this.props;

        return (
            <LoadingOverlay
                active={isLoading}
                spinner
                text="Đang tải dữ liệu..."
                className="loading-overlay"
            >
                <div className="all-clinics-container">
                    <HomeHeader />

                    <div className="all-clinics-header">
                        <div className="container">
                            <h1 className="text-center">
                                <FormattedMessage
                                    id="patient.all-clinics.title"
                                    defaultMessage="Danh sách cơ sở y tế"
                                />
                            </h1>
                            <p className="text-center description">
                                <FormattedMessage
                                    id="patient.all-clinics.sub-title"
                                    defaultMessage="Khám phá các cơ sở y tế hàng đầu và đối tác của BookingCare"
                                />
                            </p>
                        </div>
                    </div>

                    <div className="all-clinics-body">
                        <div className="container">
                            <div className="row">
                                {dataClinics && dataClinics.length > 0 ? (
                                    dataClinics.map((item, index) => {
                                        return (
                                            <div
                                                className="col-md-4 col-sm-6 clinic-item"
                                                key={index}
                                            >
                                                <div
                                                    className="clinic-card"
                                                    onClick={() =>
                                                        this.handleViewDetailClinic(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <div
                                                        className="clinic-image"
                                                        style={{
                                                            backgroundImage: `url(${item.image})`,
                                                        }}
                                                    ></div>
                                                    <div className="clinic-info">
                                                        <h3 className="clinic-name">
                                                            {item.name}
                                                        </h3>
                                                        <div className="clinic-address">
                                                            <i className="fas fa-map-marker-alt"></i>{" "}
                                                            {item.address}
                                                        </div>
                                                        {item.descriptionHTML && (
                                                            <div className="clinic-description">
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: `${item.descriptionHTML.substring(
                                                                            0,
                                                                            100
                                                                        )}...`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                        <div className="view-detail">
                                                            <span>
                                                                <FormattedMessage
                                                                    id="patient.all-clinics.view-detail"
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
                                                id="patient.all-clinics.no-data"
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
    connect(mapStateToProps, mapDispatchToProps)(AllClinics)
);
