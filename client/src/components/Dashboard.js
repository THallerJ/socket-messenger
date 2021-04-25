import React from 'react';
import Sidebar from './Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import Body from './Body';

const useStyles = makeStyles({
	root: {
		display: 'flex',
	},
});

const Dashboard = ({ id }) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Sidebar id={id} />
			<Body />
		</div>
	);
};

export default Dashboard;
