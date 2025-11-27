import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useRef, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from '../screens/Chats/Chats';
import Chat from '../screens/Chats/Chat/Chat';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import BoxContainer from '../constants/Container/BoxContainer';
import TabNavigation from './TabNavigation';
import NavigableHeaderTitle from './NavigableHeaderTitle';
import Colors from '../constants/Colors/Colors';
//Screens
import Profile from '../screens/Chats/Profile/Profile';
import NewMessage from '../screens/Chats/NewMessage/NewMessage';
import NewGroup from '../screens/Chats/NewMessage/NewGroup/NewGroup';
import CreateGroup from '../screens/Chats/NewMessage/NewGroup/CreateGroup';
import GroupProfile from '../screens/GroupProfile/GroupProfile';
import AddMembers from '../screens/GroupProfile/AddMembers';
import StartScreen from '../screens/Login/StartScreen';
import Login from '../screens/Login/Login';
import Otp from '../screens/Login/Otp';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
// import ContextMenu from '../screens/Chats/Chat/ContextMenu'
import { AppContext } from '../services/AppContext';
import Menu, { MenuItem } from 'react-native-material-menu';

const Stack = createNativeStackNavigator();

const ChatNavigation = () => {
  const { userId, isLoading } = useContext(AppContext);
  //   const {auth} = useContext(AppContext)
  console.log('from stack navigation check the vaklue of uerid', userId);
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName={userId ? 'TabNavigation' : 'StartScreen'}
    >
      
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="Otp"
        component={Otp}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{

      }
      } />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ route, navigation }) => {
          const name = route.params?.name;
          const chatId = route.params?.chatId;
          const userList = route.params?.userList;
          const userDetails = route.params?.userDetails;
          const chatType = route.params?.chatType;
          const profilePhoto = route.params?.profilePhoto;
          const subtitle = route.params?.subtitle;
          const isTyping = route.params?.isTyping;
          const typingName = route.params?.typingName;
          return {
            headerTitle: () => (
              <NavigableHeaderTitle
                name={name}
                members={userList}
                nav={chatType === 'single' ? "Profile" : "GroupProfile"}
                profilePhoto={profilePhoto}
                userDetails={userDetails}
                chatType={chatType}
                subtitle={isTyping ? 'Typing ' + typingName : subtitle}

              />
            ),
            headerRight: () => (
              <ActionRightButtons component={<ContextMenu />} />
            ),
            
            headerTitleStyle: {
              fontSize: 24,
            },
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: Colors.AppBarBackgroundColor,
            },

          };
        }}
      />
      <Stack.Screen
        name="NewMessage"
        component={NewMessage}
        options={{
          headerTitle: 'New Message',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.AppBarBackgroundColor,
          },
        }}
      />

      <Stack.Screen
        name="NewGroup"
        component={NewGroup}
        options={{
          headerTitle: 'New Group',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.AppBarBackgroundColor,
          },
        }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{
          headerTitle: 'Create Group',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.AppBarBackgroundColor,
          },
        }}
      />


      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.AppBarBackgroundColor,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                // backgroundColor: 'red',
                width: 130,
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Feather name="phone-call" size={24} color="white" />
              </View>
              <View>
                <Feather name="camera" size={24} color="white" />
              </View>
              <View>
                <Entypo name="dots-three-vertical" size={20} color="white" />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="GroupProfile"
        component={GroupProfile}
        options={{
          headerTitle: 'Group Profile',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.AppBarBackgroundColor,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                // backgroundColor: 'red',
                width: 130,
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Feather name="phone-call" size={24} color="white" />
              </View>
              <View>
                <Feather name="camera" size={24} color="white" />
              </View>
              <View>
                <Entypo name="dots-three-vertical" size={20} color="white" />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="AddMembers"
        component={AddMembers}
        options={{
          headerTitle: 'Add Members',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.AppBarBackgroundColor,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ActionRightButtons = component => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor:'red',
        width: 70,
      }}
    >
      <TouchableOpacity>
        <Feather name="phone-call" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          component;
        }}
      >
        <Entypo name="dots-three-vertical" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const ContextMenu = () => {
  const menuRef = useRef(null);

  return (
    <View>
      <Button title="Show Menu" onPress={() => menuRef.current.show()} />
      <Menu ref={menuRef}>
        <MenuItem onPress={() => menuRef.current.hide()}>Edit</MenuItem>
        <MenuItem onPress={() => menuRef.current.hide()}>Delete</MenuItem>
      </Menu>
    </View>
  );
};

export default ChatNavigation;

const styles = StyleSheet.create({
  Text: {
    fontSize: 24,

    marginLeft: 20,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
