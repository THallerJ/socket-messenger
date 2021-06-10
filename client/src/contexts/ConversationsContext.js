import React, { useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import io from "socket.io-client";
import { useUser } from "../contexts/UserContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ConversationsContext = React.createContext();

export const ConversationsContextProvider = ({ children }) => {
	const [conversations, setConversations] = useLocalStorage(
		"conversations",
		[]
	);
	const { userId } = useUser();
	const [socket, setSocket] = useState();

	useEffect(() => {
		setSocket(io(SERVER_URL, { query: { userId } }));
	}, [userId]);

	function compareArrays(a, b) {
		if (a.length !== b.length) {
			return false;
		} else {
			return a.every((element, index) => {
				return element === b[index];
			});
		}
	}

	function idToConversation(id) {
		return conversations.find((conversation) => conversation.id === id);
	}

	function deleteConversation(id) {
		setConversations(
			conversations.filter((conversation) => {
				return conversation.id !== id;
			})
		);
	}

	function createConversation(contactsInConversation) {
		const conversationExists = conversations.find((conversation) => {
			return compareArrays(conversation.recipients, contactsInConversation);
		});

		var conversationId;
		if (!conversationExists) {
			conversationId = uuidV4();
			const tempConversations = [
				...conversations,
				{
					id: conversationId,
					recipients: contactsInConversation,
					messages: [],
				},
			];

			setConversations(tempConversations);
			return conversationId;
		} else {
			conversationId = conversationExists.id;
		}

		return conversationId;
	}

	function sendMessage(recipients, message) {
		socket.emit("send-message", { recipients, message });
	}

	useEffect(() => {
		if (socket != null) {
			socket.on("message-recieved", (msg) => {
				console.log(msg);
			});
		}
	}, [socket]);

	const value = {
		conversations,
		setConversations,
		idToConversation,
		createConversation,
		deleteConversation,
		sendMessage,
	};

	return (
		<ConversationsContext.Provider value={value}>
			{children}
		</ConversationsContext.Provider>
	);
};
export const useConversations = () => useContext(ConversationsContext);
