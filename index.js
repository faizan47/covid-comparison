const autocompleteConfig = {
	fetchData: async (searchTerm) => {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: { apikey: '2f1b6146', s: searchTerm }
		});
		return response;
	},

	renderOption: (movie) => {
		movie.Poster === 'N/A' ? (movie.Poster = '/images/not_found.png') : movie.Poster;
		return `<img src="${movie.Poster}"><h1>${movie.Title} (${movie.Year})</h1>`;
	}
};
let leftSide, rightSide;
const onMovieSelect = async (movieId, target, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: { apikey: '2f1b6146', i: movieId }
	});
	target.innerHTML = movieTemplate(response.data);

	side === 'left' ? (leftSide = response.data) : (rightSide = response.data);
	if (leftSide && rightSide) {
		runComparision();
	}
};

const runComparision = () => {
	const leftStats = document.querySelectorAll('#left-summary .notification p');
	const rightStats = document.querySelectorAll('#right-summary .notification p');
	leftStats.forEach((leftStat, index) => {
		const rightStat = rightStats[index];

		const leftSideValue = parseFloat(leftStat.dataset.value);
		const rightSideValue = parseFloat(rightStat.dataset.value);
		if (leftSideValue > rightSideValue) {
			console.log(leftSideValue, rightSideValue);
			rightStat.parentElement.classList.remove('is-primary');
			rightStat.parentElement.classList.add('is-warning');
		} else if (leftSideValue < rightSideValue) {
			console.log(leftSideValue, rightSideValue);

			leftStat.parentElement.classList.remove('is-primary');
			leftStat.parentElement.classList.add('is-warning');
		} else if (leftSideValue === rightSideValue) {
			leftStat.parentElement.classList.remove('is-primary');
			rightStat.parentElement.classList.remove('is-primary');
			leftStat.parentElement.classList.add('is-info');
			rightStat.parentElement.classList.add('is-info');
		}
	});
};
const movieTemplate = (movie) => {
	const awards = movie.Awards;
	let awardCount = awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);
	const votes = movie.imdbVotes;
	votesExtracted = parseInt(votes.replace(/,/g, ''));
	const revenue = movie.BoxOffice;
	const revenueExtracted = parseFloat(revenue.replace(/\$/g, '').replace(/,/g, ''));
	const score = parseInt(movie.Metascore);
	const rating = parseFloat(movie.imdbRating);

	return `
	<article class="media">
  <figure class="media-left">
    <p class="image"><img src="${movie.Poster === 'N/A'
		? (movie.Poster = '/images/not_found.png')
		: movie.Poster}" alt=""> </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movie.Title} (${movie.Year})</h1>
      <h4>${movie.Genre}</h4>
      <p>${movie.Plot}</p>
    </div>
  </div>
</article>
<article class="notification is-primary">
  <p data-value="${awardCount}" class="title">${awards}</p>
  <p class="subtitle">Awards</p>
</article>
<article class="notification is-primary">
  <p data-value="${revenueExtracted}" class="title">${revenue}</p>
  <p class="subtitle">Box Office</p>
</article>
<article class="notification is-primary">
  <p data-value="${rating}" class="title">${rating}</p>
  <p class="subtitle">IMDB Rating</p>
</article>
<article class="notification is-primary">
  <p data-value="${score}" class="title">${score}</p>
  <p class="subtitle">Metascore</p>
</article>
<article class="notification is-primary">
  <p data-value="${votesExtracted}" class="title">${votes}</p>
  <p class="subtitle">Votes</p>
</article>
	`;
};
// createAutoComplete(autocompleteConfig);
createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector('.autocomplete'),
	onOptionSelect(movie) {
		onMovieSelect(movie.imdbID, document.querySelector('#left-summary'), 'left');
	}
});
createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector('.autocomplete-two'),
	onOptionSelect(movie) {
		onMovieSelect(movie.imdbID, document.querySelector('#right-summary'), 'right');
	}
});
