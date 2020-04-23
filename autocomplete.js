const createAutoComplete = (config) => {
	const { root, fetchData, renderOption, onOptionSelect } = config;
	root.innerHTML = `
   <label><b>Search</b></label>
    <input class="input">
    <span class="icon clear-search hide">
        <i class="fas fa-window-close hide"></i>
    </span>
    <div class="dropdown">
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content results">
        </div>
        </div>
    </div>`;
	const input = root.querySelector('.input');
	const dropdown = root.querySelector('.dropdown');
	const dropdownResults = root.querySelector('.results');
	const dropdownToggle = {
		open() {
			dropdown.classList.add('is-active');
		},
		close() {
			dropdown.classList.remove('is-active');
			dropdownResults.innerHTML = '';
		}
	};
	const onInput = async (event) => {
		const movies = await fetchData(event.target.value);
		const searchResults = movies.data.Search;
		if (searchResults) {
			for (let movie of searchResults) {
				let option = document.createElement('a');
				option.classList.add('dropdown-item');
				option.innerHTML = renderOption(movie);
				dropdownResults.appendChild(option);
				option.addEventListener('click', () => {
					// onMovieClick(movie.imdbID, '#left-summary');
					onOptionSelect(movie);
					dropdownToggle.close();
					input.value = movie.Title;
				});
			}
			dropdownToggle.open();
		} else {
			dropdownToggle.close();
			console.log('No Results found');
		}
	};

	document.addEventListener('click', (e) => {
		if (!e.target.contains(root)) dropdownToggle.close();
	});

	input.addEventListener('input', debounce(onInput, 600));
};
