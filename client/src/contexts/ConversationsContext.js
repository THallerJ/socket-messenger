import React, { useContext, useEffect, useState, useCallback } from "react";
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
	const [currentConversationId, setCurretConversationId] = useState();

	useEffect(() => {
		setSocket(io(SERVER_URL, { query: { userId: userId } }));
	}, [userId]);

	// TODO: remove function and place code in createOrUpdateConversation
	const findConversation = useCallback(
		(recipients) => {
			return conversations.findIndex((conversation) => {
				return compareArrays(conversation.recipients, recipients);
			});
		},
		[conversations]
	);

	useEffect(() => {
		console.log("conversation:", conversations);
	}, [conversations]);

	const createOrUpdateConversation = useCallback(
		(recipients, message) => {
			const conversationIndex = findConversation(recipients);

			var conversationId;
			if (conversationIndex < 0) {
				// create new conversation add message to the conversation's messages array
				conversationId = uuidV4();
				const msgArray = message === undefined ? [] : new Array(message);
				const newConversation = {
					id: conversationId,
					recipients: recipients,
					messages: msgArray,
				};

				setConversations((current) => [...current, newConversation]);
			} else {
				// add message to the existing conversation's messages array
				//conversationExists.messages.push(message);
				//console.log("exists", conversationExists);
				//conversationId = conversationExists.id;
				/*
				setConversations((current) => {
					return [
						...current.slice(0, conversationIndex),
						current[conversationIndex].messages.push(message),
						...current.slice(conversationIndex + 1),
					];
				});
							*/
			}

			setCurretConversationId(conversationId);
		},
		[setConversations, findConversation]
	);

	useEffect(() => {
		if (socket != null) {
			socket.on("message-recieved", (msg) => {
				createOrUpdateConversation(msg.recipients, msg.message);
			});
		}
	}, [socket, createOrUpdateConversation]);

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

	function sendMessage(recipients, message) {
		socket.emit("send-message", { recipients, message });
	}

	const value = {
		conversations,
		setConversations,
		currentConversationId,
		idToConversation,
		createOrUpdateConversation,
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
