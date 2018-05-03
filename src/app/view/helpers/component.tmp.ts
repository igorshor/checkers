export const componentName = 'x';
export class Compoent extends HTMLElement {

    /*
        An instance of the element is created or upgraded. 
        Useful for initializing state, settings up event listeners, or creating shadow dom. 
        See the spec for restrictions on what you can do in the constructor.
    */
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `<div>blabla</div>`;
    }

    /*
        Called every time the element is inserted into the DOM. 
        Useful for running setup code, such as fetching resources or rendering. 
        Generally, you should try to delay work until this time.
    */
    connectedCallback() {

    }

    /*
        Called every time the element is removed from the DOM. Useful for running clean up code.
    */
    disconnectedCallback() {

    }

    /*
        Elements can react to attribute changes by defining a attributeChangedCallback. 
        The browser will call this method for every change to attributes listed in the observedAttributes array.
    */
    static get observedAttributes() {
        return ['x'];
    }

    /*
        Called when an observed attribute has been added, removed, updated, or replaced. 
        Also called for initial values when an element is created by the parser, or upgraded. 
        Note: only attributes listed in the observedAttributes property will receive this callback.
    */
    attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {

    }

    /*
        The custom element has been moved into a new document (e.g. someone called document.adoptNode(el)).
    */
    adoptedCallback() {

    }
}

customElements.define(componentName, Compoent);