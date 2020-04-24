const autocompleteConfig = {
	fetchData: async (searchTerm) => {
		const countries = [
			'Afghanistan',
			'Albania',
			'Algeria',
			'Andorra',
			'Angola',
			'Anguilla',
			'Antigua & Barbuda',
			'Argentina',
			'Armenia',
			'Aruba',
			'Australia',
			'Austria',
			'Azerbaijan',
			'Bahamas',
			'Bahrain',
			'Bangladesh',
			'Barbados',
			'Belarus',
			'Belgium',
			'Belize',
			'Benin',
			'Bermuda',
			'Bhutan',
			'Bolivia',
			'Bosnia & Herzegovina',
			'Botswana',
			'Brazil',
			'British Virgin Islands',
			'Brunei',
			'Bulgaria',
			'Burkina Faso',
			'Burundi',
			'Cambodia',
			'Cameroon',
			'Canada',
			'Cape Verde',
			'Cayman Islands',
			'Central Arfrican Republic',
			'Chad',
			'Chile',
			'China',
			'Colombia',
			'Congo',
			'Cook Islands',
			'Costa Rica',
			'Cote D Ivoire',
			'Croatia',
			'Cuba',
			'Curacao',
			'Cyprus',
			'Czech Republic',
			'Denmark',
			'Djibouti',
			'Dominica',
			'Dominican Republic',
			'Ecuador',
			'Egypt',
			'El Salvador',
			'Equatorial Guinea',
			'Eritrea',
			'Estonia',
			'Ethiopia',
			'Falkland Islands',
			'Faroe Islands',
			'Fiji',
			'Finland',
			'France',
			'French Polynesia',
			'French West Indies',
			'Gabon',
			'Gambia',
			'Georgia',
			'Germany',
			'Ghana',
			'Gibraltar',
			'Greece',
			'Greenland',
			'Grenada',
			'Guam',
			'Guatemala',
			'Guernsey',
			'Guinea',
			'Guinea Bissau',
			'Guyana',
			'Haiti',
			'Honduras',
			'Hong Kong',
			'Hungary',
			'Iceland',
			'India',
			'Indonesia',
			'Iran',
			'Iraq',
			'Ireland',
			'Isle of Man',
			'Israel',
			'Italy',
			'Jamaica',
			'Japan',
			'Jersey',
			'Jordan',
			'Kazakhstan',
			'Kenya',
			'Kiribati',
			'Kosovo',
			'Kuwait',
			'Kyrgyzstan',
			'Laos',
			'Latvia',
			'Lebanon',
			'Lesotho',
			'Liberia',
			'Libya',
			'Liechtenstein',
			'Lithuania',
			'Luxembourg',
			'Macau',
			'Macedonia',
			'Madagascar',
			'Malawi',
			'Malaysia',
			'Maldives',
			'Mali',
			'Malta',
			'Marshall Islands',
			'Mauritania',
			'Mauritius',
			'Mexico',
			'Micronesia',
			'Moldova',
			'Monaco',
			'Mongolia',
			'Montenegro',
			'Montserrat',
			'Morocco',
			'Mozambique',
			'Myanmar',
			'Namibia',
			'Nauro',
			'Nepal',
			'Netherlands',
			'Netherlands Antilles',
			'New Caledonia',
			'New Zealand',
			'Nicaragua',
			'Niger',
			'Nigeria',
			'North Korea',
			'Norway',
			'Oman',
			'Pakistan',
			'Palau',
			'Palestine',
			'Panama',
			'Papua New Guinea',
			'Paraguay',
			'Peru',
			'Philippines',
			'Poland',
			'Portugal',
			'Puerto Rico',
			'Qatar',
			'Reunion',
			'Romania',
			'Russia',
			'Rwanda',
			'Saint Pierre & Miquelon',
			'Samoa',
			'San Marino',
			'Sao Tome and Principe',
			'Saudi Arabia',
			'Senegal',
			'Serbia',
			'Seychelles',
			'Sierra Leone',
			'Singapore',
			'Slovakia',
			'Slovenia',
			'Solomon Islands',
			'Somalia',
			'South Africa',
			'South Korea',
			'South Sudan',
			'Spain',
			'Sri Lanka',
			'St Kitts & Nevis',
			'St Lucia',
			'St Vincent',
			'Sudan',
			'Suriname',
			'Swaziland',
			'Sweden',
			'Switzerland',
			'Syria',
			'Taiwan',
			'Tajikistan',
			'Tanzania',
			'Thailand',
			"Timor L'Este",
			'Togo',
			'Tonga',
			'Trinidad & Tobago',
			'Tunisia',
			'Turkey',
			'Turkmenistan',
			'Turks & Caicos',
			'Tuvalu',
			'Uganda',
			'Ukraine',
			'United Arab Emirates',
			'United Kingdom',
			'United States of America',
			'Uruguay',
			'Uzbekistan',
			'Vanuatu',
			'Vatican City',
			'Venezuela',
			'Vietnam',
			'Virgin Islands (US)',
			'Yemen',
			'Zambia',
			'Zimbabwe'
		];
		const response = countries
			.filter((val) => val.toLowerCase().includes(searchTerm.trim().toLowerCase()))
			.sort((a, b) => a - b);
		return response;
	},

	renderOption: (country) => {
		// country === 'N/A' ? (country = '/images/not_found.png') : country;
		return `<h1>${country}</h1>`;
	}
};
let leftSide, rightSide;
const onCountrySelect = async (country, target, side) => {
	const response = await axios.get('https://covid19-api.com/country/', {
		params: {
			name: country,
			format: 'json'
		},
		headers: {
			'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
			'x-rapidapi-key': '69f06025ffmshe14c95a81281d5dp165df7jsnc03b356a1ec8'
		}
	});
	target.innerHTML = movieTemplate(response.data[0]);

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
		if (
			leftStats[index].nextElementSibling &&
			leftStats[index].nextElementSibling.innerHTML === 'Recovered' &&
			leftSideValue < rightSideValue
		) {
			leftStat.parentElement.classList.remove('is-primary');
			leftStat.parentElement.classList.add('is-danger');
			rightStat.parentElement.classList.add('is-success');
			console.log('HAPPENs');
		}
		if (leftSideValue < rightSideValue) {
			rightStat.parentElement.classList.remove('is-primary');
			rightStat.parentElement.classList.add('is-danger');
			leftStat.parentElement.classList.add('is-success');
		} else if (leftSideValue > rightSideValue) {
			leftStat.parentElement.classList.remove('is-primary');
			leftStat.parentElement.classList.add('is-danger');
			rightStat.parentElement.classList.add('is-success');
		} else if (leftSideValue === rightSideValue) {
			leftStat.parentElement.classList.remove('is-primary');
			rightStat.parentElement.classList.remove('is-primary');
			leftStat.parentElement.classList.add('is-info');
			rightStat.parentElement.classList.add('is-info');
		}
	});
};
const movieTemplate = (countryStats) => {
	const { country, confirmed, recovered, critical, deaths } = countryStats;
	const deathPercentage = (deaths / confirmed * 100).toFixed(2);
	return `
	<article class="media">
  <figure class="media-left">
    <p class="image"><img src="${country === 'N/A' ? (country = '/images/not_found.png') : country}" alt=""> </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${country}</h1>
    </div>
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
