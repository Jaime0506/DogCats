import React, {useState, useRef} from 'react';
import {View, Text} from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../Components/Loading";
import AddAnimalsForm from "../../Components/Animals/AddAnimalsForm";

export default function AddAnimals(props) {
    const { navigation } = props;
    const [loading, setLoading] = useState(false);
    const toastRef = useRef();

    return(
        <View>
            <AddAnimalsForm
                toastRef={toastRef}
                setLoading={setLoading}
                navigation={navigation}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Funciona mani"/>
        </View>
    )
};