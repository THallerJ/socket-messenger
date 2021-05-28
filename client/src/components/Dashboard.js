import React from "react";
import Sidebar from "./Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import Contacts from "./Contacts";
import Conversations from "./Conversations";
import Chatroom from "./Chatroom";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import { ContactsContextProvider } from "../contexts/ContactsContext";
import { ConversationsContextProvider } from "../contexts/ConversationsContext";
import {
	Typography,
	Hidden,
	IconButton,
	AppBar,
	Toolbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useDashboard } from "../contexts/DashboardContext";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		minHeight: "97vh",
	},
	container: {
		paddingTop: theme.mixins.toolbar.minHeight + theme.spacing(1),
		width: "100%",
	},
	appBarLargeScreen: { left: theme.drawerWidth },
}));

const Dashboard = () => {
	const classes = useStyles();
	const { url } = useRouteMatch();
	const { setOpenDrawer, toolbarTitle } = useDashboard();

	const appBar = (
		<div>
			<Hidden smDown>
				<AppBar
					className={classes.appBarLargeScreen}
					color="inherit"
					position="fixed"
				>
					<Toolbar>
						<Typography variant="h6">{toolbarTitle}</Typography>
					</Toolbar>
				</AppBar>
			</Hidden>
			<Hidden mdUp>
				<AppBar color="inherit" position="fixed">
					<Toolbar>
						<IconButton
							color="inherit"
							edge="start"
							onClick={() => setOpenDrawer(true)}
							className={classes.menuButton}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6">{toolbarTitle}</Typography>
					</Toolbar>
				</AppBar>
			</Hidden>
		</div>
	);

	return (
		<ContactsContextProvider>
			<ConversationsContextProvider>
				<div className={classes.root}>
					<Sidebar />
					{appBar}
					<div className={classes.container}>
						<Switch>
							<Redirect exact from="/dashboard" to={`${url}/contacts`} />
							<Route path={`${url}/contacts`} component={Contacts} />
							<Route
								path={`${url}/conversations/:conversationId`}
								component={Chatroom}
							/>
							<Route path={`${url}/conversations`} component={Conversations} />
						</Switch>
					</div>
				</div>
			</ConversationsContextProvider>
		</ContactsContextProvider>
	);
};

export default Dashboard;
