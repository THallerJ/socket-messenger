import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useUser } from "../contexts/UserContext";

const useStyles = makeStyles((theme) => ({}));

const ChatConversation = () => {
	const classes = useStyles();
	const { userId } = useUser();
	var dummyData = [];

	const messages = [
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
		"Sed ut perspiciatis",
		"omnis iste natus error sit voluptatem accusantium doloremque",
		"minima ",
	];

	for (var i = 0; i < 40; i++) {
		const sender = i % 2 === 0 ? "123" : { userId };
		dummyData.push({ sender: sender, message: messages[i % messages.length] });
	}

	return (
		<div>
			{dummyData.map((msg) => {
				return <Typography>{msg.message}</Typography>;
			})}
		</div>
	);
};

export default ChatConversation;
