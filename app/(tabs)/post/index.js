import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../../../firebase';
import { useRouter } from 'expo-router';
import axios from 'axios';


const index = () => {
    const [description, setDescription] = useState('')
    const [userId, setUserId] = useState('')
    const [image, setImage] = useState('');
    const [user, setUser] = useState();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
        }
        fetchUser();
    }, []);
    //lay profile
    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId])

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3000/profile/${userId}`);
            const userData = response.data.user;
            setUser(userData)
        } catch (error) {
            console.log('Error fetching user profile'.error);
        }
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        // console.log("ckeck resu", result);
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    const createPost = async () => {
        try {
            const uploadedUrl = await uploadFile();

            const postData = {
                description: description,
                imageUrl: uploadedUrl,
                userId: userId
            }
            console.log('check data', postData);
            const response = await axios.post('http://10.0.2.2:3000/create', postData);


            if (response.status === 200) {
                router.replace('/(tabs)/home')
            }
        } catch (error) {
            console.log("error creating post", error);
        }
    }

    const uploadFile = async () => {
        try {
            // console.log('image URI:', image);
            const { uri } = await FileSystem.getInfoAsync(image);

            if (!uri) {
                throw new Error("Invalid file URI")
            }

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                }
                xhr.onerror = (e) => {
                    reject(new TypeError("New reqest failed"))
                }
                xhr.responseType = 'blob'
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = image.substring(image.lastIndexOf('/') + 1);

            const ref = firebase.storage().ref().child(filename);
            await ref.put(blob);
            const downloadURL = await ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.log("Error:", error);
        }
    }

    console.log(user);

    return (
        <ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Entypo name="circle-with-cross" size={24} color="black" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                        <Image
                            style={{ width: 48, height: 48, borderRadius: 24 }}
                            source={{ uri: user?.profileImage }}
                        />
                        <Text style={{ fontWeight: '500' }}>Anyone</Text>
                    </View>


                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 8 }}>

                    <Entypo name="back-in-time" size={24} color="black" />
                    <Pressable
                        onPress={createPost}
                        style={{ padding: 10, backgroundColor: '#0072b1', borderRadius: 20, width: 80 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Post</Text>
                    </Pressable>

                </View>
            </View>

            <TextInput
                value={description}
                onChangeText={(text) => setDescription(text)}
                placeholder='Bạn đang nghĩ gì?'
                placeholderTextColor={'black'}
                style={{
                    marginHorizontal: 10,
                    fontSize: 15,
                    fontWeight: '500',
                    marginTop: 10
                }}
                multiline={true}
                numberOfLines={5}
                textAlignVertical={'top'}
            />

            <View>

                {image && (
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: 240, marginVertical: 20 }}
                    />)}
            </View>
            <Pressable

                style={{ flexDirection: 'column', marginRight: 'auto', marginLeft: 'auto' }}>
                <Pressable
                    onPress={pickImage}
                    style={{ width: 40, height: 40, marginTop: 12, backgroundColor: '#E0E0E0', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                >
                    <MaterialIcons name="perm-media" size={24} color="black" />
                </Pressable>
                <Text>Media</Text>
            </Pressable>
        </ScrollView>
    )
}

export default index

const styles = StyleSheet.create({})