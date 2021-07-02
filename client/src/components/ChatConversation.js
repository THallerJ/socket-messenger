import React from "react";
import { Typography, Box, Grid } from "@material-ui/core";
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
	dateTime: { paddingBottom: "1.2em" },
}));

const ChatConversation = ({ messages }) => {
	const classes = useStyles();
	const { userId } = useUser();
	const { idToName } = useContacts();

	function getDateTimetring(date) {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];

		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const day = days[date.getDay()];
		const month = months[date.getMonth()];
		const minutes =
			date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

		const hour = date.getHours() < 12 ? date.getHours() : date.getHours() - 12;
		const amOrPm = date.getHours() < 12 ? "AM" : "PM";

		return `${day}, ${month} ${date.getDate()} | ${hour}:${minutes} ${amOrPm}`;
	}

	function createChatBubble(message, prevDateTime, key) {
		const date = new Date(message.date);
		const prevDate = prevDateTime ? new Date(prevDateTime) : null;

		const timeDifference = prevDate
			? date.getTime() - prevDate.getTime()
			: null;

		return (
			<div
				key={key}
				className={
					message.sender === userId
						? classes.positionRightSide
						: classes.positionLeftSide
				}
			>
				{/* display date time information if there is more than 10 minutes between  concurrent messages being sent */}
				{timeDifference >= 60000 * 10 || !timeDifference ? (
					<Grid
						container
						direction="column"
						alignItems="center"
						justify="center"
					>
						<Typography className={classes.dateTime} variant="caption">
							{getDateTimetring(date)}
						</Typography>
					</Grid>
				) : null}

				<Typography
					className={
						message.sender === userId
							? classes.userBubble
							: classes.otherUserBubble
					}
				>
					{message.text}
				</Typography>
				{message.sender === userId ? (
					<Typography noWrap className={classes.chatInfo} variant="caption">
						{message.sender === userId ? "Me" : idToName([message.sender])}
					</Typography>
				) : (
					<Box
						component="div"
						overflow="hidden"
						textOverflow="ellipsis"
						width={"30%"}
					>
						<Typography noWrap className={classes.chatInfo} variant="caption">
							{message.sender === userId ? "Me" : idToName([message.sender])}
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
						const prevMsg = index > 0 ? messages[index - 1] : null;
						return createChatBubble(msg, prevMsg ? prevMsg.date : null, index);
				  })}
		</div>
	);
};

export default ChatConversation;
