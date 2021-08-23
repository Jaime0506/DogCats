import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, Linking } from 'react-native'
import { Button, ListItem } from 'react-native-elements';

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

import CarouselImages from '../../Components/CarouselImages';
import Loading from '../../Components/Loading';
import Map, { openAppMap } from '../../Components/Map';

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function Adopccion(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;

    const [dataRegister, setDataRegister] = useState(null);

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

    console.log(dataRegister);

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
                contact={dataRegister.contact}
                id={id}
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
    const { location, address, name, contact, id } = props;

    const data = [
        {
            title: address,
            iconName: "home-variant",
            iconType: "material-community",
            action: () => openAppMap(location),
        },
        {
            title: `+57 ${contact}`,
            iconName: "phone",
            iconType: "material-community",
            action: () => openTell()
        },
        {
            title: `+57 ${contact}`,
            iconName: "whatsapp",
            iconType: "material-community",
            action: () => openWhatsapp()
        },
        {
            title: "prueba@gmail.com",
            iconType: "material-community",
            iconName: "email",
            action: () => openEmail(),
        }
    ];

    const openTell = async () => {
        Linking.openURL(`tel: +57 ${contact}`)
    };
    const openWhatsapp = async () => {
        Linking.openURL(`https://wa.me/+57 ${contact}`)
    };
    const openEmail = async () => {
        Linking.openURL(`mailto:prueba@gmail.com?subject=PROCESO DE ADOPCCION PARA (${id})`) 
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
                data.map((item, index) => (
                    <ListItem
                        key={index}
                        title={item.title}
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
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1.3,
    }
});
