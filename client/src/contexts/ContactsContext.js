import React, { useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext();

export const ContactsContextProvider = ({ children }) => {
	const [contacts, setContacts] = useLocalStorage('contacts', []);

	// convert array of contact ids into an array of contact names
	function idToName(contactList) {
		return contactList.map((id) => {
			return contacts
				.filter((contact) => {
					return contact.id === id;
				})
				.map((contact) => {
					return contact.name;
				});
		});
	}

	const value = { contacts, setContacts, idToName };

	return (
		<ContactsContext.Provider value={value}>
			{children}
		</ContactsContext.Provider>
	);
};
export const useContacts = () => useContext(ContactsContext);
