import { StyleSheet, Text, View, Image, Dimensions, Pressable } from 'react-native'
import React, { useState } from 'react'

const UserProfile = ({ item, userId }) => {
    // console.log(item);
    const [connectionSent, setConnectionSent] = useState(false);
    const sendConnectionRequest = async (currentUserId, selectedUserId) => {
        try {

            const response = await fetch("http://10.0.2.2:3000/connection-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUserId, selectedUserId }),
            });
            console.log('chech', response);
            if (response.ok) {
                setConnectionSent(true)
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (

        <View style={{
            flex: 1,
            borderRadius: 9,
            marginHorizontal: 16,
            borderColor: '#e0e0e0',
            borderWidth: 1,
            marginVertical: 10,
            justifyContent: 'center',
            height: Dimensions.get('window').height / 3.75,
            width: (Dimensions.get('window').width - 80) / 2,
        }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={{ width: 90, height: 90, borderRadius: 45, resizeMode: 'cover' }}
                    source={{ uri: item?.profileImage }}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
                    {item?.name}
                </Text>
                <Text style={{ textAlign: 'center', marginLeft: 1, marginTop: 2 }}>
                    Engineer Graduate | Linkedin member
                </Text>
            </View>
            <Pressable
                onPress={() => sendConnectionRequest(userId, item._id)}
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderColor: connectionSent || item?.connectionRequest?.includes(userId) ? 'gray' : '#0072b1',
                    borderWidth: 1,
                    borderRadius: 25,
                    marginTop: 7,
                    paddingHorizontal: 15,
                    paddingVertical: 4
                }}>
                <Text style={{ fontWeight: '600', color: connectionSent || item?.connectionRequest?.includes(userId) ? 'gray' : '#0072b1' }}>
                    {connectionSent || item?.connectionRequest?.includes(userId) ? 'Pending' : 'Connect'}

                </Text>
            </Pressable>

        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({})