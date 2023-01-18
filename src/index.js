import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box'); 
const countryList = document.querySelector('.country-list'); 
const countryInfo = document.querySelector('.country-info'); 
 
inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY)); 
 
function onInput() {  
    if (inputEl.value !== "") {
        const countryValue = inputEl.value.trim()
        API.fetchCountries(countryValue)
            .then(renderCountries)
            .catch(onError);
    }
    
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
}; 

function renderCountries(countries) {
    if (countries.length > 10) {
        Notiflix.Notify.success("Too many matches found. Please enter a more specific name.");
    } else if (countries.length > 1) {
        const markupCountryList = countries.map(({ name, flags }) =>
            `<li class="country-list country-list__item">
                <img class="country-list__item-flag" src="${flags.svg}"alt="flag" width="40">
                <span>${name.official}</span>
            </li>`).join('');
        countryList.innerHTML = markupCountryList;
    } else {
        countryList.innerHTML = ""
        const markupCountryInfo = countries.map(({ name, capital, population, flags, languages }) => 
            `<div class="country-head">
                <img src="${flags.svg}" alt="flag" width="40">
                <h1 class="country-name">${name.official}</h1>
            </div>
            <ul class="country-list field-list">
                <li class="field-list-item"><span class="field">capital: </span>${capital}</li>
                <li class="field-list-item"><span class="field">population: </span>${population}</li>
                <li class="field-list-item"><span class="field">languages: </span>${Object.values(languages)}</li>
            </ul>`).join('');
        countryInfo.innerHTML = markupCountryInfo;
    }
};

function onError(error) { 
    Notiflix.Notify.failure("Oops, there is no country with that name");;
};