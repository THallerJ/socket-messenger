import React, { useContext, useEffect, useState, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import io from "socket.io-client";
import { useUser } from "../contexts/UserContext";
import useEffectMounted from "../hooks/useEffectMounted";

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

	useEffect(() => {
		console.log("conversation:", conversations);
	}, [conversations]);

	const createOrUpdateConversation = useCallback(
		(recipients, message, notify) => {
			setConversations((state) => {
				const conversationIndex = state.findIndex((conversation) =>
					compareArrays(conversation.recipients, recipients)
				);

				if (conversationIndex < 0) {
					// create new conversation add message to the conversation's messages array
					const conversationId = uuidV4();
					const msgArray = message === null ? [] : new Array(message);
					const newConversation = {
						id: conversationId,
						recipients: recipients,
						messages: msgArray,
					};

					if (notify) {
						setCurretConversationId(conversationId);
					}

					return [...state, newConversation];
				} else {
					// add message to the existing conversation's messages array
					const temp = [...state];
					const tempElem = { ...temp[conversationIndex] };

					tempElem.messages = compareArrays(state, [])
						? new Array(message)
						: [...tempElem.messages, message];

					temp[conversationIndex] = tempElem;

					if (notify) {
						setCurretConversationId(state[conversationIndex].id);
					}

					return temp;
				}
			});
		},
		[setConversations]
	);

	useEffectMounted(() => {
		if (socket != null) {
			socket.on("message-recieved", (msg) => {
				createOrUpdateConversation(msg.recipients, msg.message, false);
				socket.emit("message-recieved-callback", {
					messageId: msg.messageId,
					userId,
				});
			});
		}
	}, [socket, userId, createOrUpdateConversation]);

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

	function sendMessage(conversationId, recipients, message) {
		const formattedMessage = {
			conversationId: conversationId,
			sender: userId,
			date: Date.now(),
			text: message,
		};

		socket.emit("send-message", { recipients, message: formattedMessage });
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
