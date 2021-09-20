import React, { useState } from "react";
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
	Grid,
	Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useContacts } from "../contexts/ContactsContext";
import { useConversations } from "../contexts/ConversationsContext";

const useStyles = makeStyles((theme) => ({
	divider: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
	},
	body: {
		padding: theme.spacing(3),
	},
	buttonGroup: {
		justifyContent: "center",
		paddingBottom: theme.spacing(3),
	},
}));

const AddConversationDialog = ({ open, setOpen }) => {
	const classes = useStyles();

	const { contacts } = useContacts();
	const { createOrUpdateConversation } = useConversations();

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [disableButton, setDisableButton] = useState(false);
	const [contactChecked, setContactChecked] = useState(
		contacts ? contacts.slice().fill(false) : []
	);

	function handleSubmit() {
		setDisableButton(true); // prevent double clicking submit button

		const contactsInConversation = [];
		contactChecked.forEach((value, index) => {
			if (value) contactsInConversation.push(contacts[index].id);
		});

		setContactChecked(contacts.slice().fill(false));

		contactsInConversation.length === 0
			? setOpenSnackbar(true)
			: createOrUpdateConversation(contactsInConversation, null, true, false);
	}

	function toggleContactCheckbox(index) {
		setContactChecked(
			contactChecked.map((value, i) => (i === index ? !value : value))
		);
	}

	const contactList = (
		<FormGroup>
			{contacts
				? contacts.map((contact, index) => {
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
				  })
				: ""}
		</FormGroup>
	);

	const emptyContactList = (
		<Grid container justify="center">
			<Typography>You have no contacts</Typography>
		</Grid>
	);

	const submitButton = (
		<Button
			onClick={handleSubmit}
			disabled={disableButton}
			variant="contained"
			color="primary"
		>
			OK
		</Button>
	);

	return (
		<Dialog open={open} onBackdropClick={() => setOpen(false)}>
			<DialogTitle>
				<div>
					<Typography align="center" variant="h6">
						Create Conversation
					</Typography>
				</div>
			</DialogTitle>
			<Divider className={classes.divider} />
			<div className={classes.body}>
				{contacts && contacts.length > 0 ? contactList : emptyContactList}
			</div>
			<ButtonGroup className={classes.buttonGroup}>
				{contacts && contacts.length > 0 ? submitButton : ""}
				<Button onClick={() => setOpen(false)} variant="contained">
					Cancel
				</Button>
			</ButtonGroup>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={1500}
				onClose={() => setOpenSnackbar(false)}
			>
				<Alert onClose={() => setOpenSnackbar(false)} severity="info">
					No contacts selected
				</Alert>
			</Snackbar>
		</Dialog>
	);
};

export default AddConversationDialog;
