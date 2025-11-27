import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList, Modal, TextInput, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../constants/Colors/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import data from '../../../data/data';
import BoxContainer from '../../../constants/Container/BoxContainer';
import { AppContext } from '../../../services/AppContext'

// import AsyncStorage from '@react-native-async-storage/async-storage';

const NewMessage = ({ navigation }) => {
    const { userId, isLoading, auth } = useContext(AppContext)

    const [userData, setUserData] = useState(null)
    const [isModalVisible, setModalVisible] = useState(false)
    const [isLoadingMessage, setIsLoadingMessage] = useState(true)

    // modal TextInput useState
    const [firstInput, setFirstInput] = useState(false);
    const [secondInput, setSecondInput] = useState(false);
    const [thirdInput, setThirdInput] = useState(false);

    // TextInput Data
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const pressedChatTile = useRef(false);
    const pressedNewGroup = useRef(false);
    const pressedNewContact = useRef(false);
    const pressedFloatingAdd = useRef(false);
    const pressedCreateContact = useRef(false);

    useFocusEffect(
        useCallback(() => {
            pressedChatTile.current = false;
            pressedNewGroup.current = false;
            pressedNewContact.current = false;
            pressedFloatingAdd.current = false;
            pressedCreateContact.current = false;
            getUserList()
        }, []),
    );



    const getUserList = async () => {
        let flag = false
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${auth}`);
        const raw = JSON.stringify({
            "orgnid": 18,
            "search": "",
            "userId": userId,
            "userType": 3,
            "tz": "Asia/Kolkata",
            "deviceType": "Android"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(
                "https://dev.myhygge.io/hygmapi/api/v1/chat/getUserList",
                requestOptions
            );

            // Directly parse JSON
            const obj = await response.json();

            if (obj.status === 200) {
                console.log('response from new message---->>>', obj.response);
                setUserData(obj.response)
                setIsLoadingMessage(false);
            } else {
                console.log('error while fetching');
            }

        } catch (error) {
            console.error(error);
        }
        console.log('status: ', flag)
    }
    const createChat = async () => {
        const userid = userData.at(-1).id + 1
        console.log('userId created ', typeof userid)
        let flag = false
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${auth}`);
        const raw = JSON.stringify({
            "chatType": "single",
            "groupImg": "",
            "groupName": "",
            "orgnid": 18,
            "userid": 28,
            "users": [
                userid
            ],
            "tz": "Asia/Kolkata",
            "deviceType": "Android"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        await fetch("https://dev.myhygge.io/hygmapi/api/v1/chat/createChat", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log(result)
                const obj = JSON.parse(result)
                flag = obj.status === 200
                if (flag) {
                    setUserData(obj.response)
                }
                else {
                    console.log('error while fatching')
                }


            })
            .catch((error) => console.error(error));
        console.log('status: ', flag)



    }
    if (isLoading || isLoadingMessage) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: 'white' }}

        >
            <KeyboardAvoidingView style={{ backgroundColor: 'white', flex: 1 }}>
                {/* add contacts or create groups */}
                <View style={{
                    backgroundColor: 'white',

                }}>
                    <TouchableOpacity
                        disabled={pressedNewGroup.current}

                        onPress={() => {
                            if (pressedNewGroup.current) return;
                            pressedNewGroup.current = true
                            navigation.push('NewGroup', { contact: data })
                        }}
                    >
                        <AddContactComtainer
                            icon={
                                <Feather name='users' size={25} color={'grey'} />
                            }
                            title='New Group'

                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={pressedNewContact.current}

                        onPress={() => {
                            if (pressedNewContact.current) return;
                            pressedNewContact.current = true
                            setModalVisible(true)
                            setFirstName('')
                            setLastName('')
                            setPhoneNumber('')
                            setFirstInput(false)
                            setSecondInput(false)
                            setThirdInput(false)
                        }}

                    >
                        <AddContactComtainer
                            icon={
                                <Feather name='user-plus' size={25} color={'grey'} />
                            }
                            title='New Contact'
                        />
                    </TouchableOpacity>
                </View>

                {/* Contacts */}
                <Text style={{
                    backgroundColor: '#ecececff',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    color: '#505050ff',
                    fontSize: 16
                }}>Contacts</Text>

                {/* Contacts list  */}

                {userData ? (<FlatList

                    data={userData}
                    renderItem={(item) => {
                        const last_activity_time = item.item.last_activity_time;
                        const date = new Date(last_activity_time);
                        const name = item.item.full_name;
                        const profileImage = item.item.imageurl;

                        return (
                            <TouchableOpacity
                                disabled={pressedChatTile.current}

                                onPress={() => {
                                    if (pressedChatTile.current) return;
                                    pressedChatTile.current = true
                                    navigation.push('Chat', { name: name, profilePhoto: profileImage, chatType: 'single', subtitle: (date.toDateString() + '   ' + date.toLocaleTimeString()) });


                                }}
                            >
                                <BoxContainer
                                    profilePhoto={profileImage}
                                    title={
                                        name || 'no name'
                                    }
                                    subtitle={(date.toDateString() + '   ' + date.toLocaleTimeString())}
                                    boxStyle={{ paddingVertical: 10 }}


                                >

                                </BoxContainer>
                            </TouchableOpacity>
                        )
                    }
                    }

                />) : null}

                {/* addcontact floating button */}
                <TouchableOpacity
                    disabled={pressedFloatingAdd.current}

                    onPress={() => {
                        if (pressedFloatingAdd.current) return;
                        pressedFloatingAdd.current = true
                        setModalVisible(true)
                        setFirstName('')
                        setLastName('')
                        setPhoneNumber('')
                        setFirstInput(false)
                        setSecondInput(false)
                        setThirdInput(false)
                        // StoreData()
                    }}
                    style={[styles.fab, { bottom: 20 }]}>
                    <MaterialIcons name="person-add-alt" size={25} color="white" />
                </TouchableOpacity>

                {/* add contacts or group screen */}
                <Modal
                    visible={isModalVisible}
                    animationType='slide'
                    swipeDirection='down'

                    backdropColor="#13131311"
                    onRequestClose={() => {
                        pressedNewContact.current = false;
                        pressedFloatingAdd.current = false;
                        pressedCreateContact.current = false;
                        setModalVisible(false);
                    }}

                >
                    <View

                        style={{
                            // backgroundColor: '#0a0a0a38',
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                        onTouchEnd={() => {
                            setModalVisible(false)
                            pressedFloatingAdd.current = false;
                            pressedNewContact.current = false;
                        }}

                    >

                        <View style={{
                            paddingHorizontal: 20,
                            paddingVertical: 20,

                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            height: 'auto',
                            width: '100%',
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            elevation: 5,

                            backgroundColor: 'white'
                        }}
                            onTouchEnd={(e) => {
                                e.stopPropagation()

                            }}>
                            <Text style={{
                                backgroundColor: 'white',
                                width: '100%',
                                fontSize: 22,
                                marginBottom: 10,
                                color: 'black',
                                fontWeight: 'bold'
                            }}>New Contacts</Text>
                            <TextInput
                                value={firstName}
                                onChangeText={(newText) => setFirstName(newText)}
                                style={[styles.newContactTextInput, { borderColor: firstInput ? Colors.NewContactBotton : '#d3d3d3ff' }]}
                                placeholder='First name (required)'
                                placeholderTextColor={'grey'}
                                onFocus={() => setFirstInput(true)}
                                onBlur={() => setFirstInput(false)}

                            />
                            <TextInput
                                value={lastName}
                                onChangeText={(newText) => setLastName(newText)}

                                style={[styles.newContactTextInput, { borderColor: secondInput ? Colors.NewContactBotton : '#d3d3d3ff' }]}
                                placeholder='Last name (optional)'
                                placeholderTextColor={'grey'}
                                onFocus={() => setSecondInput(true)}
                                onBlur={() => setSecondInput(false)}


                            />
                            <TextInput
                                value={phoneNumber}
                                onChangeText={(newText) => setPhoneNumber(newText)}

                                style={[styles.newContactTextInput, { borderColor: thirdInput ? Colors.NewContactBotton : '#d3d3d3ff' }]}
                                placeholder='Phone number'
                                placeholderTextColor={'grey'}
                                onFocus={() => setThirdInput(true)}
                                onBlur={() => setThirdInput(false)}


                            />
                            <TouchableOpacity
                                disabled={pressedCreateContact.current}

                                onPress={async () => {
                                    if (pressedCreateContact.current) return;
                                    pressedCreateContact.current = true
                                    createChat()
                                    setModalVisible(false)
                                    setFirstName('')
                                    setLastName('')
                                    setPhoneNumber('')
                                }}
                                style={{
                                    backgroundColor: Colors.NewContactBotton,
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    paddingVertical: 15,
                                    borderRadius: 10,
                                    marginVertical: 15
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 16
                                    }}
                                >Create Contact</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>


        </SafeAreaView>

    )
}
const AddContactComtainer = ({ icon, title }) => {
    return (
        <View style={{

            backgroundColor: 'white',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 10,
        }}>
            {icon}
            <Text style={{
                paddingLeft: 20,
                fontSize: 16,
                color: 'black'
            }}>{title}</Text>
        </View>
    )
}
export default NewMessage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: Colors.AppBarBackgroundColor,
        width: 55,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    newContactTextInput: {

        borderRadius: 10,
        borderWidth: 2,
        width: '100%',
        marginVertical: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        fontSize: 16
    },loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },

})