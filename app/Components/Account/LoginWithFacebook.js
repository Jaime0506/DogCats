import React from 'react'
import { SocialIcon } from "react-native-elements";
// import * as firebase from "firebase";
// import * as Facebook from "expo-facebook";
// import { useNavigation } from "@react-navigation/native";
// import { FacebookApi } from "../../utils/social";
// import Loading from "../Loading";

export default function LoginWithFacebook(props){
    const { toastRef } = props;
    const login = () =>{
        toastRef.current.show("La funcion no se encuentra disponible, se esta trabajando en ello");
    }
    return(
        <>
            <SocialIcon
                title="Iniciar sesión con Facebook"
                button
                type="facebook"
                onPress={login}
                iconSize={16}
            />
        </>
    )
}