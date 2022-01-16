import { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";
export default function useVModels(): {
    bind: (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => void;
    unbind: (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => void;
};
