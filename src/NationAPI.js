import { useCallback, useState } from "react";

function NationAPI() {
  let [data, setData] = useState();
  let [userInput, setUserInput] = useState();

  // takes in user input
  const onChangeUserInput = useCallback((e) => {
    setUserInput(e.target.value);
  }, []);

  // fetch nationality data from 2 different APIs
  const fetchData = useCallback(async () => {
    // we are only extracting country ID from this
    let responseID = await fetch(
      "https://api.nationalize.io/?name=" + userInput
    );
    let newDataID = await responseID.json();

    // allow for 2 possibilities of country
    let countryID1 = newDataID.country[0].country_id;
    let countryID2 = newDataID.country[1].country_id;

    // because the API has got a typo where 'SQ' is supposed to be 'SG'
    if (countryID1 === "SQ") {
      countryID1 = "SG";
    }
    if (countryID2 === "SQ") {
      countryID2 = "SG";
    }

    // we are using the country ID extracted to fetch country information from this endpoint, including country name
    let responseName1 = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" + countryID1
    );

    let responseName2 = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" + countryID2
    );

    let newDataName1 = await responseName1.json();
    let newDataName2 = await responseName2.json();

    try {
      const countryName1 = JSON.stringify(
        newDataName1[0].name.common
      ).replaceAll('"', "");

      const countryName2 = JSON.stringify(
        newDataName2[0].name.common
      ).replaceAll('"', "");

      const textString = `${userInput} is from ${countryName1}...\nOR maybe ${countryName2}`;
      setData(textString);
    } catch (error) {
      console.error(error);
    }
  }, [userInput]);

  return (
    <div className="main-container">
      <div className="sub-container">
        <h2>Nationality Checker</h2>
        <div>
          <input
            className="input-box"
            type="text"
            id="user-input"
            placeholder="Your Name Here"
            onChange={onChangeUserInput}
          ></input>
        </div>
        <div>
          <button className="search-button" type="button" onClick={fetchData}>
            Search For Nationality
          </button>
        </div>
        <div className="result-box">{data}</div>
      </div>
    </div>
  );
}

export default NationAPI;
