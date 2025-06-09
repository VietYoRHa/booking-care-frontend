import { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
    getAllCodeService,
    getDetailSpecialtyById,
} from "../../../services/userService";
import _ from "lodash";
import Select from "react-select";
import { LANGUAGES } from "../../../utils/constant";

class DetailSpecialty extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            arrDoctorId: [],
            detailSpecialty: {},
            resProvince: {},
            listProvinces: [],
            selectedProvince: "",
        };
    }

    async componentDidMount() {
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            let [res, resProvince] = await Promise.all([
                getDetailSpecialtyById({
                    id: id,
                    location: "ALL",
                }),
                getAllCodeService("PROVINCE"),
            ]);

            if (
                res &&
                res.errCode === 0 &&
                resProvince &&
                resProvince.errCode === 0
            ) {
                let arrId = [];
                if (res.data && !_.isEmpty(res.data)) {
                    let arr = res.data.specialtyDoctors;
                    if (arr && arr.length > 0) {
                        arr.forEach((item) => {
                            arrId.push(item.doctorId);
                        });
                    }
                }
                if (resProvince && resProvince.data.length > 0) {
                    resProvince.data.unshift({
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueVi: "Toàn quốc",
                        valueEn: "All",
                    });
                }
                let arrProvince = this.buildDataInputSelect(resProvince.data);

                this.setState({
                    detailSpecialty: res.data,
                    resProvince: resProvince.data,
                    arrDoctorId: arrId,
                    listProvinces: arrProvince,
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
            let { resProvince } = this.state;
            let listProvinces = this.buildDataInputSelect(resProvince);
            this.setState({
                listProvinces: listProvinces,
            });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.forEach((item) => {
                let object = {};
                object.label =
                    language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    };

    handleChangeSelect = async (selectedOption) => {
        let stateCopy = { ...this.state };
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById({
                id: id,
                location: selectedOption.value,
            });

            if (res && res.errCode === 0) {
                let arrId = [];
                if (res.data && !_.isEmpty(res.data)) {
                    let arr = res.data.specialtyDoctors;
                    if (arr && arr.length > 0) {
                        arr.forEach((item) => {
                            arrId.push(item.doctorId);
                        });
                    }
                }
                stateCopy.detailSpecialty = res.data;
                stateCopy.arrDoctorId = arrId;
                stateCopy.selectedProvince = selectedOption;
            }
        }
        this.setState({
            ...stateCopy,
        });
    };

    render() {
        let { arrDoctorId, detailSpecialty, listProvinces, selectedProvince } =
            this.state;
        let { language } = this.props;

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className="description-specialty">
                        {detailSpecialty && detailSpecialty.descriptionHTML && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: detailSpecialty.descriptionHTML,
                                }}
                            ></div>
                        )}
                    </div>
                    <div className="location-search">
                        <Select
                            value={selectedProvince}
                            onChange={this.handleChangeSelect}
                            options={listProvinces}
                            name="selectedProvince"
                            placeholder={
                                language === LANGUAGES.VI
                                    ? "Tỉnh thành"
                                    : "Province"
                            }
                        />
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
                                                isShowDoctorDescription={true}
                                                isShowDetailLink={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="doctor__content-right">
                                        <div className="doctor-schedule">
                                            <DoctorSchedule doctorId={item} />
                                        </div>
                                        <div className="doctor-extra-info">
                                            <DoctorExtraInfo doctorId={item} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
