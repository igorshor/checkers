const templateCache: { [key: string]: HTMLElement } = {};

export function buildHtmlTemplate(componentName: string, htmlString: string): HTMLElement {
    if (templateCache[htmlString]) {
        return templateCache[htmlString];
    }

    const element = document.createElement('template');

    element.id = componentName;
    element.innerHTML = htmlString;

    if (element.innerHTML !== htmlString) {
        throw new Error('error in the template');
    } else {
        templateCache[htmlString] = element;
    }

    return element;
}