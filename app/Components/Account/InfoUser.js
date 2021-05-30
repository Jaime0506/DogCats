import React from 'react';
import { View,Text,StyleSheet } from 'react-native';
import { Avatar}  from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props){
    const { userInfo: { uid ,photoURL, displayName, email},
    toastRef, 
    setLoadingText, 
    setLoading } = props;

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if (resultPermissionCamera == "denied") {
            toastRef.current.show("Es necesario el acceptar los permisos de la galeria");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            })
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la seleccion de imagenes");
            } else {
                uploadImage(result.uri).then(() => {
                    updatePhotoURL();
                })
                .catch(() => {
                    toastRef.current.show("Error al actualizar el avatar");
                })
            }
        }
    };

    const randomAvatar = () => {        
        let numRandom = Math.random() *1;
        let numRandomRound = Math.round(numRandom);
        return numRandomRound;      
    };
    const uploadImage = async (uri) => {
        setLoadingText("Actualizando avatar");
        setLoading(true);

        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    };
    const updatePhotoURL = () => {
        firebase
        .storage()
        .ref(`avatar/${uid}`)
        .getDownloadURL()
        .then(async (response) => {
            const update = {
                photoURL: response,
            }
            await firebase.auth().currentUser.updateProfile(update);
            toastRef.current.show("Imagen Actualizada");
            setLoading(false);
        })
        .catch(() => {
            toastRef.current.show("Error al actualizar el avatar");
        })
    };
            
    return(
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                avatarStyle={styles.avatarStyle}
                containerStyle={styles.userInfoAvatar}
                source = {                    
                    photoURL ? {uri: photoURL} : randomAvatar() == 1 ? require("../../../assets/img/defaultAvatarCat.png") : require("../../../assets/img/defaultAvatarDog.png")
                }
                onEditPress={changeAvatar}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anonimo"}
                </Text>
                <Text>
                    {email ? email : "Social Login"}
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 20,
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
    avatarStyle: {   
    
    }
})