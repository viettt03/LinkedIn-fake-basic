import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    router.replace('/(tabs)/home');
                }

            } catch (error) {
                console.log(error);
            }
        }

        checkLoginStatus();
    }, []);

    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }
        axios.post('http://10.0.2.2:3000/login', user).then((response) => {
            console.log(response);
            const token = response.data.token;
            AsyncStorage.setItem('authToken', token);
            router.replace('/(tabs)/home');
        })

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <View>
                <Image
                    style={{ width: 170, height: 140, resizeMode: 'contain' }}
                    source={{ uri: 'https://inrenhat.com/wp-content/uploads/2022/08/logo-Linkedin.jpg' }}
                >

                </Image>
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 20, fontWeight: '700', marginTop: 12, color: '#041E42' }}
                    >
                        Log in your Account
                    </Text>
                </View>

                <View style={{ marginTop: 60 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center', gap: 5,
                        backgroundColor: '#e0e0e0',
                        paddingVertical: 5, borderRadius: 5,
                        marginTop: 30,
                    }}>
                        <MaterialIcons style={{ marginLeft: 15 }} name="email" size={24} color="black" />
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{ color: 'gray', marginVertical: 10, width: 300, fontSize: 17 }}
                            placeholder='enter your Email' />
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: '#e0e0e0',
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginTop: 30,
                    }}>
                        <Entypo style={{ marginLeft: 15 }} name="lock" size={24} color="black" />
                        <TextInput
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            style={{ color: 'gray', marginVertical: 10, width: 300, fontSize: 17 }}
                            placeholder='enter your Password'
                        />
                    </View>
                </View>

                <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <Text>Keep me logged in</Text>
                    <Text style={{
                        color: '#007FFF',
                        fontWeight: '500'
                    }}
                    >Forgot Password</Text>
                </View>

                <View style={{ marginTop: 70 }}>
                    <Pressable
                        onPress={handleLogin}
                        style={{ width: 200, backgroundColor: '#0072b1', borderRadius: 6, marginLeft: 'auto', marginRight: 'auto', padding: 15 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 17, fontWeight: 'bold' }}>Login</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.replace('/register')}
                        style={{ marginTop: 15 }}
                    >
                        <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>Don't have an account? <Text style={{ color: '#007FFF', }}>Sign Up</Text> </Text>

                    </Pressable>
                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default login

const styles = StyleSheet.create({})