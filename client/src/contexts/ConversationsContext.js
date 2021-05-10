import React, { useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ConversationsContext = React.createContext();

export const ConversationsContextProvider = ({ children }) => {
	const [conversations, setConversations] = useLocalStorage(
		'conversations',
		[]
	);
	const value = { conversations, setConversations };

	return (
		<ConversationsContext.Provider value={value}>
			{children}
		</ConversationsContext.Provider>
	);
};
export const useConversations = () => useContext(ConversationsContext);
