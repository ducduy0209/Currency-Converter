const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const amountInput = $('input');
const dropList = $$('select');
const fromCurrency = $('.box-from select');
const toCurrency = $('.box-to select');
const textExchange = $('.text-exchange');
const exchangeBtn = $('.btn-exchange');
const exchangeIcon = $('.icon-convert');

// Render select 
const renderOption = () => {
    for (let i = 0; i < dropList.length; i++) {
        for (currentCountry in country_list) {
            let selected = i == 0 ? currentCountry == "USD" ? "selected" : "" : currentCountry == "VND" ? "selected" : "";
            let optionTag = `
            <option value="${currentCountry}" ${selected}>${currentCountry}</option>
            `
            dropList[i].insertAdjacentHTML("beforeend", optionTag);
        }
        dropList[i].addEventListener('change', e => {
            loadFlag(e.target);
        })
    }
}

// Load flag country
const loadFlag = element => {
    for (key in country_list) {
        if (key == element.value) {
            const imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[key].toLowerCase()}.png`;
        }
    }
}

// Render on load
renderOption();


const convertCountry = () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
}

const getExchangeRate = async() => {
    // Default value = 1
    if (amountInput.value == "" || amountInput.value == "0") {
        amountInput.value = "1";
    }
    // when call api 
    textExchange.innerText = "Getting exchange rate....";
    try {
        const apiUrl = `https://v6.exchangerate-api.com/v6/174cc3231a6d86444de77333/latest/${fromCurrency.value}`;
        const response = await axios.get(apiUrl);
        const rateList = response.data.conversion_rates;
        const exchangeRate = toCurrency.value;
        const total = (amountInput.value * rateList[exchangeRate]);
        const totalExRate = total >= 1 ? total.toFixed(2) : total.toFixed(5);
        textExchange.innerText = `${amountInput.value} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    } catch (error) {
        // If api error 
        textExchange.innerText = 'Something went wrong';
    }
}

// Event click exchange icon
exchangeIcon.addEventListener('click', convertCountry);

// Event load to check rate
window.addEventListener('load', getExchangeRate);

// Event button
exchangeBtn.addEventListener('click', getExchangeRate);