import { useState, useRef, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { useTranslation } from "react-i18next";
// Icons
import sunIcon from "./img/sun.svg";
import moonIcon from "./img/moon.svg";
import engIcon from "./img/eng.svg";
import ukrIcon from "./img/ukr.svg";
import czeIcon from "./img/czech.svg";
// Components
import InputForm from "./components/InputForm";
import Result from "./components/Result";
import About from "./components/About";
import "./Fonts.css";
import "./App.css";

function App() {
  // Themes change
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light",
  );

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // States
  const [displayed, setDisplayed] = useState("input"); //display input/result
  const [aboutButton, setAboutButton] = useState(true);
  // User input in form
  const [userInput, setUserInput] = useState({
    day: 1,
    month: 1,
    year: 1900,
    hour: "00",
    minute: "00",
  });
  // User input converted in date format
  const [inputDate, setInputDate] = useState();

  const curDate = new Date();
  const curYear = curDate.getFullYear();

  // Save data to local storage
  const [saveUserInput, setSaveUserInput] = useLocalStorage("userInput", null);

  useEffect(() => {
    setSaveUserInput(userInput);
  }, [userInput]);

  useEffect(() => {
    saveUserInput ? setUserInput(saveUserInput) : setUserInput(userInput);
  }, []);

  // Leap years
  let leapYars = [];

  const setLeapYears = () => {
    for (let i = 1900; i <= curYear; i = i + 4) {
      leapYars.push(i);
    }
  };

  setLeapYears();

  const aboutClickHandler = () => {
    setDisplayed("about");
    setAboutButton(false);
  };

  return (
    <div className="App" data-theme={theme}>
      <LangSelect />

      {/* Change theme */}
      <button className="switch-theme-btn" onClick={switchTheme}>
        <img src={theme === "light" ? sunIcon : moonIcon} alt="light/dark" />
      </button>

      {aboutButton && (
        <button className="about-button" onClick={aboutClickHandler}>
          i
        </button>
      )}

      {displayed === "input" && (
        <InputForm
          userInput={userInput}
          setUserInput={setUserInput}
          saveUserInput={saveUserInput}
          curDate={curDate}
          curYear={curYear}
          leapYars={leapYars}
          inputDate={inputDate}
          setInputDate={setInputDate}
          displayed={displayed}
          setDisplayed={setDisplayed}
        />
      )}

      {displayed === "result" && (
        <Result
          userInput={userInput}
          curDate={curDate}
          curYear={curYear}
          leapYars={leapYars}
          inputDate={inputDate}
          displayed={displayed}
          setDisplayed={setDisplayed}
        />
      )}

      {displayed === "about" && (
        <About
          displayed={displayed}
          setDisplayed={setDisplayed}
          aboutButton={aboutButton}
          setAboutButton={setAboutButton}
        />
      )}
    </div>
  );
}

const LangSelect = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const langSwitch = useRef(),
    engButton = useRef(),
    ukrButton = useRef(),
    czeButton = useRef();

  const displayCurLangIcon = () => {
    switch (true) {
      case [
        "en",
        "en-US",
        "en-us",
        "en-GB",
        "en-AU",
        "en-CA",
        "en-NZ",
      ].includes(i18n.language):
        return { backgroundImage: `url(${engIcon})` };

      case ["uk", "uk-UA", "uk-ua", "ru", "ru-RU"].includes(i18n.language):
        return { backgroundImage: `url(${ukrIcon})` };

      case ["cs"].includes(i18n.language):
        return { backgroundImage: `url(${czeIcon})` };

      default:
        return { backgroundImage: `url(${engIcon})` };
    }
  };

  const langClickHandler = () => {
    langSwitch.current.classList.toggle("hide");
    langSwitch.current.classList.toggle("show");

    [ukrButton, engButton, czeButton].forEach((el) => {
      el.current.classList.toggle("show");
      el.current.classList.toggle("hide");
    });
  };

  const langSelectorBlur = () => {
    if (langSwitch.current.classList.contains("hide")) {
      langClickHandler();
    }
  };

  return (
    <div className="language-selector" onBlur={langSelectorBlur}>
      <div
        className="language-button__current language-button show"
        style={displayCurLangIcon()}
        ref={langSwitch}
        onClick={langClickHandler}
      ></div>

      <button
        className="language-button hide"
        style={{ backgroundImage: `url(${engIcon})` }}
        onClick={() => {
          changeLanguage("en");
          langClickHandler();
        }}
        ref={engButton}
      ></button>

      <button
        className="language-button hide"
        style={{ backgroundImage: `url(${ukrIcon})` }}
        onClick={() => {
          changeLanguage("uk");
          langClickHandler();
        }}
        ref={ukrButton}
      ></button>

      <button
        className="language-button hide"
        style={{ backgroundImage: `url(${czeIcon})` }}
        onClick={() => {
          changeLanguage("cs");
          langClickHandler();
        }}
        ref={czeButton}
      ></button>
    </div>
  );
};

export default App;
