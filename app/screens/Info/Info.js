import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Button } from 'react-native-elements';
import Modal from '../../Components/Modal';
import ViewInfo from '../../Components/Info/ViewInfo';


export default function Info() {

    const [isVisible, setIsVisible] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);
    const selectComponent = () => {
        setRenderComponent(<ViewInfo/>)
        setIsVisible(true);
    };
    return (
        <ScrollView>
            <View style={styles.containerAll}>
                <View style={styles.containerText}>
                    <Text style={styles.text}>
                        <Text style={styles.nameApp}>Dogs&Cats</Text> es una aplicacion, cuya funcionalidad es servir de ayuda para las fundaciones que tiene en adopccion algunas mascotas o que ayudan mascotas de la calle y para las personas que decean adoptar o ayudar junto a estas fundaciones a los animales de la calle.
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.nameApp}>Dogs&Cats</Text> funciona como un foro de publicacion, donde una persona puede publicar el caso/registro de un animal en pesimas condiciones que se encuentre en la calle, esta publicacion la puede ver la fundacion y cualquier persona que tenga la app, asi mismo mediante la app la fundacion puede publicar mascotas que estan disponible para su adopccion, con sus respectivos datos e informacion necesaria de contacto.
                        </Text>
                    <Text style={styles.text}>
                        <Text style={styles.nameApp}>Dogs&Cats</Text> no funciona como un intermediario, simplemente cumple la funcion de contactar al usuario-fundacion y estos son los que se encargan de contactarse por un medio externo al de la App, la App brindara informacion de contacto con la fundacion y algunos de los procedimientos que se deben realizar para que el usuario se haga una idea, al final la fundacion es la que hace el procedimiento de acuerdo a lo establecido por ellos.
                        </Text>
                    <Text style={styles.text}>
                        La App no realiza ningun tipo de tramite legal.
                    </Text>
                    
                </View>
                <View>
                    <Button 
                        title="Requisitos para adoptar una mascota"
                        buttonStyle={styles.btn}    
                        containerStyle={styles.containerBtn}
                        onPress={selectComponent}
                    />
                </View>
                {renderComponent && (
                    <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
                        {renderComponent}
                    </Modal>
                )}
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    containerAll: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    containerText: {
        margin: 11,
    },
    text: {
        textAlign: "justify",
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 8,
        elevation: 5,
    },  
    nameApp: {
        color: "#FF6800",
        fontWeight: 'bold',
    },  
    btn: {
        backgroundColor: "#FF6800",
        width: "100%",
        elevation: 5,
    },
    containerBtn: {
        marginBottom: 18,
    },  
})
