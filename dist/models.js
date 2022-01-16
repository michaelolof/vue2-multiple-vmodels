"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function getParams(binding, vnode) {
    var _a, _b;
    const isComponent = !!(vnode === null || vnode === void 0 ? void 0 : vnode.componentInstance);
    const field = binding.arg || "";
    const context = vnode.context;
    const expression = binding.expression || "";
    // @ts-ignore
    const models = (_b = (_a = vnode === null || vnode === void 0 ? void 0 : vnode.componentInstance) === null || _a === void 0 ? void 0 : _a.$options) === null || _b === void 0 ? void 0 : _b.models;
    const model = (models || []).find((m) => (m === null || m === void 0 ? void 0 : m.event) === "models:" + field);
    const event = model === null || model === void 0 ? void 0 : model.event;
    const validity = { isValid: true, err: "", type: "" };
    if (!isComponent) {
        validity.isValid = false;
        validity.type = "warning";
        validity.err = "'v-models' directive only works on custom components. Normal HTML elements are not supported. use 'v-model' in such cases";
    }
    else if (!field) {
        validity.isValid = false;
        validity.type = "warning";
        validity.err = "v-models directive missing binding argument bound to " + expression + "\nDirective must be in form of 'v-models:xxxx' which maps to the event emitted by the component";
    }
    else if (!Array.isArray(models) || (Array.isArray(models) && models.length === 0)) {
        validity.isValid = false;
        validity.type = "warning";
        validity.err = "Invalid models registration. Your custom component must include a 'models' option of type Array";
    }
    else if (!model || !event) {
        validity.isValid = false;
        validity.type = "warning";
        validity.err = "Model event not found. Couldn't find event of type models:" + field + " in your component models array";
    }
    return {
        models,
        model,
        event,
        field,
        context,
        expression,
        isComponent,
        validity,
    };
}
function useVModels() {
    let listener;
    let unwatcher = undefined;
    function bind(el, binding, vnode) {
        const { expression, model, event, validity, context } = getParams(binding, vnode);
        if (!validity.isValid) {
            console.warn(validity.err);
            return;
        }
        if (!context || !vnode.componentInstance) {
            return;
        }
        listener = value => (0, utils_1.setExpression)(context, expression, value);
        vnode.componentInstance.$on(event, listener);
        //@ts-ignore
        unwatcher = context.$watch(expression, {
            handler(newValue) {
                if (!vnode.componentInstance)
                    return;
                const vm = vnode.componentInstance;
                const dataExpression = model === null || model === void 0 ? void 0 : model.data;
                (0, utils_1.setExpression)(vm, dataExpression, newValue);
            },
            immediate: true,
        });
    }
    function unbind(el, binding, vnode) {
        const { event } = getParams(binding, vnode);
        if (vnode.componentInstance) {
            vnode.componentInstance.$off(event, listener);
        }
        if (unwatcher)
            unwatcher();
    }
    return {
        bind,
        unbind,
    };
}
exports.default = useVModels;
