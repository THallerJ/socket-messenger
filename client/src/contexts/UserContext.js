import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
	const [userId, setUserId] = useLocalStorage("userId", null);

	const value = {
		userId,
		setUserId,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export const useUser = () => useContext(UserContext);
