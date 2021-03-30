export const setItem = (key, obj) => {
    localStorage.setItem(key, JSON.stringify(obj))
};

export const getItem = (key) => {
    return localStorage.getItem(key);
};

export const removeItem = (key) => {
    return localStorage.removeItem(key);
};
