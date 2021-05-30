import React, { useState } from "react";
import {StyleSheet, View, } from "react-native";
import {Input,Icon,Button} from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validationEmail";
import { size, isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";

export default function RegisterForm(props){
    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [repeatShowPassword, setRepeatShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const navigation = useNavigation();

    const onSubmit = () => {
        if(isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)){
            toastRef.current.show("Todos los campos son obligatorios");
        } else if (!validateEmail(formData.email)){
            toastRef.current.show("El correo no es valido");
        } else if (formData.password !== formData.repeatPassword){
            toastRef.current.show("las contraseñas no coinciden");
        } else if (size(formData.password) < 6){
            toastRef.current.show("la contraseña debe tener minimo 6 caracteres");
        } else {
            setLoading(true);
            firebase.auth()
            .createUserWithEmailAndPassword(formData.email,formData.password)
            .then(() => {
                setLoading(false);
                navigation.navigate("account");
            })
            .catch(() => {
                setLoading(false);
                toastRef.current.show("Este Email ya se encuentra registrado");
            })
        }
    }
    const onChange = (e,type) =>{           
        setFormData({...formData, [type]: e.nativeEvent.text});
    }
    return(
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e,"email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                passwordRules={true}
                secureTextEntry={showPassword ? false : true}
                onChange={e => onChange(e,"password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-outline" : "eye-off-outline" }
                        iconStyle={styles.iconRight}
                        onPress={()=> setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                passwordRules={true}
                secureTextEntry={repeatShowPassword ? false : true}
                onChange={e => onChange(e,"repeatPassword")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={repeatShowPassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=> setRepeatShowPassword(!repeatShowPassword)}
                    />
                }
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading style={styles.text} isVisible={loading} text="Creando cuenta"/>
        </View>
    )

}
function defaultFormValue(){
    return{
        email: "",
        password: "",
        repeatPassword: ""
    }        
}
const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "85%",
        marginTop: 25,
    },
    btnContainerRegister: {
        marginTop: 30,
        width: "80%"
    },
    btnRegister:{
        backgroundColor: "#FF6800"
    },    
    iconRight: {
        color: "#c1c1c1"
    },
    text:{
        fontSize: 15,
    },

})