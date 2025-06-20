import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
    userIsNotAuthenticated,
    adminAuthenticated,
    doctorAuthenticated,
} from "../hoc/authentication";
import { path } from "../utils";
import Home from "../routes/Home";
import Login from "./Auth/Login";
import System from "../routes/System";
import HomePage from "./HomePage/HomePage.js";
import CustomScrollbars from "../components/CustomScrollbars.js";
import DetailDoctor from "./Patient/Doctor/DetailDoctor.js";
import Doctor from "../routes/Doctor.js";
import VerifyEmail from "./Patient/VerifyBooking.js";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty.js";
import DetailClinic from "./Patient/Clinic/DetailClinic.js";
import Forbidden from "./Forbidden/Forbidden.js";
import AllSpecialties from "./Patient/Specialty/AllSpecialties.js";
import AllClinics from "./Patient/Clinic/AllClinics.js";
import AllDoctors from "./Patient/Doctor/AllDoctors.js";
import SearchResultPage from "./Search/SearchResultPage.js";

class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars
                                style={{ height: "100vh", width: "100%" }}
                            >
                                <Switch>
                                    <Route
                                        path={path.HOME}
                                        exact
                                        component={Home}
                                    />
                                    <Route
                                        path={path.LOGIN}
                                        component={userIsNotAuthenticated(
                                            Login
                                        )}
                                    />
                                    <Route
                                        path={path.SYSTEM}
                                        component={adminAuthenticated(System)}
                                    />
                                    <Route
                                        path={path.DOCTOR}
                                        component={doctorAuthenticated(Doctor)}
                                    />
                                    <Route
                                        path={path.HOMEPAGE}
                                        component={HomePage}
                                    />
                                    <Route
                                        path={path.DETAIL_DOCTOR}
                                        component={DetailDoctor}
                                    />
                                    <Route
                                        path={path.DETAIL_SPECIALTY}
                                        component={DetailSpecialty}
                                    />
                                    <Route
                                        path={path.DETAIL_CLINIC}
                                        component={DetailClinic}
                                    />
                                    <Route
                                        path={path.VERIFY}
                                        component={VerifyEmail}
                                    />

                                    <Route
                                        path={path.FORBIDDEN}
                                        component={Forbidden}
                                    />
                                    <Route
                                        path={path.ALL_SPECIALTIES}
                                        component={AllSpecialties}
                                    />
                                    <Route
                                        path={path.ALL_CLINICS}
                                        component={AllClinics}
                                    />
                                    <Route
                                        path={path.ALL_DOCTORS}
                                        component={AllDoctors}
                                    />
                                    <Route
                                        path={path.SEARCH}
                                        component={SearchResultPage}
                                    />
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
