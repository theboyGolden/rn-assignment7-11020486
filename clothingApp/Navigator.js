import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Screens/HomeScreen';
import CartScreen from './Screens/CartScreen';
import ProductDetailScreen from './Screens/ProductDetailScreen';

const Drawer = createDrawerNavigator();

const CustomHeader = ({ navigation }) => {
  return {
    headerTitle: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 70 }}>
        <Image source={require('./assets/Logo.png')} style={{marginRight: 30 }}/>
        <View style={{ flexDirection: 'row', marginLeft: 50,}}>
            <Image source={require('./assets/Search.png')} style={{ marginRight: 20}}/>
            <Image source={require('./assets/shoppingBag.png')} style={{ }}/>
        </View>
      </View>
    ),
  };
};

function DrawerGroup() {
  return (
    <Drawer.Navigator screenOptions={({ navigation }) => CustomHeader({ navigation })}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Cart" component={CartScreen}  />
      <Drawer.Screen name='Product Details' component={ProductDetailScreen} />
    </Drawer.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <DrawerGroup />
    </NavigationContainer>
  );
}
