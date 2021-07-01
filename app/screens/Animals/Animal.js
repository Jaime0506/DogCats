import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

//import fire store

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

//import components
import Loading from '../../Components/Loading';
import CarouselImages from "../../Components/CarouselImages";
import Map from "../../Components/Map";

const screenWidth = Dimensions.get("window").width;


export default function Animal(props) {
    const { navigation, route } = props;
    const { id, name, } = route.params;
    const [dataRegister, setDataRegister] = useState(null);
    const [user, setUser] = useState({});
    const [valdiateUser, setValdiateUser] = useState({});
    let uid = valdiateUser.uid;
    let mostrar;

    navigation.setOptions({
        title: name,
    });

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
            if (userInfo) setValdiateUser(userInfo);
        })
    }, []);

    useEffect(() => {
        db.collection("registers")
            .doc(id)
            .get()
            .then((response) => {
                const data = response.data();
                data.id = response.id;
                setDataRegister(data);
            })     
    }, []);

    if (!dataRegister) return <Loading isVisible={true} text="Cargando..."/>

    if (uid == "Sm9ZeHCglEXBU4bTWOiLHlBZ4t13") mostrar = true;

    return (
        <ScrollView vertical style={styles.scrollView}>
            <CarouselImages
                arrayImages={dataRegister.images}
                height={250}
                width={screenWidth}
            />
            <TitleRegister 
                name={dataRegister.name}
                descripccion={dataRegister.descripccion}
            />
            <RegisterInfo
                location={dataRegister.location}
                name={dataRegister.name}
                addres={dataRegister.addres}
            />
            {mostrar && (
                <View style={styles.contenedorIcon}>
                    <Button
                        title="Adoptar a este animal"
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btnStyle}
                    />
                </View>                
            )}            
        </ScrollView>
    )
};                

function TitleRegister(props) {
    const {name, descripccion } = props;

    return (
        <View style={styles.viewRegistersTitle}>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.nameRegister}>{name}</Text>
            </View>
            <Text style={styles.descripccion}>{descripccion}</Text>
        </View>
    )
};
function RegisterInfo(props){
    const { location, addres, name} = props;

    return (
        <View style={styles.viewAnimalMaps}>
            <Text style={styles.textUbicacion}>Ubicacion del animal</Text>
            <Map
                location={location}
                name={name}
                height={200}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewRegistersTitle: {
        padding: 15,
    },
    nameRegister: {
        fontSize: 20,
        fontWeight: "bold",
    },
    descripccion: {
        fontSize: 12,
        color: "#7A7A7A",
        marginTop: 10,
    },
    viewAnimalMaps: {
        padding: 15,
        marginTop: -20,
    },
    textUbicacion: {
        marginBottom: 10,
    },
    contenedorIcon: {
        flex: 1,
        alignItems: "center",
        marginBottom: 15,
    },  
    btnContainer: {
        width: "93%",
    },
    btnStyle: {
        backgroundColor: "#FF6800",
    },
})
