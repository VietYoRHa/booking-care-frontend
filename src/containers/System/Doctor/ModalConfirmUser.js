import { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./ModalConfirmUser.scss";
import { APPOINTMENT_STATUS } from "../../../utils";
import {
    postCancelAppointment,
    postCompleteAppointment,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

class ModalConfirmUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelReason: "",
            file: null,
            isLoading: false,
            fileName: "",
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

    handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            this.setState({
                file: e.target.files[0],
                fileName: e.target.files[0].name,
            });
        }
    };

    handleConfirmAppointment = async () => {
        let { dataConfirm, toggle, refetchListPatient } = this.props;
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
                    toast.success(
                        <FormattedMessage id="toast.success.deny-appointment" />
                    );
                    toggle();
                    refetchListPatient();
                } else {
                    toast.error(
                        <FormattedMessage id="toast.error.deny-appointment" />
                    );
                }
            } catch (error) {
                toast.error(<FormattedMessage id="toast.error.common" />);
            }
        }
        if (dataConfirm && dataConfirm.statusId === APPOINTMENT_STATUS.DONE) {
            const formData = new FormData();
            formData.append("id", dataConfirm.id);
            formData.append("doctorId", dataConfirm.doctorId);
            formData.append("email", dataConfirm.email);
            formData.append("fullName", dataConfirm.fullName);
            formData.append("date", dataConfirm.date);
            formData.append("language", dataConfirm.language);
            formData.append("patientId", dataConfirm.patientId);
            formData.append("statusId", dataConfirm.statusId);
            formData.append("timeString", dataConfirm.timeString);
            formData.append("timeType", dataConfirm.timeType);
            formData.append("doctorName", dataConfirm.doctorName);
            formData.append("file", this.state.file);
            try {
                let res = await postCompleteAppointment(formData);
                if (res && res.errCode === 0) {
                    this.setState({
                        file: null,
                        fileName: "",
                    });
                    toast.success(
                        <FormattedMessage id="toast.success.accept-appointment" />
                    );
                    toggle();
                    refetchListPatient();
                } else {
                    toast.error(
                        <FormattedMessage id="toast.error.accept-appointment" />
                    );
                }
            } catch (error) {
                toast.error(<FormattedMessage id="toast.error.common" />);
            }
        }
    };

    handleCloseModal = () => {
        this.setState({
            cancelReason: "",
            file: null,
            fileName: "",
        });
        this.props.toggle();
    };

    render() {
        let { isOpen, dataConfirm, toggle } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                className={"confirm-modal-container"}
                centered={true}
            >
                <ModalHeader toggle={toggle}>
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
                                        onChange={this.handleFileChange}
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
                    <Button
                        color="secondary"
                        onClick={() => this.handleCloseModal()}
                    >
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
