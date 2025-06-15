import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import authService from "../services/authService";

class Home extends Component {
    render() {
        const { defaultSystemMenuPath, defaultDoctorMenuPath, isLoggedIn } =
            this.props;

        let linkToRedirect = "/home";
        if (isLoggedIn) {
            if (authService.isAdmin()) {
                linkToRedirect = defaultSystemMenuPath || "/system/manage-user";
            }
            if (authService.isDoctor()) {
                linkToRedirect =
                    defaultDoctorMenuPath || "/doctor/manage-schedule";
            }
        }

        return <Redirect to={linkToRedirect} />;
    }
}

const mapStateToProps = (state) => {
    return {
        defaultSystemMenuPath: state.app.defaultSystemMenuPath,
        defaultDoctorMenuPath: state.app.defaultDoctorMenuPath,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
