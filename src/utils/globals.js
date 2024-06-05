if (sessionStorage.getItem("auth") === null && window.location.pathname !== "/") {
    window.location.href = "/";
}

if (localStorage.getItem('isClosed') === null) {
    localStorage.setItem('isClosed', false)
}

export const tranformDate = (date) => {
    const dateArray = date.split("-");
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}

export const tranformPhone = (phone) => {
    const phoneArray = phone.split("");
    return `(${phoneArray[0]}${phoneArray[1]}) ${phoneArray.slice(2).join().replaceAll(',','')}`;
}