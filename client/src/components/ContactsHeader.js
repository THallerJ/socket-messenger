import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(1),
	},
	nameHeader: {
		paddingLeft: theme.spacing(2),
	},
	idHeader: { paddingLeft: theme.spacing(1) },
}));

const ContactsHeader = () => {
	const classes = useStyles();
	return (
		<Grid container className={classes.root}>
			<Grid className={classes.nameHeader} item xs={3}>
				<Typography variant="subtitle2" color="textSecondary" noWrap>
					Name
				</Typography>
			</Grid>
			<Grid className={classes.idHeader} item xs={9}>
				<Typography variant="subtitle2" color="textSecondary" noWrap>
					ID
				</Typography>
			</Grid>
		</Grid>
	);
};

export default ContactsHeader;
