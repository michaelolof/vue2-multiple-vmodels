import Vue from "vue";

export function setExpression(vm :Vue, location: string, value: any) {
    const locations = location.split(".");
    if (locations.length > 1) {
        const field = locations.slice(locations.length - 1, locations.length)[0];
        const paths = locations.slice(0, locations.length - 1);
        let currentObj :Record<string, any> = vm;
        for (const path of paths) {
            currentObj = currentObj[path];
        }
        vm.$set(currentObj, field, value);
    }
    else {
        vm.$set(vm, locations[0], value);
    }
}

export function isSelectElement(node :Node): node is HTMLSelectElement {
    return ((node as HTMLElement)?.tagName || "").toLowerCase() === "select";
}