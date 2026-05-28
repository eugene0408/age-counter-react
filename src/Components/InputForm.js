import { useState, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import ArrowButton from "./ArrowButton";

const InputForm = ({
  userInput,
  setUserInput,
  saveUserInput,
  curDate,
  curYear,
  leapYars,
  setInputDate,
  setDisplayed,
}) => {
  const { t } = useTranslation();

  // States
  const [inputDayClassName, setInputDayClassName] = useState("date-input");
  const [inputYearClassName, setInputYearClassName] = useState("date-input");
  const [maxDays, setMaxDays] = useState(31);

  // Effect
  useEffect(() => {
    changeDateHandler();
  }, [userInput]);

  useEffect(() => {
    checkMaxDays();
  }, [maxDays, userInput]);

  const inputDay = userInput.day,
    inputMonth = userInput.month,
    inputYear = userInput.year,
    inputHour = userInput.hour,
    inputMinute = userInput.minute;

  const saveDay = saveUserInput.day,
    saveYear = saveUserInput.year,
    saveHour = saveUserInput.hour,
    saveMinute = saveUserInput.minute;

  const setUserInputProp = (prop, value) => {
    setUserInput({ ...userInput, [prop]: value });
  };

  // Months list for react-select
  const months = [
    { value: "1", label: t("mon.jan") },
    { value: "2", label: t("mon.feb") },
    { value: "3", label: t("mon.mar") },
    { value: "4", label: t("mon.apr") },
    { value: "5", label: t("mon.may") },
    { value: "6", label: t("mon.jun") },
    { value: "7", label: t("mon.jul") },
    { value: "8", label: t("mon.aug") },
    { value: "9", label: t("mon.sep") },
    { value: "10", label: t("mon.oct") },
    { value: "11", label: t("mon.nov") },
    { value: "12", label: t("mon.dec") },
  ];

  // Styles for react-select
  const selectStyles = {
    control: () => ({
      width: 100,
      height: 50,
      background: "#fff",
      borderRadius: 10,
      fontSize: 20,
      display: "flex",
      flexDirection: "row",
    }),
    valueContainer: () => ({
      width: "60%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),

    input: () => ({
      display: "none",
    }),
    indicatorsContainer: () => ({
      width: "40%",
      display: "flex",
      alignItems: "center",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided, state) => ({
      ...provided,
      borderRadius: 10,
    }),
  };

  // Set max days for every month
  const changeDateHandler = () => {
    switch (true) {
      case [4, 6, 9, 11].includes(inputMonth):
        setMaxDays(30);
        break;
      case inputMonth === 2 && leapYars.includes(Number(inputYear)):
        setMaxDays(29);
        break;
      case inputMonth === 2:
        setMaxDays(28);
        break;
      default:
        setMaxDays(31);
    }
  };

  // Set max and min values for inputs & set values to states
  const inputDateHandler = (min, max, saved) => {
    return (e) => {
      switch (true) {
        case e.target.value > max:
          e.target.value = max;
          break;
        case e.target.value === "" ||
          e.target.value == null ||
          e.target.value === undefined ||
          isNaN(e.target.value):
          e.target.value = saved;
          break;
        case e.target.value < min:
          e.target.value = min;
          break;
        default:
          return;
      }

      if (max === curYear) {
        setUserInputProp("year", e.target.value);
      }

      if (max === 31) {
        setUserInputProp("day", e.target.value);
      }
    };
  };

  const inputTimeHandler = (max, saved) => {
    return (e) => {
      switch (true) {
        case e.target.value < 10 && e.target.value.length === 1:
          e.target.value = `0${e.target.value}`;
          break;
        case e.target.value > max:
          e.target.value = max;
          break;
        case e.target.value === "" ||
          isNaN(e.target.value) ||
          e.target.value === undefined ||
          e.target.value == null:
          e.target.value = saved;
          break;
        case e.target.value < 0:
          e.target.value = "00";
          break;
        default:
          return;
      }

      if (max === 23) {
        setUserInputProp("hour", e.target.value);
      }

      if (max === 59) {
        setUserInputProp("minute", e.target.value);
      }
    };
  };

  // Checking max posible days value in input month
  const checkMaxDays = () => {
    if (inputDay > maxDays) {
      setInputDayClassName("date-input input-error");
      return false;
    } else {
      setInputDayClassName("date-input");
      return true;
    }
  };

  // Clear input
  const clearValue = (e) => {
    e.target.value = "";
  };

  const startButtonHandler = (e) => {
    e.preventDefault();
    // Set input values to date
    let usrDate = new Date(
      `${inputMonth},${inputDay},${inputYear},${inputHour}:${inputMinute}`,
    );
    setInputDate(usrDate);

    // Check the date is right and display result
    if (checkMaxDays() && curDate - usrDate >= 0) {
      setDisplayed("result");
    }

    if (curDate < usrDate) {
      setInputYearClassName("date-input input-error");
    }
  };

  return (
    <>
      <h2 className="main-header">{t("form.title")}</h2>

      <form className="input-form flex-col-wrapper">
        <div className="date-form">
          <DateInput
            label={t("form.day")}
            className={inputDayClassName}
            value={inputDay}
            onChange={(e) => setUserInputProp("day", e.target.value)}
            onFocus={clearValue}
            onBlur={inputDateHandler(1, 31, saveDay)}
          />

          <div className="flex-col-wrapper">
            <label> {t("form.month")} </label>

            <Select
              options={months}
              styles={selectStyles}
              value={months[inputMonth - 1]}
              onChange={(e) => {
                setUserInputProp("month", Number(e.value));
              }}
            />
          </div>

          <DateInput
            label={t("form.year")}
            className={inputYearClassName}
            value={inputYear}
            onChange={(e) => {
              setUserInputProp("year", e.target.value);
              setInputYearClassName("date-input");
            }}
            onFocus={clearValue}
            onBlur={inputDateHandler(1900, curYear, saveYear)}
          />
        </div>

        <div className="time-header">
          <h2>
            <span className="yellow">&</span>
            {t("form.time")}
          </h2>
          <span className="optional">({t("form.optional")})</span>
        </div>

        <div className="time-form">
          <DateInput
            label={t("form.hour")}
            className="time-input"
            value={inputHour}
            onChange={(e) => setUserInputProp("hour", e.target.value)}
            onFocus={clearValue}
            onBlur={inputTimeHandler(23, saveHour)}
          />

          <div className="time-colon">
            <span>:</span>
          </div>

          <DateInput
            label={t("form.minute")}
            className="time-input"
            value={inputMinute}
            onChange={(e) => setUserInputProp("minute", e.target.value)}
            onFocus={clearValue}
            onBlur={inputTimeHandler(59, saveMinute)}
          />
        </div>

        <ArrowButton className={"start-button"} handler={startButtonHandler} />
      </form>
    </>
  );
};

const DateInput = ({ label, className, value, onChange, onFocus, onBlur }) => {
  return (
    <div className="flex-col-wrapper">
      <label>{label}</label>

      <input
        className={className}
        type="number"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default InputForm;
