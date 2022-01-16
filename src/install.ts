import { VueConstructor} from "vue";
import useVModelDestructure from "./destructure";
import useVModels from "./models";

export default {
    install(Vue :VueConstructor) {
        Vue.directive("model-destruct", useVModelDestructure());
        Vue.directive("models", useVModels());
    },
}