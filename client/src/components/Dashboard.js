import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = ({ id }) => {
	return (
		<div>
			Your id: {id}
			{/* Put this in App.js. Conditionally render as permanent depending on screen size (this will require passing permanent boolean prop to Sidebar. Must also conditionally render button to enable drawer)*/}
		</div>
	);
};

export default Dashboard;
