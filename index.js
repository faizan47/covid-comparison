const autocompleteConfig = {
	fetchData: async (searchTerm) => {
		const countries = await axios.get(`https://restcountries.eu/rest/v2/name/${searchTerm}`);
		const response = countries.data.filter((val) => val.name.toLowerCase()).sort((a, b) => a - b);
		return response;
	},

	renderOption: (country) => {
		return `<img src=${country.flag} width="50"> <h1>${country.name}</h1>`;
	}
};
let leftSide, rightSide;
const onCountrySelect = async (country, target, side) => {
	const response = await axios.get('https://covid19-api.com/country/', {
		params: {
			name: country.name,
			format: 'json'
		},
		headers: {
			'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
			'x-rapidapi-key': '69f06025ffmshe14c95a81281d5dp165df7jsnc03b356a1ec8'
		}
	});
	target.innerHTML = countryTemplate(response.data[0], country);

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
		console.log(leftStat.innerHTML === 'Recovered');
		if (leftSideValue < rightSideValue) {
			//right side is better & greater
			if (leftStat.innerHTML !== 'Recovered') {
				rightStat.parentElement.classList.remove('is-primary');
				rightStat.parentElement.classList.add('is-danger');
				leftStat.parentElement.classList.add('is-success');
			}
		} else if (leftSideValue > rightSideValue) {
			//left side is better & greater
			if (leftStat.innerHTML !== 'Recovered') {
				leftStat.parentElement.classList.remove('is-primary');
				leftStat.parentElement.classList.add('is-danger');
				rightStat.parentElement.classList.add('is-success');
			}
		} else if (leftSideValue === rightSideValue) {
			leftStat.parentElement.classList.remove('is-primary');
			rightStat.parentElement.classList.remove('is-primary');
			leftStat.parentElement.classList.add('is-info');
			rightStat.parentElement.classList.add('is-info');
		}
	});
};

const countryTemplate = (countryStats, countryData) => {
	const { flag, population } = countryData;
	const { country, confirmed, recovered, critical, deaths } = countryStats;
	const deathPercentage = (deaths / confirmed * 100).toFixed(2);
	return `
	<div class="box">
	<article class="media">
  <figure class="media-left">
    <p class="image"><img src=${flag} width="50"> </p>
  </figure>
  <div class="media-content">
    <div class="content">
	  <h1>${country}</h1>
	  <p>Population: ${fnum(population)}</p>
    </div></div>
  </div>
</article>
<article class="notification is-primary">
  <p data-value="${confirmed}" class="title">${confirmed}</p>
  <p class="subtitle">Confirmed</p>
</article>
<article class="notification is-primary">
  <p data-value="${recovered}" class="title">${recovered}</p>
  <p class="subtitle">Recovered</p>
</article>
<article class="notification is-primary">
  <p data-value="${critical}" class="title">${critical}</p>
  <p class="subtitle">Critical</p>
</article>
<article class="notification is-primary">
  <p data-value="${deaths}" class="title">${deaths}</p>
  <p class="subtitle">Deaths</p>
</article>
<article class="notification is-primary">
  <p data-value="${deathPercentage}%" class="title">${deathPercentage}%</p>
  <p class="subtitle">Death Percentage</p>
</article>
	`;
};
// createAutoComplete(autocompleteConfig);
createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector('.autocomplete'),
	onOptionSelect(country) {
		onCountrySelect(country, document.querySelector('#left-summary'), 'left');
	}
});
createAutoComplete({
	...autocompleteConfig,
	root: document.querySelector('.autocomplete-two'),
	onOptionSelect(country) {
		onCountrySelect(country, document.querySelector('#right-summary'), 'right');
	}
});
