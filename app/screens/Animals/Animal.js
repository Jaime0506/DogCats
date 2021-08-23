import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Linking } from 'react-native';
import { Button, ListItem } from 'react-native-elements';

//import fire store

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

//import components
import Loading from '../../Components/Loading';
import CarouselImages from "../../Components/CarouselImages";
import Map, { openAppMap } from "../../Components/Map";

const screenWidth = Dimensions.get("window").width;


export default function Animal(props) {
    const { navigation, route } = props;
    const { id, name, } = route.params;
    const [dataRegister, setDataRegister] = useState(null);
    const [user, setUser] = useState({});
    let mostrar;

    useEffect(() => {
        navigation.setOptions({
            title: name,
        });
    },[])

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
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

    if (user) {
        if (user.uid == "Sm9ZeHCglEXBU4bTWOiLHlBZ4t13") {
            mostrar = user.uid;
        }
    }

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
                contact={dataRegister.contact}
            />
            {mostrar && (
                <View style={styles.contenedorIcon}>
                    <Button
                        title="Transferir el registro"
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btnStyle}
                        onPress={() => navigation.navigate("adoption-animal",{
                            id,
                            name
                        })}
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
    const { location, addres, name, contact } = props;

    const data = [
        {
            text: addres,
            iconName: "map-marker",
            iconType: "material-community",
            action: () => openAppMap(location),
        },
        {
            text: `+57 ${contact}`,
            iconName: "phone",
            iconType: "material-community",
            action: () => openTell()
        },
        {
            text: `+57 ${contact}`,
            iconName: "whatsapp",
            iconType: "material-community",
            action: () => openWhatsapp()
        }
    ];

    const openTell = async () => {
       await Linking.openURL(`tel: +57 ${contact}`) 
    };
    const openWhatsapp = async () => {
       await Linking.openURL(`https://wa.me/+57 ${contact}`)
    };

    return (
        <View style={styles.viewAnimalMaps}>
            <Text style={styles.textUbicacion}>Informacion del animal</Text>
            <Map
                location={location}
                name={name}
                height={200}
            />
            {
                data.map ((item, index) => (
                    <ListItem
                        key={index}
                        title={item.text}
                        leftIcon={{
                            name: item.iconName,
                            type: item.iconType,
                            color: "#FF6800"
                        }}            
                        containerStyle={styles.containerListItem}
                        onPress={item.action}
                    >
                    </ListItem>  
                ))
            }
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
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1.3,
    }
})
