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

    //Change your renderComponent function to look for z[var] attributes on the element it's rendering, 
        //and use those to grab the data for the element.

        // render template will now need to look in the element's attributes rather than in data
        // element attributes inform the registry (not the other way around)

    function renderComponent (componentName) {
        const component = Zinc._components[componentName];
            // ^ this idetifies comp. in our registry
        const nodeList = document.querySelectorAll(componentName);
            // ^ this identifies the comp element in the DOM
        nodeList.forEach( (node) => {
            
            // this is where I need to grab the attributes and their vales. Make an object that can be easily referenced
            component.data = {}
            
            renderTemplate(component.templateFile, component.data) // <- component.data is where we get name,email, etc
            // the data will no longer be coming from our registery, it will come from the element.attributes
            .then ((html) => {
                const doc = domParser.parseFromString(html, 'text/html');
                // ^ this gets an type-object of the newly rendered html (rather than a string)
                const el = node.insertAdjacentElement('beforeend', doc.firstChild.children[1].firstChild);
                // ^ this inserts our newly rendered html into our DOM node, and then calls that el
                el._state = {};
                if (component.controller) {
                    el.controller = component.controller;
                    // ^ this adds key controller to element, and makes value = what's in the registry 
                    el.controller();
                    // ^ this envokes that controller function
                };
                Zinc._components[componentName].element = el;
            });
        });
    }
    
    //when i register comp. I can got get the attributes and store in data.
            // configObj doesnt' yet have data.  
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
