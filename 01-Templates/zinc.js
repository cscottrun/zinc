'use strict';

/* eslint-env browser */

(() => {
    function populateList(results) {
        console.log(results);

        function capFirst(words){
            let splitWords = words.split(' ').map( word => {
                return word[0].toUpperCase()+word.slice(1);
            })
            return splitWords.join(' ');
        }

        let container = document.getElementsByClassName('container')[0];
        let userList = document.createElement('ul');
        container.appendChild(userList);
        userList.setAttribute('class','user-list');
        userList.setAttribute('id','z-user-list');
        for (let result of results) {
            let user = document.createElement('li');
            user.setAttribute('class','user');
            userList.appendChild(user);

                let userPhoto = document.createElement('img');
                user.appendChild(userPhoto)
                userPhoto.setAttribute('class','user-photo');
                userPhoto.setAttribute('src', `${result.picture.large}`);
                userPhoto.setAttribute('alt',`Photo of ${result.name.first} ${result.name.last}`);

                let userName = document.createElement('div');
                user.appendChild(userName);
                userName.setAttribute('class','user-name');
                userName.textContent = `${capFirst(result.name.first)} ${capFirst(result.name.last)}`;

                let userLocation = document.createElement('div');
                user.appendChild(userLocation);
                userLocation.setAttribute('class','user-location');
                userLocation.textContent = `${capFirst(result.location.city)}, ${capFirst(result.location.state)}`;

                let userEmail = document.createElement('div');
                user.appendChild(userEmail);
                userEmail.setAttribute('class','user-email');
                userEmail.textContent = `${result.email}`;

        }
        
    }

    function init() {
        fetch('https://randomuser.me/api/?results=5')
            .then(res => res.json())
            .then(json => populateList(json.results));
    }

    document.addEventListener('DOMContentLoaded', init);
})();
