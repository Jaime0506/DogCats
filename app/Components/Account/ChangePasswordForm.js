import React, { useState } from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Input, Button} from "react-native-elements";
import {size} from "lodash";
import * as firebase from "firebase";
import {reauthenticate} from "../../utils/api";

export default function ChangePasswordForm(props){
    const {setIsVisible} = props;
    const [formData, setFormData] = useState(passwordNewData());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    
    const onChange = (e,type) => {
        setFormData({...formData,[type]: e.nativeEvent.text})
    }
    const onSubmit = () => {        
        setError({});
        if (!formData.oldPassword || !formData.newPassword || !formData.repeatNewPassword){
            setError({
                oldPassword: !formData.oldPassword ? "La contraseña no puede estar vacia" : "",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacia" : "",
                repeatNewPassword: !formData.repeatNewPassword ? "La contraseña no puede estar vacia" : "",
            })
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            setError({
                newPassword: "Las contraseñas no coinciden",
                repeatNewPassword: "Las contraseñas no coinciden",
            })
        } else if (formData.newPassword === formData.oldPassword) {
            setError({
                newPassword: "La contraseña no puede ser igual a la actual",
                repeatNewPassword: "La contraseña no puede ser igual a la actual"
            })
        } else if (size(formData.newPassword) < 6) {
            setError({
                newPassword: "La contraseña debe tener como minimo 6 caracteres",
                repeatNewPassword: "La contraseña debe tener como minimo 6 caracteres",
            })
        } else {
            setLoading(true);
            reauthenticate(formData.oldPassword)
            .then(async () => {  
                setLoading(false);              
                await firebase
                    .auth()
                    .currentUser
                    .updatePassword(formData.newPassword)
                    .then(() => {
                        setLoading(false);
                        setIsVisible(false);
                        firebase.auth().signOut();
                    })
                    .catch(()=> {
                        setLoading(false);
                        setError({
                            other: "Error al actualizar la contraseña"
                        });
                    })
            })
            .catch(() => {
                setLoading(false);
                setError({
                    oldPassword: "La contraseña es incorrecta"
                });
            })
        }        
    }
    

    return(
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                passwordRules={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: "lock",
                    color: "#c2c2c2"
                }}
                onChange={e => onChange(e,"oldPassword")}
                errorMessage={error.oldPassword}
            />
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                passwordRules={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-outline" : "eye-off-outline",
                    color: "#c2c2c2",
                    onPress: () =>  setShowPassword(!showPassword)
                }}
                onChange={e => onChange(e,"newPassword")}
                errorMessage={error.newPassword}
            />
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                passwordRules={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-outline" : "eye-off-outline",
                    color: "#c2c2c2",
                    onPress: () =>  setShowPassword(!showPassword)
                }}
                onChange={e => onChange(e,"repeatNewPassword")}
                errorMessage={error.repeatNewPassword}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
            />
            {error.other && <Text style={styles.other}>{error.other}</Text>}
        </View>
    )
}
function passwordNewData() {
    return{
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
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
    other: {
        marginTop: 10,
        marginBottom: -7,
    }
})