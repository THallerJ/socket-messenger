import React from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';
import { ContactsContextProvider } from '../contexts/ContactsContext';
import { ConversationsContextProvider } from '../contexts/ConversationsContext';

function App() {
	const [id, setId] = useLocalStorage('id');

	return id ? (
		<ContactsContextProvider>
			<ConversationsContextProvider>
				<Dashboard id={id} setUserId={setId} />
			</ConversationsContextProvider>
		</ContactsContextProvider>
	) : (
		<Login setUserId={setId} />
	);
}

export default App;
