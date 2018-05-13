import { buildHtmlTemplate } from "../../helpers/html-template-builder";

export const name = 'is-repeat';

export interface IRepeaterProps {
    elements: string;
}

export interface IRepeaterState {
    element: string[];
}

export class Repeater extends HTMLElement {
    private _template: HTMLElement;
    constructor() {
        super();

        const element = document.getElementById('item');
        const strData = element.getAttribute('data-array');
        const data = JSON.parse(strData);

    }

    static get observedRefAttributes(): string[] {
        return ['data'];
    }

    static get observedValueAttributes(): string[] {
        return [];
    }

    static get observedAttributes() {
        return [...Repeater.observedRefAttributes, ...Repeater.observedValueAttributes];
    }

    attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
        if (oldVal === newVal) {
            return;
        }
        if (Repeater.observedRefAttributes.indexOf(attrName) >= 0) {
            //
        } else {
            //
        }
        const data = JSON.parse(newVal);
    }
}

customElements.define(name, Repeater);