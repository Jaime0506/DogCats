import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, } from 'react-native'

//import componentes

import Loading from "../../Components/Loading";
import CarouselImages from "../../Components/CarouselImages";
import Map from "../../Components/Map";

//import firebase for use firestore

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Animal(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [dataAnimal, setDataAnimal] = useState(null);

    navigation.setOptions({
        title: name
    })

    useEffect(() => {
        db.collection("registers")
            .doc(id)
            .get()
            .then((response) => {
                const data = response.data();
                data.id = response.id;
                setDataAnimal(data);
            })
    }, []);

    // console.log(dataAnimal);

    if(!dataAnimal) return <Loading isVisible={true} text="Cargando..."/>

    return (
        <ScrollView style={styles.ScrollView}>
            <CarouselImages 
                arrayImages={dataAnimal.images} 
                height={250} 
                width={screenWidth}                    
            />
            <DataRegister 
                name={dataAnimal.name} 
                descripccion={dataAnimal.descripccion}                        
            />
            <AnimalViewMaps
                location={dataAnimal.location}
                name={dataAnimal.name}
                address={dataAnimal.address}
            />
        </ScrollView>
    );
};

function DataRegister(props){
    const { name, descripccion } = props;
    return(
        <View style={styles.viewRegistersTitle}>            
            <Text style={styles.nameRegister}>{name}</Text>
            <Text style={styles.descripccion}>{descripccion}</Text>            
        </View>
    )
};
function AnimalViewMaps(props) {
    const {location, address, name} = props;
    return(
        <View style={styles.viewAnimalMaps}>
            <Text style={styles.textUbicacion}>Ubicacion del Animal</Text>
            <Map
                location={location}
                name={name}
                height={200}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    ScrollView: {
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
        fontWeight: 'bold',
        fontSize: 20,
    },
})
