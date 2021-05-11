import React from 'react';
import {
	Grid,
	Typography,
	Card,
	CardContent,
	IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { useContacts } from '../contexts/ContactsContext';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(1),
	},
}));

const Conversation = ({ recipients, lastMessage }) => {
	const classes = useStyles();
	const { idToName } = useContacts();

	return (
		<Card variant="outlined" className={classes.root}>
			<CardContent>
				<Grid container spacing={2}>
					<Grid item xs={3} className={classes.name}>
						<Typography>{idToName(recipients).join(', ')}</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography noWrap>{lastMessage}</Typography>
					</Grid>
					<Grid item xs={1}>
						<IconButton onClick={() => console.log('delete')}>
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default Conversation;
