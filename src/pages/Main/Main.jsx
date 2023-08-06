import { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";

import Select, { components, createFilter } from "react-select";
import Calendar from "react-calendar";
import "./Calendar.css";
import search from "../../assets/icons/search.svg";
import noNameFlag from "../../assets/icons/icon-flag.png";

const Main = ({ currencies = null, countryCodes }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedCurrencyForPeriod, setSelectedCurrencyForPeriod] = useState();
  const [selectedCurrencyRate, setSelectedCurrencyRate] = useState();
  const [valueFrom, setValueFrom] = useState();
  const [valueTo, setValueTo] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [currenciesRateOnDate, setCurrenciesRateOnDate] = useState([]);

  function changeDate(date) {
    setSelectedDate(date);
    fetchAllRates(date);
    if (selectedCurrency != null) {
      const currencyForPeriod = getCurrencyByDate(selectedCurrency, date);
      setSelectedCurrencyForPeriod(currencyForPeriod);
      fetchRate(selectedCurrency, currencyForPeriod, date);
    }
  }

  function selectCurrency(currency) {
    setSelectedCurrency(currency);
    const currencyForPeriod = getCurrencyByDate(currency, selectedDate);
    setSelectedCurrencyForPeriod(currencyForPeriod);

    const currencyValidityPeriod = resolveCurrencyPeriod(currency);
    setMinDate(currencyValidityPeriod[0]);
    setMaxDate(currencyValidityPeriod[1]);
    fetchRate(currency, currencyForPeriod, selectedDate);
  }

  function getCurrencyByDate(currency, date) {
    return currency.Periods.find(
      (value) => date >= value.Cur_DateStart && date <= value.Cur_DateEnd
    );
  }

  function fetchRate(currency, currencyForPeriod, date) {
    if (currencyForPeriod === undefined) {
      return;
    }

    const dateString =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const apiUrl =
      "https://api.nbrb.by/exrates/rates/" +
      currencyForPeriod.Cur_ID +
      "?ondate=" +
      dateString;
    axios.get(apiUrl).then((resp) => {
      setSelectedCurrencyRate(resp.data.Cur_OfficialRate);
      setValueTo((valueFrom / resp.data.Cur_OfficialRate).toFixed(4));
    });
  }

  function fetchAllRates(date = new Date()) {
    const dateString =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const apiUrl =
      "https://api.nbrb.by/exrates/rates/?periodicity=0&ondate=" + dateString;
    axios.get(apiUrl).then((resp) => {
      setCurrenciesRateOnDate(resp.data);
    });
  }

  function calculateValueFrom(event) {
    setValueTo(event.target.value);
    setValueFrom((event.target.value * selectedCurrencyRate).toFixed(4));
  }

  function calculateValueTo(event) {
    setValueFrom(event.target.value);
    setValueTo((event.target.value / selectedCurrencyRate).toFixed(4));
  }

  function resolveCurrencyPeriod(currency) {
    let minDate = null,
      maxDate = null;
    currency.Periods.forEach((elem) => {
      if (minDate == null || minDate > elem.Cur_DateStart) {
        minDate = elem.Cur_DateStart;
      }

      if (maxDate == null || maxDate < elem.Cur_DateEnd) {
        maxDate = elem.Cur_DateEnd;
      }
    });

    console.log(minDate);

    return [minDate, maxDate];
  }

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    matchFrom: "any",
    stringify: (option) => `${option.data.Cur_Name}`,
    trim: false,
  };

  useEffect(() => {
    fetchAllRates(selectedDate);
  }, [selectedDate]);

  return (
    <main className="main">
      <h1>Калькулятор валют</h1>
      <div className="text_instruction">
        <p>
          * — Для начала конверсии валюты, из выпадающего списка выберите ее
          название.
        </p>
        <p>
          — Для ввода количества рублей (числа), либо количества валюты (числа),
          используйте соответствующие поля.
        </p>
        <p>
          — Узнать конверсию валюты на прошедшую дату можно выбрав ee на
          календаре (по умолчанию используется текущая дата и последние
          сформированные курсы валют).
        </p>
      </div>
      <div className="calculator_section">
        <div className="on_date">
          <Calendar
            defaultValue={selectedDate}
            onChange={changeDate}
            maxDate={maxDate < new Date() ? maxDate : new Date()}
            minDate={minDate}
          />
        </div>
        <form>
          <div className="selection_field">
            <div>
              <p>
                <input
                  className="cell-BYN"
                  type="number"
                  name="cell-BYN"
                  onChange={calculateValueTo}
                  value={valueFrom}
                  disabled={selectedCurrencyForPeriod === undefined}
                  placeholder="кол-во рублей"
                />
              </p>
              <p>
                <input
                  className="cell-currency"
                  type="number"
                  name="cell-currency"
                  value={valueTo}
                  onChange={calculateValueFrom}
                  disabled={selectedCurrencyForPeriod === undefined}
                  placeholder="кол-во валюты"
                />
              </p>
            </div>
            <div className="block_select">
              <p>
                <img
                  src={"https://www.nbrb.by/i/flags/flags/4x3/BY.svg"}
                  style={{ width: 36 }}
                />
                Белорусских рублей
              </p>
              <Select
                options={Object.values(currencies)}
                getOptionLabel={(option) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        countryCodes[option.Cur_Abbreviation]
                          ? "https://www.nbrb.by/i/flags/flags/4x3/" +
                            countryCodes[option.Cur_Abbreviation] +
                            ".svg"
                          : noNameFlag
                      }
                      style={{ width: 36 }}
                    />
                    <span style={{ marginLeft: 5 }}>
                      {option.Cur_Name} ({option.Cur_Abbreviation})
                    </span>
                  </div>
                )}
                onChange={selectCurrency}
                placeholder="* выберите валюту"
                filterOption={createFilter(filterConfig)}
              />
            </div>
          </div>
          <div
            style={{ display: selectedCurrency ? "block" : "none" }}
            className="result"
          >
            {selectedCurrencyForPeriod &&
              `${selectedCurrencyForPeriod.Cur_Scale} ${selectedCurrency.Cur_Abbreviation} = ${selectedCurrencyRate} BYN`}
          </div>
        </form>
      </div>

      <div className="container-table">
        <table>
          <thead>
            <tr>
              <th>
                <h3>Наименование иностранной валюты</h3>
              </th>
              <th>
                <h3>Количество единиц, код валюты</h3>
              </th>
              <th>
                <h3>Официальный курс</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            {currenciesRateOnDate.map((item) => {
              return (
                <tr key={item.Cur_ID}>
                  <td>
                    <img
                      src={
                        countryCodes[item.Cur_Abbreviation]
                          ? "https://www.nbrb.by/i/flags/flags/4x3/" +
                            countryCodes[item.Cur_Abbreviation] +
                            ".svg"
                          : noNameFlag
                      }
                      style={{ width: 36 }}
                    />
                    {item.Cur_Name}
                  </td>
                  <td data-label="Кол-во">
                    {item.Cur_Scale} {item.Cur_Abbreviation}
                  </td>
                  <td data-label="Курс">{item.Cur_OfficialRate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default Main;
