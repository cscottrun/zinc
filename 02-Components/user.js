'use strict';

/* eslint-env browser */
/* globals Zinc */

(() => {
    function onClick() {
        this.addEventListener('click', () => {
            this.classList.toggle('hilight');
            this.$state.hilight = !this.$state.hilitght;
        });
    }

    function populateList(users) {
        const myComponents = ['user-info'];
        for (let i = 0; i < users.length; i++) {
            let userConfigObj = {
                componentName: myComponents[i],
                templateFile: 'user',
                data: users[i], //this is an object containing our user info
                controller: onClick
            }
            //Zinc.register will now take the config object
            Zinc.registerComponent(userConfigObj)
                
        }
    }

    fetch('https://randomuser.me/api/?results=5')
        .then(res => res.json())
        .then(json => populateList(json.results));
})();