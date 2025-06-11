import { Component } from "react";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "./ManageClinic.scss";
import { CommonUtils } from "../../../utils";
import { createNewClinic } from "../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            imageBase64: "",
            descriptionHTML: "",
            descriptionMarkdown: "",
            isLoading: false,
        };
    }

    async componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({
            ...copyState,
        });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
    };

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSaveClinic = async () => {
        try {
            this.setState({
                isLoading: true,
            });
            let res = await createNewClinic({
                name: this.state.name,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            });
            if (res && res.errCode === 0) {
                this.setState({
                    name: "",
                    address: "",
                    imageBase64: "",
                    descriptionHTML: "",
                    descriptionMarkdown: "",
                });
                toast.success("Create specialty successfully");
            } else {
                toast.error("Create specialty failed");
            }
        } catch (error) {
            toast.error("Create specialty failed");
        } finally {
            this.setState({
                isLoading: false,
            });
        }
    };

    render() {
        let { name, address, descriptionMarkdown, isLoading } = this.state;
        return (
            <div className="manage-specialty-container">
                <div className="title ms-title">Quản lý phòng khám</div>
                <div className="add-new-specialty row col-12 ">
                    <div className="col-6 form-group">
                        <label>Tên phòng khám</label>
                        <input
                            className="form-control"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                this.handleOnChangeInput(e, "name")
                            }
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Địa chỉ phòng khám</label>
                        <input
                            className="form-control"
                            type="text"
                            value={address}
                            onChange={(e) =>
                                this.handleOnChangeInput(e, "address")
                            }
                        />
                    </div>
                    <div className="col-12 form-group">
                        <label>Ảnh phòng khám</label>
                        <input
                            className="form-control-file"
                            type="file"
                            onChange={(e) => this.handleOnChangeImage(e)}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <MdEditor
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={descriptionMarkdown}
                    />
                </div>
                <div className="col-12">
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => this.handleSaveClinic()}
                        disabled={isLoading}
                    >
                        Save
                    </button>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
