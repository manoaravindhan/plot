/* eslint-disable import/no-named-as-default */
import React from "react";
import PropTypes from "prop-types";
import { hot } from "react-hot-loader";
import Map from "./Map";
import Draw from './Draw';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  render() {
    return (
      <>
        <Draw/>
        <Map/>
      </>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
