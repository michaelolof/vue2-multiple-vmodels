"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSelectElement = exports.setExpression = void 0;
function setExpression(vm, location, value) {
    const locations = location.split(".");
    if (locations.length > 1) {
        const field = locations.slice(locations.length - 1, locations.length)[0];
        const paths = locations.slice(0, locations.length - 1);
        let currentObj = vm;
        for (const path of paths) {
            currentObj = currentObj[path];
        }
        vm.$set(currentObj, field, value);
    }
    else {
        vm.$set(vm, locations[0], value);
    }
}
exports.setExpression = setExpression;
function isSelectElement(node) {
    var _a;
    return (((_a = node) === null || _a === void 0 ? void 0 : _a.tagName) || "").toLowerCase() === "select";
}
exports.isSelectElement = isSelectElement;
