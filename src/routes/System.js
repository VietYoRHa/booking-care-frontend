import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import ManageUser from "../containers/System/Admin/ManageUser";
import Header from "../containers/Header/Header";
import ManageDoctor from "../containers/System/Admin/ManageDoctor";
import ManageSpecialty from "../containers/System/Specialty/ManageSpecialty";
import ManageClinic from "../containers/System/Clinic/ManageClinic";
import AdminManageSchedule from "../containers/System/Admin/AdminManageSchedule";

class System extends Component {
    render() {
        const { defaultSystemMenuPath, isLoggedIn } = this.props;
        return (
            <>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route
                                path="/system/manage-user"
                                component={ManageUser}
                            />
                            <Route
                                path="/system/manage-doctor"
                                component={ManageDoctor}
                            />
                            <Route
                                path="/system/manage-schedule"
                                component={AdminManageSchedule}
                            />
                            <Route
                                path="/system/manage-specialty"
                                component={ManageSpecialty}
                            />
                            <Route
                                path="/system/manage-clinic"
                                component={ManageClinic}
                            />

                            <Route
                                component={() => {
                                    return (
                                        <Redirect to={defaultSystemMenuPath} />
                                    );
                                }}
                            />
                        </Switch>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        defaultSystemMenuPath: state.app.defaultSystemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
