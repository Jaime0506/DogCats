import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import AnimalsStack from "./AnimalsStack";
import SearchStack from "./SearchStack";
import InfoStack from "./InfoStack";
import AccountStack from "./AccountStack";

const Tab = createBottomTabNavigator();

export default function Navigation(){
    return(
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="account"
                tabBarOptions={{
                    inactiveTintColor: "#646464",
                    activeTintColor: "#FF6800"
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color })=> screenOption(route,color),
                })}
            >
                <Tab.Screen
                    name="animals"
                    component={AnimalsStack}
                    options={{title: "Animales"}}
                />
                <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{title: "Buscar"}}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{title: "Cuenta"}}
                />
                <Tab.Screen
                    name="info"
                    component={InfoStack}
                    options={{title: "Info"}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
function screenOption(route,color) {
    let iconName;

    switch (route.name) {
        case "animals":
            iconName = "dog"
            break;
        case "search":
            iconName = "magnify"  
            break;
        case "account":
            iconName = "account"
            break;
        case "info":
            iconName = "information-outline"
            break;          
    }
    return(
        <Icon type="material-community" name={iconName} size={22} color={color}/>
    )
}