import React from 'react';
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

	function handleSubmit() {
		setOpen(false);
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
					{contacts.map((contact) => {
						return (
							<FormControlLabel
								control={
									<Checkbox
										checked={false}
										onChange={() => {
											console.log('test');
										}}
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
