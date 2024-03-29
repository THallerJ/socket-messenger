/* eslint-disable */
import { useEffect, useRef } from 'react';

// functions like useEffect except it doesn't run on initial render
const useEffectMounted = (func, deps) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
};

export default useEffectMounted;
