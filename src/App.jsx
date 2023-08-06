import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Header from "./components/Header/Header";
import Main from "./pages/Main/Main";
import CountryCodes from "./assets/json/country-codes.json";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const countryCodesMap = {};
  CountryCodes.forEach(function (elem) {
    countryCodesMap[elem["ISO4217-currency_alphabetic_code"]] =
      elem["ISO3166-1-Alpha-2"];
  });

  function convertCurrencies(currenciesResponse) {
    const currencies = {};

    currenciesResponse
      .sort((a, b) => (a.Cur_Name > b.Cur_Name ? 1 : -1))
      .forEach((elem) => {
        if (currencies[elem.Cur_Abbreviation] != null) {
          currencies[elem.Cur_Abbreviation].Periods = [
            ...currencies[elem.Cur_Abbreviation].Periods,
            {
              Cur_DateStart: new Date(elem.Cur_DateStart),
              Cur_DateEnd: new Date(elem.Cur_DateEnd),
              Cur_ID: elem.Cur_ID,
              Cur_Scale: elem.Cur_Scale,
              Cur_ParentID: elem.Cur_ParentID,
            },
          ];
        } else {
          currencies[elem.Cur_Abbreviation] = {};
          currencies[elem.Cur_Abbreviation].Cur_Name = elem.Cur_Name;
          currencies[elem.Cur_Abbreviation].Cur_Code = elem.Cur_Code;
          currencies[elem.Cur_Abbreviation].Cur_Abbreviation =
            elem.Cur_Abbreviation;
          currencies[elem.Cur_Abbreviation].Periods = [
            {
              Cur_DateStart: new Date(elem.Cur_DateStart),
              Cur_DateEnd: new Date(elem.Cur_DateEnd),
              Cur_ID: elem.Cur_ID,
              Cur_Scale: elem.Cur_Scale,
              Cur_ParentID: elem.Cur_ParentID,
            },
          ];
        }
      });
    return currencies;
  }

  useEffect(() => {
    const apiUrl = "https://api.nbrb.by/exrates/currencies";
    axios.get(apiUrl).then((resp) => {
      setCurrencies(convertCurrencies(resp.data));
    });
  }, [setCurrencies]);
  return (
    <>
      <Header />
      <Main currencies={currencies} countryCodes={countryCodesMap} />
    </>
  );
}

export default App;
