import { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";
import { ElmNode, HTMLOptionElmElement, ListnerParams } from "./types";
import { isSelectElement, setExpression } from "./utils";


const generateListener = ({ context, field, expression } :ListnerParams) => (obj :any) => {
    if (!obj) {
        return;
    }
    throwObjectTypeErr(obj);
    const currentValue = obj[field];
    setExpression(context, expression, currentValue);
};

function getParams(binding :DirectiveBinding, vnode :VNode) {
    const isComponent = !!vnode?.componentInstance;
    const field = binding.arg || "";
    const context = vnode.context;
    const expression = binding.expression || "";
    let model;
    let event;

    if (isComponent) {
        model = vnode?.componentInstance?.$options?.model;
        event = model?.event || Object.keys(vnode?.componentOptions?.listeners || {})[0];
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

function throwObjectTypeErr(obj :any) {
    if (typeof obj !== "object") {
        throw new TypeError("Expected object, got " + (typeof obj) + "\n'v-model-destruct' directive only works with objects. Make sure your component emmits an object");
    }
}

function throwInvalidPropErr(type :string, prop :string) {
    console.warn("Invalid Prop Type. Trying to mutate the destructured parts of type '" + type + "' is not allowed in Vue. \nEnsure your '" + prop + "' prop defaults to type Object to enable mutation of its fields.");
}


export default function useVModelDestructure() {

    let listener :(((obj :any) => void) | undefined) = undefined;
    let tagListener :(((e :Event) => void) | undefined) = undefined;
    let unwatcher :((() => void) | undefined) = undefined;

    function bind(el :HTMLElement, binding: DirectiveBinding, vnode: VNode ) {
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

            const handleUpdate = (target :ElmNode) => {
                const obj = isSelectElement(target)
                    ? (target[target.selectedIndex] as HTMLOptionElmElement)?._value
                    : target?.value;
                listener = generateListener({ context, field, expression });
                return listener(obj);
            }

            handleUpdate(vnode?.elm);
            tagListener = (e :Event) => {
                e.stopPropagation();
                handleUpdate(e?.target as ElmNode);
            }

            vnode.elm.addEventListener(event, tagListener);
        }

        //@ts-ignore
        unwatcher = context.$watch(expression, {
            handler: (newValue :any) => {
                if (!isComponent) {
                    return;
                }

                const prop = model?.prop || "value";
                // @ts-ignore
                const obj = vnode.componentInstance?.[prop] as any;
                if (typeof obj !== "object") {
                    throwInvalidPropErr(obj, prop);
                    return;
                }

                throwObjectTypeErr(obj);
                obj[field] = newValue;
            },

            immediate: true,
        })
    }

    function unbind(el :HTMLElement, binding: DirectiveBinding, vnode: VNode ) {
        const {event, isComponent} = getParams(binding, vnode);
        if (!event) {
            return;
        }

        if (listener && isComponent && vnode.componentInstance) {
            vnode.componentInstance.$off(event, listener);
        }
        else if (vnode.elm && tagListener) {
            vnode.elm.removeEventListener(event, tagListener)
        }

        if(unwatcher) unwatcher();
    }


    return {
        bind,
        unbind,
    }

}