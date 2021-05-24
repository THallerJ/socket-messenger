import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { v4 as uuidV4 } from "uuid";

const ConversationsContext = React.createContext();

export const ConversationsContextProvider = ({ children }) => {
	const [conversations, setConversations] = useLocalStorage(
		"conversations",
		[]
	);

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

	const value = {
		conversations,
		setConversations,
		idToConversation,
		createConversation,
		deleteConversation,
	};

	return (
		<ConversationsContext.Provider value={value}>
			{children}
		</ConversationsContext.Provider>
	);
};
export const useConversations = () => useContext(ConversationsContext);
