import React from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';
import Sidebar from './Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		display: 'flex',
	},
});

function App() {
	const classes = useStyles();
	const [id, setId] = useLocalStorage('id');

	return (
		<div className={classes.root}>
			<Sidebar />
			{id ? <Dashboard id={id} /> : <Login setUserId={setId} />}
		</div>
	);
}

export default App;
