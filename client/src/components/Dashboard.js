import React from 'react';
import Sidebar from './Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import Contacts from './Contacts';
import Conversations from './Conversations';
import Chatroom from './Chatroom';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const useStyles = makeStyles({
	root: {
		display: 'flex',
	},
});

const Dashboard = ({ id, setUserId }) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Router>
				<Sidebar id={id} setUserId={setUserId} />
				<Switch>
					<Route exact path="/contacts" render={Contacts} />
					<Route exact path="/conversations" component={Conversations} />
					<Route exact path="/chat" component={Chatroom} />
				</Switch>
			</Router>
		</div>
	);
};

export default Dashboard;
