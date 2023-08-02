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

  useEffect(() => {
    const apiUrl = "https://api.nbrb.by/exrates/rates?periodicity=0";
    axios.get(apiUrl).then((resp) => {
      setCurrencies(resp.data);
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
