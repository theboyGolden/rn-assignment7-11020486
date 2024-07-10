import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                let items = await AsyncStorage.getItem('cartItems');
                items = items ? JSON.parse(items) : [];
                setCartItems(items);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCartItems();
    }, []);

    const removeFromCart = async (itemKey) => {
        try {
            let items = await AsyncStorage.getItem('cartItems');
            items = items ? JSON.parse(items) : [];
            const updatedItems = items.filter(item => item.key !== itemKey);
            setCartItems(updatedItems);
            await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
        } catch (error) {
            console.error(error);
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(String(item.price).replace('$', ''));
            return total + (isNaN(price) ? 0 : price);
        }, 0).toFixed(2);
    };

    const Footer = () => (
        <View style={styles.footer}>
            <Text style={styles.totalPriceText}>Est. Total: ${calculateTotalPrice()}</Text>
            <TouchableOpacity style={styles.checkoutButton}>
                <Image source={require('../assets/shoppingBag_w.png')} style={{ marginLeft: 90, marginRight: 25, height: 25, width: 20 }}/>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
        </View>
    );

    // const Header = () => (
    //     <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 120 }}>
    //         <Image source={require('../assets/Logo.png')} style={{ marginLeft: 30 }} />
    //         <View style={{ flexDirection: 'row', marginLeft: 80 }}>
    //             <Image source={require('../assets/Search.png')} style={{ marginRight: 20 }} />
    //         </View>
    //     </View>
    // );

    return (
        <SafeAreaView style={styles.container}>
            {/* <Header /> */}
            <Text style={{ fontFamily: 'Verdana', fontWeight: '500', fontSize: 26, textAlign: 'center' }}>Checkout</Text>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}>
                        <View style={styles.item}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View style={styles.detaildiv}>
                                <Text style={styles.itemText}>{item.title}</Text>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                            <TouchableOpacity 
                                style={{ marginLeft: 30, paddingTop: 20 }} 
                                onPress={() => removeFromCart(item.key)}
                            >
                                <Image source={require('../assets/remove.png')} style={styles.removefromCartIcon} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => item.key ? item.key.toString() : index.toString()}
                ListFooterComponent={<Footer />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    item: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        alignItems: 'center',
    },
    itemText: {
        color: '#000',
        fontFamily: 'Verdana',
        fontSize: 18,
    },
    descriptionText: {
        color: '#ABABAB',
        fontSize: 14,
    },
    price: {
        color: '#ff7733',
        fontSize: 16,
    },
    itemImage: {
        width: 80,
        height: 100,
    },
    removefromCartIcon: {
        width: 25,
        height: 25,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    totalPriceText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    checkoutButton: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    detaildiv: {
        marginLeft: 10,
        width: 180,
    }
});
