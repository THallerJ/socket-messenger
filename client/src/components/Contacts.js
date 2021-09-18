import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CreateContactDialog from "./CreateContactDialog";
import Contact from "./Contact";
import { Grid, Typography } from "@material-ui/core";
import ContactsHeader from "./ContactsHeader";
import { useContacts } from "../contexts/ContactsContext";
import { useDashboard } from "../contexts/DashboardContext";
import HideOnScrollDown from "./HideOnScrollDown";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	fab: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
	emptyMessage: {
		padding: "20%",
	},
}));
const Contacts = () => {
	const classes = useStyles();
	const [openDialog, setOpenDialog] = useState(false);
	const { contacts } = useContacts();
	const { setToolbarTitle } = useDashboard();

	useEffect(() => {
		setToolbarTitle("Contacts");
	});

	const contactList = (
		<div>
			<ContactsHeader />
			<Grid container alignItems="center" justify="center">
				{contacts
					? contacts.map((person, index) => {
							return <Contact key={index} name={person.name} id={person.id} />;
					  })
					: ""}
			</Grid>
		</div>
	);

	const emptyContactList = (
		<div>
			<Grid
				className={classes.emptyMessage}
				container
				direction="column"
				alignItems="center"
				justify="center"
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
			{contacts && contacts.length > 0 ? contactList : emptyContactList}
			<CreateContactDialog open={openDialog} setOpen={setOpenDialog} />
			<HideOnScrollDown>
				<Fab
					className={classes.fab}
					onClick={() => setOpenDialog(true)}
					color="primary"
					aria-label="add"
				>
					<AddIcon />
				</Fab>
			</HideOnScrollDown>
		</div>
	);
};

export default Contacts;
