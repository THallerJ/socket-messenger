import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { userId } = useUser();

	return (
		<Route
			{...rest}
			render={(props) => {
				return userId ? <Component {...props} /> : <Redirect to="/login" />;
			}}
		></Route>
	);
};

export default PrivateRoute;
