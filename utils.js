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

function fnum(num) {
	if (num > 999 && num < 1000000) {
		return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million
	} else if (num > 1000000) {
		return (num / 1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million
	} else if (num < 900) {
		return num; // if value < 1000, nothing to do
	}
}
