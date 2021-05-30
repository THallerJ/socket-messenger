import React from "react";
import { useParams } from "react-router";
import { useConversations } from "../contexts/ConversationsContext";
import { useContacts } from "../contexts/ContactsContext";
import { Grid, TextField, Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDashboard } from "../contexts/DashboardContext";
import SendIcon from "@material-ui/icons/Send";
import ChatConversation from "./ChatConversation";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
	},
	chatBubbleContainer: {
		height: "80vh",
		overflow: "auto",
	},
	sendContainer: {
		paddingTop: theme.spacing(1),
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),
	},
	sendButton: {
		borderTopLeftRadius: 90,
		borderBottomLeftRadius: 90,
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
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
			<Box className={classes.chatBubbleContainer}>
				<ChatConversation />
			</Box>
			<Box className={classes.sendContainer}>
				<Grid container justify="flex-end">
					<Grid item>
						<Button
							className={classes.sendButton}
							variant="contained"
							color="primary"
							size="large"
							startIcon={<SendIcon />}
						>
							Send
						</Button>
					</Grid>
					<Grid item xs={7}>
						<Grid item></Grid>
						<TextField
							className={classes.sendTextfield}
							fullWidth
							multiline
							variant="outlined"
							label="Send a message"
						/>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default Chatroom;
