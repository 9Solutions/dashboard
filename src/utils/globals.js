if(sessionStorage.getItem("auth") === null && window.location.pathname !== "/") {
    window.location.href = "/";
}

if(localStorage.getItem('isClosed') === null) {
    localStorage.setItem('isClosed', false)
}