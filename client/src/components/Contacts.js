import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddContactDialog from './AddContactDialog';
import Contact from './Contact';
import { Grid } from '@material-ui/core';
import ContactsHeader from './ContactsHeader';

const useStyles = makeStyles((theme) => ({
	fab: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(5),
	},
}));
const Contacts = () => {
	const classes = useStyles();
	const [openDialog, setOpenDialog] = useState(false);

	const people = [
		{
			name: 'Tom',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Bill Hickensburg',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Steve',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Ryan',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Shelby',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Tom',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Bill Hickensburg',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Steve',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Ryan',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
		{
			name: 'Shelby',
			id: '034c4b9d-1b6b-445d-89de-186c8b1abcc1',
		},
	];

	return (
		<div>
			<ContactsHeader />
			<Grid container alignItems="center" justify="center">
				{people.map((person, index) => {
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
