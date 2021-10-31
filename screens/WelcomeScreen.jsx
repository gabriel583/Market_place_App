import React, { useEffect } from 'react';
import { Text, StyleSheet, View, ImageBackground, Image, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";

import general from '../styles/general';
import colors from '../styles/colors';

const WelcomeScreen = (props) => {

  const getData = async () => {
    let loggedUser = [];
    await AsyncStorage.getItem("logged").then((req) => JSON.parse(req)).then((json) => (loggedUser = json)).catch((error) => console.error(error));
    if (loggedUser !== null) {
      props.navigation.navigate("App", { user: loggedUser });
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <ImageBackground style={general.background} source={require('../assets/background.jpg')}>
      <Image style={styles.logo} source={require('../assets/logo-welcome.png')}/>
      <View style={styles.buttonContainer}>
        <TouchableHighlight style={general.buttonRadius} onPress={() => props.navigation.navigate("SignIn")}>
          <View style={[general.buttonPrimary, styles.loginButton]}>
            <Ionicons name="navigate" color={colors.columbiaBlue} size={32} style={{right: 8}}/>
            <Text style={[general.textPrimary, styles.loginText]}>Sign In</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={[general.buttonRadius, {marginTop: 15}]} onPress={() => props.navigation.navigate("Register")}>
          <View style={[general.buttonSecondary, styles.registerButton]}>
            <Ionicons name="person-add" color={colors.indigoDye} size={22} style={{right: 3}}/>
            <Text style={[general.textSecondary, styles.registerText]}>Register</Text>
          </View>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
  
}

const styles = StyleSheet.create({
  logo: {
    flex: 1,
    top: 30,
    resizeMode: "contain",
    width: "90%",
  },
  buttonContainer: {
    flex: 1,
    top: 55,
    alignItems: "center",
  },
  loginButton: {
    minWidth: "50%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontSize: 30,
  },
  registerButton: {
    minWidth: "36%",
    height: 45,
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    fontSize: 20,
  },
});

export default WelcomeScreen;
