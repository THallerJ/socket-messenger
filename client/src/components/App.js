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
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { DashboardContextProvider } from "../contexts/DashboardContext";

const theme = createMuiTheme({
	drawerWidth: 240,
});

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<UserContextProvider>
				<DashboardContextProvider>
					<Router>
						<Switch>
							<Route path="/login" component={Login} />
							<LoginPrivateRoute path="/dashboard" component={Dashboard} />
							<Redirect from="/" to="/dashboard" />
						</Switch>
					</Router>
				</DashboardContextProvider>
			</UserContextProvider>
		</MuiThemeProvider>
	);
}

export default App;
