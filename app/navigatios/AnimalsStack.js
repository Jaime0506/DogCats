import React from 'react';
import { createStackNavigator } from "@react-navigation/stack"
import {View, Text} from "react-native";
import Animals from "../screens/Animals/Animals";
import AddAnimals from "../screens/Animals/AddAnimals";
import Animal from '../screens/Animals/Animal';

const Stack = createStackNavigator();

export default function AnimalsStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="animals"
                component={Animals}
                options={{title: "Registros"}}
            />
            <Stack.Screen
                name="add-animals"
                component={AddAnimals}
                options={{title: "Crear Registro"}}
            />
            <Stack.Screen
                name="animal"
                component={Animal}
            />
        </Stack.Navigator>
    );
}