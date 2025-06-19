import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";
import authService from "../../services/authService";
import { loginSchema } from "../../utils/validate/loginSchema";
import { toast } from "react-toastify";
import { zodValidate } from "../../utils/validate/validate";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isShowPassword: false,
            errMessage: "",
        };
    }

    handleOnChangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value,
        });
    };

    handleLogin = async () => {
        const formObject = {
            email: this.state.email,
            password: this.state.password,
        };
        let validate = zodValidate(loginSchema, formObject);
        if (!validate.isValid) {
            toast.error(validate.errors[0].message);
            return;
        }
        this.setState({
            errMessage: "",
        });
        try {
            let data = await handleLoginApi(
                this.state.email,
                this.state.password
            );
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
                if (data.user.accessToken) {
                    authService.setToken(data.user.accessToken);
                }
                this.props.userLoginSuccess(data.user);
                toast.success(<FormattedMessage id="toast.success.login" />);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message,
                    });
                }
            }
        }
    };

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            this.handleLogin();
        }
    };

    render() {
        // JSX
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="col-12 text-login">
                            Đăng nhập hệ thống
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Email</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={(event) =>
                                    this.handleOnChangeInput(event, "email")
                                }
                                onKeyDown={(event) => this.handleKeyDown(event)}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Mật khẩu:</label>
                            <div className="custom-input-password">
                                <input
                                    type={
                                        this.state.isShowPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "password"
                                        )
                                    }
                                    onKeyDown={(event) =>
                                        this.handleKeyDown(event)
                                    }
                                />
                                <span
                                    onClick={() => {
                                        this.handleShowHidePassword();
                                    }}
                                >
                                    <i
                                        className={
                                            this.state.isShowPassword
                                                ? "far fa-eye"
                                                : "far fa-eye-slash"
                                        }
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12" style={{ color: "red" }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn-login"
                                onClick={() => {
                                    this.handleLogin();
                                }}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </div>
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
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
