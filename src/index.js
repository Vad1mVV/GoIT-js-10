import './css/styles.css';
import { fetchCountries } from './api';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
} 

refs.searchInput.addEventListener('input', debounce(onSearchInputInput, DEBOUNCE_DELAY))

function onSearchInputInput(e) {
    fetchCountries(refs.searchInput.value.trim())
        .then(rest => {
            if (rest.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
                return
            }
            if (rest.length <= 10 && rest.length > 1) {
                createCountryListMarkup(rest);
                return
            }
            if (rest.length === 1) {
                createCountryInfoMarkup(rest);
                return
            }
            console.log(rest.length)
            
        })
        .catch((error) => {
            fullClear()
            Notiflix.Notify.failure("Oops, there is no country with that name")
        }); 
}


function createCountryListMarkup(arr) {
    fullClear()
    arr.map(({ name: {official: officialName}, flags: {svg: flagSvg, alt: flagDescribe} }) => {
        const markup = `
        <li>
            <img src="${flagSvg}" alt="${flagDescribe}" width="50">
            <h2>${officialName}</h2>
        </li>
        `
        refs.countryList.insertAdjacentHTML('beforeend', markup)
    })
}

function createCountryInfoMarkup(country) {
    fullClear()
    const { name: {official: officialName}, capital, population, flags: {svg: flagSvg, alt: flagDescribe}, languages } = country[0];
    const markup = 
    `<img src="${flagSvg}" alt="${flagDescribe}" width="50"></img>
    <h1>
        ${officialName}
    </h1> 
    <ul>
        <li>
            Capital: ${capital}
        </li>
        <li>
            Population: ${population}
        </li>
        <li>
            Languages:  ${Object.values(languages)}
        </li>
    </ul>`;
    refs.countryInfo.insertAdjacentHTML('beforeend', markup)
}

function fullClear() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}