import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { getAllDoctorsService } from "../../../services/userService";
import { withRouter } from "react-router-dom";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import "./AllDoctors.scss";
import { LANGUAGES } from "../../../utils/constant";
import LoadingOverlay from "react-loading-overlay";

class AllDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDoctors: [],
            isLoading: false,
        };
    }

    async componentDidMount() {
        await this.fetchAllDoctors();
    }

    fetchAllDoctors = async () => {
        this.setState({ isLoading: true });
        try {
            let res = await getAllDoctorsService();
            if (res && res.errCode === 0) {
                this.setState({
                    allDoctors: res.data ? res.data : [],
                });
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    };

    render() {
        const { allDoctors, isLoading } = this.state;
        const { language } = this.props;

        return (
            <LoadingOverlay
                active={isLoading}
                spinner
                text="Đang tải dữ liệu..."
                className="loading-overlay"
            >
                <div className="all-doctors-container">
                    <HomeHeader />

                    <div className="all-doctors-header">
                        <div className="container">
                            <h1 className="text-center">
                                <FormattedMessage
                                    id="patient.all-doctors.title"
                                    defaultMessage="Danh sách bác sĩ"
                                />
                            </h1>
                            <p className="text-center description">
                                <FormattedMessage
                                    id="patient.all-doctors.sub-title"
                                    defaultMessage="Tìm kiếm và khám phá các bác sĩ hàng đầu trong lĩnh vực y tế"
                                />
                            </p>
                        </div>
                    </div>

                    <div className="all-doctors-body">
                        <div className="container">
                            <div className="row">
                                {allDoctors && allDoctors.length > 0 ? (
                                    allDoctors.map((item, index) => {
                                        let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                        let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                        return (
                                            <div
                                                className="col-md-4 col-sm-6 doctor-item"
                                                key={index}
                                            >
                                                <div
                                                    className="doctor-card"
                                                    onClick={() =>
                                                        this.handleViewDetailDoctor(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <div className="doctor-image-container">
                                                        <div
                                                            className="doctor-image"
                                                            style={{
                                                                backgroundImage: `url(${item.image})`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="doctor-info">
                                                        <h3 className="doctor-name">
                                                            {language ===
                                                            LANGUAGES.VI
                                                                ? nameVi
                                                                : nameEn}
                                                        </h3>

                                                        {item.Doctor_Info && (
                                                            <div className="doctor-clinic">
                                                                {/* <i className="fas fa-hospital"></i> */}
                                                                {item
                                                                    .Doctor_Info
                                                                    .description || (
                                                                    <FormattedMessage
                                                                        id="patient.all-doctors.no-info"
                                                                        defaultMessage="Chưa có thông tin"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="view-detail">
                                                            <span>
                                                                <FormattedMessage
                                                                    id="patient.all-doctors.view-detail"
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
                                                id="patient.all-doctors.no-data"
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
    connect(mapStateToProps, mapDispatchToProps)(AllDoctors)
);
