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
const renderSelect = () => {
    for (let i = 0; i < dropList.length; i++) {
        for (currentCode in country_list) {
            let selected = i == 0 ? currentCode == "USD" ? "selected" : "" : currentCode == "VND" ? "selected" : "";
            let optionTag = `
            <option value="${currentCode}" ${selected}>${currentCode}</option>
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
    for (code in country_list) {
        if (code == element.value) {
            const imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`
        }
    }
}

// Render on load
renderSelect();

const convertCountry = () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
}

// Event click exchange icon
exchangeIcon.addEventListener('click', convertCountry);


const getExchangeRate = async() => {
    // Default value = 1
    if (amountInput.value == "" || amountInput.value == "0") {
        amountInput.value = "1";
    }
    // when call api 
    textExchange.innerText = "Getting exchange rate....";
    try {
        const apiUrl = `https://v6.exchangerate-api.com/v6/174cc3231a6d86444de77333/latest/${fromCurrency.value}`;
        const response = await axios.get(apiUrl)
        const rateList = response.data.conversion_rates;
        const exchangeRate = toCurrency.value;
        let totalExRate = (amountInput.value * rateList[exchangeRate]).toFixed(2);
        textExchange.innerText = `${amountInput.value} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    } catch (error) {
        // If api error 
        textExchange.innerText = 'Something went wrong';
    }
}

// Event load to check rate
window.addEventListener('load', getExchangeRate);

// Event button
exchangeBtn.addEventListener('click', getExchangeRate);