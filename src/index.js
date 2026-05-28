import React from "react";
import ReactDOM from "react-dom";
import { Suspense } from "react";
import "./index.css";
import Loading from "./components/Loading";
import App from "./App";

import "./i18n";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root"),
);
