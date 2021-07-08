import React, { useState, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-easy-toast';
import AddAnimalAdoptionForm from '../../Components/Adoption/AddAnimalAdoptionForm';

export default function AddAnimalAdoption(props) {
    const { navigation, route } = props;
    const { id } = route.params;

    const [loading, setLoading] = useState(false);
    const toastRef = useRef();

    return (
        <View>
            <AddAnimalAdoptionForm
                toastRef={toastRef}
                setLoading={loading}
                navigation={navigation}
                id={id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </View>
    )
}

const styles = StyleSheet.create({})
