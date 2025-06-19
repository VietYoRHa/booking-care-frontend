import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import "./ManageUser.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { toast } from "react-toastify";
import { zodValidate } from "../../../utils/validate/validate";
import { createModalUserSchema } from "../../../utils/validate/modalUserSchema";

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            gender: "",
            position: "",
            role: "",
            avatar: "",
            previewImgUrl: "",
            isOpen: false,
            showPositionSelect: false,
        };
    }

    componentDidMount() {
        this.setState({
            gender:
                this.props.genders && this.props.genders.length > 0
                    ? this.props.genders[0].keyMap
                    : "",
            role:
                this.props.roles && this.props.roles.length > 0
                    ? this.props.roles[0].keyMap
                    : "",
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userEdit !== this.props.userEdit && this.props.userEdit) {
            let user = this.props.userEdit;
            let isShowPositionSelect = true;
            if (user.roleId === "R1" || user.roleId === "R3") {
                isShowPositionSelect = false;
            }

            this.setState({
                id: user.id,
                email: user.email,
                password: "HARDCODE",
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                position: user.positionId,
                role: user.roleId,
                previewImgUrl: user.image,
                showPositionSelect: isShowPositionSelect,
            });
        }

        if (prevProps.isOpen !== this.props.isOpen && !this.props.isOpen) {
            this.resetForm();
        }
    }

    resetForm = () => {
        this.setState({
            id: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            gender:
                this.props.genders && this.props.genders.length > 0
                    ? this.props.genders[0].keyMap
                    : "",
            position:
                this.props.positions && this.props.positions.length > 0
                    ? this.props.positions[0].keyMap
                    : "",
            role:
                this.props.roles && this.props.roles.length > 0
                    ? this.props.roles[0].keyMap
                    : "",
            avatar: "",
            previewImgUrl: "",
            isOpen: false,
        });
    };

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64,
            });
        }
    };

    handleOpenPreviewImg = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true,
        });
    };

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;

        if (id === "role") {
            if (event.target.value === "R1" || event.target.value === "R3") {
                copyState.position = "";
                copyState.showPositionSelect = false;
            } else {
                let user = this.props.userEdit;
                if (user && user.positionId) {
                    copyState.position = user.positionId;
                }
                copyState.showPositionSelect = true;
            }
        }
        this.setState({
            ...copyState,
        });
    };

    handleSaveUser = () => {
        const formObject = {
            email: this.state.email,
            password: this.state.password,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            phone_number: this.state.phoneNumber,
            address: this.state.address,
        };

        const modalUserSchema = createModalUserSchema();
        let validate = zodValidate(modalUserSchema, formObject);

        if (!validate.isValid) {
            toast.error(validate.errors[0].message);
            return;
        }
        const { action } = this.props;

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editUser({
                id: this.state.id,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        }

        this.props.toggle();
    };

    render() {
        let {
            previewImgUrl,
            isOpen,
            email,
            password,
            firstName,
            lastName,
            address,
            phoneNumber,
            gender,
            position,
            role,
        } = this.state;
        let {
            language,
            genders,
            positions,
            roles,
            isLoadingGender,
            isLoadingPosition,
            isLoadingRole,
            action,
        } = this.props;

        return (
            <>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={this.props.toggle}
                    size="lg"
                    style={{ maxWidth: "1000px", width: "100%" }}
                    centered={true}
                    className="modal-user-container"
                >
                    <ModalHeader toggle={this.props.toggle}>
                        {action === CRUD_ACTIONS.EDIT ? (
                            <FormattedMessage id="manage-user.edit" />
                        ) : (
                            <FormattedMessage id="manage-user.add" />
                        )}
                    </ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    {isLoadingGender === true
                                        ? "Loading genders..."
                                        : ""}
                                </div>
                                <div className="col-12">
                                    {isLoadingPosition === true
                                        ? "Loading positions..."
                                        : ""}
                                </div>
                                <div className="col-12">
                                    {isLoadingRole === true
                                        ? "Loading roles..."
                                        : ""}
                                </div>
                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.email" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={email}
                                        disabled={action === CRUD_ACTIONS.EDIT}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "email"
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.password" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        value={password}
                                        disabled={action === CRUD_ACTIONS.EDIT}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "password"
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.first-name" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={firstName}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "firstName"
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.last-name" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={lastName}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "lastName"
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.phone-number" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "phoneNumber"
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-9 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.address" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={address}
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "address"
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.gender" />
                                    </label>
                                    <select
                                        className="form-control"
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "gender"
                                            )
                                        }
                                        value={gender}
                                    >
                                        {genders &&
                                            genders.length > 0 &&
                                            genders.map((item, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={item.keyMap}
                                                    >
                                                        {language ===
                                                        LANGUAGES.VI
                                                            ? item.valueVi
                                                            : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>

                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.role" />
                                    </label>
                                    <select
                                        className="form-control"
                                        onChange={(event) =>
                                            this.handleOnChangeInput(
                                                event,
                                                "role"
                                            )
                                        }
                                        value={role}
                                    >
                                        {roles &&
                                            roles.length > 0 &&
                                            roles.map((item, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={item.keyMap}
                                                    >
                                                        {language ===
                                                        LANGUAGES.VI
                                                            ? item.valueVi
                                                            : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                                {this.state.showPositionSelect && (
                                    <div className="col-3 mb-3">
                                        <label>
                                            <FormattedMessage id="manage-user.position" />
                                        </label>
                                        <select
                                            className="form-control"
                                            onChange={(event) =>
                                                this.handleOnChangeInput(
                                                    event,
                                                    "position"
                                                )
                                            }
                                            value={position}
                                        >
                                            {positions &&
                                                positions.length > 0 &&
                                                positions.map((item, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={item.keyMap}
                                                        >
                                                            {language ===
                                                            LANGUAGES.VI
                                                                ? item.valueVi
                                                                : item.valueEn}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                )}
                                <div className="col-3 mb-3">
                                    <label>
                                        <FormattedMessage id="manage-user.image" />
                                    </label>
                                    <div className="preview-img-container">
                                        <input
                                            id="previewImg"
                                            type="file"
                                            hidden
                                            onChange={(event) =>
                                                this.handleOnChangeImage(event)
                                            }
                                        />
                                        <label
                                            className="label-upload"
                                            htmlFor="previewImg"
                                        >
                                            Upload{" "}
                                            <i className="fas fa-upload"></i>
                                        </label>
                                        <div
                                            className="preview-image"
                                            style={{
                                                backgroundImage: `url(${previewImgUrl})`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color={"primary"}
                            onClick={() => this.handleSaveUser()}
                        >
                            <FormattedMessage id="manage-user.save" />
                        </Button>
                        <Button color="secondary" onClick={this.props.toggle}>
                            <FormattedMessage id="manage-user.cancel" />
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        positions: state.admin.positions,
        roles: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
        isLoadingPosition: state.admin.isLoadingPosition,
        isLoadingRole: state.admin.isLoadingRole,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        editUser: (data) => dispatch(actions.editUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
