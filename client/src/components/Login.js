import React, { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

import {
	Grid,
	TextField,
	Button,
	ButtonGroup,
	Typography,
} from '@material-ui/core';

const Login = ({ setUserId }) => {
	const idRef = useRef();

	function generateId() {
		setUserId(uuidV4());
	}

	function loginWithId(e) {
		e.preventDefault();

		setUserId(idRef.current.value);
	}

	return (
		<Grid
			container
			alignItems="center"
			direction="column"
			justify="center"
			style={{ minHeight: '100vh', minWidth: '100vw' }}
		>
			<Grid item xs={12}>
				<Typography style={{ padding: '50px' }} variant="h2">
					Socket Messenger
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField variant="outlined" label="Enter your ID" inputRef={idRef} />
			</Grid>
			<Grid item spacing={3} container xs={12} justify="center">
				<Grid item>
					<ButtonGroup variant="contained" size="small">
						<Button onClick={loginWithId} color="primary">
							Login
						</Button>
						<Button onClick={generateId} color="seconday">
							Generate ID
						</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Login;
