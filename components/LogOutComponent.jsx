import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const logOutAlert = (props) => {
    Alert.alert("Are you sure you want to log out?", "You will need to sign in again to access Sell It!", [
        {
            text: "Cancel",
            style: "cancel",
        },
        {
            text: "Log out",
            onPress: async () => {
                await AsyncStorage.removeItem("logged");
                props.navigation.navigate("Welcome");
            },
        },
    ]);
};

export default logOutAlert;