import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, FlatList,Image, KeyboardAvoidingView, PermissionsAndroid } from 'react-native';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import BoxContainer from '../../../../constants/Container/BoxContainer';
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Chatbubble from '../ChatBubble';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../../constants/Colors/Colors';
import ImageViewing from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import data from '../../../../data/data'
// camera, image, video, asyncstorage ,sound
import * as ImagePicker from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
    joinRoom,
    sendMessage,
    onReceiveMessage,
    offReceiveMessage,
} from '../../../services/chatApi';
import { initSocket } from "../../../services/socket";
import SoundRecorder from 'react-native-nitro-sound';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupChat = ({ route }) => {
    
    const keyString = String(route.params.key);
    const navigation = useNavigation();



    const insets = useSafeAreaInsets();

    // console.log()
    // const BottomSheetRef = useRef<BottomSheet>(null)
    // const SnapPoint = useMemo(()=>['25%','50%', '75%'],[])

    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const [currentVideoUri, setCurrentVideoUri] = useState(null);
    const [currentImageUri, setCurrentImageUri] = useState(null);
    const [isVisiblePhoto, setIsVisiblePhoto] = useState(false);
    const [message, setMessage] = useState([]);
    const [userInput, setUserState] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);

    // const openSheet = () => BottomSheetRef.current.expand()

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

    useEffect(()=>{
            navigation.addListener('beforeRemove',(e)=>{
                if (
            (e.data.action.type === 'POP' || e.data.action.type === 'GO_BACK') 
          ){
            e.preventDefault();
            navigation.push('TabNavigation')
          }
          
            })
        },[navigation])

    const upLoadImage = async () => {
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
                setIsModalVisible(false);
                if (response.didCancel) {
                    console.log('User cancelled camera session');
                } else if (response.errorCode) {
                    console.error('ImagePicker Error:', response.errorMessage);
                    // Inform the user about the error, perhaps permission denied
                } else if (response.assets && response.assets.length > 0) {
                    // Success! Get the URI of the captured photo
                    const photoAsset = response.assets[0];

                    setMessage(prevMessages => [...prevMessages, {
                        'id': prevMessages.length + 1,
                        'photo': photoAsset.uri,
                        'video': null,
                        'message': null,
                        'duration': null,
                        'left': false
                    }])
                    setTimeout(() => {
                        setMessage(prevMessages => [...prevMessages, {
                            'id': prevMessages.length + 1,
                            'photo': null,
                            'video': null,
                            'message': 'hey',
                            'duration': null,
                            'left': true
                        }]);
                    }, 1000);


                }


            });

        }
    };
    const upLoadVideo = async () => {
        const hasPermission = await requestPermissions();
        if (hasPermission) {
            // Only launch the camera/library if permission is granted
            ImagePicker.launchCamera({
                mediaType: 'video',
                cameraType: 'back',
                quality: 1,
                saveToPhotos: true,
                maxHeight: 1500,
                maxWidth: 1500,
            }, (response) => {
                setIsModalVisible(false);
                if (response.didCancel) {
                    console.log('User cancelled camera session');
                } else if (response.errorCode) {
                    console.error('ImagePicker Error:', response.errorMessage);
                    // Inform the user about the error, perhaps permission denied
                } else if (response.assets && response.assets.length > 0) {
                    // Success! Get the URI of the captured photo
                    const videoAsset = response.assets[0];

                    setMessage(prevMessages => [...prevMessages, {
                        'id': prevMessages.length + 1,
                        'photo': null,
                        'video': videoAsset.uri,
                        'message': null,
                        'duration': videoAsset.duration,
                        'left': false
                    }])
                    setTimeout(() => {
                        setMessage(prevMessages => [...prevMessages, {
                            'id': prevMessages.length + 1,
                            'photo': null,
                            'video': null,
                            'message': 'hey',
                            'duration': null,
                            'left': true
                        }]);
                    }, 1000);


                }


            });

        }
    };
    async function requestMicPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: 'Microphone Permission',
                message: 'App needs access to your microphone',
                buttonPositive: 'OK',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
   

    const handleSend = () => {
        // ... Your existing logic for user message and bot response ...
        setMessage(prevMessages => [...prevMessages, {
            'id': prevMessages.length + 1,
            'photo': null,
            'video': null,
            'message': userInput,
            'duration': null,
            'left': false
        }]);

        setUserState('');

        setTimeout(() => {
            setMessage(prevMessages => [...prevMessages, {
                'id': prevMessages.length + 1,
                'photo': null,
                'video': null,
                'message': 'hey',
                'duration': null,
                'left': true
            }]);
        }, 1000);
    };
    return (
        // main view

        <KeyboardAvoidingView
            style={[styles.MainView,]}
        >

            {/* chat bubble */}
            <FlatList
                style={{
                    // backgroundColor:'blue'
                    flex: 1,
                }}
                data={message}
                renderItem={(item) => {

                    return <TouchableOpacity
                        onPress={() => {
                            if (item.item.photo) {
                                setCurrentImageUri(item.item.photo)
                                setIsVisiblePhoto(true)
                            } else if (item.item.video) {
                                setCurrentVideoUri(item.item.video);
                                setIsVideoVisible(true);
                            }
                        }}
                    ><Chatbubble
                            left={item.item.left}
                            data={item.item.message}
                            photo={item.item.photo}
                            video={item.item.video}
                            duration={item.item.duration}

                        />
                    </TouchableOpacity>

                }}
            />
            <ImageViewing
                images={currentImageUri ? [{ uri: currentImageUri }] : []}
                imageIndex={0} // Start at the first image
                visible={isVisiblePhoto}
                onRequestClose={() => {
                    setIsVisiblePhoto(false)
                    setCurrentImageUri(null);
                }} // Set to close the modal

                presentationStyle="fullScreen"
                swipeToCloseEnabled={true}
            />
            <Modal
                visible={isVideoVisible}
                animationType="slide"
                onRequestClose={() => {
                    setIsVideoVisible(false);
                    setCurrentVideoUri(null);
                }}
            >
                {currentVideoUri && (
                    <View style={styles.videoModalContainer}>
                        <VideoPlayer
                            source={{ uri: currentVideoUri }}
                            // Fullscreen control is essential in a modal player
                            onBack={() => { // This is triggered by the back button in video-controls
                                setIsVideoVisible(false);
                                setCurrentVideoUri(null);
                            }}
                            style={styles.fullScreenVideo}
                            // Start playing when the modal opens
                            paused={false}
                            controls={true}
                            disableVolume={true} // Recommended for mobile
                        />
                    </View>
                )}
            </Modal>
            {/* bottom textinput */}
            <View
                style={[styles.FloatingButton, { bottom: insets.bottom, }]}
            >
                <BoxContainer
                    icon={
                        <TouchableOpacity>
                            <Entypo name='emoji-happy' size={24} color='grey' />
                        </TouchableOpacity>
                    }
                    iconStyle={{
                        width: 30,
                        height: 30,
                        borderRadius: 30,

                    }}
                    boxStyle={{
                        paddingHorizontal: 10,
                        paddingVertical: 0,

                    }}
                    status={<View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // backgroundColor:'blue',
                            width: userInput === '' ? 70 : 30,
                        }}
                    >
                        {userInput === '' ?
                            (
                                <>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setIsModalVisible(true)
                                            // openSheet()
                                        }}
                                    >
                                        <FontAwesome6 name='paperclip' size={24} color='grey' />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={async () => {
                                            if (isMicOn) {
                                                setIsMicOn(true)
                                                await SoundRecorder.start({
                                                    format: 'aac', // or 'wav', 'mp3'
                                                    sampleRate: 44100,
                                                    channels: 1,
                                                });
                                            } else {
                                                setIsMicOn(false)
                                                const result = await SoundRecorder.stop();
                                                console.log('File saved at:', result.path);

                                            }

                                        }}
                                    >
                                        <Feather name='mic' size={24} color={isMicOn ? 'red' : 'grey'} />
                                    </TouchableOpacity>

                                </>)
                            :
                            (<TouchableOpacity
                                onPress={handleSend}
                            >
                                <Ionicons name='send' size={24} color={Colors.AppBarBackgroundColor} />
                            </TouchableOpacity>
                            )

                        }
                    </View>}
                    content={
                        <TextInput
                            placeholder='Message'
                            value={userInput}
                            onChangeText={(newText) => {
                                setUserState(newText)
                            }}

                            style={
                                {
                                    // backgroundColor:'green',
                                    width: '100%',
                                    marginLeft: 6,
                                    fontSize: 18,
                                }
                            }

                        />}
                />
            </View>
            {/* modal view from bottom */}

            <Modal
                visible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                swipeDirection='down'
                onSwipeComplete={() => setIsModalVisible(false)}
                backdropColor="#13131323"
                animationType='slide'
                onRequestClose={() => {
                    setIsModalVisible(false)
                }}
            >
                {/* main view of modal */}
                <View

                    style={{
                        // backgroundColor: '#0a0a0a38',
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            height: 'auto',
                            width: '100%',
                            backgroundColor: 'white',
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            paddingVertical: 20,
                            paddingHorizontal: 20,
                            elevation: 5,
                            justifyContent: 'space-around',
                            alignItems: 'flex-end',
                            flexDirection: 'row',

                        }}>

                        <TouchableOpacity
                            onPress={upLoadImage}
                            style={{
                                backgroundColor: '#b6d6ffff',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 80,
                                width: 80,
                                borderRadius: 80,

                            }}>
                            <Feather name='camera' size={40} color='white' />

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={upLoadVideo}
                            style={{
                                backgroundColor: '#b6d6ffff',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 80,
                                width: 80,
                                borderRadius: 80,

                            }}>
                            <Feather name='video' size={40} color='white' />

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </KeyboardAvoidingView>


    )
}

export default GroupChat

const styles = StyleSheet.create({
    MainView: {
        backgroundColor: '#93abcaff',

        flex: 1
    },
    FloatingButton: {
        // position:'absolute',

        backgroundColor: 'white',

    },
    videoModalContainer: {
        flex: 1,
        backgroundColor: 'black', // Black background for full-screen video
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenVideo: {
        // This makes the player fill the whole modal container
        width: '100%',
        height: '100%',
    },
})


