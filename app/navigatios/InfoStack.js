import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import {View, Text} from "react-native";
import Info from "../screens/Info/Info";


const Stack = createStackNavigator();

export default function InfoStack(){
        
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="info"
                component={Info}
                options={{title: "Informacion"}}                
            />
        </Stack.Navigator>
    );
}
