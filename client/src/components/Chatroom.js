import React from "react";
import { useParams } from "react-router";

const Chatroom = () => {
	const { conversationId } = useParams();

	return <div>chatroom: {conversationId}</div>;
};

export default Chatroom;
