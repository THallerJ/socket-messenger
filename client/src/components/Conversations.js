import React, { useState } from "react";
import { Fab, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CreateConversationDialog from "./CreateConversationDialog";
import { useConversations } from "../contexts/ConversationsContext";
import Conversation from "./Conversation";
import useEffectMounted from "../hooks/useEffectMounted";
import { useHistory } from "react-router-dom";
import { useDashboard } from "../contexts/DashboardContext";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	fab: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

const Conversations = () => {
	const classes = useStyles();

	const [openDialog, setOpenDialog] = useState(false);
	const [newConversationId, setNewConversationId] = useState();
	const { conversations } = useConversations();
	const history = useHistory();
	const { setToolbarTitle } = useDashboard();

	setToolbarTitle("Conversations");

	useEffectMounted(() => {
		history.push("conversations/" + newConversationId);
	}, [newConversationId]);

	function dialogCallback(id) {
		setNewConversationId(id);
	}

	const conversationList = (
		<div>
			<Grid container alignItems="center" justify="center">
				{conversations.map((conversation, index) => {
					return (
						<Conversation
							key={index}
							id={conversation.id}
							recipients={conversation.recipients}
							lastMessage={
								conversation.messages[conversation.messages.length - 1]
							}
						/>
					);
				})}
			</Grid>
		</div>
	);

	const emptyConversationtList = (
		<div>
			<Grid
				container
				direction="column"
				alignItems="center"
				justify="center"
				style={{ minHeight: "95vh" }}
			>
				<Typography color="textSecondary">
					You don't have any active conversations.
				</Typography>
				<Typography color="textSecondary">
					Click the '+' symbol in the bottom right corner to create a
					conversation.
				</Typography>
			</Grid>
		</div>
	);

	return (
		<div className={classes.root}>
			<CreateConversationDialog
				open={openDialog}
				setOpen={setOpenDialog}
				callback={dialogCallback}
			/>
			{conversations.length > 0 ? conversationList : emptyConversationtList}
			<Fab
				className={classes.fab}
				onClick={() => setOpenDialog(true)}
				color="primary"
				aria-label="add"
			>
				<AddIcon />
			</Fab>
		</div>
	);
};

export default Conversations;
