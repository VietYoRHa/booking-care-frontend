import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";
import { searchEverything } from "../../services/userService";
import { LANGUAGES } from "../../utils/constant";
import "./SearchResultPage.scss";
import LoadingOverlay from "react-loading-overlay";
import SearchContainer from "./SearchContainer";

class SearchResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            isLoading: false,
            searchResults: {
                doctors: [],
                specialties: [],
                clinics: [],
            },
            activeTab: "all",
        };
    }

    async componentDidMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const keyword = queryParams.get("keyword");

        if (keyword) {
            this.setState({ keyword });
            await this.performSearch(keyword);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            const queryParams = new URLSearchParams(this.props.location.search);
            const keyword = queryParams.get("keyword");

            if (keyword) {
                this.setState({ keyword });
                this.performSearch(keyword);
            }
        }
    }

    performSearch = async (keyword) => {
        if (!keyword.trim()) return;

        this.setState({ isLoading: true });

        try {
            let res = await searchEverything(keyword);
            if (res && res.errCode === 0) {
                this.setState({
                    searchResults: {
                        doctors: res.doctors || [],
                        specialties: res.specialties || [],
                        clinics: res.clinics || [],
                    },
                });
            }
        } catch (error) {
            console.error("Error searching:", error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleTabClick = (tab) => {
        this.setState({ activeTab: tab });
    };

    handleViewDetail = (type, id) => {
        switch (type) {
            case "doctor":
                this.props.history.push(`/detail-doctor/${id}`);
                break;
            case "specialty":
                this.props.history.push(`/detail-specialty/${id}`);
                break;
            case "clinic":
                this.props.history.push(`/detail-clinic/${id}`);
                break;
            default:
                break;
        }
    };

    renderDoctors = () => {
        const { doctors } = this.state.searchResults;
        const { language } = this.props;

        if (doctors.length === 0) return null;

        return (
            <div className="search-result-section">
                <h3 className="section-title">
                    <i className="fas fa-user-md"></i>{" "}
                    <FormattedMessage id="patient.search.doctors" />
                </h3>

                <div className="doctors-list">
                    <div className="row">
                        {doctors.map((doctor) => {
                            let nameVi = `${doctor.positionData.valueVi}, ${doctor.lastName} ${doctor.firstName}`;
                            let nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName}`;

                            return (
                                <div
                                    className="col-lg-4 col-md-6"
                                    key={`doctor-${doctor.id}`}
                                >
                                    <div
                                        className="doctor-card"
                                        onClick={() =>
                                            this.handleViewDetail(
                                                "doctor",
                                                doctor.id
                                            )
                                        }
                                    >
                                        <div
                                            className="doctor-image"
                                            style={{
                                                backgroundImage: `url(${doctor.image})`,
                                            }}
                                        ></div>
                                        <div className="doctor-info">
                                            <h4 className="doctor-name">
                                                {language === LANGUAGES.VI
                                                    ? nameVi
                                                    : nameEn}
                                            </h4>

                                            {doctor.Doctor_Info &&
                                                doctor.Doctor_Info
                                                    .specialtyData && (
                                                    <div className="doctor-specialty">
                                                        <i className="fas fa-stethoscope"></i>{" "}
                                                        {
                                                            doctor.Doctor_Info
                                                                .specialtyData
                                                                .name
                                                        }
                                                    </div>
                                                )}

                                            <div className="view-profile">
                                                <FormattedMessage id="patient.search.view-profile" />
                                                <i className="fas fa-arrow-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    renderSpecialties = () => {
        const { specialties } = this.state.searchResults;

        if (specialties.length === 0) return null;

        return (
            <div className="search-result-section">
                <h3 className="section-title">
                    <i className="fas fa-stethoscope"></i>{" "}
                    <FormattedMessage id="patient.search.specialties" />
                </h3>

                <div className="specialties-list">
                    <div className="row">
                        {specialties.map((specialty) => (
                            <div
                                className="col-lg-4 col-md-6"
                                key={`specialty-${specialty.id}`}
                            >
                                <div
                                    className="specialty-card"
                                    onClick={() =>
                                        this.handleViewDetail(
                                            "specialty",
                                            specialty.id
                                        )
                                    }
                                >
                                    <div
                                        className="specialty-image"
                                        style={{
                                            backgroundImage: `url(${specialty.image})`,
                                        }}
                                    ></div>
                                    <div className="specialty-info">
                                        <h4 className="specialty-name">
                                            {specialty.name}
                                        </h4>
                                        <div className="specialty-description">
                                            {specialty.descriptionHTML && (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: `${specialty.descriptionHTML.substring(
                                                            0,
                                                            100
                                                        )}...`,
                                                    }}
                                                ></div>
                                            )}
                                        </div>
                                        <div className="view-detail">
                                            <FormattedMessage id="patient.search.learn-more" />
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    renderClinics = () => {
        const { clinics } = this.state.searchResults;

        if (clinics.length === 0) return null;

        return (
            <div className="search-result-section">
                <h3 className="section-title">
                    <i className="fas fa-hospital"></i>{" "}
                    <FormattedMessage id="patient.search.clinics" />
                </h3>

                <div className="clinics-list">
                    <div className="row">
                        {clinics.map((clinic) => (
                            <div
                                className="col-lg-4 col-md-6"
                                key={`clinic-${clinic.id}`}
                            >
                                <div
                                    className="clinic-card"
                                    onClick={() =>
                                        this.handleViewDetail(
                                            "clinic",
                                            clinic.id
                                        )
                                    }
                                >
                                    <div
                                        className="clinic-image"
                                        style={{
                                            backgroundImage: `url(${clinic.image})`,
                                        }}
                                    ></div>
                                    <div className="clinic-info">
                                        <h4 className="clinic-name">
                                            {clinic.name}
                                        </h4>
                                        <div className="clinic-address">
                                            <i className="fas fa-map-marker-alt"></i>{" "}
                                            {clinic.address}
                                        </div>
                                        <div className="view-detail">
                                            <FormattedMessage id="patient.search.learn-more" />
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { keyword, isLoading, searchResults, activeTab } = this.state;
        const { doctors, specialties, clinics } = searchResults;
        const totalResults =
            doctors.length + specialties.length + clinics.length;

        return (
            <div className="search-result-page">
                <HomeHeader />

                <div className="search-header">
                    <div className="container">
                        <SearchContainer />
                    </div>
                </div>

                <div className="search-result-container">
                    <div className="container">
                        <LoadingOverlay
                            active={isLoading}
                            spinner
                            text="Đang tìm kiếm..."
                        >
                            <div className="search-summary">
                                <h2>
                                    <FormattedMessage id="patient.search.results-for" />
                                    <span className="keyword">"{keyword}"</span>
                                </h2>
                                <p>
                                    <FormattedMessage id="patient.search.total-results" />
                                    : {totalResults}
                                </p>
                            </div>

                            {totalResults === 0 && !isLoading ? (
                                <div className="no-results">
                                    <i className="fas fa-search"></i>
                                    <h3>
                                        <FormattedMessage id="patient.search.no-results-found" />
                                    </h3>
                                    <p>
                                        <FormattedMessage id="patient.search.try-different-keyword" />
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="search-tabs">
                                        <div
                                            className={`tab ${
                                                activeTab === "all"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                this.handleTabClick("all")
                                            }
                                        >
                                            <FormattedMessage id="patient.search.all" />{" "}
                                            ({totalResults})
                                        </div>
                                        <div
                                            className={`tab ${
                                                activeTab === "doctors"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                this.handleTabClick("doctors")
                                            }
                                        >
                                            <FormattedMessage id="patient.search.doctors" />{" "}
                                            ({doctors.length})
                                        </div>
                                        <div
                                            className={`tab ${
                                                activeTab === "specialties"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                this.handleTabClick(
                                                    "specialties"
                                                )
                                            }
                                        >
                                            <FormattedMessage id="patient.search.specialties" />{" "}
                                            ({specialties.length})
                                        </div>
                                        <div
                                            className={`tab ${
                                                activeTab === "clinics"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                this.handleTabClick("clinics")
                                            }
                                        >
                                            <FormattedMessage id="patient.search.clinics" />{" "}
                                            ({clinics.length})
                                        </div>
                                    </div>

                                    <div className="search-results">
                                        {activeTab === "all" && (
                                            <>
                                                {this.renderDoctors()}
                                                {this.renderSpecialties()}
                                                {this.renderClinics()}
                                            </>
                                        )}

                                        {activeTab === "doctors" &&
                                            doctors.length > 0 &&
                                            this.renderDoctors()}
                                        {activeTab === "specialties" &&
                                            specialties.length > 0 &&
                                            this.renderSpecialties()}
                                        {activeTab === "clinics" &&
                                            clinics.length > 0 &&
                                            this.renderClinics()}

                                        {activeTab !== "all" &&
                                            ((activeTab === "doctors" &&
                                                doctors.length === 0) ||
                                                (activeTab === "specialties" &&
                                                    specialties.length === 0) ||
                                                (activeTab === "clinics" &&
                                                    clinics.length === 0)) && (
                                                <div className="no-results category-no-results">
                                                    <i className="fas fa-search"></i>
                                                    <h4>
                                                        <FormattedMessage id="patient.search.no-results-in-category" />
                                                    </h4>
                                                </div>
                                            )}
                                    </div>
                                </>
                            )}
                        </LoadingOverlay>
                    </div>
                </div>

                <HomeFooter />
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
    connect(mapStateToProps, mapDispatchToProps)(SearchResultPage)
);
