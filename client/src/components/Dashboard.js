import React from "react";
import Sidebar from "./Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import Contacts from "./Contacts";
import Conversations from "./Conversations";
import Chatroom from "./Chatroom";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import { ContactsContextProvider } from "../contexts/ContactsContext";
import { ConversationsContextProvider } from "../contexts/ConversationsContext";

const useStyles = makeStyles({
	root: {
		display: "flex",
	},
});

const Dashboard = () => {
	const classes = useStyles();
	const { url } = useRouteMatch();

	return (
		<ContactsContextProvider>
			<ConversationsContextProvider>
				<div className={classes.root}>
					<Sidebar />
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
			</ConversationsContextProvider>
		</ContactsContextProvider>
	);
};

export default Dashboard;
