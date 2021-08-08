import { useEffect, useState } from "react";

const PREFIX = "messaging-app";

function useLocalStorage(key, initialValue) {
	const prefixedKey = PREFIX + key;
	const [value, setValue] = useState(() => {
		const jsonValue = localStorage.getItem(prefixedKey);

		if (jsonValue != null) return JSON.parse(jsonValue);

		if (typeof initialValue === "function") {
			return initialValue();
		} else {
			return initialValue;
		}
	});

	useEffect(() => {
		// setting the value deletes the item from local storage
		value
			? localStorage.setItem(prefixedKey, JSON.stringify(value))
			: localStorage.removeItem(prefixedKey);
	}, [prefixedKey, value]);

	return [value, setValue];
}

export default useLocalStorage;
