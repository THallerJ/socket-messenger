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
	Hidden,
	IconButton,
} from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import GroupIcon from '@material-ui/icons/Group';
import Alert from '@material-ui/lab/Alert';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MenuIcon from '@material-ui/icons/Menu';

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
	const [openDrawer, setOpenDrawer] = useState(false);

	function handleDrawerClose() {
		setOpenDrawer(false);
	}

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

	const drawerContent = (
		<div>
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
		</div>
	);

	return (
		<div>
			<Hidden smDown>
				<Drawer
					className={classes.drawer}
					variant="persistent"
					anchor="left"
					open={true}
					classes={{ paper: classes.drawer }}
				>
					{drawerContent}
				</Drawer>
			</Hidden>
			<Hidden mdUp>
				<IconButton
					color="inherit"
					edge="start"
					onClick={() => setOpenDrawer(true)}
					className={classes.menuButton}
				>
					<MenuIcon />
				</IconButton>
				<Drawer
					className={classes.drawer}
					anchor="left"
					open={openDrawer}
					close={() => handleDrawerClose}
					classes={{ paper: classes.drawer }}
					ModalProps={{ onBackdropClick: handleDrawerClose }}
				>
					{drawerContent}
				</Drawer>
			</Hidden>
		</div>
	);
};

export default Sidebar;
