import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";
import * as actions from "../../../store/actions";
import "./ManageUser.scss";
import TableManageUser from "./TableManageUser";
import ModalUser from "./ModalUser";

class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModal: false,
            action: CRUD_ACTIONS.CREATE,
            userEdit: null,
        };
    }

    async componentDidMount() {
        this.props.fetchGenderStart();
        this.props.fetchPositionStart();
        this.props.fetchRoleStart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                isOpenModal: false,
                action: CRUD_ACTIONS.CREATE,
                userEdit: null,
            });
        }
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
            action: CRUD_ACTIONS.CREATE,
            userEdit: null,
        });
    };

    handleAddNewUser = () => {
        this.setState({
            isOpenModal: true,
            action: CRUD_ACTIONS.CREATE,
            userEdit: null,
        });
    };

    handleEditUser = (user) => {
        this.setState({
            isOpenModal: true,
            action: CRUD_ACTIONS.EDIT,
            userEdit: user,
        });
    };

    render() {
        return (
            <div className="manage-user-container">
                <div className="title">
                    <FormattedMessage id="manage-user.title" />
                </div>
                <div className="manage-user-body">
                    <div className="col-12 mb-3">
                        <button
                            className="btn btn-primary px-3"
                            onClick={this.handleAddNewUser}
                        >
                            <i className="fas fa-plus"></i>{" "}
                            <FormattedMessage id="manage-user.add" />
                        </button>
                    </div>
                    <div className="col-12 mb-5">
                        <TableManageUser
                            handleEditUser={this.handleEditUser}
                            action={this.state.action}
                        />
                    </div>
                </div>

                <ModalUser
                    isOpen={this.state.isOpenModal}
                    toggle={this.toggleUserModal}
                    action={this.state.action}
                    userEdit={this.state.userEdit}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
        fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
