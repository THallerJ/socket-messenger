import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useUser } from "../contexts/UserContext";

const ContactsContext = React.createContext();

export const ContactsContextProvider = ({ children }) => {
	const [contacts, setContacts] = useLocalStorage("contacts", []);
	const { userId } = useUser();

	// convert array of contact ids into an array of contact names
	function idToName(contactList) {
		return contactList
			.map((id) => {
				const result = contacts.find((contact) => contact.id === id);
				return result !== undefined ? result : { name: id };
			})
			.map((contact) => contact.name);
	}

	function createContact(id, name) {
		if (contacts.find((e) => e.id === id) || id === userId) {
			return false;
		}

		const tempContacts = [...contacts, { id: id, name: name }];

		setContacts(
			// ensures that the array of contacts is sorted alphabetically
			tempContacts.sort((a, b) => {
				return a.name.localeCompare(b.name);
			})
		);

		return true; // returns true for successful creation of contact
	}

	function deleteContact(id) {
		setContacts(
			contacts.filter((contact) => {
				return contact.id !== id;
			})
		);
	}

	const value = {
		contacts,
		setContacts,
		createContact,
		deleteContact,
		idToName,
	};

	return (
		<ContactsContext.Provider value={value}>
			{children}
		</ContactsContext.Provider>
	);
};
export const useContacts = () => useContext(ContactsContext);
