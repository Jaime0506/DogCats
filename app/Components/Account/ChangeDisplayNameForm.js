import React, { useState } from 'react';
import {View, StyleSheet} from "react-native";
import {Input, Button} from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props){

    const {setIsVisible, toastRef, displayName, setReloadUserInfo} = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {

        setError(null);
        if (!newDisplayName) {
            setError("El nombre no puede estar vacio");
        } else if (newDisplayName === displayName) {
            setError("El nombre no puede ser igual al actual");
        } else {
            setLoading(true);

            const update = {
                displayName: newDisplayName
            };
            
            firebase
                .auth()
                .currentUser
                .updateProfile(update)
                .then(() => {
                    setLoading(false);
                    setIsVisible(false);
                    setReloadUserInfo(true);
                    toastRef.current.show("Se ha actualizado correctamente");
                })
                .catch(() => {
                    setError("Error al actualizar el nombre");
                    setLoading(false);
                })
        }
    }
    return(
        <View style={styles.view}>
           <Input
               placeholder="Cambiar nombre y apellido"
               containerStyle={styles.input}
               rightIcon={{
                   type: "material-community",
                   name: "account-circle",
                   color: "#c2c2c2"
               }} 
               onChange={e => setNewDisplayName(e.nativeEvent.text)}
               errorMessage={error}
           />
           <Button
               title="Cambiar nombre"
               containerStyle={styles.btnContainer}
               buttonStyle={styles.btn}
               loading={loading}
               onPress={onSubmit}
           />
        </View>
    )
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
    }
})
