"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const destructure_1 = __importDefault(require("./destructure"));
const models_1 = __importDefault(require("./models"));
exports.default = {
    install(Vue) {
        Vue.directive("model-destruct", (0, destructure_1.default)());
        Vue.directive("models", (0, models_1.default)());
    },
};
