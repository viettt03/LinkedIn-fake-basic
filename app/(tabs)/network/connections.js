import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import moment from 'moment';


const connections = () => {
    const [connections, setConnections] = useState([]);
    const [userId, setUserId] = useState('');


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
            fetchConnections();
        }
    }, [userId])
    const fetchConnections = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3000/connections/${userId}`);
            setConnections(response.data.connections);
        } catch (error) {
            console.log(error);
        }
    }
    // console.log('check', connections);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 12, marginVertical: 12 }}>
                <Text style={{ fontWeight: 500 }}>{connections?.length} Connections</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <AntDesign name="search1" size={24} color="black" />
                    <Octicons name="three-bars" size={24} color="black" />
                </View>
            </View>

            <View style={{ height: 2, borderColor: '#E0E0E0', borderWidth: 2, marginTop: 0 }} />

            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                {connections?.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 }}>

                        <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={{ uri: item?.profileImage }} />

                        <View style={{ flexDirection: 'column', gap: 2 }}>

                            <Text style={{ fontSize: 15, fontWeight: '500' }}>{item?.name}</Text>

                            <Text style={{ color: 'gray' }}>B.Tech | Computer Science Technology</Text>

                            <Text style={{ color: 'gray' }}>connected on {moment(item?.createdAt).format("MMMM Do YYYY")}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Entypo name='dots-three-vertical' size={24} color='black' />
                            <Feather name="send" size={24} color="black" />
                        </View>
                    </View>

                ))}


            </View>
        </View>
    )
}

export default connections

const styles = StyleSheet.create({})