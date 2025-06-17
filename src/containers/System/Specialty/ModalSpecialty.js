import { Component } from "react";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "./ManageSpecialty.scss";
import { CommonUtils, CRUD_ACTIONS } from "../../../utils";
import {
    createNewSpecialty,
    editSpecialty,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const mdParser = new MarkdownIt();

class ModalClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageBase64: "",
            descriptionHTML: "",
            descriptionMarkdown: "",
            isLoading: false,
        };
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.isOpen !== this.props.isOpen) {
            if (this.props.isOpen === true) {
                if (this.props.editData) {
                    let {
                        name,
                        address,
                        image,
                        descriptionHTML,
                        descriptionMarkdown,
                    } = this.props.editData;
                    this.setState({
                        name: name,
                        address: address,
                        imageBase64: image,
                        descriptionHTML: descriptionHTML,
                        descriptionMarkdown: descriptionMarkdown,
                    });
                } else {
                    this.setState({
                        name: "",
                        address: "",
                        imageBase64: "",
                        descriptionHTML: "",
                        descriptionMarkdown: "",
                    });
                }
            }
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

    handleSaveSpecialty = async () => {
        try {
            this.setState({
                isLoading: true,
            });
            if (this.props.action === CRUD_ACTIONS.CREATE) {
                let res = await createNewSpecialty({
                    name: this.state.name,
                    imageBase64: this.state.imageBase64,
                    descriptionHTML: this.state.descriptionHTML,
                    descriptionMarkdown: this.state.descriptionMarkdown,
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        name: "",
                        imageBase64: "",
                        descriptionHTML: "",
                        descriptionMarkdown: "",
                    });
                    toast.success("Tạo chuyên khoa thành công");
                    this.props.toggle();
                    this.props.fetchAllSpecialty();
                } else {
                    toast.error("Tạo chuyên khoa thất bại");
                }
            }
            if (this.props.action === CRUD_ACTIONS.EDIT) {
                let res = await editSpecialty({
                    id: this.props.editData.id,
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
                    toast.success("Sửa chuyên khoa thành công");
                    this.props.toggle();
                    this.props.fetchAllSpecialty();
                } else {
                    toast.error("Sửa chuyên khoa thất bại");
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lưu chuyên khoa");
        } finally {
            this.setState({
                isLoading: false,
            });
        }
    };

    render() {
        let { name, descriptionMarkdown, isLoading } = this.state;
        let { toggle, isOpen } = this.props;
        return (
            <>
                <Modal
                    isOpen={isOpen}
                    toggle={toggle}
                    size="lg"
                    style={{ maxWidth: "1440px", width: "90%" }}
                    centered={true}
                >
                    <ModalHeader toggle={this.props.toggle}>
                        {this.props.action === CRUD_ACTIONS.CREATE
                            ? "Thêm chuyên khoa"
                            : "Chỉnh sửa chuyên khoa"}
                    </ModalHeader>
                    <ModalBody>
                        <div className="add-new-specialty row col-12 ">
                            <div className="col-6 form-group">
                                <label>Tên chuyên khoa</label>
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
                                <label>Ảnh chuyên khoa</label>
                                <input
                                    className="form-control-file"
                                    type="file"
                                    onChange={(e) =>
                                        this.handleOnChangeImage(e)
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-12 form-group">
                            <label>Mô tả chuyên khoa</label>
                            <MdEditor
                                style={{ height: "500px" }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={descriptionMarkdown}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => this.handleSaveSpecialty()}
                            disabled={isLoading}
                        >
                            Lưu
                        </button>
                        <button
                            className="btn btn-secondary mt-3"
                            onClick={() => toggle()}
                        >
                            Huỷ
                        </button>
                    </ModalFooter>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalClinic);
