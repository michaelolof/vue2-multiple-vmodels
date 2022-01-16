import Vue from "vue";

export interface ListnerParams {
    context: Vue,
    field: string;
    expression: string;
}

export interface ElmNode extends Node {
    value?: any
}

export interface HTMLOptionElmElement extends HTMLOptionElement {
    _value?: any
}