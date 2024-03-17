import { useCallback, useState } from "react";

function NationAPI() {
  let [data, setData] = useState();
  let [userInput, setUserInput] = useState();

  // takes in user input
  const onChangeUserInput = useCallback((e) => {
    setUserInput(e.target.value);
  }, []);

  // fetch nationality data
  const fetchData = useCallback(async () => {
    let responseID = await fetch(
      "https://api.nationalize.io/?name=" + userInput
    );
    let newDataID = await responseID.json();

    console.log(newDataID);
    let responseName = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" +
        newDataID.country[0].country_id
    );
    let newDataName = await responseName.json();

    try {
      const countryName = JSON.stringify(newDataName[0].name.common).replaceAll(
        '"',
        ""
      );
      const textString = `${userInput} is from ${countryName}`;
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
