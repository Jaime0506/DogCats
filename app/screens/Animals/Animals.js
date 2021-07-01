import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native"; 

//import firebase store

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

//import components

import ListAnimals from '../../Components/Animals/ListAnimals';

const db = firebase.firestore(firebaseApp);

export default function Animals(props) {
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [animals, setAnimals] = useState([]);
    const [totalAnimals, setTotalAnimals] = useState(0);
    const [startAnimals, setStartAnimals] = useState(null);
    const [loading, setLoading] = useState(false);

    const limitAnimals = 10;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        })
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.collection("registers")
                .get()
                .then((snap) => {
                    setTotalAnimals(snap.size);
                });

            const resultAnimals = [];
            
            db.collection("registers")
                .orderBy("createAt","desc")
                .limit(limitAnimals)
                .get()
                .then((response) => {
                    setStartAnimals(response.docs[response.docs.length - 1]);
                    response.forEach((doc) => {
                        const animal = doc.data();
                        animal.id = doc.id;
                        resultAnimals.push(animal);
                    });
                    setAnimals(resultAnimals);
                });            
        },[])
    );
    const handleLoadMore = () => {
        const resultAnimals = [];
        animals.length < totalAnimals && setLoading(true);

        db.collection("registers")
            .orderBy("createAt","desc")
            .startAfter(startAnimals.data().createAt)
            .limit(limitAnimals)
            .get()
            .then((response) => {
                if (response.docs.length > 0) {
                    setStartAnimals(response.docs[response.docs.length - 1]);
                } else {
                    setLoading(false);
                }
                response.forEach((doc) => {
                    const animal = doc.data();
                    animal.id = doc.id;
                    resultAnimals.push(animal);
                })
                setAnimals([...animals, ...resultAnimals]);
            });
    };

    return (
        <View style={styles.viewBody}>
            <ListAnimals 
                animals={animals} 
                handleLoadMore={handleLoadMore} 
                loading={loading} 
                navigation={navigation}                   
            />

            {user && (
                <Icon
                    reverse
                    type="material-community"
                    name="plus"
                    color="#FF6800"
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("add-animals")}
               />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,        
    }
})
