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

const Contact = ({ name, id }) => {
	const classes = useStyles();
	const { deleteContact } = useContacts();

	return (
		<Card variant="outlined" className={classes.root}>
			<CardContent>
				<Grid container spacing={2}>
					<Grid item xs={3} className={classes.name}>
						<Typography noWrap>{name}</Typography>
					</Grid>
					<Grid item xs={8}>
						<Typography noWrap>{id}</Typography>
					</Grid>
					<Grid item xs={1}>
						<IconButton onClick={() => deleteContact(id)}>
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default Contact;
