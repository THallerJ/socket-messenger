import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Drawer,
	ListItem,
	ListItemIcon,
	List,
	ListItemText,
	Typography,
	Divider,
	Button,
	Snackbar,
} from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import GroupIcon from '@material-ui/icons/Group';
import Alert from '@material-ui/lab/Alert';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: 240,
	},
	drawerHeader: {
		padding: theme.spacing(3),
	},
	drawerTitle: {
		padding: theme.spacing(1),
	},
	drawerContent: {
		padding: theme.spacing(2),
	},
}));

const Sidebar = ({ permanent, id }) => {
	const classes = useStyles();
	const [openSnackbar, setOpenSnackbar] = useState(false);

	const itemsList = [
		{
			text: 'Contacts',
			icon: <GroupIcon />,
		},
		{
			text: 'Conversations',
			icon: <ChatBubbleIcon />,
		},
	];

	return (
		<Drawer
			className={classes.drawer}
			variant="persistent"
			anchor="left"
			open={true}
			classes={{ paper: classes.drawer }}
		>
			<div className={classes.drawerHeader}>
				<Typography className={classes.drawerTitle} variant="h6">
					Socket Messenger
				</Typography>
				<CopyToClipboard text={id}>
					<Button
						variant="text"
						size="small"
						onClick={() => setOpenSnackbar(true)}
					>
						<Typography
							color="textSecondary"
							variant="subtitle2"
							style={{ textTransform: 'none' }}
						>
							ID: {id}
						</Typography>
					</Button>
				</CopyToClipboard>
				<Snackbar
					open={openSnackbar}
					autoHideDuration={1500}
					onClose={() => setOpenSnackbar(false)}
				>
					<Alert onClose={() => setOpenSnackbar(false)} severity="info">
						ID copied to clipboard
					</Alert>
				</Snackbar>
			</div>
			<Divider />
			<List className={classes.drawerContent}>
				{itemsList.map((item, index) => {
					const { text, icon, onClick } = item;
					return (
						<ListItem button key={text} onClick={onClick}>
							{icon && <ListItemIcon>{icon}</ListItemIcon>}
							<ListItemText primary={text} />
						</ListItem>
					);
				})}
			</List>
		</Drawer>
	);
};

export default Sidebar;
