import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import GroupIcon from "@material-ui/icons/Group";
import Alert from "@material-ui/lab/Alert";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useContacts } from "../contexts/ContactsContext";
import useEffectInitial from "../hooks/useEffectInitial";

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
	drawerFooter: {
		margin: theme.spacing(2),
		position: "fixed",
		bottom: 0,
	},
}));

const Sidebar = ({ id, setUserId }) => {
	const classes = useStyles();
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [signOut, setSignOut] = useState(false);
	const { setContacts } = useContacts();

	useEffectInitial(() => {
		setUserId(null);
	}, [signOut]);

	function handleDrawerClose() {
		setOpenDrawer(false);
	}

	function signout() {
		setContacts([]);
		setSignOut(true);
	}

	const itemsList = [
		{
			text: "Contacts",
			icon: <GroupIcon />,
			route: "/contacts",
		},
		{
			text: "Conversations",
			icon: <ChatBubbleIcon />,
			route: "/conversations",
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
							style={{ textTransform: "none" }}
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
			<List>
				{itemsList.map((item, index) => {
					const { text, icon, route } = item;
					return (
						<ListItem button key={text} component={Link} to={route}>
							{icon && <ListItemIcon>{icon}</ListItemIcon>}
							<ListItemText primary={text} />
						</ListItem>
					);
				})}
			</List>
			<div className={classes.drawerFooter}>
				<Button
					variant="contained"
					color="primary"
					size="large"
					startIcon={<ExitToAppIcon />}
					onClick={() => signout()}
				>
					Sign Out
				</Button>
			</div>
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
