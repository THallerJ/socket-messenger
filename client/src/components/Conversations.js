import React from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Conversations = () => {
	return (
		<div>
			Conversations
			<Button component={Link} to={'/chat'}>
				Chat
			</Button>
		</div>
	);
};

export default Conversations;
