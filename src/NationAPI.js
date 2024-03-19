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
    console.log(newDataID.country);
    // allow for 2 possibilities of country
    let countryIDs = [];

    let textString;
    if (newDataID.country.length === 0) {
      textString = `We can't locate ${userInput}...`;
      setData(textString);
    } else {
      let responseName1;
      let responseName2;
      let newDataName1;
      let newDataName2;

      for (let i = 0; i < newDataID.country.length; i++) {
        let countryID = newDataID.country[i].country_id;
        if (countryID === "SQ") {
          countryID = "SG";
        }
        countryIDs.push(countryID);
      }
      responseName1 = await fetch(
        "https://restcountries.com/v3.1/alpha?codes=" + countryIDs[0]
      );
      newDataName1 = await responseName1.json();

      if (countryIDs.length > 1) {
        responseName2 = await fetch(
          "https://restcountries.com/v3.1/alpha?codes=" + countryIDs[1]
        );
        newDataName2 = await responseName2.json();
      }
      // we are using the country ID extracted to fetch country information from this endpoint, including country name

      let countryName1;
      let countryName2;
      try {
        countryName1 = JSON.stringify(newDataName1[0].name.common).replaceAll(
          '"',
          ""
        );

        if (countryIDs.length > 1) {
          countryName2 = JSON.stringify(newDataName2[0].name.common).replaceAll(
            '"',
            ""
          );
        }
        textString =
          countryIDs.length > 1
            ? `${userInput} is from ${countryName1}...\nOR maybe ${countryName2}`
            : `${userInput} is from ${countryName1}`;
        setData(textString);
      } catch (error) {
        console.error(error);
      }
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
