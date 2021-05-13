import React, { useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ConversationsContext = React.createContext();

export const ConversationsContextProvider = ({ children }) => {
	const [conversations, setConversations] = useLocalStorage(
		'conversations',
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

	function deleteConversation(recipients) {
		setConversations(
			conversations.filter((conversation) => {
				return !compareArrays(conversation.recipients, recipients);
			})
		);
	}

	function createConversation(contactsInConversation) {
		const conversationExists = conversations.some((conversation) => {
			return compareArrays(conversation.recipients, contactsInConversation);
		});

		if (!conversationExists) {
			const tempConversations = [
				...conversations,
				{ recipients: contactsInConversation, messages: [] },
			];

			setConversations(tempConversations);
		}
	}
	const value = {
		conversations,
		setConversations,
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
