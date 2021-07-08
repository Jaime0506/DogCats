import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { Button } from 'react-native-elements';

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

import CarouselImages from '../../Components/CarouselImages';
import Loading from '../../Components/Loading';
import Map from '../../Components/Map';

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function Adopccion(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;

    const [dataRegister, setDataRegister] = useState(null);
    console.log(dataRegister);

    useEffect(() => {
        navigation.setOptions({
            title: name,
        });
    }, []);

    useEffect(() => {
        db.collection(`adoption-register`)
            .doc(id)
            .get()
            .then((response) => {
                const data = response.data();
                data.id = response.id;
                setDataRegister(data);
            });
    }, []);

    if (!dataRegister) return <Loading isVisible={true} text="Cargando..."/>;

    return (
        <ScrollView>
            <CarouselImages
                arrayImages={dataRegister.images}
                width={widthScreen}
                height={250}
            />
            <TitleRegister 
                name={dataRegister.name}
                description={dataRegister.description}
            />
            <RegisterInfo
                location={dataRegister.location}
                name={dataRegister.name}
                address={dataRegister.address}
            />
        </ScrollView>
    )
};

function TitleRegister(props) {
    const {name, description} = props;

    return (
       <View style={styles.viewRegistersTitle}>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.nameRegister}>{name}</Text>
            </View>
            <Text style={styles.descripccion}>{description}</Text>
        </View>
    )
};

function RegisterInfo(props){
    const { location, address, name} = props;

    return (
        <View style={styles.viewAnimalMaps}>
            <Text style={styles.textUbicacion}>Ubicacion del animal</Text>
            <Map
                location={location}
                name={name}
                height={200}
            />
            <Text style={styles.textAddress}>Direccion: {address}</Text>
        </View>
    )
};

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
    textAddress: {
        marginTop: 5,
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
    }
});
