import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../Components/Account/LoginForm";
import LoginWithFacebook from "../../Components/Account/LoginWithFacebook";

export default function Login(){
    const toastRef = useRef();

    return(
        <ScrollView>
            <Image
                source={require("../../../assets/img/logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef}/>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.viewContainer}>
                <LoginWithFacebook toastRef={toastRef}/>
            </View>            
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </ScrollView>
    );    
}
function CreateAccount(){
    const navigation = useNavigation();
    return(
        <Text style={styles.textRegister}>
            ¿Aun no tienes una cuenta?{" "}
            <Text 
                onPress={()=>{
                    navigation.navigate("register");
                }}
                style={styles.btnRegister}>
                Registrate
            </Text>
        </Text>
    );
}
const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 280,
        marginTop: 0,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    btnRegister: {
        color: "#FF6800",
        fontWeight: "bold",
    },
    textRegister: {
        marginTop: 17,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
    },
    divider: {
         backgroundColor: "#FF6800",
         marginBottom: 15,
         marginLeft: 49,
         marginRight: 49,
         marginTop: 15,
         height: 1.5,
    }
})
