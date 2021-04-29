import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddContactDialog from './AddContactDialog';

const useStyles = makeStyles((theme) => ({
	fab: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(5),
	},
}));
const Contacts = () => {
	const classes = useStyles();
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<div>
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
