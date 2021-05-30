import React, { useRef } from 'react';
import { StyleSheet, View, Image, Text} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../Components/Account/RegisterForm";

export default function Register(){
    const toastRef = useRef();
    return(
        <KeyboardAwareScrollView>
            <Image
                source={require("../../../assets/img/logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View>
                <RegisterForm toastRef={toastRef}/>
            </View>
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
        </KeyboardAwareScrollView>
    );
}
const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 260,
        marginTop: 20,
        marginBottom: -60,
    }
})