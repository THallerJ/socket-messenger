import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Drawer,
	ListItem,
	ListItemIcon,
	List,
	ListItemText,
} from '@material-ui/core';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import GroupIcon from '@material-ui/icons/Group';

const useStyles = makeStyles({
	drawer: {
		width: '200px',
	},
});

const Sidebar = ({ permanent }) => {
	const classes = useStyles();
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
		>
			<List>
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
