import React, { useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext();

export const ContactsContextProvider = ({ children }) => {
	const [contacts, setContacts] = useLocalStorage('contacts', []);

	// convert array of contact ids into an array of contact names
	function idToName(contactList) {
		return contactList
			.map((id) => {
				const result = contacts.find((contact) => contact.id === id);
				return result !== undefined ? result : { name: id };
			})
			.map((contact) => contact.name);
	}

	const value = { contacts, setContacts, idToName };

	return (
		<ContactsContext.Provider value={value}>
			{children}
		</ContactsContext.Provider>
	);
};
export const useContacts = () => useContext(ContactsContext);
