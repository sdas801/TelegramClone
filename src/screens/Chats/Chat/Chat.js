import 'react-native-gesture-handler';
import { Keyboard, ToastAndroid, BackHandler, StyleSheet, Text, View, Linking, TextInput, TouchableOpacity, Modal, Image, KeyboardAvoidingView, PermissionsAndroid, Platform, FlatList, ScrollView, Alert } from 'react-native';
import React, { useState, useCallback, useFocusEffect, useMemo, useRef, useEffect, useContext } from 'react';
import lodash from 'lodash';

import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

//custom
import BoxContainer from '../../../constants/Container/BoxContainer';
import Chatbubble from './ChatBubble';
import { BottomSheet, useBottomSheet } from '../../../services/BottomSheet';

//colors
import Colors from '../../../constants/Colors/Colors';


//icon
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// camera, image, video, asyncstorage ,sound, file
import ImageViewing from 'react-native-image-viewing';
import VideoPlayer from 'react-native-video-controls';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import * as ImagePicker from 'react-native-image-picker';
import { requestCameraPermissions, requestGalleryPermission, requestStoragePermission } from '../../../services/permission';
import SoundRecorder from 'react-native-nitro-sound';
import { pick, types, isCancel } from '@react-native-documents/picker';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';


//asyncstorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../../services/AppContext'

//socket imports
import {
  joinRoom,
  sendMessage,
  onReceiveMessage,
  offReceiveMessage,
  onMessageSeen,
  seenMessage,
  startTyping,
  stopTyping,
  onTypingStart,
  onTypingStop,
  offTypingStart,
  offTypingStop,
  offMessageSeen,
  offseenMessage,
} from '../../../services/chatApi';
import { initSocket } from "../../../services/socket";

const Chat = ({ route }) => {
  const { userId , auth, isLoading} = useContext(AppContext);

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const chatId = route.params.id;
  const userList = route.params.userList;
  console.log('from chat userList: ', route.params.userList);
  const userDetails = route.params.userDetails;
  const chatType = route.params.chatType;

  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const { isOpen, open, close } = useBottomSheet();
  // const bottomSheetRef = useRef(null)
  // const snapPoints = useMemo(()=>['25%','50%', '75%'],[])
  // const openSheet = () => BottomSheetRef.current.expand()


  const [user, setUser] = useState(null)
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState(null);
  const [currentImageUri, setCurrentImageUri] = useState(null);
  const [isVisiblePhoto, setIsVisiblePhoto] = useState(false);
  const [message, setMessage] = useState([]);
  const [userInput, setUserState] = useState('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [showGalleryAssets, setShowGalleryAssets] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  // const [MessageId, setMessageId] = useState([])
  // State to hold the URI of the PDF to display
  const [pdfUri, setPdfUri] = useState(null);
  // State to control the visibility of the full-screen modal
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const [replyActive, setReplyActive] = useState(false)
  const [replyUserName, setReplyUserName] = useState(null)
  const [replyUserMessage, setReplyUserMessage] = useState('')
  const [replyMessageId, setReplyMessageId] = useState(null)
  const [replySenderId, setReplySenderId] = useState(null)

  const userMap = chatType === 'group' ? Object.fromEntries(
    userDetails.map(u => [u.user_id, u.full_name])
  ):null;

  const handlePdfPress = (uri) => {
    setPdfUri(uri);
    setPdfModalVisible(true);
  };
  const closePdfViewer = () => {
    setPdfModalVisible(false);
    setPdfUri(null);
  };

  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();


    if (hasPermission) {
      ImagePicker.launchImageLibrary({
        selectionLimit: 0,
        mediaType: 'mixed', // You can also use 'video' or 'mixed'
        quality: 1, // 0 to 1
        includeBase64: false,
      }, (response) => {
        if (response.didCancel) {
          // console.log('User cancelled the image picker');
        } else if (response.errorCode) {
          // console.log('Error: ', response.errorMessage);
        } else {
          // console.log(response)
          const assets = response.assets[0]


          const fileName = assets.fileName;
          // console.log('fileName----> ', fileName)

          const fileSize = assets.fileSize
          // console.log('fileSize----> ', fileSize)

          const uri = assets.uri;
          // console.log('uri----> ', uri)

          const type = assets.type;
          // console.log('type----> ', type)


          // const originalPath = assets[0].originalPath;

          uploadPhoto(uri, type, fileName, fileSize)
          // console.log('Selected image: ', assets);



        }
      });
    } else {
      Alert.alert('Permission Denied', 'Please grant permission to access your gallery.');
    }
  };

  const capturePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
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
        setIsBottomSheetVisible(false);
        if (response.didCancel) {
          // console.log('User cancelled camera session');
        } else if (response.errorCode) {
          // console.error('ImagePicker Error:', response.errorMessage);
          // Inform the user about the error, perhaps permission denied
        } else if (response.assets && response.assets.length > 0) {
          // Success! Get the URI of the captured photo
          const assets = response.assets[0];
          // console.log('photo asset ---->', assets)
          // console.log('photo asset file type ---->', typeof assets)

          const fileName = assets.fileName;
          // console.log('fileName----> ', fileName)

          const fileSize = assets.fileSize
          // console.log('fileSize----> ', fileSize)

          const uri = assets.uri;
          // console.log('uri----> ', uri)

          const type = assets.type;
          // console.log('type----> ', type)

          uploadPhoto(uri, type, fileName, fileSize)


        }


      });

    }
  };

  const captureVideo = async () => {
    const hasPermission = await requestCameraPermissions();
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
        setIsBottomSheetVisible(false);
        if (response.didCancel) {
          console.log('User cancelled camera session');
        } else if (response.errorCode) {
          console.error('ImagePicker Error:', response.errorMessage);
          // Inform the user about the error, perhaps permission denied
        } else if (response.assets && response.assets.length > 0) {
          // Success! Get the URI of the captured photo
          const assets = response.assets[0];
          console.log('video asset ----------------------->', response)
          console.log('video asset file type ---->', typeof assets)


          const fileName = assets.fileName;
          console.log('fileName-----> ', fileName)

          const fileSize = assets.fileSize
          console.log('fileSize----> ', fileSize)

          const uri = assets.uri;
          console.log('uri----> ', uri)

          const type = assets.type;
          console.log('type----> ', type)

          uploadVideo(uri, type, fileName, fileSize)



        }


      });

    }
  };

  const captureFile = async () => {
    const hasPermission = await requestGalleryPermission();

    if (hasPermission) {

      try {
        // 1. Call the pick() method (replacing the old pickSingle)
        const results = await pick({
          // You can specify file types here, or use types.allFiles
          type: [types.allFiles],
          copyToCacheDirectory: true, // Recommended to ensure the file is accessible
        });

        // 2. pick() returns an array, so we destructure the first result
        const [res] = results;

        // 3. Log the file information to the console
        // console.log('--- Document Picker Result ---');
        // console.log('URI (Local Storage Location):', res.uri);
        // console.log('File Name:', res.name);
        // console.log('Type (MIME):', res.type);
        // console.log('Size (Bytes):', res.size);
        // console.log('------------------------------');
        // 4. Update state to display info in the UI

        const fileName = res.name;

        const fileSize = res.size

        const uri = res.uri;

        const type = res.type;

        console.log('name-----> ', fileName)
        console.log('size----> ', fileSize)
        console.log('uri----> ', uri)
        console.log('type----> ', type)


        uploadFile(uri, type, fileName, fileSize)
      } catch (err) {
        if (isCancel) {
          // User cancelled the picker
          ToastAndroid.show( `User cancelled the document picker.`, ToastAndroid.SHORT);

        } else {
          // Some other error occurred
          ToastAndroid.show( `An error occurred(file): ${err.message}`, ToastAndroid.SHORT);
        }
      }
    } else {
      ToastAndroid.show('Permission Denied', ToastAndroid.SHORT)
      
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

  const getChatMessages = async () => {
    let flag = false
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${auth}`);
    const raw = JSON.stringify({
      chatId: chatId,
      orgnid: 18,
      userid: userId,
      tz: 'Asia/Kolkata',
      deviceType: 'Android',
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    await fetch("https://dev.myhygge.io/hygmapi/api/v1/chat/getChatMessages", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // console.log(result)
        const obj = JSON.parse(result)
        // console.log('getMessage------', obj.response)
        flag = obj.status === 200
        if (flag) {
          setMessage(obj.response)

        }
        else {
          console.log('error while fatching')
        }


      })
      .catch((error) => console.error(error));
    console.log('status: ', flag)




  }

  //for upload file
  const uploadFile = async (uri, type, fileName, fileSize) => {
    let flag = false;

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${auth}`);

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: type,
      name: fileName,
      // msgSize: fileSize

    });

    const requestOptions = {
      method: 'POST',
      // headers: myHeaders,
      body: formData,
    };

    await fetch(
      'https://dev.myhygge.io/hygmapi/api/v1/fileUpload/uploadFile',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        // console.log(result)
        const obj = JSON.parse(result);
        flag = obj.status === 200;
        if (flag) {
          console.log('fromData------response-> ', obj);
          const fileName = obj.response.fileName;
          const orgFileName = obj.response.orgFileName;

          sendMessage({
            orgnid: 18,
            chatId: chatId,
            msg: '',
            enc: 1,
            fileName: fileName,
            orgFileName: orgFileName,
            msgSize: '',
            msgType: type,
            fromUser: userId,
            toUser: userList,
            chatType: chatType,
            timestamp: Date.now(),
            seen: 0,
            isDisappearing: 0,
          });
        } else {
          console.log('error while fatching');
        }
      })
      .catch(error => console.error(error));
    console.log('status: ', flag);
  };

  //getting name for socket deliver 
  const uploadPhoto = async (uri, type, fileName, fileSize) => {
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

    await fetch("https://dev.myhygge.io/hygmapi/api/v1/fileUpload/uploadFile", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // console.log(result)
        const obj = JSON.parse(result)
        flag = obj.status === 200
        if (flag) {
          console.log('fromData------response-> ', obj.response)
          const fileName = obj.response.fileName;
          const orgFileName = obj.response.orgFileName
          console.log()

          sendMessage({
            orgnid: 18,
            chatId: chatId,
            msg: "",
            enc: 1,
            fileName: fileName,
            orgFileName: orgFileName,
            msgSize: "",
            msgType: type,
            fromUser: userId,
            toUser: userList,
            chatType: chatType,
            timestamp: Date.now(),
            seen: 0,
            isDisappearing: 0,
          });

        }
        else {
          console.log('error while fatching')
        }


      })
      .catch((error) => console.error(error));
    console.log('status: ', flag)




  }
  const uploadVideo = async (uri, type, fileName, fileSize) => {
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

    await fetch("https://dev.myhygge.io/hygmapi/api/v1/fileUpload/uploadFile", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const obj = JSON.parse(result);
        flag = obj.status === 200
        if (flag) {
          console.log('fromData------response-> ', obj.response);
          const fileName = obj.response.fileName;
          const orgFileName = obj.response.orgFileName;

          sendMessage({
            orgnid: 18,
            chatId: chatId,
            msg: "",
            enc: 1,
            fileName: fileName,
            orgFileName: orgFileName,
            msgSize: "",
            msgType: type,
            fromUser: userId,
            toUser: userList,
            chatType: chatType,
            timestamp: Date.now(),
            seen: 0,
            isDisappearing: 0,
          });

        }
        else {
          console.log('error while fatching')
        }


      })
      .catch((error) => console.error(error));
    console.log('status: ', flag)




  }

  useEffect(() => {

    const socket = initSocket();

    joinRoom(chatId, userId);

    const msgListener = (data) => {
      const incoming = data.response;

      // setMessageId(arr => [...arr, incoming?._id])

      setMessage(prev => [incoming, ...prev]);

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      });
    };

    onReceiveMessage(msgListener);



    onTypingStart(data => {
      const typingId = data.response.userId;
      if (typingId !== userId) {
        // console.log('from chat ontyping userDetails-----',userMap[typingId])
        navigation.setParams({ isTyping: true, typingName: userMap[typingId] })
      }

    });

    onTypingStop((data) => {
      if (data.response.userId !== userId) {
        navigation.setParams({ isTyping: false });
      }
    });


    // onMessageSeen(data => {
    //   if (data.response.userId !== userId) {
    //     console.log('from onMessageSeen.... data', data)
    //   }


    // });

    // const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
    //                   stopTyping(chatId, userId)


    // });
    // beforeRemoveListener()
    getChatMessages();


    return () => {
      offReceiveMessage();
      offTypingStart()
      offTypingStop()
      offMessageSeen()
      offseenMessage()
    };
  }, [chatId, userId]);

  useEffect(() => {
    const backAction = () => {
      if (showMenu) {
        setShowMenu(false)
        return true
      }
      return false


    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => {
      console.log('run from useEffect pf backhandler')
      backHandler.remove()
    }
  }, [showMenu])

  useEffect(() => {
    if (userInput === '') return

    const timeout = setTimeout(() => {
      stopTyping(chatId, userId)
    }, 1000)

    return clearTimeout(timeout)
  }, [userInput])

  useEffect(() => {
    if (replyUserMessage === '') return

    const timeout = setTimeout(() => {
      stopTyping(chatId, userId)
    }, 1000)

    return clearTimeout(timeout)
  }, [replyUserMessage])

  const handleSend = () => {
    setUserState('');

    sendMessage({
      orgnid: 18,
      chatId: chatId,
      msg: userInput?.trim() || "",
      enc: 1,
      fileName: "",
      orgFileName: "",
      msgSize: "",
      msgType: "text",
      fromUser: userId,
      toUser: userList,
      chatType: chatType,
      timestamp: Date.now(),
      seen: 0,
      isDisappearing: 0,
    });
  };

  const handleReplySend = () => {
    setUserState('');

    sendMessage({
      orgnid: 18,
      chatId: chatId,
      msg: replyUserMessage?.trim() || "",
      enc: 1,
      fileName: '',
      orgFileName: '',
      fromUser: userId,
      toUser: userList,
      chatType: chatType,
      timestamp: Date.now(),
      isDisappearing: 0,
      msgType: "text",
      msgSize: '',
      replyMsgId: replyMessageId || '',
      replyMsg: userInput?.trim() || "",
      replySender: replySenderId || '',
    });
    // Keyboard.dismiss();
    // setTimeout(() => {
    //   ToastAndroid.show("replyActive", ToastAndroid.SHORT, ToastAndroid.TOP) //fail in android 11 only
    // }, 150);
    setReplyActive(false)
    setReplyUserName(null)
    setReplyUserMessage(null)
    setReplyMessageId(null)
    setReplySenderId(null)



  }




  const openFile = async (url, fileName) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert("Permission denied", "Cannot save file.");
        return;
      }

      const { dirs } = ReactNativeBlobUtil.fs;
      const localPath = `${dirs.DownloadDir}/${fileName}`;

      let mime =
        fileName.endsWith(".xlsx")
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : fileName.endsWith(".xls")
            ? "application/vnd.ms-excel"
            : fileName.endsWith(".docx")
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : fileName.endsWith(".doc")
                ? "application/msword"
                : "*/*";

      console.log("localPath:", localPath);
      console.log("mime:", mime);

      // Download file using ReactNativeBlobUtil
      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: localPath,
          mime: mime,
          description: 'Downloading file',
          mediaScannable: true,
        },
      }).fetch('GET', url);

      const downloadedPath = response.path();
      console.log("File downloaded to:", downloadedPath);

      // Open file using Android's built-in intent
      await ReactNativeBlobUtil.android.actionViewIntent(
        downloadedPath,
        mime
      );

      console.log("File opened successfully");

    } catch (err) {
      console.log("Error downloading:", err);
      if (err.message && err.message.includes('No app found')) {
        Alert.alert(
          "Cannot open file",
          "No compatible app installed to open this file."
        );
      } else {
        Alert.alert("Error", "File download or open failed.");
      }
    }
  };

  const onMessageDelete = async (messageId) => {
    setShowMenu(null)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${auth}`);
    const raw = JSON.stringify({
      "msgId": messageId

    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    const result = await fetch("https://dev.myhygge.io/hygmapi/api/v1/chat/deleteMessageById", requestOptions)
    console.log('message delete suscessfull ', result.status)
    await getChatMessages()
  }


  return (
    // main view

    <KeyboardAvoidingView style={[styles.MainView]}>
      {/* chat bubble */}
      <FlatList
        ref={flatListRef}
        style={{
          // backgroundColor:'blue'
          flex: 1,
        }}
        inverted={true}
        data={message}
        renderItem={item => {
          // console.log('from chat render item--->>>>>', item.item)
          const timestamp = item.item.timestamp;
          const fromUser = item.item.fromUser;
          const senderImage = item.item.senderImage;
          const senderName = item.item.senderName;
          const seen = item.item.seen;
          const deleted = item.item.deleted;
          const deletedat = item.item.deletedat;
          const fileName = item.item.fileName;
          let fileExtension = fileName.split('.').pop();
          const replySenderId = item.item.replySender;
          //   return <Text style={{textAlign:fromUser !== userId ? 'left' : 'right'}}>{item.item.msg}</Text>
          // console.log('filename from chat--->',item.item.fileName === ''? null: item.item.fileName)

          const uriFile = `https://hyggeliteprodblobstorage.blob.core.windows.net/hyggemedia/uploadedFiles/${item.item.fileName}`;
          // const uriVideo = `http://20.46.156.91/uploadedFiles/${item.item.fileName}`;
          console.log('file name: ', item.item.orgFileName)
          return (

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (showMenu !== item.item._id) {
                  setShowMenu(null)

                }

                if (fileExtension === 'pdf') {
                  if (deleted === 1) {
                    ToastAndroid.show("Deleted message!", ToastAndroid.SHORT);
                  } else {
                    handlePdfPress(uriFile);

                  }
                } else if (fileExtension === 'docx' || fileExtension === 'xlsx') {
                  if (deleted === 1) {
                    ToastAndroid.show("Deleted message!", ToastAndroid.SHORT);
                  } else {
                    openFile(uriFile, decodeURIComponent(item.item.orgFileName));

                  }
                }
                else if (fileExtension === 'jpg') {
                  if (deleted === 1) {
                    ToastAndroid.show("Deleted message!", ToastAndroid.SHORT);
                  } else {
                    setIsVisiblePhoto(true)

                    setCurrentImageUri(uriFile);
                  }

                }
                else {
                  if (deleted === 1) {
                    ToastAndroid.show("Deleted message!", ToastAndroid.SHORT);


                  }
                  else {
                    item.item.fileName === ''
                      ? setIsVisiblePhoto(false)
                      : setIsVisiblePhoto(true);
                    setCurrentImageUri(null);
                  }

                }
              }}

              onLongPress={() => {

                setShowMenu(item.item._id)
              }}

            >
              <Chatbubble
                left={fromUser !== userId}
                data={item.item.msg}
                photo={fileExtension === 'jpg' ? uriFile : null}
                // video={fileExtension === 'jpg' ? uriVideo : null}
                file={fileExtension !== 'jpg' ? uriFile : null}
                filename={decodeURIComponent(item.item.orgFileName)}
                fileType={fileExtension}
                chatType={chatType}
                senderName={fromUser !== userId ? senderName : null}
                senderImage={fromUser !== userId ? senderImage : null}
                fromUser={fromUser}
                timestamp={timestamp}
                seen={seen}
                deleted={deleted}
                deletedat={deletedat}
                replyMsg={item.item.replyMsg}
                replySenderName={replySenderId ? replySenderId === userId ? 'You' : (userMap)?.[replySenderId] : null}

              // duration={item.item.duration}
              />
              {showMenu === item.item._id ? deleted === 1 ? null : <View
                style={{
                  alignSelf: fromUser === userId ? 'flex-end' : 'flex-start',
                  width: '40%',
                  backgroundColor: 'white',
                  borderRadius: 10,
                  elevation: 5,
                  marginBottom: 10,
                  paddingHorizontal: 3,
                  paddingVertical: 3,
                  // alignItems:fromUser === userId ? 'flex-end' 
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: '#e3edf8ff',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: fromUser !== userId ? 10 : 0,
                    borderBottomRightRadius: fromUser !== userId ? 10 : 0,

                  }}
                  onPress={() => {
                    if (replyActive) {
                      setReplyActive(false)
                    } else {
                      setReplyActive(true)

                    }
                    setReplyUserName(senderName)
                    setReplyMessageId(item.item._id)
                    setReplySenderId(fromUser)
                    setReplyUserMessage(item.item.msg)

                  }}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'

                  }}>
                    <Text
                      style={{
                        color: 'blue',
                        paddingHorizontal: 10,
                        paddingVertical: 10,

                      }}
                    >Reply</Text>
                    <Entypo name='reply' size={20} color={'blue'} />

                  </View>
                </TouchableOpacity>

                {fromUser !== userId ? null : <TouchableOpacity
                  style={{
                    backgroundColor: '#f8e7e7ff',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                  onPress={() => {
                    onMessageDelete(item.item._id)
                  }}

                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'

                  }}>
                    <Text
                      style={{
                        color: 'red',
                        paddingHorizontal: 10,
                        paddingVertical: 10,

                      }}>Delete</Text>
                    <MaterialIcons name='delete-outline' size={20} color={'red'} />

                  </View>

                </TouchableOpacity>}

              </View> : null}
            </TouchableOpacity>
          );
        }}
      />




      <ImageViewing
        images={currentImageUri ? [{ uri: currentImageUri }] : []}
        imageIndex={0} // Start at the first image
        visible={isVisiblePhoto}
        onRequestClose={() => {
          setIsVisiblePhoto(false);
          setCurrentImageUri(null);
        }} // Set to close the modal
        presentationStyle="fullScreen"
        swipeToCloseEnabled={true}
      />


      {/* pdf view modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={pdfModalVisible}
        onRequestClose={closePdfViewer} // Handles Android back button
      >
        {pdfUri && (
          <Pdf
            // Ensure the URI is wrapped in a source object
            trustAllCerts={false}
            source={{ uri: pdfUri, cache: true }}
            onLoadComplete={(numberOfPages) => {
              console.log(`PDF loaded with ${numberOfPages} pages.`);
            }}
            onError={(error) => {
              console.error("PDF Viewer Error:", error);
              // Alert.alert("Error", `Could not display PDF: ${error.message}`);
              closePdfViewer();
            }}
            style={{
              height: '100%',
              width: '100%'
            }}
          />
        )}
      </Modal>


      {/* video playback */}
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
              onBack={() => {
                // This is triggered by the back button in video-controls
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
      <View style={[styles.FloatingButton, { bottom: insets.bottom }]}>

        {replyActive ?
          <View style={{
            flexDirection: 'row',
            // backgroundColor: 'blue',
            width: '100%',
            height: 50,


          }}>
            {/* header */}
            <View style={{
              width: '90%',
              height: '100%',
              // backgroundColor:'red',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* icon */}
              <View style={{
                width: '20%',
                height: '100%',
                // backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Entypo name='reply' size={20} color={'blue'} />
              </View>
              {/* body */}
              <View style={{
                width: '80%',
                height: '100%',
                // backgroundColor: 'orange',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'scroll'
              }}>
                <Text>{replyUserName}</Text>
                <Text style={{

                }}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >{replyUserMessage}</Text>
              </View>

            </View>
            {/* trailling */}
            <TouchableOpacity style={{
              height: '100%',
              width: '10%',
              // backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center'

            }}
              onPress={() => {
                setReplyActive(false)
                setReplyUserName(null)
                setReplyUserMessage(null)

              }}
            >
              <Entypo name='cross' size={20} color={'grey'} />
            </TouchableOpacity>


          </View>
          :
          null
        }
        <View style={{
          height: 1,
          width: '100%',
          backgroundColor: '#74717138'
        }} />
        <BoxContainer
          iconStyle={{
            width: 0,
            height: 0,
            borderRadius: 30,
          }}
          boxStyle={{
            paddingHorizontal: 10,
            paddingVertical: 0,
            maxHeight:100,
          }}
          status={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // backgroundColor:'blue',
                width: userInput === '' ? 70 : 30,
              }}
            >
              {userInput === '' ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      // open()
                      setIsBottomSheetVisible(true);
                    }}
                  >
                    <FontAwesome6 name="paperclip" size={24} color="grey" />
                  </TouchableOpacity>
                  <TouchableOpacity
                  // onPress={async () => {
                  //     if (isMicOn) {
                  //         setIsMicOn(true)
                  //         await SoundRecorder.start({
                  //             format: 'aac', // or 'wav', 'mp3'
                  //             sampleRate: 44100,
                  //             channels: 1,
                  //         });
                  //     } else {
                  //         setIsMicOn(false)
                  //         const result = await SoundRecorder.stop();
                  //         console.log('File saved at:', result.path);

                  //     }

                  // }}
                  >
                    <Feather
                      name="mic"
                      size={24}
                      color={isMicOn ? 'red' : 'grey'}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => replyActive ? handleReplySend() : handleSend()}>
                  <Ionicons
                    name="send"
                    size={24}
                    color={Colors.AppBarBackgroundColor}
                  />
                </TouchableOpacity>
              )}
            </View>
          }
          content={
            <TextInput
              multiline
              textAlignVertical="top"
              onFocus={() => {
                setShowMenu(false)
              }}
              placeholder="Message"
              value={userInput}
              onChangeText={newText => {
                setUserState(newText);
                startTyping(
                  chatId, userId
                )
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                }

                typingTimeoutRef.current = setTimeout(() => {
                  stopTyping(chatId, userId);   
                }, 1000);

              }}
              onBlur={() => {
                stopTyping(chatId, userId)
              }}
              style={{
                // backgroundColor:'green',
                width: '100%',
                marginLeft: 6,
                fontSize: 18,
              }}
            />
          }
        />
      </View>




      {/* modal view from bottom */}
      <Modal
        visible={isBottomSheetVisible}
        onBackdropPress={() => setIsBottomSheetVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setIsBottomSheetVisible(false)}
        backdropColor="#13131311"
        animationType="slide"
        onRequestClose={() => {
          setIsBottomSheetVisible(false);
        }}
      >
        {/* main view of modal */}
        <View
          style={{
            // backgroundColor: '#0a0a0a38',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            
          }}
          onTouchEnd={()=>{
            setIsBottomSheetVisible(false)
          }}
        >
          <View
            style={{
              height: 'auto',
              width: '100%',
              backgroundColor: 'white',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              elevation: 5,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              position: 'relative',
            }}
            onTouchEnd={(e)=>{
            e.stopPropagation()
          }}
          >
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'space-around',
                alignItems: 'center',
                marginVertical: 10,
                // backgroundColor:'red',
                width: '100%',
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity
                onPress={capturePhoto}
                style={[
                  {
                    backgroundColor: '#5633f3ff',
                    borderColor: '#cfc4ffff',
                  },
                  styles.modalButton,
                ]}
              >
                <Feather name="camera" size={25} color="white" />
              </TouchableOpacity>

              {/* <TouchableOpacity
                // onPress={captureVideo}
                style={[
                  {
                    backgroundColor: '#4bc02dff',
                    borderColor: '#bbfcabff',
                  },
                  styles.modalButton,
                ]}
              >
                <Feather name="video" size={25} color="white" />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={captureFile}
                style={[
                  {
                    backgroundColor: '#953ee6ff',
                    borderColor: '#deaafcff',
                  },
                  styles.modalButton,
                ]}
              >
                <Feather name="file" size={25} color="white" />
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={null}
                style={[
                  {
                    backgroundColor: '#1c86ffff',
                    borderColor: '#9ecbffff',
                  },
                  styles.modalButton,
                ]}
              >
                <Ionicons name="person-outline" size={25} color="white" />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={openGallery}
                style={[
                  {
                    backgroundColor: '#e6523eff',
                    borderColor: '#f8b6adff',
                  },
                  styles.modalButton,
                ]}
              >
                <Feather name="image" size={25} color="white" />
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={null}
                style={[
                  {
                    backgroundColor: '#e68f3eff',
                    borderColor: '#f8e0adff',
                  },
                  styles.modalButton,
                ]}
              >
                <Entypo name="location-pin" size={25} color="white" />
              </TouchableOpacity> */}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default Chat;

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
  image: {
    width: '33.33%', // For 3 columns
    height: 120,
    margin: 1,
  },
  loadingText: {
    padding: 20,
    textAlign: 'center'
  },
  modalButton: {
    borderWidth: 5,
    // borderColor: '#ffffffff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
    elevation: 5,
    marginVertical: 0,
    marginRight: 10

  }
})


