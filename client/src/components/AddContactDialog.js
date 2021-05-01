import React, { useRef } from 'react';
import {
	Button,
	ButtonGroup,
	Dialog,
	DialogTitle,
	Typography,
	TextField,
	Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useContacts } from '../contexts/ContactsContext';

const useStyles = makeStyles((theme) => ({
	divider: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
	},
	textfields: {
		display: 'flex',
		flexDirection: 'column',
		padding: theme.spacing(3),
	},

	idTextField: {
		marginTop: theme.spacing(3),
	},
	buttonGroup: {
		justifyContent: 'center',
		paddingBottom: theme.spacing(2),
	},
}));

const AddContactDialog = ({ open, setOpen }) => {
	const classes = useStyles();

	const nameRef = useRef();
	const idRef = useRef();

	const { contacts, setContacts } = useContacts();

	function handleSubmit() {
		const tempContacts = [
			...contacts,
			{ id: idRef.current.value, name: nameRef.current.value },
		];
		setContacts(tempContacts);
		setOpen(false);
	}

	return (
		<Dialog open={open} onBackdropClick={() => setOpen(false)}>
			<DialogTitle>
				<div>
					<Typography align="center" variant="h6">
						Add Contact
					</Typography>
				</div>
			</DialogTitle>
			<Divider className={classes.divider} />
			<div className={classes.textfields}>
				<TextField
					variant="outlined"
					inputRef={nameRef}
					autoFocus
					id="name"
					label="Enter name"
					type="name"
				/>
				<TextField
					className={classes.idTextField}
					inputRef={idRef}
					variant="outlined"
					id="ID"
					label="Enter ID"
					type="ID"
				/>
			</div>
			<ButtonGroup className={classes.buttonGroup}>
				<Button onClick={handleSubmit} variant="contained" color="primary">
					OK
				</Button>
				<Button onClick={() => setOpen(false)} variant="contained">
					Cancel
				</Button>
			</ButtonGroup>
		</Dialog>
	);
};

export default AddContactDialog;
