const debounce = (func, delay = 1000) => {
	let timerId;
	return (...arguments) => {
		if (timerId) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			// console.log(timerId, 'went through.');
			func.apply(null, arguments);
		}, delay);
	};
};
