import React from 'react';
import {View, Text} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Adopcciones from '../screens/Adopcciones/Adopcciones';

const Stack = createStackNavigator();

export default function SearchStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="adopcciones"
                component={Adopcciones}
                options={{title: "Mascotas para Adoptar"}}
            />
        </Stack.Navigator>
    );
};
