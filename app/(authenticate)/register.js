import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');

    const router = useRouter();

    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            profileImage: image
        }
        // console.log(user);


        axios.post("http://10.0.2.2:3000/register", user).then((response) => {
            console.log('check', response);
            Alert.alert('Registration successful', 'You have been registered successful');
            setName('');
            setEmail('');
            setPassword('');
            setImage('');

        }).catch((error) => {
            Alert.alert('Registration failed', 'An error occurred while registering');
            console.log('registration failed', error.message);
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <View>
                <Image
                    style={{ width: 150, height: 100, resizeMode: 'contain' }}
                    source={{ uri: 'https://inrenhat.com/wp-content/uploads/2022/08/logo-Linkedin.jpg' }}
                >

                </Image>
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 20, fontWeight: '700', marginTop: 12, color: '#041E42' }}
                    >
                        Register to your Account
                    </Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center', gap: 5,
                        backgroundColor: '#e0e0e0',
                        paddingVertical: 5, borderRadius: 5,
                        marginTop: 30,
                    }}>
                        <Ionicons style={{ marginLeft: 15 }} name="person" size={24} color="black" />
                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={{ color: 'gray', marginVertical: 7, width: 300, fontSize: 17 }}
                            placeholder='enter your name' />
                    </View>
                </View>

                <View style={{ marginTop: 0 }}>
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
                            style={{ color: 'gray', marginVertical: 7, width: 300, fontSize: 17 }}
                            placeholder='enter your Email' />
                    </View>
                </View>
                <View style={{ marginTop: 0 }}>
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
                            style={{ color: 'gray', marginVertical: 7, width: 300, fontSize: 17 }}
                            placeholder='enter your Password'
                        />
                    </View>
                </View>

                <View style={{ marginTop: 0 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center', gap: 5,
                        backgroundColor: '#e0e0e0',
                        paddingVertical: 5, borderRadius: 5,
                        marginTop: 30,
                    }}>
                        <Entypo style={{ marginLeft: 15 }} name="image" size={24} color="black" />
                        <TextInput
                            value={image}
                            onChangeText={(text) => setImage(text)}
                            style={{ color: 'gray', marginVertical: 7, width: 300, fontSize: 17 }}
                            placeholder='enter your image url' />
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

                <View style={{ marginTop: 50 }}>
                    <Pressable
                        onPress={handleRegister}
                        style={{ width: 200, backgroundColor: '#0072b1', borderRadius: 6, marginLeft: 'auto', marginRight: 'auto', padding: 15 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 17, fontWeight: 'bold' }}>Register</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.replace('/login')}
                        style={{ marginTop: 15 }}
                    >


                        <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>Already have an account? <Text style={{ color: '#007FFF', }}>Sign Up</Text> </Text>

                    </Pressable>
                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default register

const styles = StyleSheet.create({})