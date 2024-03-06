import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const ConnectionRequest = ({ item, connectionRequests, setConnectionRequests, userId }) => {
    const appceptConnection = async (requestId) => {
        // console.log(2);
        try {
            const response = await fetch('http://10.0.2.2:3000/connection-request/accept', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: requestId,
                    recepientId: userId
                })
            })

            if (response.ok) {
                setConnectionRequests(connectionRequests.filter((request) => request._id !== request))
            }
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
            >
                <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: item?.image }}
                />
                <Text style={{ width: 200 }}>
                    {item?.name} is Inviting you to Connect
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                    <Pressable
                        onPress={() => appceptConnection(item._id)}
                        style={{
                            width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0E0E0', justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Ionicons name="checkmark-outline" size={24} color="#0072b1" />
                    </Pressable>



                    <Pressable
                        style={{
                            width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0E0E0', justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Feather name='x' size={24} color='black' />
                    </Pressable>
                </View>
            </View>

        </View>
    )
}

export default ConnectionRequest

const styles = StyleSheet.create({})