import React, { useContext, useState } from "react";

const SidebarContext = React.createContext();

export const SidebarContextProvider = ({ children }) => {
	const [openDrawer, setOpenDrawer] = useState(false);
	const [toolbarTitle, setToolbarTitle] = useState();

	const value = {
		openDrawer,
		setOpenDrawer,
		toolbarTitle,
		setToolbarTitle,
	};

	return (
		<SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
	);
};
export const useSidebar = () => useContext(SidebarContext);
