import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddContactDialog from './AddContactDialog';
import Contact from './Contact';
import { Grid } from '@material-ui/core';
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

	return (
		<div className={classes.root}>
			<ContactsHeader />
			<Grid container alignItems="center" justify="center">
				{contacts.map((person, index) => {
					return <Contact key={index} name={person.name} id={person.id} />;
				})}
			</Grid>
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
