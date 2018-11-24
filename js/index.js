window.onload = function(){
    setTimeout(onIndexPageLoaded, 1500);
};

function onIndexPageLoaded() {
    let userName = prompt("Enter your name here:", name);
    if(name === null) { userName = ''}
    localStorage.setItem('userName', userName);
}