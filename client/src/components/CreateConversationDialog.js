import React, { useState } from 'react';
import {
	Button,
	ButtonGroup,
	Dialog,
	DialogTitle,
	Typography,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useContacts } from '../contexts/ContactsContext';

const useStyles = makeStyles((theme) => ({
	divider: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(5),
	},
	contactList: {
		display: 'flex',
		flexDirection: 'column',
		padding: theme.spacing(3),
	},

	buttonGroup: {
		justifyContent: 'center',
		paddingBottom: theme.spacing(3),
	},
}));

const AddConversationDialog = ({ open, setOpen }) => {
	const classes = useStyles();

	const { contacts } = useContacts();
	const [contactChecked, setContactChecked] = useState(
		contacts.slice().fill(false)
	);

	function handleSubmit() {
		const contactsInConversation = [];
		contactChecked.forEach((value, index) => {
			if (value) contactsInConversation.push(contacts[index]);
		});

		setContactChecked(contacts.slice().fill(false));

		// create a conversation with the contacts in contactsInConversation
		console.log(contactsInConversation);
		setOpen(false);
	}

	function toggleContactCheckbox(index) {
		setContactChecked(
			contactChecked.map((value, i) => (i === index ? !value : value))
		);
	}

	return (
		<Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
			<DialogTitle>
				<div>
					<Typography align="center" variant="h6">
						Create Conversation
					</Typography>
				</div>
			</DialogTitle>
			<Divider className={classes.divider} />
			<div className={classes.contactList}>
				<FormGroup>
					{contacts.map((contact, index) => {
						return (
							<FormControlLabel
								key={index}
								control={
									<Checkbox
										color="primary"
										checked={contactChecked[index]}
										onClick={() => toggleContactCheckbox(index)}
										name="checkedA"
									/>
								}
								label={contact.name}
							/>
						);
					})}
				</FormGroup>
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

export default AddConversationDialog;
