import React, { Component } from 'react';
import { View, TextInput, Text, TouchableHighlight, Image, Platform, ScrollView, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';

import baseImage from '../assets/anon.jpg';
import colors from '../styles/colors';
import general from '../styles/general'
import apiConfig from '../config/api.config';

class RegisterScreen extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            phone: "",
            avatar: Image.resolveAssetSource(baseImage).uri,
            username: "",
            password: "",
            passwordTest: "",
            userList: [],
            warning: ""
        }
    }

    componentDidMount() {(async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.cancelled) {
            this.setState({ avatar: result.uri})
        }
    };

    setStateFor = (key, val) => {
        this.setState({
            [key]: val
        });
    }

    validatePhone = (phoneNumber) => {
        var re = /^[0-9]{9}$/;
        return re.test(phoneNumber);
    }

    validateEmail = (emailUser) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(emailUser);
    }

    validatePassword = (passwordUser) => {
        var re = /^.{8,}$/;
        return re.test(passwordUser);
    }

    registerUser = async () => {

        if (this.state.name !== undefined && this.state.name.length <= 64 &&
            this.state.email !== undefined && this.state.email.length <= 64 &&
            this.validateEmail(this.state.email) &&
            this.state.phone !== undefined &&
            this.validatePhone(this.state.phone) &&
            this.state.avatar !== undefined &&
            this.state.username !== undefined && this.state.username.length <= 32 && 
            this.validatePassword(this.state.password) &&
            this.state.password !== undefined && this.state.password.length <= 32) {

            if (this.state.password === this.state.passwordTest) {
                await this.createUser(this.state.name,
                    this.state.email, this.state.phone, this.state.avatar,
                    this.state.username, this.state.password);
    
                if (this.state.loggedUser.Username) {
                    this.setStateFor("warning", "");
                    this.props.navigation.navigate("App", { user: this.state.loggedUser })
                }
                else {
                    this.setStateFor("warning", "Insert proper information into the fields!");
                }
            } else {
                this.setStateFor("warning", "The passwords don't match!");
            }
        } else if(this.state.name.length > 64) {
            this.setStateFor("warning", "Full name has too many caracters! (maximum 64)");
        } else if(this.state.email.length > 64) {
            this.setStateFor("warning", "Email address has too many caracters! (maximum 64)");
        } else if(this.state.username.length > 32) {
            this.setStateFor("warning", "Username has too many caracters! (maximum 32)");
        } else if(this.state.password.length > 32) {
            this.setStateFor("warning", "Password has too many caracters! (maximum 32)");
        }  else if (!this.validateEmail(this.state.email)) {
            this.setStateFor("warning", "Insert a valid email! (with '@' and '.')");
        } else if (!this.validatePhone(this.state.phone)) {
            this.setStateFor("warning", "Insert a valid number! (9 digits)");
        } else if (!this.validatePassword(this.state.password)) {
            this.setStateFor("warning", "Insert a valid password! (8 characters minimum)");
        } else {
            this.setStateFor("warning", "Insert proper information into the fields!");
        }
        
    }

    signInUser = () => {
        this.props.navigation.navigate("SignIn")
    }

    createUser = async (name, email, phone, avatar, username, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: name,
                Email: email,
                Phone: phone,
                Avatar: avatar,
                Username: username,
                Password: password,
                loggedUser: []
            })
        };

        await fetch(apiConfig.URI + '/users', requestOptions)
            .then((response) => response.json())
            .then((json) => this.setStateFor("loggedUser", json))
            .catch((error) => console.error(error));
    }

    renderFileUri() {
        if (this.state.avatar) {
          return <Image source={{ uri: this.state.avatar }} style={styles.avatar} />
        }
    } 

    render() {
        return (
            <ImageBackground style={general.background} source={require('../assets/background.jpg')}>
                <ScrollView>
                        <View style={styles.titleContainer}>
                            <Text style={[general.title, {fontSize: 40}]}>Welcome to Sell It!</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.rowContainer}>
                                <View style={general.inputIcon}>
                                    <Ionicons name="person-circle" color={colors.mountainMeadow} size={22}/>
                                </View>
                                <TextInput
                                    placeholder="Username"
                                    style={general.input}
                                    onChangeText={(value) => this.setStateFor("username", value)}
                                />
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={general.inputIcon}>
                                    <Ionicons name="lock-closed" color={colors.mountainMeadow} size={22}/>
                                </View>
                                <TextInput
                                    placeholder="Password"
                                    style={general.input}
                                    onChangeText={(value) => this.setStateFor("password", value)}
                                    secureTextEntry
                                />
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={general.inputIcon}>
                                    <Ionicons name="lock-open" color={colors.mountainMeadow} size={22}/>
                                </View>
                                <TextInput
                                    placeholder="Confirm password"
                                    style={general.input}
                                    onChangeText={(value) => this.setStateFor("passwordTest", value)}
                                    secureTextEntry
                                />
                            </View>
                            <View style={[styles.separator, {marginTop: 5, marginBottom: 10}]}/>
                            <View style={styles.rowContainer}>
                                <View style={general.inputIcon}>
                                    <Ionicons name="person" color={colors.mountainMeadow} size={22}/>
                                </View>
                                <TextInput
                                    placeholder="Full name"
                                    style={general.input}
                                    onChangeText={(value) => this.setStateFor("name", value)}
                                />
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={general.inputIcon}>
                                    <Ionicons name="mail" color={colors.mountainMeadow} size={22}/>
                                </View>
                                <TextInput
                                    placeholder="Email address"
                                    style={general.input}
                                    onChangeText={(value) => this.setStateFor("email", value)}
                                    keyboardType="email-address"
                                />
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={general.inputIcon}>
                                    <Ionicons name="call" color={colors.mountainMeadow} size={22}/>
                                </View>
                                <TextInput
                                    placeholder="Phone number"
                                    style={general.input}
                                    onChangeText={(value) => this.setStateFor("phone", value)}
                                    keyboardType="phone-pad"
                                />
                            </View>
                            {this.state.warning !== "" ? <Text style={[general.warning, {marginTop: 5}]}>{this.state.warning}</Text> : null}
                            <View style={styles.avatarContainer}>
                                <View>{this.renderFileUri()}</View>
                                <View style={styles.avatarIcon}>
                                    <TouchableOpacity onPress={this.pickImage}>
                                        <Ionicons name="document-attach" color={colors.indigoDye} size={24} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableHighlight style={[general.buttonRadius, {marginTop: 20, marginBottom: 30}]} onPress={this.registerUser}>
                                <View style={[general.buttonPrimary, styles.button]}>
                                    <Ionicons name="chevron-up-circle-outline" color={colors.columbiaBlue} size={22} style={{right: 3}}/>
                                    <Text style={[styles.buttonText, general.textPrimary]}>Register</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.loginContainer}>
                            <View style={general.separator}/>
                            <Text style={[general.lowerText, general.lowerTextBackground, {marginTop: 30}]}>Already have an account?</Text>
                            <View style={general.lowerTextBackground}>
                                <Text style={general.lowerText}>Sign into your account</Text>
                                <TouchableHighlight onPress={this.signInUser} underlayColor={colors.transparent}>
                                    <Text style={styles.clickText}>here</Text>
                                </TouchableHighlight>
                                <Text style={general.lowerText}>!</Text>
                            </View>
                        </View>
                        <View style={{margin: 10}}/>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    avatarIcon: {
        backgroundColor: colors.white,
        height: 44,
        width: 44,
        borderRadius: 44 / 2,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: (Dimensions.get("window").width / 2) - 75,
        bottom: 0,
    },
    avatarContainer: {
        maxHeight: "100%",
        maxWidth: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    avatar: {
        height: 150,
        width: 150,
        borderRadius: 150 / 2,
        borderWidth: 2,
        borderColor: colors.skobeloff,
        alignSelf: "center",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2.5,
    },
    titleContainer: {
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 30,
    },
    inputContainer: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 30,
    },
    loginContainer: {
        alignItems: "center",
    },
    button: {
        minWidth: "40%",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonImage: {
        minWidth: "35%",
        height: 30,
    },
    buttonText: {
        fontSize: 20,
    },
    clickText: {
        color: colors.skobeloffBorder,
        fontWeight: "bold",
    },
    separator: {
        borderBottomColor: colors.skobeloff,
        borderBottomWidth: 2,
        minWidth: "70%",
        paddingVertical: 4,
    },
});

export default RegisterScreen;
