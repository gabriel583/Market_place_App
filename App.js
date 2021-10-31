import "react-native-gesture-handler";
import React, { Component, useState } from "react";
import { View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/SignInScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SellerProfileScreen from "./screens/SellerProfileScreen";
import UserProductsScreen from "./screens/UserProductsScreen";
import EditUserScreen from "./screens/EditUserScreen";
import AddCategoryScreen from "./screens/AddCategoryScreen";
import AddProductScreen from "./screens/AddProductScreen";
import SearchCategoryScreen from "./screens/SearchCategoryScreen";
import SearchScreen from "./screens/SearchScreen";
import EditProductScreen from "./screens/EditProductScreen";

// Others
import { AuthContext } from "./context/AuthContext";
import general from "./styles/general";
import colors from "./styles/colors";
import apiConfig from "./config/api.config";

// Navigation
function WelcomeNav({ navigation }) {
  return <WelcomeScreen navigation={navigation} />;
}

function SignInNav({ navigation }) {
  return <SignInScreen navigation={navigation} />;
}

function RegisterNav({ navigation }) {
  return <RegisterScreen navigation={navigation} />;
}

function HomeNav({ navigation }) {
  return <HomeScreen navigation={navigation} />;
}

function ProductNav({ navigation, route }) {
  return <ProductScreen navigation={navigation} route={route} />;
}

function ProfileNav({ navigation, route }) {
  return <ProfileScreen navigation={navigation} route={route} />;
}

function SellerProfileNav({ navigation, route }) {
  return <SellerProfileScreen navigation={navigation} route={route} />;
}

function UserProductsNav({ navigation, route }) {
  return <UserProductsScreen navigation={navigation} route={route} />;
}

function EditUserNav({ navigation }) {
  return <EditUserScreen navigation={navigation} />;
}

function AddCategoryNav({ navigation }) {
  return <AddCategoryScreen navigation={navigation} />;
}

function AddProductNav({ navigation, route }) {
  return <AddProductScreen navigation={navigation} route={route} />;
}

function SearchCategoryNav({ navigation, route }) {
  return <SearchCategoryScreen navigation={navigation} route={route} />;
}

function SearchNav({ navigation }) {
  return <SearchScreen navigation={navigation} />;
}

function EditProductNav({ navigation, route }) {
  return <EditProductScreen navigation={navigation} route={route} />;
}

// Auth Stack Navigation
const StackAuth = createStackNavigator();
function NavAuth(logged) {
  return (
    <StackAuth.Navigator
      initialRouteName={logged ? "App" : "Welcome"}
      headerMode="none"
    >
      <StackAuth.Screen name="Welcome" component={WelcomeNav} />
      <StackAuth.Screen name="SignIn" component={SignInNav} />
      <StackAuth.Screen name="Register" component={RegisterNav} />
      <StackAuth.Screen name="App" component={NavTab} />
    </StackAuth.Navigator>
  );
}

// Tab Navigation
const Tab = createBottomTabNavigator();
function NavTab(props) {
  const [user, setUser] = useState(props.route.params.user);
  const [currentContext, setCurrentContext] = useState({
    user: user,
    updateUser: async () => {
      await getUserById(user.Id);
    },
  });

  // Get User By Id From DB
  const getUserById = async (id) => {
    await fetch(apiConfig.URI + "/users/" + id)
      .then((response) => response.json())
      .then((json) => updateProvider(json))
      .catch((error) => console.error(error));
  };

  // Update Context Provider Value
  const updateProvider = (newUserData) => {
    setUser(newUserData);
    setCurrentContext({
      user: newUserData,
      updateUser: async () => {
        await getUserById(user.Id);
      },
    });
  };

  return (
    <AuthContext.Provider value={currentContext}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "SearchScreen") {
              iconName = focused ? "search" : "search-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: colors.mountainMeadow,
          inactiveTintColor: colors.columbiaBlue,
          inactiveBackgroundColor: colors.indigoDye,
          activeBackgroundColor: colors.skobeloffBorder,
          showLabel: false,
        }}
      >
        <Tab.Screen name="Home" component={NavProduct} />
        <Tab.Screen name="SearchScreen" component={NavSearch} />
        <Tab.Screen name="Profile" component={NavUser} />
      </Tab.Navigator>
    </AuthContext.Provider>
  );
}

// Product Stack Navigation
const Stack = createStackNavigator();
function NavProduct() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={HomeNav} />
      <Stack.Screen name="Product" component={ProductNav} />
      <Stack.Screen name="AddProduct" component={AddProductNav} />
      <Stack.Screen name="AddCategory" component={AddCategoryNav} />
      <Stack.Screen name="Profile" component={ProfileNav} />
      <Stack.Screen name="EditUser" component={EditUserNav} />
      <Stack.Screen name="SellerProfile" component={SellerProfileNav} />
      <Stack.Screen name="UserProducts" component={UserProductsNav} />
      <Stack.Screen name="SearchCategory" component={SearchCategoryNav} />
      <Stack.Screen name="EditProduct" component={EditProductNav} />
    </Stack.Navigator>
  );
}

// Search Stack Navigation
const StackSearch = createStackNavigator();
function NavSearch(props) {
  return (
    <StackSearch.Navigator initialRouteName="Search" headerMode="none">
      <StackSearch.Screen name="Search" component={SearchNav} />
      <StackSearch.Screen name="Product" component={ProductNav} />
      <StackSearch.Screen name="Profile" component={ProfileNav} />
      <StackSearch.Screen name="EditUser" component={EditUserNav} />
      <StackSearch.Screen name="SellerProfile" component={SellerProfileNav} />
      <StackSearch.Screen name="UserProducts" component={UserProductsNav} />
      <StackSearch.Screen name="EditProduct" component={EditProductNav} />
    </StackSearch.Navigator>
  );
}

// User Stack Navigation
const StackUser = createStackNavigator();
function NavUser(props) {
  return (
    <StackUser.Navigator initialRouteName="Profile" headerMode="none">
      <StackUser.Screen name="Profile" component={ProfileNav} />
      <StackUser.Screen name="EditUser" component={EditUserNav} />
      <StackUser.Screen name="UserProducts" component={UserProductsNav} />
      <StackUser.Screen name="Product" component={ProductNav} />
      <StackUser.Screen name="EditProduct" component={EditProductNav} />
    </StackUser.Navigator>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={general.container}>
        <SafeAreaView style={general.containerSafe}>
          <NavigationContainer>
            {NavAuth(this.context.isLogged)}
          </NavigationContainer>
        </SafeAreaView>
      </View>
    );
  }
}

App.contextType = AuthContext;

export default App;
