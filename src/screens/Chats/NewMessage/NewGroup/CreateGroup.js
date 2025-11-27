import {
    ImageBackground,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList,
    Modal,
    TextInput,

    ToastAndroid,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import BoxContainer from '../../../../constants/Container/BoxContainer'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../../constants/Colors/Colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather'
import data from '../../../../data/data'
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../../../services/AppContext'

import * as ImagePicker from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CreateGroup = ({ route }) => {
    const { auth } = useContext(AppContext)
    const { userId } = useContext(AppContext)
    const navigation = useNavigation()
    const groupMembers = route.params.members

    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const [groupName, setGroupName] = useState('')
    const [groupImage, setGroupImage] = useState(null);
    const [groupImageInfo, setGroupImageInfo] = useState(null)
    const [listOfMembers, setListOfMembers] = useState([]);
    // const [uploadImage, setUploadImage] = useState(null)

    const pressedFloatingAdd = useRef(false);
    const disabled = useRef(false)


    useFocusEffect(
        useCallback(() => {
            pressedFloatingAdd.current = false;
            // setIsLoadingButton(false);

            disabled.current = false;
        }, [])
    )

    useEffect(() => {
        const ids = groupMembers.map(item => item.id);
        setListOfMembers(ids);
    }, [groupMembers]);
    useEffect(() => {

    }, [groupImageInfo]);

    const requestPermissions = async () => {
        // Determine the permission string based on the platform
        const cameraPermission = Platform.select({
            ios: PERMISSIONS.IOS.CAMERA,
            android: PERMISSIONS.ANDROID.CAMERA,
        });

        try {
            // 1. Check the current status
            let result = await check(cameraPermission);

            if (result === RESULTS.DENIED) {
                // 2. Request the permission if it hasn't been granted
                result = await request(cameraPermission);
            }

            if (result === RESULTS.GRANTED) {
                console.log("Camera permission granted. Proceeding to launch camera/picker.");
                // Now you can call your ImagePicker.launchCamera()
                return true;
            } else {
                console.log("Permission denied or blocked.");
                return false;
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
            return false;
        }
    };
    const captureGroupImage = async () => {
        const hasPermission = await requestPermissions();
        if (hasPermission) {
            // Only launch the camera/library if permission is granted
            ImagePicker.launchCamera({
                mediaType: 'photo',
                cameraType: 'back',
                quality: 1,
                saveToPhotos: true,
                maxHeight: 1500,
                maxWidth: 1500,
            }, (response) => {

                if (response.didCancel) {
                    console.log('User cancelled camera session');
                } else if (response.errorCode) {
                    console.error('ImagePicker Error:', response.errorMessage);
                    // Inform the user about the error, perhaps permission denied
                } else if (response.assets && response.assets.length > 0) {
                    // Success! Get the URI of the captured photo
                    const assets = response.assets[0];
                    setGroupImage(assets.uri)
                    setGroupImageInfo(assets)



                }


            });

        }
    };
    const uploadGroupImage = async () => {
        const uri = groupImageInfo.uri
        const type = groupImageInfo.type
        const fileName = groupImageInfo.fileName
        const fileSize = groupImageInfo.fileSize

        let flag = false

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${auth}`);
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: type,
            name: fileName,
            // msgSize: fileSize
        });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,

        };
        try {
            const response = await fetch("https://dev.myhygge.io/hygmapi/api/v1/fileUpload/uploadFile", requestOptions);
            const resultText = await response.text();
            const obj = JSON.parse(resultText);
            flag = obj.status === 200
            console.log('status: ', flag)

            if (flag) {
                const fileName = obj.response.fileName;
                const orgFileName = obj.response.orgFileName;
                // console.log('step 1-', [fileName, orgFileName]);
                return [fileName, orgFileName];
            } else {
                console.log('error while fetching');
                return [null, null];
            }
        } catch (error) {
            console.error(error);
            return [null, null];
        }




    }
    const createChat = async (groupName, listOfMembers) => {
        let flag = false;

        if (!groupName.trim()) {
            pressedFloatingAdd.current = false;

            ToastAndroid.show('Please enter a group name', ToastAndroid.SHORT);
            return flag;
        }

        let imageFileName = null;
        let imageOrgFileName = null;

        if (groupImageInfo) {
            const result = await uploadGroupImage();
            // console.log('step 2-:', result);
            if (Array.isArray(result)) {
                [imageFileName, imageOrgFileName] = result;
            }
        }
        //    console.log('step final-',imageFileName)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${auth}`);
        const raw = JSON.stringify({
            chatType: 'group',
            groupImg: imageFileName || '',
            groupName: groupName.trim(),
            orgnid: 18,
            userid: userId,
            users: listOfMembers,
            tz: 'Asia/Kolkata',
            deviceType: 'Android',
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
                    console.log('createChat complete')
                }
                else {
                    console.log('error while fatching')
                }


            })
            .catch((error) => console.error(error));
        console.log('status: ', flag)

        return flag;


    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: 'white' }}

        >

            <KeyboardAvoidingView style={{ backgroundColor: 'white', flex: 1 }}>
                <CreateGroupTextInput
                    leading={
                        <TouchableOpacity
                        disabled={disabled.current}
                            onPress={() => {
                                captureGroupImage()
                            }}
                            style={{
                                height: 60,
                                width: 60,
                                borderRadius: 60,
                                backgroundColor: groupImage === null ? '#367be4ff' : 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden'

                            }}
                        >
                            {groupImage === null ?
                                (<MaterialIcons name='add-photo-alternate' size={30} color='white' />)
                                :
                                (<ImageBackground
                                    source={{ uri: groupImage }}
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                    resizeMode="cover"
                                ></ImageBackground>)
                            }
                        </TouchableOpacity>}
                    heading={

                        <View style={{
                            flexDirection: 'column',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 10

                        }}>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    // backgroundColor:'red',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <TextInput
                                    editable={!disabled.current}

                                    placeholder='Enter group name'
                                    placeholderTextColor={'grey'}
                                    style={{
                                        fontSize: 16,
                                        flex: 1
                                    }}
                                    value={groupName}
                                    onChangeText={(newText) => setGroupName(newText)}
                                />
                                <Entypo name='emoji-happy' size={24} color='grey' />
                            </View>
                            <View
                                style={{
                                    height: 2,
                                    backgroundColor: '#367be4ff',
                                    width: '100%'

                                }}
                            />

                        </View>
                    }
                />
                <View
                    style={{
                        backgroundColor: '#ecececff',
                        height: 30,
                        width: '100%'

                    }} />

                <FlatList
                    data={groupMembers}
                    renderItem={item => {
                        // console.log('-----------------------------for create grp ', item.item)
                        const profileImage = item.item.imageurl;
                        const last_activity_time = item.item.last_activity_time;
                        const date = new Date(last_activity_time);
                        const name = item.item.full_name;

                        return <BoxContainer

                            profilePhoto={profileImage}
                            title={
                                name || 'no name'
                            }
                            subtitle={(date.toDateString() + '   ' + date.toLocaleTimeString())}

                            boxStyle={{ paddingVertical: 10 }}


                        >

                        </BoxContainer>
                    }}
                />
                {/* floating tik mark botton */}
                <TouchableOpacity
                    disabled={pressedFloatingAdd.current}

                    onPress={async () => {
                        if (pressedFloatingAdd.current) return;
                        pressedFloatingAdd.current = true;
                        setIsLoadingButton(true);
                        if (groupName) {
                            disabled.current = true;
                        }
                        let flag = await createChat(groupName, listOfMembers)
                        if (flag) {
                            navigation.popToTop();
                        } else {
                            setIsLoadingButton(false);

                        }

                    }}
                    style={styles.fab}
                >
                    {isLoadingButton
                        ? (<View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ccccf8ff" />
                        </View>)
                        : (<Feather
                            name='check' size={25} color='white'
                        />)}


                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const CreateGroupTextInput = ({ heading, leading }) => {
    return (<View
        style={{
            flexDirection: 'row',
            // backgroundColor:'red',
            height: 'auto',
            width: '100%',
            paddingVertical: 10,
            paddingHorizontal: 10



        }}>
        {/* leading */}

        {leading}
        {/* heading */}
        {heading}

    </View>)
}
export default CreateGroup

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
    statusItem: {
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#d3d3d3ff',
        borderRadius: 10,
        width: 80,
        paddingVertical: 10,
        paddingHorizontal: 10,
        height: 'auto'
    }, loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
})