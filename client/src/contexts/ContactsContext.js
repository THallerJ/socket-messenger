import React, { useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext();

export const ContactsContextProvider = ({ children }) => {
	const [contacts, setContacts] = useLocalStorage('contacts', []);
	const value = { contacts, setContacts };

	return (
		<ContactsContext.Provider value={value}>
			{children}
		</ContactsContext.Provider>
	);
};
export const useContacts = () => useContext(ContactsContext);
