import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProfileComponent from '../components/ProfileComponent';
import LogOutComponent from '../components/LogOutComponent';

import { AuthContext } from '../context/AuthContext';
import general from '../styles/general';
import colors from '../styles/colors';


const ProfileScreen = (props) => {

    return (
        <AuthContext.Consumer>
        {(context) => (
            <View style={{flex: 1}}>
                <ProfileComponent user={context.user} navigation={props.navigation}  />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={general.buttonRadius} onPress={() => props.navigation.navigate("EditUser")}>
                        <View style={[styles.button, general.buttonEdit]}>
                            <Ionicons name="create" size={18} color={colors.carrotOrange} />
                            <Text style={[styles.buttonText, general.textEdit]}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={general.buttonRadius} onPress={() => LogOutComponent(props)}>
                        <View style={[styles.button, general.buttonWarning]}>
                            <Ionicons name="log-out" size={16} color={colors.venetianRed} />
                            <Text style={[styles.buttonText, general.textWarning]}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )}
        </AuthContext.Consumer>  
    );

}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignSelf: "center",
        width: 95,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: "row",
        position: "absolute",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        top: 105,
        width: "95%",
        height: 50,
        backgroundColor: colors.transparent,
    },
});

export default ProfileScreen;