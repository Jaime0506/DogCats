import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";


export default function UserGuest(){
    const navigation = useNavigation();
    return(
        <ScrollView centerContent={true} style={styles.viewBod}>
            <Image
                source={require("../../../assets/img/pipe.png")}
                resizeMode="contain"
                style={styles.image}
            />            
            <Text style={styles.title}>
                Consulta tu peril de DogsCats
            </Text>
            <Text style={styles.description}>
                ¿Comó puedes ayudar? Crea una cuenta, busca y visualiza a los caninos y felinos que se encuentran a tu alrededor.
            </Text>
            <View style={styles.containerBtn}>
                <Button
                    title="Inicia Ahora"
                    buttonStyle={styles.btnSyle}
                    containerStyle={styles.btnContainer}
                    onPress={()=> {
                        navigation.navigate("login");
                    }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBod: {
        marginLeft: 30,
        marginRight: 20,        
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: -40,
        marginTop: 40,
    },
    title: {
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 10,
        textAlign: "center",
        marginTop: 45,
    },
    description: {
        textAlign: "center",
        marginBottom: 40,
        fontSize: 17
    },
    containerBtn: {
        alignItems: "center"
    },
    btnSyle: {
        backgroundColor: "#FF6800"
    },
    btnContainer: {
        width: "70%"
    }
})