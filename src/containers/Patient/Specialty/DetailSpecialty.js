import { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";

class DetailSpecialty extends Component {
    constructor(prop) {
        super(prop);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        return (
            <>
                <HomeHeader />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
