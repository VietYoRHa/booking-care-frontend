import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import authService from "../services/authService";

const locationHelper = locationHelperBuilder({});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: (state) => !state.user.isLoggedIn,
    wrapperDisplayName: "UserIsNotAuthenticated",
    redirectPath: (state, ownProps) =>
        locationHelper.getRedirectQueryParam(ownProps) || "/",
    allowRedirectBack: false,
});

// HOC kiểm tra Admin quyền
export const adminAuthenticated = (ComposedComponent) => {
    class AdminAuthentication extends Component {
        render() {
            const { isLoggedIn } = this.props;

            if (!isLoggedIn) {
                return <Redirect to="/login" />;
            }

            if (!authService.isAdmin()) {
                return <Redirect to="/forbidden" />; // Redirect đến trang lỗi khi không có quyền
            }

            return <ComposedComponent {...this.props} />;
        }
    }

    const mapStateToProps = (state) => ({
        isLoggedIn: state.user.isLoggedIn,
    });

    return connect(mapStateToProps)(AdminAuthentication);
};

// HOC kiểm tra Doctor quyền
export const doctorAuthenticated = (ComposedComponent) => {
    class DoctorAuthentication extends Component {
        render() {
            const { isLoggedIn } = this.props;

            if (!isLoggedIn) {
                return <Redirect to="/login" />;
            }

            if (!authService.isDoctor() && !authService.isAdmin()) {
                return <Redirect to="/forbidden" />; // Admin cũng có thể truy cập route của Doctor
            }

            return <ComposedComponent {...this.props} />;
        }
    }

    const mapStateToProps = (state) => ({
        isLoggedIn: state.user.isLoggedIn,
    });

    return connect(mapStateToProps)(DoctorAuthentication);
};
