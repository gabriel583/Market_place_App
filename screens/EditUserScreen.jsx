import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, TouchableHighlight, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from 'buffer';

import { AuthContext } from '../context/AuthContext';
import general from '../styles/general';
import colors from '../styles/colors';
import apiConfig from '../config/api.config';

class EditUserScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            name: "",
            username: "",
            email: "",
            phone: "",
            avatar: "",
            password: "",
            passwordTest: "",
            warning: "",
            loggedUser: []
        }
    }
    
    componentDidMount() {
        this.setStateFor("userId", this.context.user.Id);
        this.setStateFor("username", this.context.user.Username);
        this.setStateFor("name", this.context.user.Name);
        this.setStateFor("email", this.context.user.Email);
        this.setStateFor("phone", this.context.user.Phone);
        this.setStateFor("avatar", new Buffer.from(this.context.user.Avatar).toString("ascii"));
        this.setStateFor("password", this.context.user.Password);
    }

    setStateFor = (key, val) => {
        this.setState({
            [key]: val
        });
    }

    goToProfile = () => {
        this.props.navigation.pop();
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

    saveUser = async () => {

        if (this.state.name != undefined && this.state.name.length <= 64 &&
            this.state.email != undefined && this.state.email.length <= 64 &&
            this.validateEmail(this.state.email) &&
            this.state.phone != undefined &&
            this.validatePhone(this.state.phone) &&
            this.state.avatar != undefined &&
            this.state.password != undefined && this.state.password.length <= 32 &&
            this.validatePassword(this.state.password)) {

            if (this.state.password === this.state.passwordTest) {
                await this.updateUser(
                    this.state.name,
                    this.state.email,
                    this.state.phone,
                    this.state.avatar,
                    this.state.password);
    
                this.setStateFor("warning", "");
                await AsyncStorage.mergeItem("logged", JSON.stringify(this.state.loggedUser));
                this.props.navigation.navigate("Profile");
            } else {
                this.setStateFor("warning", "The passwords don't match!");
            }
            
        } else if(this.state.name.length > 64) {
            this.setStateFor("warning", "Full name has too many caracters! (maximum 64)");
        } else if(this.state.email.length > 64) {
            this.setStateFor("warning", "Email address has too many caracters! (maximum 64)");
        } else if(this.state.password.length > 32) {
            this.setStateFor("warning", "Password has too many caracters! (maximum 32)");
        } else if (!this.validateEmail(this.state.email)) {
            this.setStateFor("warning", "Insert a valid email! (with '@' and '.')");
        } else if (!this.validatePhone(this.state.phone)) {
            this.setStateFor("warning", "Insert a valid number! (9 digits)");
        } else if (!this.validatePassword(this.state.password)) {
            this.setStateFor("warning", "Insert a valid password! (8 characters minimum)");
        } else {
            this.setStateFor("warning", "Insert proper information into the fields!");
        }

    }

    updateUser = async (name, email, phone, avatar, password) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: name,
                Email: email,
                Phone: phone,
                Avatar: avatar,
                Password: password,
                loggedUser: []
            })
        };

        await fetch(`${apiConfig.URI}/users/${this.state.userId}`, requestOptions)
            .then((response) => response.json())
            .then((json) => this.setStateFor("loggedUser", json))
            .catch((error) => console.error(error));

        this.context.updateUser();
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

    getAvatar = (avatar) => {
        if (avatar) {
          const img = new Buffer.from(avatar).toString("ascii")
          return <Image source={{uri: img}} style={styles.avatar} />
        }
        else {
          return <Image source={require('../assets/anon.jpg')} style={styles.avatar} />
        }
    }

    render() {
        return (
            
            <View style={general.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatarBackContainer} source={require('../assets/background.jpg')}/>
                        <View style={styles.empty}></View>
                        {this.getAvatar(this.state.avatar)}
                        <View style={styles.avatarIcon}>
                            <TouchableOpacity onPress={this.pickImage}>
                                <Ionicons name="document-attach" color={colors.indigoDye} size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.usernameText}>{this.state.username}</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="person" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Name"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("name", value)}
                                defaultValue={this.state.name}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="mail" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Email"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("email", value)}
                                defaultValue={this.state.email}
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="call" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Phone"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("phone", value)}
                                defaultValue={this.state.phone}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={[general.separator, {marginTop: 5, marginBottom: 12.5}]}></View>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="lock-closed" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Password"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("password", value)}
                                defaultValue={this.state.password}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="lock-open" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Password"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("passwordTest", value)}
                                secureTextEntry
                            />
                        </View>
                    </View>
                    {this.state.warning !== "" ? 
                    <Text style={[general.warning, {maxWidth: "80%", marginTop: 10, marginBottom: -10, alignSelf: "center"}]}>
                        {this.state.warning}
                    </Text> 
                    : 
                    null}
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight style={general.buttonRadius} onPress={this.goToProfile}>
                            <View style={[styles.button, general.buttonCancel]}>
                                <Text style={[styles.buttonText, general.textCancel]}>Cancel</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={general.buttonRadius} onPress={this.saveUser}>
                            <View style={[styles.button, general.buttonPrimary]}>
                                <Text style={[styles.buttonText, general.textPrimary]}>Save</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>

        )
    }
}

EditUserScreen.contextType = AuthContext;

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignSelf: "center",
        width: 125,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-around",
        alignItems: "center",
        width: "95%",
        marginTop: 20,
        height: 50,
        backgroundColor: colors.transparent,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2.5,
    },
    usernameText: {
        fontSize: 16,
        color: colors.indigoDye,
        fontStyle: "italic",
        textAlign: "center",
        maxWidth: "100%",
        alignSelf: "center",
    },
    nameContainer: {
        marginTop: -20,
        flexWrap: "wrap",
        alignContent: "center",
    },
    inputContainer: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
    avatarIcon: {
        backgroundColor: colors.white,
        height: 44,
        width: 44,
        borderRadius: 44 / 2,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: (Dimensions.get("window").width / 2) - 75,
        bottom: 25,
      },
    avatar: {
        position: "absolute",
        height: 150,
        width: 150,
        borderRadius: 150 / 2,
        borderWidth: 2,
        borderColor: colors.columbiaBlue,
        alignSelf: "center",
    },
    empty: {
        height: "100%",
        width: "100%",
    },
    avatarBackContainer: {
        height: "100%",
        backgroundColor: colors.columbiaBlue,
        resizeMode: "cover",
    },
    avatarContainer: {
        height: 200,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.columbiaBlue,
    },
});

export default EditUserScreen;
