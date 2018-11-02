'use strict';

/* eslint-env browser */
/* eslint-disable no-unused-vars */

const Zinc = {
    components: {}
};

(() => {
    const domParser = new DOMParser();

    function init() {
        Zinc.renderComponents();
    }

    // TBD: prefetch and cache templates?
    function renderTemplate(template, data) {
        console.log('renderTemplate is called')
        console.log('the data passed to render template: ', data)
        return fetch(`${template}.html`)
            .then(res => res.text())
            .then(html => html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, variable) =>
                data[variable]));
    }

    // Change your renderComponent function to look for z[var] attributes on the element it's rendering, 
    // and use those to grab the data for the element.
        // 1 identify the attributes and their values. 
        // build an object with attribute values that can be translated for replace


    Zinc.renderComponent = (componentName, parentNode = document) => {
        console.log('renderComponent is called');
        //v= v Zinc component
        const component = Zinc.components[componentName];
        // v DOM component 
        const nodeList = parentNode.querySelectorAll(componentName);
        // for each DOM component, do these things v
        for (let i = 0; i < nodeList.length; i++) {
            // need to get attributes:values before I can render Teplate
            // Make temporary object with userdata and values
            let data = {};
            console.log(nodeList[i].attributes);
            Array.prototype.slice.call(nodeList[i].attributes).forEach(item => {
                let key = item.name.replace(/z\[\s*([\w.]+)\s*\]/g, (match, selection) =>  selection);
                data[key] = item.value;
                return data;});
                console.log('data: ',data);

            // now i (should) have an object of data, and the keys should be in the right format

            renderTemplate(component.templateFile, data)
                .then((html) => {
                    console.log('rendered template', html)
                    const doc = domParser.parseFromString(html, 'text/html');
                    const el = nodeList[i].insertAdjacentElement('beforeend', doc.firstChild.children[1].firstChild);
                    console.log('el: ', el)
                    el.$state = {};
                    if (component.controller) {
                        el.$controller = component.controller;
                        el.$controller();
                    }
                    Zinc.renderComponents(el);
                });
        }
    };

    Zinc.renderComponents = (rootNode = document) => {
        console.log('renderCoponent-S- is called')
        Object.values(Zinc.components).forEach((component) => {
            Zinc.renderComponent(component.name, rootNode);
        });
    };

    Zinc.registerComponent = ({
        name,
        templateFile,
        data,
        controller
    }) => {
        Zinc.components[name] = {
            name,
            templateFile,
            data,
            controller
        };
    };

    document.addEventListener('DOMContentLoaded', init);
})();