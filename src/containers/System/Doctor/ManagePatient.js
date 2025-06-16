import { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { getListPatientForDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import ModalConfirmUser from "./ModalConfirmUser";

class ManagePatient extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            currentDate: new Date(),
            data: {},
            isOpenModal: false,
            dataConfirm: {},
        };
    }

    async componentDidMount() {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formattedDate = currentDate.setHours(0, 0, 0, 0);
        this.getListPatient(user.id, formattedDate);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
        }
    }

    handleOnChangeDatePicker = (date) => {
        let { user } = this.props;
        let formattedDate = date[0].setHours(0, 0, 0, 0);
        this.getListPatient(user.id, formattedDate);
        this.setState({
            currentDate: date[0],
        });
    };

    getListPatient = async (doctorId, formattedDate) => {
        let res = await getListPatientForDoctor({
            doctorId: doctorId,
            date: formattedDate,
        });
        if (res && res.errCode === 0) {
            this.setState({
                data: res.data ? res.data : {},
            });
        }
    };

    handleConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
        };
        this.setState({
            isOpenModal: true,
            dataConfirm: data,
        });
    };

    closeModal = () => {
        this.setState({
            isOpenModal: false,
            dataConfirm: {},
        });
    };

    render() {
        let { data, isOpenModal, dataConfirm } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="manage-patient-container">
                    <div className="title">Quản lý bệnh nhân</div>
                    <div className="manage-patient-body row">
                        <div className="col-4 form-group">
                            <label>Chọn ngày khám</label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                            />
                        </div>
                        <div className="col-12">
                            <table id="TableManage">
                                <tbody>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ tên</th>
                                        <th>Địa chỉ</th>
                                        <th>Giới tính</th>
                                        <th>Lí do khám</th>
                                        <th>Hành động</th>
                                    </tr>
                                    {data && data.length > 0
                                        ? data.map((item, index) => {
                                              let nameVi = `${item.patientData.lastName} ${item.patientData.firstName}`;
                                              let nameEn = `${item.patientData.firstName} ${item.patientData.lastName}`;
                                              let genderLabel =
                                                  language === LANGUAGES.VI
                                                      ? item.patientData
                                                            .genderData.valueVi
                                                      : item.patientData
                                                            .genderData.valueEn;
                                              let timeLabel =
                                                  language === LANGUAGES.VI
                                                      ? item.patientTimeTypeData
                                                            .valueVi
                                                      : item.patientTimeTypeData
                                                            .valueEn;
                                              return (
                                                  <tr key={index}>
                                                      <td>{index + 1}</td>
                                                      <td>{timeLabel}</td>
                                                      <td>
                                                          {language ===
                                                          LANGUAGES.VI
                                                              ? nameVi
                                                              : nameEn}
                                                      </td>
                                                      <td>
                                                          {
                                                              item.patientData
                                                                  .address
                                                          }
                                                      </td>
                                                      <td>{genderLabel}</td>
                                                      <td>{item.reason}</td>

                                                      <td>
                                                          <button
                                                              className="btn btn-primary"
                                                              onClick={() =>
                                                                  this.handleConfirm(
                                                                      item
                                                                  )
                                                              }
                                                          >
                                                              Xác nhận
                                                          </button>
                                                      </td>
                                                  </tr>
                                              );
                                          })
                                        : "Không có dữ liệu"}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ModalConfirmUser
                    isOpen={isOpenModal}
                    handleCloseModal={this.closeModal}
                    dataConfirm={dataConfirm}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
