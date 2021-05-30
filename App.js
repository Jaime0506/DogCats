import React from 'react';
import Navigation from "./app/navigatios/Navigation";
import {YellowBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";

YellowBox.ignoreWarnings(["Setting a timer"]);

export default function App() {
  
  return (
    <Navigation/>
  );
}
