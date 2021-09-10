"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var styled_components_1 = require("styled-components");
var Style = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #454545;\n  width: 40px;\n  position: fixed;\n  z-index: 9999;\n  right: ", ";\n  top: ", ";\n  display: ", ";\n  border-radius: 20px;\n  height: auto;\n\n  .wrap__icon {\n    cursor: pointer;\n  }\n"], ["\n  background-color: #454545;\n  width: 40px;\n  position: fixed;\n  z-index: 9999;\n  right: ", ";\n  top: ", ";\n  display: ", ";\n  border-radius: 20px;\n  height: auto;\n\n  .wrap__icon {\n    cursor: pointer;\n  }\n"])), function (props) { return props.theme.right + "px"; }, function (props) { return props.theme.top + 50 + "px"; }, function (props) { return props.theme.display; });
exports["default"] = Style;
var templateObject_1;
