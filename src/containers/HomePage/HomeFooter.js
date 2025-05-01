import React, { Component } from "react";
import { connect } from "react-redux";

class HomeFooter extends Component {
    render() {
        return (
            <div className="home-footer">
                <p>
                    &copy; 2025 Doan Thai Viet. All rights reserved. <br />
                    <span>Contact me: </span>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/VietYoRHa"
                    >
                        &#8594; More info &#8592;
                    </a>
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
