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
        return fetch(`${template}.html`)
            .then(res => res.text())
            .then(html => html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, variable) =>
                variable.split('.').reduce((acc, curr) => acc[curr], data) || ''));
    }


    Zinc.renderComponent = (componentName, parentNode = document) => {
        const component = Zinc.components[componentName];
        const nodeList = parentNode.querySelectorAll(componentName);
        for (let i = 0; i < nodeList.length; i++) {
            renderTemplate(component.templateFile, component.data)
                .then((html) => {
                    const doc = domParser.parseFromString(html, 'text/html');
                    const el = nodeList[i].insertAdjacentElement('beforeend', doc.firstChild.children[1].firstChild);
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