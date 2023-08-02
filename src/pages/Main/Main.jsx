import { useState } from "react";
import "./styles.css";
import axios from "axios";

import Select, { components } from "react-select";
import Calendar from "react-calendar";
import "./Calendar.css";

const Main = ({ currencies = null, countryCodes }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedCurrencyRate, setSelectedCurrencyRate] = useState();
  const [valueFrom, setValueFrom] = useState();
  const [valueTo, setValueTo] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());

  function changeDate(date) {
    setSelectedDate(date);
    if (selectedCurrency != null) {
      fetchRate(selectedCurrency, date);
    }
  }

  function selectCurrency(currency) {
    setSelectedCurrency(currency);
    fetchRate(currency, selectedDate);
  }

  function fetchRate(currency, date = new Date()) {
    const dateString =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const apiUrl =
      "https://api.nbrb.by/exrates/rates/" +
      currency.Cur_ID +
      "?ondate=" +
      dateString;
    axios.get(apiUrl).then((resp) => {
      setSelectedCurrencyRate(resp.data.Cur_OfficialRate);
      setValueTo((valueFrom / resp.data.Cur_OfficialRate).toFixed(4));
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
            maxDate={new Date()}
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
                  disabled={selectedCurrency === null}
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
                  disabled={selectedCurrency === null}
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
                options={currencies}
                getOptionLabel={(option) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        "https://www.nbrb.by/i/flags/flags/4x3/" +
                        countryCodes[option.Cur_Abbreviation] +
                        ".svg"
                      }
                      style={{ width: 36 }}
                    />
                    <span style={{ marginLeft: 5 }}>{option.Cur_Name}</span>
                  </div>
                )}
                onChange={selectCurrency}
                placeholder="* выберите валюту"
              />
            </div>
          </div>
          <div
            style={{ display: selectedCurrency ? "block" : "none" }}
            className="result"
          >
            {selectedCurrency &&
              `${selectedCurrency.Cur_Scale} ${selectedCurrency.Cur_Abbreviation} = ${selectedCurrencyRate} BYN`}
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
            {currencies.map((item) => {
              return (
                <tr key={item.Cur_ID}>
                  <td>
                    <img
                      src={
                        "https://www.nbrb.by/i/flags/flags/4x3/" +
                        countryCodes[item.Cur_Abbreviation] +
                        ".svg"
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
