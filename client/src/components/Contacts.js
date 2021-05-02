import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddContactDialog from './AddContactDialog';
import Contact from './Contact';
import { Grid, Typography } from '@material-ui/core';
import ContactsHeader from './ContactsHeader';
import { useContacts } from '../contexts/ContactsContext';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	fab: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(5),
	},
}));
const Contacts = () => {
	const classes = useStyles();
	const [openDialog, setOpenDialog] = useState(false);

	const { contacts } = useContacts();

	const contactList = (
		<div>
			<ContactsHeader />
			<Grid container alignItems="center" justify="center">
				{contacts.map((person, index) => {
					return <Contact key={index} name={person.name} id={person.id} />;
				})}
			</Grid>
		</div>
	);

	const emptyContactList = (
		<div>
			<Grid
				container
				direction="column"
				alignItems="center"
				justify="center"
				style={{ minHeight: '95vh' }}
			>
				<Typography color="textSecondary">
					You don't have any contacts.
				</Typography>
				<Typography color="textSecondary">
					Click the '+' symbol in the bottom right corner to add a contact.
				</Typography>
			</Grid>
		</div>
	);

	return (
		<div className={classes.root}>
			{contacts.length > 0 ? contactList : emptyContactList}
			<AddContactDialog open={openDialog} setOpen={setOpenDialog} />
			<Fab
				className={classes.fab}
				onClick={() => setOpenDialog(true)}
				color="primary"
				aria-label="add"
			>
				<AddIcon />
			</Fab>
		</div>
	);
};

export default Contacts;
