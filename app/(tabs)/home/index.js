import { StyleSheet, Text, View, ScrollView, Pressable, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { AntDesign, Entypo, Feather, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment/moment';
import { useRouter } from 'expo-router';

const index = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState();
    const [posts, setPosts] = useState([]);
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
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:3000/all');

                setPosts(response.data.posts)
            } catch (error) {
                console.log('error fetching posts');
            }
        }
        fetchAllPosts();
    })
    const MAX_LINE = 2;
    const [showfullText, setShowfullText] = useState(false)

    const toggleShowFullText = () => {
        setShowfullText(!showfullText);
    }

    const [isLiked, setIsLiked] = useState(false);


    const handleLikePost = async (postId) => {
        try {
            const response = await axios.post(`http:10.0.2.2:3000/like/${postId}/${userId}`);
            if (response.status === 200) {
                const updatedPost = response.data.post;
                setIsLiked(updatedPost.likes.some((like) => like.user === userId))
            }
        } catch (error) {
            console.log("Error liking/unliking the post");
        }
    }
    const router = useRouter();

    return (
        <ScrollView>
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Pressable onPress={() => router.push('home/profile')}>
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

            <View>
                {posts?.map((item, index) => (
                    <View key={index}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                            <Image
                                style={{ width: 60, height: 60, borderRadius: 30 }}
                                source={{ uri: item?.user?.profileImage }}
                            />

                            <View>
                                <Text style={{ fontSize: 15, fontWeight: 600 }}>{item?.user?.name}</Text>
                                <Text
                                    ellipsizeMode='tail'
                                    numberOfLines={1} style={{ width: 230, color: 'gray', fontSize: 15, fontWeight: 400 }}>Engineer Graduate | LinkedIn Member</Text>
                                <Text>{moment(item?.createdAt).format('DD/MM/YYYY')}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                <Entypo name="dots-three-vertical" size={24} color="black" />
                                <Feather name="x" size={20} color="black" />
                            </View>
                        </View>

                        <View style={{ marginLeft: 15, marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
                            <Text style={{ fontSize: 15 }} numberOfLines={showfullText ? undefined : MAX_LINE}>{item?.description}</Text>
                            {!showfullText && (
                                <Pressable onPress={toggleShowFullText}>
                                    <Text style={{ color: 'gray' }}>See more</Text>
                                </Pressable>
                            )}

                        </View>

                        <Image
                            style={{ margin: 'auto', width: '100%', height: 260 }}
                            source={{ uri: item?.imageUrl }}
                        />

                        {item?.likes?.length > 0 && (
                            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <SimpleLineIcons name="like" size={16} color="#0072b1" />
                                <Text style={{ color: 'gray' }}>{item?.likes?.length}</Text>
                            </View>
                        )}

                        <View style={{ height: 2, borderColor: '#E0E0E0', borderWidth: 2, marginTop: 0 }} />

                        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-around', marginVertical: 10 }}>
                            <Pressable onPress={() => handleLikePost(item?._id)}>
                                <AntDesign style={{ textAlign: 'center' }} name="like2" size={22} color={isLiked ? "#0072b1" : 'gray'} />
                                <Text style={{ textAlign: 'center', fontSize: 12, marginTop: 2, color: isLiked ? "#0072b1" : 'gray' }} >Like</Text>
                            </Pressable>

                            <Pressable>
                                <FontAwesome style={{ textAlign: 'center' }} name="comment-o" size={22} color="black" />
                                <Text style={{ textAlign: 'center', fontSize: 12, color: 'gray', marginTop: 2 }}>Comment</Text>
                            </Pressable>

                            <Pressable>
                                <Feather style={{ textAlign: 'center' }} name="share" size={22} color="black" />
                                <Text style={{ textAlign: 'center', fontSize: 12, color: 'gray', marginTop: 2 }}>Repost</Text>
                            </Pressable>

                            <Pressable>
                                <Feather style={{ textAlign: 'center' }} name="send" size={22} color="black" />
                                <Text style={{ textAlign: 'center', fontSize: 12, color: 'gray', marginTop: 2 }}>Send</Text>
                            </Pressable>
                        </View>

                        <View style={{ height: 2, borderColor: '#E0E0E0', borderWidth: 2 }} />

                    </View>
                ))}
            </View>
        </ScrollView >
    )
}

export default index

const styles = StyleSheet.create({})