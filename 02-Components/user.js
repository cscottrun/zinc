'use strict';

/* eslint-env browser */
/* globals Zinc */

(() => {
    function userController() {
        this.addEventListener('click', () => {
            this.classList.toggle('hilight');
            this.$state.hilit = !this.$state.hilit;
        });
    }

    function populateList(users) {
        const myComponents = ['user-one', 'user-two', 'user-three', 'user-four', 'user-five'];
        for (let i = 0; i < users.length; i++) {
            Zinc.registerComponent({
                name: myComponents[i],
                templateFile: 'user-item',
                data: users[i],
                controller: userController
            });
        }
        Zinc.registerComponent({
            name: 'user-list',
            templateFile: 'user-list',
        });
        Zinc.renderComponents();
    }

    fetch('https://randomuser.me/api/?results=5')
        .then(res => res.json())
        .then(json => populateList(json.results));
})();