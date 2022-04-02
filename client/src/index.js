import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter, Routes, Route} from "react-router-dom";

ReactDOM.render(<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />}>
      <Route index="index" element={<Home />}/>
      <Route path="chat" element={<Chat />}/>
      <Route path="terms-and-conditions" element={<TermsAndConditions />}/>
      <Route path="privacy-policy" element={<PrivacyPolicy />}/>
    </Route>
    <Route path="*" element={<NotFound />}/>
  </Routes>
</BrowserRouter>, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
