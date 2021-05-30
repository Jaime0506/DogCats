import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import Loading from "../../Components/Loading";
import InfoUser from "../../Components/Account/InfoUser";
import AccountOptions from "../../Components/Account/AccountOptions";

export default function UserLogged() {
    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [reloadUserInfo, setReloadUserInfo] = useState(false);
    const toastRef = useRef();

    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })()
        setReloadUserInfo(false);
    }, [reloadUserInfo])
    return(
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser 
                            userInfo={userInfo} 
                            toastRef={toastRef} 
                            setLoading={setLoading}
                            setLoadingText={setLoadingText}
                        />}
            <AccountOptions userInfo={userInfo} toastRef={toastRef} setReloadUserInfo={setReloadUserInfo}/>
            <Button
                title="Cerrar Sesión"
                titleStyle={styles.btnCloseSecionText}
                buttonStyle={styles.btnCloseSesion}
                onPress={()=> firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading text={loadingText} isVisible={loading}/>
        </View>
    );
}
const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSesion: {
        // backgroundColor: "#FF6800",
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSecionText: {        
        color: "#FF6800",
    },    
})