import { StyleSheet, Text, View, Image, Pressable, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import axios, { Axios } from 'axios';
import { AntDesign, Ionicons } from '@expo/vector-icons';


const profile = () => {

    const [userId, setUserId] = useState('');
    const [user, setUser] = useState();
    const [posts, setPosts] = useState([]);
    const [userDescription, setUserDescription] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
        }
        fetchUser();
    }, []);

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
    const [isEditing, setIsEditing] = useState(false)

    const handleSaveDescription = async () => {
        try {

            const response = await axios.put(`http://10.0.2.2:3000/profile/${userId}`, {
                userDescription
            });

            if (response.status === 200) {
                await fetchUserProfile();
                setIsEditing(false)
            }
        } catch (error) {
            console.log("Error saving user description", error);
        }
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('authToken'); // Xóa thông tin đăng nhập từ AsyncStorage
            // Thực hiện các hành động khác sau khi đăng xuất thành công
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    }
    return (
        <View>
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Pressable >
                    <Image
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                        source={{ uri: user?.profileImage }}
                    />
                </Pressable>

                <Pressable
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 7, gap: 10, backgroundColor: 'white', borderRadius: 3, height: 30 }}
                >
                    <AntDesign style={{ marginLeft: 10 }} name="search1" size={21} color="black" />
                    <TextInput placeholder='Search' />
                </Pressable>

                <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
            </View>

            <Image
                style={{ width: '100%', height: 130 }}
                source={{}}
            />

            <View style={{ position: 'absolute', top: 130, left: 10 }}>
                <Image
                    style={{ width: 120, height: 120, borderRadius: 60 }}
                    source={{ uri: user?.profileImage }}
                />
            </View>

            <View style={{ marginTop: 80, marginHorizontal: 25 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user?.name}</Text>


                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 17 }}>{user?.userDescription}</Text>
                    <Pressable onPress={() => setIsEditing(true)}>
                        <Text style={{ textAlign: 'right', color: "#0072b1" }}>Update description</Text>
                    </Pressable>
                    {isEditing ? (
                        <>
                            <TextInput
                                placeholder='Enter your descrition'
                                value={userDescription}
                                onChangeText={(text) => setUserDescription(text)}
                            />
                            <Button style={{ width: 50, backgroundColor: 'white' }} onPress={handleSaveDescription} title='Save' />
                        </>
                    ) : ''}
                </View>
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: 30, gap: 10, marginTop: 20 }}>

                <Pressable
                    style={{
                        backgroundColor: '#0072b1',
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        borderRadius: 25
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Open to</Text>
                </Pressable>
                <Pressable style={{
                    backgroundColor: '#0072b1',
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 25
                }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Add Section</Text>
                </Pressable>
            </View>

            <View style={{ marginHorizontal: 30, marginTop: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Analytics</Text>
                <Text style={{ fontSize: 15, color: 'gray', marginTop: 2 }}>Private to you</Text>
            </View>


            <View style={{ width: '100%', margin: 'auto', alignItems: 'center', marginTop: 30 }}>
                <Pressable
                    onPress={() => handleLogout()}
                    style={{
                        height: 40,
                        width: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0072b1',
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        borderRadius: 10
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Logout</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default profile

const styles = StyleSheet.create({})