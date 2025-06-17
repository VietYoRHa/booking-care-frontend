import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import "./SearchContainer.scss";
import { LANGUAGES } from "../../utils/constant";
import LoadingOverlay from "react-loading-overlay";
import { debounce } from "lodash";
import { searchEverything } from "../../services/userService";

class SearchContainer extends Component {
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
            isShowResult: false,
            activeTab: "all",
        };

        // Debounce search function để tránh gửi quá nhiều request
        this.debouncedSearch = debounce(this.performSearch, 500);
    }

    handleOnChangeInput = (event) => {
        const keyword = event.target.value;
        this.setState({
            keyword: keyword,
            isShowResult: keyword.length > 0,
        });

        if (keyword.length > 1) {
            this.debouncedSearch(keyword);
        } else {
            this.setState({
                searchResults: {
                    doctors: [],
                    specialties: [],
                    clinics: [],
                },
            });
        }
    };

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

    handleSearch = (e) => {
        e.preventDefault();
        const { keyword } = this.state;
        if (keyword.trim()) {
            // Redirect to search results page with keyword
            this.props.history.push(
                `/search?keyword=${encodeURIComponent(keyword)}`
            );
        }
    };

    handleRedirectToDetail = (type, id) => {
        this.setState({ isShowResult: false, keyword: "" });

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

    handleTabClick = (tab) => {
        this.setState({ activeTab: tab });
    };

    handleBlur = () => {
        // Delay hiding results to allow clicking on results
        setTimeout(() => {
            this.setState({ isShowResult: false });
        }, 200);
    };

    handleFocus = () => {
        if (this.state.keyword) {
            this.setState({ isShowResult: true });
        }
    };

    renderDoctorResults = (doctors) => {
        const { language } = this.props;

        return doctors.map((doctor, index) => {
            let nameVi = `${doctor.positionData.valueVi}, ${doctor.lastName} ${doctor.firstName}`;
            let nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName}`;

            return (
                <div
                    key={`doctor-${doctor.id}`}
                    className="search-result-item"
                    onClick={() =>
                        this.handleRedirectToDetail("doctor", doctor.id)
                    }
                >
                    <div className="search-item-image doctor-image">
                        <div
                            className="image"
                            style={{ backgroundImage: `url(${doctor.image})` }}
                        ></div>
                    </div>
                    <div className="search-item-info">
                        <div className="search-item-name">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className="search-item-type">
                            <i className="fas fa-user-md"></i>{" "}
                            <FormattedMessage id="patient.search.doctor" />
                        </div>
                    </div>
                </div>
            );
        });
    };

    renderSpecialtyResults = (specialties) => {
        return specialties.map((specialty, index) => (
            <div
                key={`specialty-${specialty.id}`}
                className="search-result-item"
                onClick={() =>
                    this.handleRedirectToDetail("specialty", specialty.id)
                }
            >
                <div className="search-item-image specialty-image">
                    <div
                        className="image"
                        style={{ backgroundImage: `url(${specialty.image})` }}
                    ></div>
                </div>
                <div className="search-item-info">
                    <div className="search-item-name">{specialty.name}</div>
                    <div className="search-item-type">
                        <i className="fas fa-stethoscope"></i>{" "}
                        <FormattedMessage id="patient.search.specialty" />
                    </div>
                </div>
            </div>
        ));
    };

    renderClinicResults = (clinics) => {
        return clinics.map((clinic, index) => (
            <div
                key={`clinic-${clinic.id}`}
                className="search-result-item"
                onClick={() => this.handleRedirectToDetail("clinic", clinic.id)}
            >
                <div className="search-item-image clinic-image">
                    <div
                        className="image"
                        style={{ backgroundImage: `url(${clinic.image})` }}
                    ></div>
                </div>
                <div className="search-item-info">
                    <div className="search-item-name">{clinic.name}</div>
                    <div className="search-item-address">
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {clinic.address}
                    </div>
                    <div className="search-item-type">
                        <i className="fas fa-hospital"></i>{" "}
                        <FormattedMessage id="patient.search.clinic" />
                    </div>
                </div>
            </div>
        ));
    };

    render() {
        const { keyword, isLoading, searchResults, isShowResult, activeTab } =
            this.state;
        const { doctors, specialties, clinics } = searchResults;
        const totalResults =
            doctors.length + specialties.length + clinics.length;
        const hasResults = totalResults > 0;

        return (
            <div className="search-container">
                <div className="search-box">
                    <form onSubmit={this.handleSearch}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={
                                    this.props.language === LANGUAGES.VI
                                        ? "Tìm bác sĩ, chuyên khoa, phòng khám..."
                                        : "Search doctors, specialties, clinics..."
                                }
                                value={keyword}
                                onChange={this.handleOnChangeInput}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-primary search-btn"
                                    type="submit"
                                >
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>

                    {isShowResult && (
                        <div className="search-results-dropdown">
                            <LoadingOverlay
                                active={isLoading}
                                spinner
                                text="Đang tìm kiếm..."
                            >
                                <div className="search-results-tabs">
                                    <div
                                        className={`tab ${
                                            activeTab === "all" ? "active" : ""
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
                                            this.handleTabClick("specialties")
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

                                <div className="search-results-content">
                                    {!hasResults &&
                                    !isLoading &&
                                    keyword.length > 1 ? (
                                        <div className="no-results">
                                            <FormattedMessage id="patient.search.no-results" />
                                        </div>
                                    ) : (
                                        <div className="search-results-list">
                                            {(activeTab === "all" ||
                                                activeTab === "doctors") &&
                                                doctors.length > 0 && (
                                                    <React.Fragment>
                                                        {activeTab ===
                                                            "all" && (
                                                            <div className="search-section-title">
                                                                <i className="fas fa-user-md"></i>{" "}
                                                                <FormattedMessage id="patient.search.doctors" />
                                                            </div>
                                                        )}
                                                        {this.renderDoctorResults(
                                                            doctors
                                                        )}
                                                    </React.Fragment>
                                                )}

                                            {(activeTab === "all" ||
                                                activeTab === "specialties") &&
                                                specialties.length > 0 && (
                                                    <React.Fragment>
                                                        {activeTab ===
                                                            "all" && (
                                                            <div className="search-section-title">
                                                                <i className="fas fa-stethoscope"></i>{" "}
                                                                <FormattedMessage id="patient.search.specialties" />
                                                            </div>
                                                        )}
                                                        {this.renderSpecialtyResults(
                                                            specialties
                                                        )}
                                                    </React.Fragment>
                                                )}

                                            {(activeTab === "all" ||
                                                activeTab === "clinics") &&
                                                clinics.length > 0 && (
                                                    <React.Fragment>
                                                        {activeTab ===
                                                            "all" && (
                                                            <div className="search-section-title">
                                                                <i className="fas fa-hospital"></i>{" "}
                                                                <FormattedMessage id="patient.search.clinics" />
                                                            </div>
                                                        )}
                                                        {this.renderClinicResults(
                                                            clinics
                                                        )}
                                                    </React.Fragment>
                                                )}
                                        </div>
                                    )}

                                    {hasResults && (
                                        <div className="view-all-results">
                                            <button
                                                className="btn btn-light"
                                                onClick={this.handleSearch}
                                            >
                                                <FormattedMessage id="patient.search.view-all-results" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </LoadingOverlay>
                        </div>
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
);
