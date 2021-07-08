import React, { useEffect } from 'react';
import Navigation from "./app/navigatios/Navigation";
import {YellowBox, LogBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  return (
    <Navigation/>
  );
}
