export const setWithExpiry = (key, value, expirationMinutes) => {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + expirationMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
};

export const clearLocalStorageItem = (key) => {
    localStorage.removeItem(key);
};