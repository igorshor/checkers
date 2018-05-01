import { buildHtmlTemplate } from "../../helpers/html-template-builder";

export const name = 'repeat';
export class Repeater extends HTMLElement {
    private template: HTMLElement;
    constructor() {
        super();

        this.template = buildHtmlTemplate(name, require('./repeater.template.html'));
        const element = document.getElementById('item');
        const strData = element.getAttribute('data-array');
        const data = JSON.parse(strData);

    }
}

customElements.define(name, Repeater);