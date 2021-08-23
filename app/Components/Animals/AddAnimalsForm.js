import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Alert, Dimensions, Text} from "react-native";
import {Icon, Avatar, Image, Input, Button} from "react-native-elements";
import {map,size,filter} from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";
import uuid from "random-uuid-v4";

import {firebaseApp} from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore();

const widthScreen = Dimensions.get("window").width;

export default function AddAnimalsForm(props){
    const {toastRef, setLoading, navigation} = props;
    const [dataName, setDataName] = useState("");
    const [dataDireccion, setDataDireccion] = useState("");
    const [dataDescrippcions, setDataDescrippcions] = useState("");
    const [dataContact, setDataContact] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);
    const [error, setErrors] = useState({});
    const [buttonLoading, setButtonLoading] = useState(false);

    const onSubmit = () => {
        setErrors({});
        if (!dataName || !dataDireccion || !dataDescrippcions || !dataContact){
            setErrors({
                name: !dataName ? "Todos los campos son obligatorios" : "",
                addres: !dataDireccion ? "Todos los campos son obligatorios" : "",
                descripccion: !dataDescrippcions ? "Todos los campos son obligatorios" : "",
                contact: !dataContact ? "Todos los campos son obligatorios" : "",
            });
        } else if (size(imageSelected) === 0) {
            toastRef.current.show("El Animal debe tener almenos una imagen");
        } else if (!locationRestaurant){
            setErrors({
                addres: "No has seleccionado ninguna ubicacion"
            })
        } else {
            console.log("DATOS READY");
            setButtonLoading(true);
            uploadImageStore().then((response) => {
                db.collection(`registers`)
                    .add({
                        name: dataName,
                        addres: dataDireccion,
                        contact: dataContact,
                        descripccion: dataDescrippcions,
                        location: locationRestaurant,
                        images: response,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    }).then(() => {
                        setButtonLoading(false);
                        console.log("OK");
                        navigation.navigate("animals")
                    }).catch(() => {
                        setButtonLoading(false);
                        toastRef.current.show("Ha ocurrido un error, intentelo nuevamente mas tarde");
                    });
            });
        };
    };

    const uploadImageStore = async () => {
        const imageBlob = [];
        await Promise.all(
            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebaseApp.storage().ref(`images-animals`).child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`images-animals/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoUrl) => {
                            imageBlob.push(photoUrl);
                        });
                });
            })
        );
        return imageBlob;
    };

    return(
        <ScrollView style={styles.scrollView}>
            <ImageAnimal
                imagesAnimal={imageSelected[0]}
            />
            <FormAdd
                setDataName={setDataName}
                setDataDireccion={setDataDireccion}
                setDataDescrippcions={setDataDescrippcions}
                setIsVisible={setIsVisible}
                setDataContact={setDataContact}
                dataContact={dataContact}
                locationRestaurant={locationRestaurant}
                error={error}
            />
            <UploadImage
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}
                toastRef={toastRef}
            />
            <Button
                title="Crear Registro"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={buttonLoading}
            />
            <Map
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                toastRef={toastRef}
                setLocationRestaurant={setLocationRestaurant}
            />
        </ScrollView>
    )
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
function FormAdd(props){
    const {
        setDataName,
        setDataDireccion,
        setDataDescrippcions,
        setDataContact,
        dataContact,
        setIsVisible,
        locationRestaurant, error } = props;

    return(
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre de la Mascota"
                containerStyle={styles.input}
                onChange={e => setDataName(e.nativeEvent.text)}
                errorMessage={error.name}
            />
            <Input
                placeholder="Direccion donde se encontro"
                containerStyle={styles.input}
                onChange={e => setDataDireccion(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#FF6800" : "#c2c2c2",
                    onPress: () => setIsVisible(true)
                }}
                errorMessage={error.addres}
            />
            <Input
                placeholder="Telefono de contacto"
                containerStyle={styles.input}
                onChange={e => setDataContact(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "phone",
                    color: dataContact ? "#FF6800" : "#c2c2c2",
                }}
                keyboardType="numeric"
                errorMessage={error.contact}
            />
            <Input
                placeholder="Descripccion de las Condiciones en las que se encuentra"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setDataDescrippcions(e.nativeEvent.text)}
                errorMessage={error.descripccion}
            />
        </View>
    )
};
function Map(props){
    const {isVisible,setIsVisible,toastRef,setLocationRestaurant} = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermissions = await Location.requestPermissionsAsync();
            const statusPermissions = resultPermissions.status;
            if (statusPermissions !== "granted"){
                toastRef.current.show(
                    "Tienes que aceptar los permisos de localizacion para crear un restaurante", 4000
                    )
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
        setLocationRestaurant(location);
        setIsVisible(false);
        toastRef.current.show("Localizacion guardada correctamente",2000);
    }

    return(
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
function UploadImage(props) {
    const {toastRef, setImageSelected, imageSelected} = props;

    const imageSelect = async() => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );
        if (resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la aplicacion, si los rechazo debera acpetar")
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            });
            if (result.cancelled){
                toastRef.current.show("Se cancelo la seleccion de imagen");
            } else {
                setImageSelected([...imageSelected, result.uri])
            }
        }
    };
    const deleteImage = (image) => {
        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro que deseas eliminar esta imagen?",
            [
                {
                    text: "Cancel",
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
            {map(imageSelected, (imageRestaurant, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imageRestaurant}}
                    onPress={() => deleteImage(imageRestaurant)}
                />
            ))}
        </View>
    )
};
const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
        marginTop: 0,
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },  
    textArea: {
        height: 100,
        width: "100%",
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
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3", 
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
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