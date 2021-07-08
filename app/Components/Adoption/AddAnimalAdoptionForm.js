import React, { useState, useEffect }from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, Alert } from 'react-native'
import { Image, Input, Button, Icon, Avatar } from "react-native-elements";
import { map, size, filter } from "lodash";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from '../Modal';
import uuid from 'random-uuid-v4';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore();

const widthScreen = Dimensions.get("window").width;

export default function AddAnimalAdoptionForm(props) {

    const {toastRef, navigation, id} = props;
    const [data, setData] = useState(defaultData);
    const [locationAnimal, setLocationAnimal] = useState(null);
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState({});
    const [buttonLoading, setButtonLoading] = useState(false);

    const onChange = (e,type) => {
        setData({...data, [type]: e.nativeEvent.text})
    };
    const onSubmit = () => {
        setError({});
        if (!data.name || !data.description || !data.address || !data.contact){
            setError({
                name: !data.name ? "Se requiere un nombre" : "",
                description: !data.description ? "Se requiere una descripccion" : "",
                address: !data.address ? "Se requiere una direccion" : "",
                contact: !data.contact ? "Se requiere un medio de contacto" : "",
            })
        } else if (!locationAnimal) {
            setError({
                address: "Se requiere que ingrese la ubicacion, mediante el icono de google Maps",
            })
        } else if (size(imageSelected) === 0) {
            toastRef.current.show("El Animal debe tener al menos una imagen")
        } else {
            console.log("OK")
            
            uploadImageStore().then((response) => {
                db.collection(`adoption-register`)
                    .add({
                        name: data.name,
                        address: data.address,
                        description: data.description,
                        location: locationAnimal,
                        images: response,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    }).then(() => {
                        setButtonLoading(false);
                        console.log("Funciono todo pa");
                        deleteRegister(id);
                    }).catch(() => {
                        setButtonLoading(false);
                        toastRef.current.show("Ha ocurrido un error, intentelo nuevamente mas tarde");
                    });
            });
        };
    };
    
    const uploadImageStore = async () => {
        setButtonLoading(true);
        const imageBlob = [];
        await Promise.all(
            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebaseApp.storage().ref(`images-adoptions`).child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`images-adoptions/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoURL) => {
                            imageBlob.push(photoURL);
                        });
                });
            })
        );
        return imageBlob;
    };

    const deleteRegister = async (id) => {
        await db.collection("registers")
            .doc(id)
            .delete()
            .then(() => {
                toastRef.current.show("Se ha transferido el registro correctamente");
            });
        navigation.navigate("animals");
    }

    return (
        <ScrollView>
            <ImageAnimal
                imagesAnimal={imageSelected[0]}
            />
            <FormData
                locationAnimal={locationAnimal}
                onChange={onChange}
                onSubmit={onSubmit}
                setIsVisible={setIsVisible}
                error={error}
            />
            <UploadImage
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}
                toastRef={toastRef}
            />
            <Button
                title="Subir registro"
                containerStyle={styles.containerBtn}
                buttonStyle={styles.btnStyles}
                onPress={onSubmit}                    
                loading={buttonLoading}
            />
            <Map
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                toastRef={toastRef}
                setLocationAnimal={setLocationAnimal}
            />
        </ScrollView>
    );
};

function ImageAnimal(props){
    const {imagesAnimal} = props;
    return(
        <View style={styles.viewFoto}>
            <Image
                source={imagesAnimal ? {uri: imagesAnimal} : require("../../../assets/img/no-image.png")}
                style={{width: widthScreen, height: 200,}}
            />
        </View>
    )
};

function FormData(props) {
    const {id, name, onChange, locationAnimal, setIsVisible, error} = props;   

    return (
        <View>
            <View style={styles.containerForm}>
                <Input
                    placeholder="Nombre de la Mascota"
                    onChange={(e) => onChange(e,"name")}
                    containerStyle={styles.input}                    
                    errorMessage={error.name}
                />
                <Input
                    placeholder="Direccion de donde se encuentra"
                    onChange={(e) => onChange(e,"address")}
                    containerStyle={styles.input}
                    rightIcon={{
                        type: "material-community",
                        name: "google-maps",
                        color: locationAnimal ? "#FF6800" : "#c2c2c2",
                        onPress: () => setIsVisible(true),
                    }}
                    errorMessage={error.address}
                />
                <Input
                    placeholder="Medios de contacto de la fundacion"
                    onChange={(e) => onChange(e,"contact")}
                    containerStyle={styles.input}
                    errorMessage={error.contact}
                />
                <Input
                    placeholder="Descripccion breve de los tratamientos resividos por la mascota"
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => onChange(e,"description")}
                    errorMessage={error.description}
                />                
            </View>            
        </View>
    )
};

function UploadImage(props) {
    const { toastRef, setImageSelected, imageSelected } = props;

    const imageSelect = async () => {

        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        if (resultPermissions == "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la aplicacion, si los rechazo debera aceptarlos desde las configuraciones de su dispositivo", 300)
        } else {

            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            });

            if (result.cancelled) {
                toastRef.current.show("Se cancelo la seleccion de la imagen")
            } else {
                setImageSelected([...imageSelected, result.uri])
            }
        }
    };
    
    const deleteImage = (image) => {
        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro de que deseas eliminar esta imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imageSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ]
        )
    };

    return(
        <View style={styles.viewImage}>
            {size(imageSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imageSelected, (imageAnimal, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imageAnimal}}
                    onPress={() => deleteImage(imageAnimal)}
                />
            ))}
        </View>
    )
};

function Map (props) {

    const {isVisible, setIsVisible, toastRef, setLocationAnimal} = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermission = await Location.requestPermissionsAsync();
            const statusPermissions = resultPermission.status;

            if (statusPermissions !== "granted") {
                toastRef.current.show("Tienes que aceptar los permisos de localizacion para poder transferir el registro", 4000);
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                });
            };
        })();
    }, []);

    const confirmLocation = () => {
        setLocationAnimal(location);
        setIsVisible(false);
        toastRef.current.show("Localizacion guardada correctamente", 2000);
    };

    return (
        <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
            <View>
                {location && (
                   <MapView 
                    style={styles.mapStyles}
                    initialRegion={location}
                    showsUserLocation={true}
                    onRegionChange={(region) => setLocation(region)}                    
                   >
                    <MapView.Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        draggable
                    />
                   </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Cancelar ubicacion"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisible(false)}
                    />
                    <Button
                        title="Guardar ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                </View>
            </View>
        </Modal>
    )
};

function defaultData() {
    return {
        name: "",
        address: "",
        contact: "",
        description: ""
    }
};

const styles = StyleSheet.create({
    containerForm: {        
        margin: 13,
    },
    containerBtn: {
        marginTop: 10,
        marginLeft: 22,
        marginRight: 22,
        marginBottom: 10,
    },  
    btnStyles: {
        backgroundColor: "#FF6800",
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        padding: 0,
        margin: 0,
    },
    btnContainer: {
        margin: 20,
    },
    btn: {
        backgroundColor: "#FF6800",
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 22,
        marginRight: 22,
        marginTop: 5,
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        height: 70,
        width: 70,
        marginBottom: 5,  
        marginRight: 15,      
        backgroundColor: "#e3e3e3",
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 15,
    },
    viewFoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapStyles: {
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingRight: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSave: {
        paddingLeft: 5,
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }, 
});

