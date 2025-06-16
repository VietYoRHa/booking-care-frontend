import { Component } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import { CRUD_ACTIONS } from "../../../utils";
import {
    deleteSpecialty,
    getAllSpecialty,
} from "../../../services/userService";
import { toast } from "react-toastify";
import ModalSpecialty from "./ModalSpecialty";

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModal: false,
            specialtyData: {},
            action: CRUD_ACTIONS.CREATE,
            editData: null,
        };
    }

    async componentDidMount() {
        this.fetchAllSpecialty();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    fetchAllSpecialty = async () => {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                specialtyData: res.data || {},
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

    handleEditSpecialty = (specialty) => {
        this.setState({
            isOpenModal: true,
            action: CRUD_ACTIONS.EDIT,
            editData: specialty,
        });
    };

    handleDeleteSpecialty = async (specialty) => {
        if (specialty && specialty.id) {
            let res = await deleteSpecialty(specialty.id);
            if (res && res.errCode === 0) {
                toast.success("Xoá chuyên khoa thành công");
                this.fetchAllSpecialty();
            } else {
                toast.error("Xoá chuyên khoa thất bại");
            }
        }
    };

    render() {
        let { isOpenModal, specialtyData, action, editData } = this.state;
        return (
            <>
                <div className="manage-specialty-container">
                    <div className="title ms-title">Quản lý chuyên khoa</div>
                    <div className="col-12">
                        <button
                            className="btn btn-primary mt-3 mb-3"
                            onClick={() => this.handleCreateButtonClick()}
                        >
                            Thêm chuyên khoa
                        </button>
                    </div>
                    <div className="col-12">
                        <table id="TableManage">
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên chuyên khoa</th>
                                    <th>Hành động</th>
                                </tr>
                                {specialtyData && specialtyData.length > 0
                                    ? specialtyData.map((item, index) => {
                                          return (
                                              <tr key={index}>
                                                  <td>{index + 1}</td>
                                                  <td>{item.name}</td>
                                                  <td>
                                                      <button
                                                          className="btn-edit"
                                                          onClick={() => {
                                                              this.handleEditSpecialty(
                                                                  item
                                                              );
                                                          }}
                                                      >
                                                          <i className="fas fa-pencil-alt"></i>
                                                      </button>
                                                      <button
                                                          className="btn-delete"
                                                          onClick={() => {
                                                              this.handleDeleteSpecialty(
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
                <ModalSpecialty
                    isOpen={isOpenModal}
                    toggle={() => this.toggleModal()}
                    action={action}
                    editData={editData}
                    fetchAllSpecialty={this.fetchAllSpecialty}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
