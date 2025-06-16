import { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./ModalConfirmUser.scss";
import { APPOINTMENT_STATUS } from "../../../utils";
import { postCancelAppointment } from "../../../services/userService";
import { toast } from "react-toastify";

class ModalConfirmUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelReason: "",
            attachment: null,
            isLoading: false,
        };
    }

    async componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    handleChangeTextArea = (event) => {
        this.setState({
            cancelReason: event.target.value,
        });
    };

    handleConfirmAppointment = async () => {
        let { dataConfirm, handleCloseModal, refetchListPatient } = this.props;
        if (dataConfirm && dataConfirm.statusId === APPOINTMENT_STATUS.CANCEL) {
            try {
                let res = await postCancelAppointment({
                    id: dataConfirm.id,
                    doctorId: dataConfirm.doctorId,
                    email: dataConfirm.email,
                    fullName: dataConfirm.fullName,
                    date: dataConfirm.date,
                    language: dataConfirm.language,
                    patientId: dataConfirm.patientId,
                    statusId: dataConfirm.statusId,
                    timeString: dataConfirm.timeString,
                    timeType: dataConfirm.timeType,
                    doctorName: dataConfirm.doctorName,
                    cancelReason: this.state.cancelReason,
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        cancelReason: "",
                    });
                    toast.success("Từ chối lịch hẹn thành công");
                    handleCloseModal();
                    refetchListPatient();
                } else {
                    toast.error("Từ chối lịch hẹn thất bại");
                }
            } catch (error) {
                toast.error("Từ chối lịch hẹn thất bại");
            }
        }
        if (dataConfirm && dataConfirm.statusId === APPOINTMENT_STATUS.DONE) {
        }
    };

    render() {
        let { isOpen, dataConfirm, handleCloseModal } = this.props;
        console.log("dataConfirm in ModalConfirmUser: ", dataConfirm);

        return (
            <Modal
                isOpen={isOpen}
                className={"confirm-modal-container"}
                centered={true}
            >
                <ModalHeader toggle={handleCloseModal}>
                    {dataConfirm &&
                        dataConfirm.statusId === APPOINTMENT_STATUS.DONE &&
                        "Xác nhận bệnh nhân đã khám"}
                    {dataConfirm &&
                        dataConfirm.statusId === APPOINTMENT_STATUS.CANCEL &&
                        "Từ chối lịch hẹn"}
                </ModalHeader>
                <ModalBody>
                    {dataConfirm &&
                        dataConfirm.statusId === APPOINTMENT_STATUS.DONE && (
                            <div className="row">
                                <div className="col-6 form-group">
                                    <label>Email bệnh nhân</label>
                                    <input
                                        className="form-control"
                                        value={dataConfirm.email}
                                        disabled
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Nội dung đính kèm</label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                    />
                                </div>
                            </div>
                        )}
                    {dataConfirm &&
                        dataConfirm.statusId === APPOINTMENT_STATUS.CANCEL && (
                            <div className="row">
                                <div className="col-12 form-group">
                                    <label>Email bệnh nhân</label>
                                    <input
                                        className="form-control"
                                        value={dataConfirm.email}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 form-group">
                                    <label>Lí do từ chối</label>
                                    <textarea
                                        className="form-control"
                                        value={this.state.cancelReason}
                                        onChange={(event) =>
                                            this.handleChangeTextArea(event)
                                        }
                                    />
                                </div>
                            </div>
                        )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => this.handleConfirmAppointment()}
                    >
                        Confirm
                    </Button>
                    <Button color="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalConfirmUser);
