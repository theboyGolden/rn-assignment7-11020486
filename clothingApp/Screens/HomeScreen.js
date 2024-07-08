import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const numColumns = 2;

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        const URL = 'https://fakestoreapi.com/products';

        fetch(URL)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to fetch products. Please try again later.');
                setLoading(false);
            });
    };

    const formatData = (data, numColumns) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);

        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
            numberOfElementsLastRow++;
        }

        return data;
    };

    const addToCart = async (item) => {
        try {
            let cartItems = await AsyncStorage.getItem('cartItems');
            cartItems = cartItems ? JSON.parse(cartItems) : [];
            cartItems.push(item);
            await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
            alert(`${item.title} added to cart!`);
        } catch (error) {
            console.error(error);
        }
    };

    const GridItem = ({ item }) => {
        if (item.empty) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }

        return (
            <View style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <TouchableOpacity style={styles.cartIconContainer} onPress={() => addToCart(item)}>
                    <Image source={require('../assets/add_circle.png')} style={styles.cartIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.storyContainer}>
                    <Text style={styles.storyText}>OUR STORY</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image source={require('../assets/thumbnail.png')} style={styles.icon} />
                </View>
                <View style={styles.iconContainer}>
                    <Image source={require('../assets/filter.png')} style={styles.icon} />
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={formatData(products, numColumns)}
                    renderItem={({ item }) => <GridItem item={item} />}
                    numColumns={numColumns}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        marginTop: 10,
    },
    storyContainer: {
        paddingTop: 10,
    },
    storyText: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Verdana',
        paddingRight: 130,
    },
    iconContainer: {
        marginRight: 20,
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 30,
    },
    icon: {
        height: 25,
        width: 25,
    },
    item: {
        alignItems: 'left',
        justifyContent: 'center',
        flex: 1,
        marginTop: 60,
        margin: 5,
        marginBottom: 80,
        height: 230,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    itemText: {
        color: '#000',
        fontFamily: 'Verdana',
        paddingTop: 5,
    },
    price: {
        color: '#ff7733',
        fontSize: 18,
    },
    cartIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 5,
    },
    cartIcon: {
        width: 20,
        height: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        padding: 20,
    },
});

export default HomeScreen;
