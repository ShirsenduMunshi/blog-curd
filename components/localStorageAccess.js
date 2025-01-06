"use client"

const localStorageAccess = () => {
    const name = localStorage.getItem('name');
    return name;
}

export default localStorageAccess