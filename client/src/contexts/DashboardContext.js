import React, { useContext, useState } from "react";

const DashboardContext = React.createContext();

export const DashboardContextProvider = ({ children }) => {
	const [openDrawer, setOpenDrawer] = useState(false);
	const [toolbarTitle, setToolbarTitle] = useState();

	const value = {
		openDrawer,
		setOpenDrawer,
		toolbarTitle,
		setToolbarTitle,
	};

	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	);
};
export const useDashboard = () => useContext(DashboardContext);
