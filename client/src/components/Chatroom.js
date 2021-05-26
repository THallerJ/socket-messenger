import React from "react";
import { useParams } from "react-router";
import { useConversations } from "../contexts/ConversationsContext";
import { useContacts } from "../contexts/ContactsContext";
import { Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDashboard } from "../contexts/DashboardContext";

const useStyles = makeStyles((theme) => ({
	root: { width: "100%" },
	appBarLargeScreen: { left: theme.drawerWidth },
}));

const Chatroom = () => {
	const classes = useStyles();
	const { conversationId } = useParams();
	const { idToConversation } = useConversations();
	const { idToName } = useContacts();
	const { setToolbarTitle } = useDashboard();

	const conversation = idToConversation(conversationId);

	setToolbarTitle(idToName(conversation.recipients).join(", "));

	return (
		<div className={classes.root}>
			<Grid container>
				<Grid container xs={12} alignContent="flex-end">
					<Grid item container xs={2} justify="flex-end">
						<TextField
							multiline
							fullWidth
							variant="outlined"
							label="Type a message"
						/>
					</Grid>
					<Grid item container justify="flex-end">
						<Button variant="contained" color="primary" justify="flex-end">
							Send
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Chatroom;
