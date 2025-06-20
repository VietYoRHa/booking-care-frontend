import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";

// const mdParser = new MarkdownIt();

// function handleEditorChange({ html, text }) {
//     console.log("handleEditorChange", html, text);
// }

class TableManageUser extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            arrUsers: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllUsers();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                arrUsers: this.props.listUsers,
            });
        }
    }

    handleDeleteUser = (user) => {
        if (this.props.currentUser.id === user.id) {
            toast.error(
                <FormattedMessage
                    id="manage-user.delete-self-error"
                    defaultMessage="Không thể xoá chính mình"
                />
            );
            return;
        }
        this.props.deleteUser(user.id);
    };

    handleEditUser = (user) => {
        this.props.handleEditUser(user);
    };

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <>
                <table id="TableManage">
                    <tbody>
                        <tr>
                            <th>
                                <FormattedMessage id="manage-user.email" />
                            </th>
                            <th>
                                <FormattedMessage id="manage-user.first-name" />
                            </th>
                            <th>
                                <FormattedMessage id="manage-user.last-name" />
                            </th>
                            <th>
                                <FormattedMessage id="manage-user.address" />
                            </th>
                            <th></th>
                        </tr>
                        {arrUsers &&
                            arrUsers.length > 0 &&
                            arrUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => {
                                                    this.props.handleEditUser(
                                                        item
                                                    );
                                                }}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => {
                                                    this.handleDeleteUser(item);
                                                }}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {/* <MdEditor
                    style={{ height: "500px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                /> */}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listUsers: state.admin.users,
        currentUser: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllUsers: () => dispatch(actions.fetchAllUsersStart()),
        deleteUser: (userId) => dispatch(actions.deleteUser(userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
