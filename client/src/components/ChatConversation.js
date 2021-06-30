import React from "react";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useUser } from "../contexts/UserContext";
import { useContacts } from "../contexts/ContactsContext";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	userBubble: {
		borderRadius: "15px",
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
	chatInfo: { marginStart: "2em", marginEnd: "2em" },
}));

const ChatConversation = ({ messages }) => {
	const classes = useStyles();
	const { userId } = useUser();
	const { idToName } = useContacts();
	/// TODO EITHER ADD PADDING TO RIGHT SIDE BUBBLE OR REMOVE PAADING AROUND BOX ON LEFT
	function createChatBubble(sender, message, key) {
		return (
			<div
				key={key}
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

				{sender === userId ? (
					<Typography noWrap className={classes.chatInfo} variant="caption">
						{sender === userId ? "Me" : idToName([sender])}
					</Typography>
				) : (
					<Box
						component="div"
						overflow="hidden"
						textOverflow="ellipsis"
						width={"30%"}
					>
						<Typography noWrap className={classes.chatInfo} variant="caption">
							{sender === userId ? "Me" : idToName([sender])}
						</Typography>
					</Box>
				)}
			</div>
		);
	}

	return (
		<div className={classes.root}>
			{messages === undefined || messages.length === 0
				? ""
				: messages.map((msg, index) => {
						return createChatBubble(msg.sender, msg.text, index);
				  })}
		</div>
	);
};

export default ChatConversation;
