import React, { useState } from 'react';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CreateConversationDialog from './CreateConversationDialog';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	fab: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

const Conversations = () => {
	const classes = useStyles();

	const [openDialog, setOpenDialog] = useState(false);

	return (
		<div>
			<CreateConversationDialog open={openDialog} setOpen={setOpenDialog} />

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

export default Conversations;
