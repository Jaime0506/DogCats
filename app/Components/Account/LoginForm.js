import React, { useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Icon, Button} from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validationEmail";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";

export default function LoginForm(props){
    const { toastRef } = props;    
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const onChange = (e, type) =>{
        setFormData({...formData , [type]: e.nativeEvent.text});        
    }
    const onSubmit = () =>{
        if (isEmpty(formData.email) || isEmpty(formData.password)){
            toastRef.current.show("Todos los campos son obligatorios");
        } else if (!validateEmail(formData.email)){
            toastRef.current.show("El email no es valido");
        } else{
            setLoading(true);
            firebase
            .auth()
            .signInWithEmailAndPassword(formData.email,formData.password)
            .then(() => {
                setLoading(false);
                navigation.navigate("account");
            })
            .catch(() => {
                setLoading(false);
                toastRef.current.show("Email o contraseña incorrecta");
            });
        }
    }
    
    return(
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        iconStyle={styles.iconRight}
                        name="at"
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={e => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=> setShowPassword(!showPassword)}                        
                    />
                }
            />
            <Button
                buttonStyle={styles.btnIniciar}
                containerStyle={styles.btnContainer}
                title="Iniciar sesión"
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Iniciando Sesión"/>
         </View>
    );
}
function defaultFormValue(){
    return {
        email: "",
        password: ""
    }
}
const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -30,
        
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    iconRight: {
        color: "#c1c1c1"
    },
    btnIniciar: {
        backgroundColor: "#FF6800",
        marginTop: 20        
    },
    btnContainer: {
        width: "95%"
    }
})
