import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	ButtonGroup,
	Dialog,
	DialogTitle,
	Typography,
	TextField,
	Divider,
	Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useContacts } from "../contexts/ContactsContext";

const useStyles = makeStyles((theme) => ({
	divider: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
	},
	textfields: {
		display: "flex",
		flexDirection: "column",
		padding: theme.spacing(3),
	},

	idTextField: {
		marginTop: theme.spacing(3),
	},
	buttonGroup: {
		justifyContent: "center",
		paddingBottom: theme.spacing(2),
	},
}));

const CreateContactDialog = ({ open, setOpen }) => {
	const classes = useStyles();

	const nameRef = useRef();
	const idRef = useRef();

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarText, setSnackbarText] = useState("");
	const [disableButton, setDisableButton] = useState(false);

	const { createContact } = useContacts();

	function setupSnackbar(text) {
		setSnackbarText(text);
		setOpenSnackbar(true);
	}

	useEffect(() => {
		if (open) setDisableButton(false);
	}, [open]);

	function handleSubmit() {
		if (idRef.current.value.length === 36) {
			// if contact successfully created...
			if (createContact(idRef.current.value, nameRef.current.value)) {
				setDisableButton(true); // prevent double clicking submit button
				setOpen(false);
			} else {
				setupSnackbar("Contact with ID already exists");
			}
		} else {
			setupSnackbar("ID must be 36 characters long");
		}
	}

	return (
		<div>
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
					<Button
						onClick={handleSubmit}
						disabled={disableButton}
						variant="contained"
						color="primary"
					>
						OK
					</Button>
					<Button onClick={() => setOpen(false)} variant="contained">
						Cancel
					</Button>
				</ButtonGroup>
			</Dialog>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={1500}
				onClose={() => setOpenSnackbar(false)}
			>
				<Alert onClose={() => setOpenSnackbar(false)} severity="info">
					{snackbarText}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default CreateContactDialog;
