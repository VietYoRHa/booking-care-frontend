import { Component } from "react";
import { connect } from "react-redux";
import "./ManageClinic.scss";
import { CRUD_ACTIONS } from "../../../utils";
import { deleteClinic, getAllClinic } from "../../../services/userService";
import { toast } from "react-toastify";
import ModalClinic from "./ModalClinic";
import { FormattedMessage } from "react-intl";

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModal: false,
            clinicData: {},
            action: CRUD_ACTIONS.CREATE,
            editData: null,
        };
    }

    async componentDidMount() {
        this.fetchAllClinic();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    fetchAllClinic = async () => {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                clinicData: res.data || {},
            });
        }
    };

    handleCreateButtonClick = () => {
        this.setState({
            isOpenModal: true,
            action: CRUD_ACTIONS.CREATE,
            editData: null,
        });
    };

    toggleModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
            action: CRUD_ACTIONS.CREATE,
            editData: null,
        });
    };

    handleEditClinic = (clinic) => {
        this.setState({
            isOpenModal: true,
            action: CRUD_ACTIONS.EDIT,
            editData: clinic,
        });
    };

    handleDeleteClinic = async (clinic) => {
        if (clinic && clinic.id) {
            let res = await deleteClinic(clinic.id);
            if (res && res.errCode === 0) {
                toast.success(
                    <FormattedMessage id="toast.success.delete-clinic" />
                );
                this.fetchAllClinic();
            } else {
                toast.error(
                    <FormattedMessage id="toast.error.delete-clinic" />
                );
            }
        }
    };

    render() {
        const { isOpenModal, clinicData, action, editData } = this.state;
        return (
            <>
                <div className="manage-specialty-container">
                    <div className="title ms-title">Quản lý phòng khám</div>
                    <div className="col-12">
                        <button
                            className="btn btn-primary mt-3 mb-3"
                            onClick={() => this.handleCreateButtonClick()}
                        >
                            Thêm phòng khám
                        </button>
                    </div>
                    <div className="col-12">
                        <table id="TableManage">
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên phòng khám</th>
                                    <th>Địa chỉ</th>
                                    <th>Hành động</th>
                                </tr>
                                {clinicData && clinicData.length > 0
                                    ? clinicData.map((item, index) => {
                                          return (
                                              <tr key={index}>
                                                  <td>{index + 1}</td>
                                                  <td>{item.name}</td>
                                                  <td>{item.address}</td>

                                                  <td>
                                                      <button
                                                          className="btn-edit"
                                                          onClick={() => {
                                                              this.handleEditClinic(
                                                                  item
                                                              );
                                                          }}
                                                      >
                                                          <i className="fas fa-pencil-alt"></i>
                                                      </button>
                                                      <button
                                                          className="btn-delete"
                                                          onClick={() => {
                                                              this.handleDeleteClinic(
                                                                  item
                                                              );
                                                          }}
                                                      >
                                                          <i className="fas fa-trash"></i>
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
                <ModalClinic
                    isOpen={isOpenModal}
                    toggle={() => this.toggleModal()}
                    action={action}
                    editData={editData}
                    fetchAllClinic={this.fetchAllClinic}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
