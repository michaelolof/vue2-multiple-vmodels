import { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";
import { setExpression } from "./utils";

function getParams(binding :DirectiveBinding, vnode: VNode) {
    const isComponent = !!vnode?.componentInstance;
    const field = binding.arg || "";
    const context = vnode.context;
    const expression = binding.expression || "";
    // @ts-ignore
    const models = vnode?.componentInstance?.$options?.models;
    const model = (models || []).find((m :any) => m?.event === "models:" + field);
    const event = model?.event;
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


export default function useVModels() {

    let listener: ((value :any) => void) | undefined;
    let unwatcher :((() => void) | undefined) = undefined;
    
    function bind(el :HTMLElement, binding: DirectiveBinding, vnode: VNode) {
        const { expression, model, event, validity, context } = getParams(binding, vnode);
        if (!validity.isValid) {
            console.warn(validity.err);
            return;
        }

        if (!context || !vnode.componentInstance) {
            return;
        }

        listener = value => setExpression(context, expression, value);
        vnode.componentInstance.$on(event, listener);
        
        //@ts-ignore
        unwatcher = context.$watch(expression, {
            handler(newValue: any) {
                if (!vnode.componentInstance) return;
                const vm = vnode.componentInstance;
                const dataExpression = model?.data;
                setExpression(vm, dataExpression, newValue);
            },
            immediate: true,
        })
    }

    function unbind(el :HTMLElement, binding: DirectiveBinding, vnode: VNode) {
        const { event } = getParams(binding, vnode);
        if (vnode.componentInstance) {
            vnode.componentInstance.$off(event, listener);
        }
        if (unwatcher) unwatcher();
    }

    return {
        bind,
        unbind,
    }
}