import React, { useState, useEffect, useCallback } from "react";
import Slide from "@material-ui/core/Slide";

// components that are passed into this component are hidden when the user scrolls down
const HideOnScrollDown = (props) => {
	const [scrollDown, setScrollDown] = useState(false); // tracks whether user is currently scrolling down
	const [y, setY] = useState(window.pageYOffset);

	const handleScroll = useCallback(
		(e) => {
			const window = e.currentTarget;

			y < window.pageYOffset ? setScrollDown(true) : setScrollDown(false);
			setY(window.pageYOffset);
		},
		[y]
	);

	useEffect(() => {
		setY(window.pageYOffset);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	return (
		<Slide direction="up" in={!scrollDown}>
			{props.children}
		</Slide>
	);
};

export default HideOnScrollDown;
