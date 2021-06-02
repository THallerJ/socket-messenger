import React from "react";
import {
	Grid,
	Typography,
	Card,
	CardContent,
	CardActionArea,
	IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useContacts } from "../contexts/ContactsContext";
import { useConversations } from "../contexts/ConversationsContext";
import { Link, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(1),
	},
}));

const Conversation = ({ id, recipients, lastMessage }) => {
	const classes = useStyles();
	const { idToName } = useContacts();
	const { deleteConversation } = useConversations();
	const { url } = useRouteMatch();

	return (
		<Card variant="outlined" className={classes.root}>
			<CardActionArea component={Link} to={{ pathname: `${url}/${id}` }}>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={3} className={classes.name}>
							<Typography>{idToName(recipients).join(", ")}</Typography>
						</Grid>
						<Grid item xs={7} md={8}>
							<Typography noWrap>{lastMessage}</Typography>
						</Grid>
						<Grid item xs={2} md={1}>
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									deleteConversation(id);
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default Conversation;
