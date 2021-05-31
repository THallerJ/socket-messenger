import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useUser } from "../contexts/UserContext";
import { useContacts } from "../contexts/ContactsContext";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	userBubble: {
		borderRadius: "20px",
		width: "40%",
		padding: ".75em",
		marginLeft: ".4em",
		marginRight: ".4em",
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
	},
	otherUserBubble: {
		borderRadius: "20px",
		width: "40%",
		padding: ".75em",
		marginLeft: ".4em",
		marginRight: ".4em",
		backgroundColor: theme.palette.offwhite,
	},
	positionLeftSide: {
		display: "flex",
		flexDirection: "column",
		marginBottom: ".7em",
		alignItems: "flex-start",
	},
	positionRightSide: {
		display: "flex",
		flexDirection: "column",
		marginBottom: ".7em",
		alignItems: "flex-end",
	},
	chatInfo: { marginStart: "1.5em", marginEnd: "1.5em" },
}));

const ChatConversation = () => {
	const classes = useStyles();
	const { userId } = useUser();
	const { idToName } = useContacts();
	var dummyData = [];

	const messages = [
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
		"Sed ut perspiciatis",
		"omnis iste natus error sit voluptatem accusantium doloremque",
		"minima ",
	];

	for (var i = 0; i < 40; i++) {
		const sender = i % 2 === 0 ? "123" : userId;
		dummyData.push({ sender: sender, message: messages[i % messages.length] });
	}

	function createChatBubble(sender, message) {
		return (
			<div
				className={
					sender === userId
						? classes.positionRightSide
						: classes.positionLeftSide
				}
			>
				<Typography
					className={
						sender === userId ? classes.userBubble : classes.otherUserBubble
					}
				>
					{message}
				</Typography>
				<Typography className={classes.chatInfo} variant="caption">
					{sender === userId ? "Me" : idToName([sender])}
				</Typography>
			</div>
		);
	}

	return (
		<div className={classes.root}>
			{dummyData.map((msg) => {
				return createChatBubble(msg.sender, msg.message);
			})}
		</div>
	);
};

export default ChatConversation;
