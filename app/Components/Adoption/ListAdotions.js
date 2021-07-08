import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Image } from "react-native-elements";
import { size } from "lodash";

export default function ListAdotions(props) {
    const { navigation, loading, data, handleLoadMore } = props;

    return (
        <>
            {size(data) > 0 ? (
                <View>
                    <FlatList
                        data={data}
                        renderItem={(animalData) => <RegisterData dataRegister={animalData} navigation={navigation}/>}
                        keyExtractor={(item,index) => index.toString()}
                        onEndReachedThreshold={0.5}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={<Footer loading={loading}/>}
                    />
                </View>
            ) : (
                <View style={styles.loaderContainerCenter}>
                    <ActivityIndicator size="large" color="#000"/>
                    <Text style={styles.textLoading}>Cargando...</Text>
                </View>
            )}
        </>
    )
};

function RegisterData(props) {
    
    const {dataRegister, navigation} = props;
    const {name, address, description, id, images} = dataRegister.item;
    const firstImage= images[0];

    const goRegister = () => {
        navigation.navigate("adopccion",{
            id,
            name
        })
    }

    return(
        <TouchableOpacity onPress={goRegister}>
            <View style={styles.viewRegister}>
                <View style={styles.viewRegisterImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator size="large"/>}
                        source={
                            firstImage ? 
                                {uri: firstImage}
                            : 
                                require("../../../assets/img/no-image.png")
                            
                        }
                        style={styles.imageRegister}
                    />
                </View>
                <View>
                    <Text>{name}</Text>
                    <Text>{address}</Text>
                    <Text>{description.substr(0,60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

function Footer(props) {
    const {loading} = props;

    if (loading) {
        return (
            <View style={styles.containerFooter}>
                <ActivityIndicator size="large" color="#000"/>
            </View>
        )
    } else {
        return (
            <View style={styles.containerFooter}>
                <Text>No quedan registros por cargar</Text>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    loaderContainerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textLoading: {
        marginTop: 10,
    },
    viewRegister: {
        flexDirection: "row",
        margin: 10,
        width: "70%",
    },
    viewRegisterImage: {
        marginRight: 15,
    },
    imageRegister: {
        width: 80,
        height: 80,
    },
    containerFooter: {
        marginTop: 10,
        alignItems: "center",
    },  
})
