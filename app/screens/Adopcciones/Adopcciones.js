import React, { useState ,useEffect } from 'react'
import {View,Text} from "react-native";

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Adopcciones() {

    const [user, setUser] = useState({});
    const [validateUser, setValidateUser] = useState({});
    let uid = validateUser.uid;
    let mostrar;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
            if (userInfo) setValidateUser(userInfo);
        });
        
        if (uid == "Sm9ZeHCglEXBU4bTWOiLHlBZ4t13") mostrar = true;
        
    }, []);
    
    console.log(mostrar);

    return(
        <View>
            {mostrar && (
                <Text>HOla papus</Text>
            )}
        </View>        
    );
}