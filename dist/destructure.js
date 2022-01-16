"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const generateListener = ({ context, field, expression }) => (obj) => {
    if (!obj) {
        return;
    }
    throwObjectTypeErr(obj);
    const currentValue = obj[field];
    (0, utils_1.setExpression)(context, expression, currentValue);
};
function getParams(binding, vnode) {
    var _a, _b, _c;
    const isComponent = !!(vnode === null || vnode === void 0 ? void 0 : vnode.componentInstance);
    const field = binding.arg || "";
    const context = vnode.context;
    const expression = binding.expression || "";
    let model;
    let event;
    if (isComponent) {
        model = (_b = (_a = vnode === null || vnode === void 0 ? void 0 : vnode.componentInstance) === null || _a === void 0 ? void 0 : _a.$options) === null || _b === void 0 ? void 0 : _b.model;
        event = (model === null || model === void 0 ? void 0 : model.event) || Object.keys(((_c = vnode === null || vnode === void 0 ? void 0 : vnode.componentOptions) === null || _c === void 0 ? void 0 : _c.listeners) || {})[0];
    }
    else {
        // Treat as a regular HTML element
        const tag = vnode.tag;
        if (tag === "input") {
            event = "input";
            model = {
                prop: "value",
                event,
            };
        }
        else {
            event = "change";
            model = {
                prop: "value",
                event,
            };
        }
    }
    return {
        model,
        event,
        field,
        context,
        expression,
        isComponent,
    };
}
function throwObjectTypeErr(obj) {
    if (typeof obj !== "object") {
        throw new TypeError("Expected object, got " + (typeof obj) + "\n'v-model-destruct' directive only works with objects. Make sure your component emmits an object");
    }
}
function throwInvalidPropErr(type, prop) {
    console.warn("Invalid Prop Type. Trying to mutate the destructured parts of type '" + type + "' is not allowed in Vue. \nEnsure your '" + prop + "' prop defaults to type Object to enable mutation of its fields.");
}
function useVModelDestructure() {
    let listener = undefined;
    let tagListener = undefined;
    let unwatcher = undefined;
    function bind(el, binding, vnode) {
        const { model, event, context, field, expression, isComponent } = getParams(binding, vnode);
        if (!model || !context) {
            return;
        }
        if (isComponent && vnode.componentInstance) {
            listener = generateListener({ context, field, expression });
            vnode.componentInstance.$on(event, listener);
        }
        else {
            if (!vnode.elm) {
                return;
            }
            const handleUpdate = (target) => {
                var _a;
                const obj = (0, utils_1.isSelectElement)(target)
                    ? (_a = target[target.selectedIndex]) === null || _a === void 0 ? void 0 : _a._value
                    : target === null || target === void 0 ? void 0 : target.value;
                listener = generateListener({ context, field, expression });
                return listener(obj);
            };
            handleUpdate(vnode === null || vnode === void 0 ? void 0 : vnode.elm);
            tagListener = (e) => {
                e.stopPropagation();
                handleUpdate(e === null || e === void 0 ? void 0 : e.target);
            };
            vnode.elm.addEventListener(event, tagListener);
        }
        //@ts-ignore
        unwatcher = context.$watch(expression, {
            handler: (newValue) => {
                var _a;
                if (!isComponent) {
                    return;
                }
                const prop = (model === null || model === void 0 ? void 0 : model.prop) || "value";
                // @ts-ignore
                const obj = (_a = vnode.componentInstance) === null || _a === void 0 ? void 0 : _a[prop];
                if (typeof obj !== "object") {
                    throwInvalidPropErr(obj, prop);
                    return;
                }
                throwObjectTypeErr(obj);
                obj[field] = newValue;
            },
            immediate: true,
        });
    }
    function unbind(el, binding, vnode) {
        const { event, isComponent } = getParams(binding, vnode);
        if (!event) {
            return;
        }
        if (listener && isComponent && vnode.componentInstance) {
            vnode.componentInstance.$off(event, listener);
        }
        else if (vnode.elm && tagListener) {
            vnode.elm.removeEventListener(event, tagListener);
        }
        if (unwatcher)
            unwatcher();
    }
    return {
        bind,
        unbind,
    };
}
exports.default = useVModelDestructure;
