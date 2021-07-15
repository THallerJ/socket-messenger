import React, { useRef, useEffect } from "react";
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
		height: "82vh",
		overflow: "auto",
	},
	sendContainer: {
		paddingTop: theme.spacing(1),
		paddingLeft: theme.spacing(6),
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
	const { idToConversation, sendMessage } = useConversations();
	const { idToName } = useContacts();
	const { setToolbarTitle } = useDashboard();
	const textfieldRef = useRef();
	const conversation = idToConversation(conversationId);

	useEffect(() => {
		if (conversation !== undefined) {
			setToolbarTitle(idToName(conversation.recipients).join(", "));
		}
	});

	function handleSubmit() {
		sendMessage(
			conversation.id,
			conversation.recipients,
			textfieldRef.current.value
		);
		textfieldRef.current.value = "";
	}

	return (
		<div className={classes.root}>
			<Box className={classes.chatBubbleContainer}>
				<ChatConversation
					messages={
						conversation === undefined ? undefined : conversation.messages
					}
				/>
			</Box>
			<Box className={classes.sendContainer}>
				<Grid container justify="flex-end">
					<Grid item>
						<Button
							className={classes.sendButton}
							variant="contained"
							color="primary"
							size="small"
							onClick={handleSubmit}
							startIcon={<SendIcon />}
						>
							Send
						</Button>
					</Grid>
					<Grid item xs={7}>
						<Grid item></Grid>
						<TextField
							className={classes.sendTextfield}
							inputRef={textfieldRef}
							fullWidth
							multiline
							variant="outlined"
							placeholder="Send a message"
						/>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default Chatroom;
