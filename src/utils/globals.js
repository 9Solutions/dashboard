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

const cleanBase64String = (base64) => {
    // Remove any characters that are not part of the base64 alphabet
    const base64Alphabet = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Alphabet.test(base64)) {
        throw new Error("Invalid base64 string");
    }

    // Ensure the string length is a multiple of 4
    while (base64.length % 4 !== 0) {
        base64 += "=";
    }

    return base64;
};

export const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(cleanBase64String(base64));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Extract base64 part
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}