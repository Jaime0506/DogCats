import React, { useState } from 'react';
import {View, StyleSheet} from "react-native";
import {Input, Button} from "react-native-elements";
import * as firebase from "firebase";
import {validateEmail} from "../../utils/validationEmail";
import {reauthenticate} from "../../utils/api";
import { set } from 'lodash';

export default function ChangeEmailForm(props){
    const {setIsVisible, email, toastRef, setReloadUserInfo} = props;
    const [formData, setFormData] = useState(dateNewEmail());
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const onChange = (e,type) => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }
    const onSubmit = () => {
        console.log(formData)
        setError({})
        if (!formData.email || !formData.password) {
            setError({
                email: "El email no puede estar vacio",
                password: "La contraseña no puede estar vacia"
            })
        } else if (formData.email === email) {
            setError({
                email: "El email no puede ser igual al actual",
            });
        } else if (!validateEmail(formData.email)){
            setError({
                email: "El email no cumple con los caracteres correctos"
            })
        } else {
            setLoading(true)
            reauthenticate(formData.pasword)
            .then(() => {
                firebase
                    .auth()
                    .currentUser
                    .updateEmail(formData.email)
                    .then(() => {
                        setLoading(false);
                        setIsVisible(false);
                        toastRef.current.show("Se actualizo correctamente");
                        setReloadUserInfo(true);
                    })
                    .catch(() => {
                        setLoading(false);
                        setError({
                            email: "Error al actualizar el email"
                        })
                    })
            })
            .catch(() => {
                setLoading(false);
                setError({
                    password: "Contraseña incorrecta"
                })
            })
        }
    }
    return(
        <View style={styles.view}>
            <Input
                placeholder="Nuevo Email"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2",
                }}
                onChange={e => onChange(e,"email")}
                errorMessage={error.email}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                passwordRules={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-outline" : "eye-off-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={e => onChange(e,"password")}
                errorMessage={error.password}
            />
            <Button
                title="Cambiar Email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                loading={loading}
                onPress={onSubmit}
            />
        </View>
    )
}
function dateNewEmail(){
    return{
        email: "",
        password: "",
    }
}
const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 10,
        width: "95%",
    },
    btn: {
        backgroundColor: "#FF6800",
    },
})