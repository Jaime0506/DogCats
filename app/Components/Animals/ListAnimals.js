import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from "react-native-elements";
import { size } from "lodash";

export default function ListAnimals(props) {
    const {animals, handleLoadMore, loading, navigation} = props;
    return (
        <>
            {size(animals) > 0 ?  (
                <View>
                    <FlatList 
                        data={animals}
                        renderItem={(data) => <Animal data={data} navigation={navigation}/>}
                        keyExtractor={(item,index) => index.toString()}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={<FooterList loading={loading}/>}
                    />
                </View>
            ) : (
                <View style={styles.loaderContainerCenter}>
                    <ActivityIndicator size="large"/>
                    <Text style={styles.textLoader}>Cargando Registros</Text>
                </View>
            )}
        </>
    )
};
function Animal(props) {
    const { data, navigation } = props;
    const { images, name, addres, descripccion, id } = data.item;
    const imagesAnimals = images[0];

    const goRegister = () => {
        navigation.navigate("animal", {
            id,
            name
        });
        console.log(id);
    };

    return(
        <TouchableOpacity onPress={goRegister}>
            <View style={styles.viewAnimal}>
                <View style={styles.viewAnimalImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="fff"/>}
                        source={
                            imagesAnimals ? 
                                {uri: imagesAnimals}
                             : 
                                require("../../../assets/img/no-image.png")
                            
                        }
                        style={styles.imageAnimal}

                    />
                </View>
                <View>
                    <Text style={styles.nameAnimals}>{name}</Text>
                    <Text style={styles.textInfoAnimal}>{addres}</Text>
                    <Text style={styles.textInfoAnimal}>{descripccion.substr(0,60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};
function FooterList(props){
    const { loading } = props;

    if(loading){
        return(
            <View style={styles.loaderContainerCenter}>
                <ActivityIndicator size="large"/>
            </View>
        )
    } else {
        return(
            <View style={styles.notFoundAnimals}> 
                <Text>No quedan registros por cargar</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    loaderContainerCenter: {
        flex:1,
        justifyContent: "center",
        alignItems: "center"        
    },    
    textLoader: {
        marginTop: 10,
    }, 
    viewAnimal: {
        flexDirection: "row",
        margin: 10,
    },
    viewAnimalImage: {
        marginRight: 15,
    },
    imageAnimal: {
        width: 80,
        height: 80,
    },
    nameAnimals: {
        fontWeight: "bold",
    },
    textInfoAnimal: {
        color: "grey",
        paddingTop: 5,
    },
    notFoundAnimals: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
})
