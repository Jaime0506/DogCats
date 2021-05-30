import React, { useState } from 'react';
import { StyleSheet, View, Text} from "react-native";
import { map } from "lodash";
import Modal from "../Modal";
import { ListItem } from 'react-native-elements';
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props){
    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [isVisible, setIsVisible] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectComponent = (key) => {
        switch (key){
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        setIsVisible={setIsVisible}
                        displayName={userInfo.displayName}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setIsVisible(true);                
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        setIsVisible={setIsVisible}
                        email={userInfo.email}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setIsVisible(true);                
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                        setIsVisible={setIsVisible}
                    />
                );
                setIsVisible(true);                
                break;
            default:
                setRenderComponent(null);
                break;
        }
    }
    const menuOptions = generateOptions(selectComponent);
    return(
        <View>
            {map(menuOptions, (menu,index) => (
                <ListItem
                    key={index}
                    title={menu.title}
                    containerStyle={styles.menuItem}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}     
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight,
                    }}
                    onPress={menu.onPress}               
                />
            ))}            
            {renderComponent && (
                <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
                    {renderComponent}
                </Modal>
            )}
        </View>
        
    )
};
function generateOptions (selectComponent) {
    return [
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#FF6800",
            
            iconNameRight: "chevron-right",
            iconColorRight: "#FF6800",
            onPress: () => selectComponent("displayName"),
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#FF6800",
            
            iconNameRight: "chevron-right",
            iconColorRight: "#FF6800",
            onPress: () => selectComponent("email"),
        },
        {
            title: "Cambiar Contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#FF6800", 

            iconNameRight: "chevron-right",
            iconColorRight: "#FF6800",
            onPress: () => selectComponent("password"),
        }
    ]
};
const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1.2,
        borderBottomColor: "#e3e3e3",
    }
});