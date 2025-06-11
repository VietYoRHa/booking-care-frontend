import { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "./ModalConfirmUser.scss";

class ModalConfirmUser extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        let { isOpen, dataConfirm, handleCloseModal } = this.props;
        return (
            <Modal
                isOpen={isOpen}
                className={"confirm-modal-container"}
                centered={true}
            >
                <ModalHeader toggle={handleCloseModal}>
                    Xác nhận lịch hẹn
                </ModalHeader>
                <ModalBody>
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
                            <input type="file" className="form-control-file" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleCloseModal}>
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
