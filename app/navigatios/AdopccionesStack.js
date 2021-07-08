import React from "react";
import {View, Text} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Adopcciones from '../screens/Adopcciones/Adopcciones';
import Adopccion from "../screens/Adopcciones/Adopccion";

const Stack = createStackNavigator();

export default function SearchStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="adopcciones"
                component={Adopcciones}
                options={{title: "Mascotas para Adoptar"}}
            />
            <Stack.Screen
                name="adopccion"
                component={Adopccion}
            />
        </Stack.Navigator>
    );
};