function onPageLoaded() {
    var name = prompt("Enter your name here:")
    localStorage.setItem('userName', name);
}

window.onload = onPageLoaded;