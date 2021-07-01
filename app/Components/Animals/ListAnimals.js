import React from 'react';
import { StyleSheet, 
        Text, View, 
        ActivityIndicator, 
        FlatList, 
        TouchableOpacity } from 'react-native';
import { Image } from "react-native-elements";
import { size } from "lodash";

export default function ListAnimals(props) {
    const { handleLoadMore, animals, loading, navigation } = props;

    return (
        <>
            {size(animals) > 0 ? (
                <View>
                    <FlatList
                        data={animals}
                        renderItem={(animalData) => <AnimalData animalData={animalData} navigation={navigation} />}
                        keyExtractor={(item,index) =>  index.toString()}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={<Footer loading={loading}/>}                        
                    />
                </View>
            ) : (
                <View style={styles.loaderContainerCenter}>
                    <ActivityIndicator size="large"/> 
                    <Text style={styles.textLoader}>Cargando...</Text>
                </View>
            )}
        </>
    )
};
function AnimalData(props) {
    const { animalData, navigation } = props;
    const { name, images, descripccion, id, addres } = animalData.item;
    const firstImage = images[0];

    const goRegister = () => {
        navigation.navigate("animal", {
            id,
            name,
        })
    };

    return(
        <TouchableOpacity onPress={goRegister}>
            <View style={styles.viewAnimal}>
                <View style={styles.viewAnimalImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="fff"/>}
                        source={
                            firstImage ? 
                                {uri: firstImage}
                             : 
                                require("../../../assets/img/no-image.png")
                            
                        }
                        style={styles.imageAnimal}
                    />         
                </View>
                <View>
                    <Text>{name}</Text>
                    <Text>{addres}</Text>
                    <Text>{descripccion.substr(0,60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};
function Footer(props) {
    const {loading} = props;
    
    if (loading) {
        return (
            <View style={styles.loaderContainerCenter}>
                <ActivityIndicator size="large"/>
            </View>
        )
    } else {
        return (
            <View style={styles.notFoundAnimals}>
                <Text>No quedan registros por mostrar</Text>
            </View>
        )
    }
};

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
        width: "70%",
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
