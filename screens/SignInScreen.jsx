import React, { Component } from 'react';
import { View, TextInput, Text, TouchableHighlight, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors from '../styles/colors';
import general from '../styles/general';
import apiConfig from '../config/api.config';

class SignInScreen extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            Username: "",
            Password: "",
            loggedUser: [],
            warning: ""
        }
    }

    setStateFor = (key, val) => {
        this.setState({
            [key]: val
        });
    }

    verifyUser = async () => {

        if (this.state.Username !== undefined && this.state.Password !== undefined) {

            await this.getUser(this.state.Username, this.state.Password);
            if (this.state.loggedUser.Username) {
                await AsyncStorage.setItem("logged", JSON.stringify(this.state.loggedUser));
                
                this.setStateFor("warning", "");
                this.props.navigation.navigate("App", { user: this.state.loggedUser });
            }
            else {
                this.setStateFor("warning", "Wrong combination of username and password!");
            }
        }
        else {
            this.setStateFor("warning", "No username or password provided!");
        }
    }

    getUser = async (u, p) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: u, Password: p })
        };

        await fetch(apiConfig.URI + '/users/signIn', requestOptions)
            .then((response) => response.json())
            .then((json) => this.setStateFor("loggedUser", json))
            .catch((error) => console.error(error));
    }

    registerUser = () => {
        this.props.navigation.navigate("Register");
    }

    render() {
        return (
            <ImageBackground style={general.background} source={require('../assets/background.jpg')}>
                <View style={styles.titleContainer}>
                    <Text style={general.title}>Welcome back!</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.rowContainer}>
                        <View style={general.inputIcon}>
                            <Ionicons name="person" color={colors.mountainMeadow} size={22}/>
                        </View>
                        <TextInput
                            placeholder="Username"
                            style={general.input}
                            onChangeText={(value) => this.setStateFor("Username", value)}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={general.inputIcon}>
                            <Ionicons name="lock-closed" color={colors.mountainMeadow} size={22}/>
                        </View>
                        <TextInput
                            placeholder="Password"
                            style={general.input}
                            onChangeText={(value) => this.setStateFor("Password", value)}
                            secureTextEntry
                        />
                    </View>
                    {this.state.warning !== "" ? <Text style={[general.warning, {marginTop: 10}]}>{this.state.warning}</Text> : null}
                    <TouchableHighlight style={[general.buttonRadius, {marginTop: 10}]} onPress={this.verifyUser}>
                        <View style={[general.buttonPrimary, styles.button]}>
                            <Ionicons name="chevron-up-circle-outline" color={colors.columbiaBlue} size={22} style={{right: 3}}/>
                            <Text style={[styles.buttonText, general.textPrimary]}>Sign In</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.registerContainer}>
                    <View style={[general.separator, {bottom: 40}]}/>
                    <Text style={[general.lowerText, general.lowerTextBackground]}>Don't have an account?</Text>
                    <View style={general.lowerTextBackground}>
                        <Text style={general.lowerText}>Create a new account</Text>
                        <TouchableHighlight onPress={this.registerUser} underlayColor={colors.transparent}>
                            <Text style={styles.clickText}>here</Text>
                        </TouchableHighlight>
                        <Text style={general.lowerText}>!</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2.5,
    },
    titleContainer: {
        flex: 1.5,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    inputContainer: {
        flex: 2,
        alignItems: "center",
        justifyContent: 'center'
    },
    registerContainer: {
        flex: 1,
        alignItems: "center",
    },
    button: {
        minWidth: "40%",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 20,
    },
    clickText: {
        color: colors.skobeloffBorder,
        fontWeight: "bold",
    },
});

export default SignInScreen;
