'use strict';

const Zinc = {
    _components: {}
};

(() => {
    const domParser = new DOMParser();
    Zinc._components = {};
    document.addEventListener('DOMContentLoaded', init)
    
    // i want to pass register component the details and have it register, saving all the data.
    // render Template will be performed given the registered component key-values 
    //then i want to go through each of the components and render each one given those values. 
    
    function renderTemplate (templateFile, data) {
        return fetch (templateFile+'.html')
        .then ( res => res.text())
        .then (html => html.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, variable) => 
                variable.split('.').reduce((acc, curr) => acc[curr],data)))
    }

    function renderComponent (componentName) {
        const component = Zinc._components[componentName];
        const nodeList = document.querySelectorAll(componentName);
        nodeList.forEach( (node) => {
            renderTemplate(component.templateFile, component.data)
            .then ((html) => {
                const doc = domParser.parseFromString(html, 'text/html');
                const elem = node.insertAdjacentElement('beforeend', doc.firstChild.children[1].firstChild);
                elem._state = {};
                if (component.controller) {
                    elem.controller = component.controller;
                    elem.controller();
                };
                Zinc._components[componentName].element = elem;
            });
        });
    }
    
    //this function will now take one config object instead of 4 arguments
    Zinc.registerComponent = function (configObj) {
        Zinc._components[configObj.componentName] = {
            componentName: configObj.componentName,
            templateFile: configObj.templateFile,
            data: configObj.data,
            controller: configObj.controller
        };
        renderComponent (configObj.componentName);
    }

    function init() {
    };   
})();
