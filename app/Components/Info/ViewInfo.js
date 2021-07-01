import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View, Linking} from 'react-native'
import { Icon, Button } from 'react-native-elements';

export default function ViewInfo() {

    const [viewMoreText, setViewMoreText] = useState(false);
    const [changeIcon, setChangeIcon] = useState(false);
    
    const seeText = () => {
        setViewMoreText(!viewMoreText);
        setChangeIcon(!changeIcon);
    };

    return (
        <ScrollView>
            <View>
                <Text style={styles.texts}>
                    1. Ser mayor de edad: Se presentará el DNI de identificación.
                </Text>
            </View>
            <View>
                <Text style={styles.texts}>
                    2. Comprobante de domicilio: Documento que demuestre que la persona es propietaria del domicilio donde vivirá la mascota o, en caso de alquiler, que el arrendatario permite residir con animales.           
                </Text>                
            </View>
            <View>
                <Text style={styles.texts}>
                    3. Contrato de adopción. Debes firmar un acta que te compromete a:                  
                </Text>
                <Text style={styles.lista}>
                        - Cuidar de tu mascota y mantenerla en unas condiciones óptimas de espacio, tiempo, alimentación, ejercicio...
                </Text>
                {!changeIcon && (
                    <Icon
                        type="material-community"
                        name={changeIcon ? "arrow-up-drop-circle-outline" : "arrow-down-drop-circle-outline"}
                        onPress={seeText}
                        iconStyle={{
                            marginTop: 0,
                            marginBottom: -2,
                        }}
                    />
                )}
                {viewMoreText && (
                    <View>
                        <Text style={styles.lista}>
                                - Dotarle de los cuidados veterinarios que necesite. La mascota se entregará desparasitada y con las correspondientes vacunas, los perros y los gatos llevarán, además, microchip.
                        </Text>
                        <Text style={styles.lista}>
                                - No destinarlo a la cría o reproducción. Los animales que tengan la edad suficientes se entregarán esterilizados, y si aún no han alcanzado la edad necesaria se firmará un compromiso de esterilización.
                        </Text>
                        <Text style={styles.lista}>
                                - Notificar cualquier cambio a la asociación (pérdida, muerte...).
                        </Text>
                        <Text style={styles.lista}>
                            Compromiso de no abandonarlo. Si por algún motivo no puedes hacerte cargo de la mascota lo devolverás a la asociación.
                        </Text>
                    </View>
                )}     
            </View>  
            {changeIcon && (
                <Button 
                    title="Si desea obtener mas informacion presiona Aqui"
                    buttonStyle={{
                        backgroundColor: "#ffffff",
                    }}
                    containerStyle={{
                        height: 30,                        
                    }}
                    titleStyle={{
                        color: "#000",
                        fontSize: 14,   
                        fontWeight: "bold",                     
                    }}
                    onPress={() => Linking.openURL('https://www.hogarmania.com/mascotas/perros/consejos/requisitos-para-adoptar-mascota-5910.html')}
                />
            )}         
            {changeIcon && (
                    <Icon
                        type="material-community"
                        name="arrow-up-drop-circle-outline"
                        onPress={seeText}
                        iconStyle={{
                            marginTop: 6,
                            marginBottom: -2,
                        }}
                    />
                )}       
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    texts: {
        textAlign: "justify",
        margin: 5,
    },
    lista: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 8,
        textAlign: 'justify',
    },
    iconMore: {
        display: 'flex',
    },
})
