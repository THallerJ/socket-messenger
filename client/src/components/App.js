import React from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';
import { ContactsContextProvider } from '../contexts/ContactsContext';

function App() {
	const [id, setId] = useLocalStorage('id');

	return id ? (
		<ContactsContextProvider>
			<Dashboard id={id} setUserId={setId} />
		</ContactsContextProvider>
	) : (
		<Login setUserId={setId} />
	);
}

export default App;
