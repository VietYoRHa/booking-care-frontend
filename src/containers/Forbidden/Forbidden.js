import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./Forbidden.scss";

class Forbidden extends Component {
    render() {
        return (
            <div className="forbidden-container">
                <div className="forbidden-content">
                    <h1>403</h1>
                    <h2>
                        <FormattedMessage id="common.access-denied" />
                    </h2>
                    <p>
                        <FormattedMessage id="common.no-permission" />
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => this.props.history.push("/home")}
                    >
                        <FormattedMessage id="common.back-to-home" />
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Forbidden);
