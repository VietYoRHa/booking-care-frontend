import React, { Component } from "react";
import Flatpickr from "react-flatpickr";
import moment from "moment";

import { KeyCodeUtils } from "../../utils";
import "./DatePicker.scss";

class DatePicker extends Component {
    flatpickrNode = null;

    nodeRef = (element) => {
        this.flatpickr = element && element.flatpickr;
        this.flatpickrNode = element && element.node;
        if (this.flatpickrNode) {
            this.flatpickrNode.addEventListener("blur", this.handleBlur);
            this.flatpickrNode.addEventListener("keydown", this.handlerKeyDown);
        }
    };

    handlerKeyDown = (event) => {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCodeUtils.ENTER) {
            event.preventDefault();
            const { onChange } = this.props;
            const value = event.target.value;

            const valueMoment = moment(value, "DD/MM/YYYY");
            onChange([valueMoment.toDate(), valueMoment.toDate()]);
        }
    };

    componentWillUnmount() {
        if (this.flatpickrNode) {
            this.flatpickrNode.removeEventListener("blur", this.handleBlur);
            this.flatpickrNode.removeEventListener(
                "keydown",
                this.handlerKeyDown
            );
        }
    }

    handleBlur = (event) => {
        const { onChange } = this.props;
        const value = event.target.value;

        event.preventDefault();
        const valueMoment = moment(value, "DD/MM/YYYY");
        onChange([valueMoment.toDate(), valueMoment.toDate()]);
    };

    onOpen = () => {
        if (this.flatpickrNode) {
            this.flatpickrNode.blur();
        }
    };

    close() {
        this.flatpickr.close();
    }

    checkDateValue = (str, max) => {
        if (str.charAt(0) !== "0" || str === "00") {
            var num = parseInt(str);
            if (isNaN(num) || num <= 0 || num > max) num = 1;
            str =
                num > parseInt(max.toString().charAt(0)) &&
                num.toString().length === 1
                    ? "0" + num
                    : num.toString();
        }
        return str;
    };

    autoFormatOnChange = (value, seperator) => {
        var input = value;

        let regexForDeleting = new RegExp(`\\D\\${seperator}$`);

        if (regexForDeleting.test(input))
            input = input.substr(0, input.length - 3);

        var values = input.split(seperator).map(function (v) {
            return v.replace(/\D/g, "");
        });

        if (values[0]) values[0] = this.checkDateValue(values[0], 31);
        if (values[1]) values[1] = this.checkDateValue(values[1], 12);
        var output = values.map(function (v, i) {
            return v.length === 2 && i < 2 ? v + " " + seperator + " " : v;
        });
        return output.join("").substr(0, 14);
    };

    onInputChange = (e) => {
        if (this.DISPLAY_FORMAT === this.DATE_FORMAT_AUTO_FILL) {
            let converted = this.autoFormatOnChange(
                e.target.value,
                this.SEPERATOR
            );
            e.target.value = converted;
        }
    };

    onInputBlur = (e) => {};

    SEPERATOR = "/";
    DATE_FORMAT_AUTO_FILL = "d/m/Y";
    DISPLAY_FORMAT = "d/m/Y";

    render() {
        const { value, onChange, minDate, onClose, maxDate, ...otherProps } =
            this.props;
        const options = {
            dateFormat: this.DISPLAY_FORMAT,
            allowInput: true,
            disableMobile: true,
            onClose: onClose,
            onOpen: this.onOpen,
        };
        if (minDate) {
            options.minDate = minDate;
        }
        if (maxDate) {
            options.maxDate = maxDate;
        }
        return (
            <Flatpickr
                ref={this.nodeRef}
                value={value}
                onChange={onChange}
                options={options}
                {...otherProps}
            />
        );
    }
}

export default DatePicker;
