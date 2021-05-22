import React from "react";
import Dashboard from "./Dashboard";
import LoginPrivateRoute from "./LoginPrivateRoute";
import { UserContextProvider } from "../contexts/UserContext";
import Login from "./Login";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

function App() {
	return (
		<UserContextProvider>
			<Router>
				<Switch>
					<Route path="/login" component={Login} />
					<LoginPrivateRoute path="/dashboard" component={Dashboard} />
					<Redirect from="/" to="/dashboard" />
				</Switch>
			</Router>
		</UserContextProvider>
	);
}

export default App;
