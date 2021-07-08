import React, { useState ,useEffect, useCallback } from 'react'
import { View, Text, StyleSheet} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";

import ListAdoptions from "../../Components/Adoption/ListAdotions";

const db = firebase.firestore(firebaseApp);

export default function Adopcciones(props) {

    const { navigation } = props;
    const [user, setUser] = useState({});
    const [registers, setRegisters] = useState([])
    const [totalRegister, setTotalRegister] = useState(0);
    const [startRegister, setStartRegister] = useState(null);
    const [loading, setLoading] = useState(false);

    const limitRegister = 10;

    useEffect(() => {
            firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        }); 
    },[])

    useFocusEffect(
        useCallback(() => {
            db.collection(`adoption-register`)
                .get()
                .then((snap) => {
                    setTotalRegister(snap.size);
                });

            const resultRegister = [];

            db.collection(`adoption-register`)
                .orderBy("createAt", "desc")
                .limit(limitRegister)
                .get()
                .then((response) => {
                    setStartRegister(response.docs[response.docs.length - 1]);
                    response.forEach((doc) => {
                        const animal = doc.data();
                        animal.id = doc.id;
                        resultRegister.push(animal);
                    });
                    setRegisters(resultRegister);
                });
        },[])
    );

    
    
    const handleLoadMore = () => {
        const resultRegister = [];
        registers.length < totalRegister && setLoading(true);

        db.collection(`adoption-register`)
            .orderBy("createAt", "desc")
            .startAfter(startRegister.data().createAt)
            .limit(limitRegister)
            .get()
            .then((response) => {
                if (response.docs.length > 0) {
                    setStartRegister(response.docs[response.docs.length - 1]);
                } else {
                    setLoading(false);
                }
                response.forEach((doc) => {
                    const registro = doc.data();
                    registro.id = doc.id;
                    resultRegister.push(registro);
                })
                setRegisters([...registers, ...resultRegister]);
            })
    }

    return(
        <View style={{flex: 1, backgroundColor:"#fff"}}>
            <ListAdoptions
                data={registers}
                loading={loading}
                navigation={navigation}
                handleLoadMore={handleLoadMore}
            />
        </View>        
    );
};

const styles = StyleSheet.create({

})
