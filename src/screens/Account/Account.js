import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useEffect, useCallback, useContext, useState, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../services/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'
export default function Account({ navigation }) {
    const disabled = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const { userData } = useContext(AppContext);
    console.log('Account---->full name', userData.full_name)

    const getColorForBackground = name => {
        let hash = 0;
        for (let i = 0; i < name?.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        // convert hash → hue (0–360)
        const hue = Math.abs(hash) % 360;
        // softer pastel tones
        return `hsl(${hue}, 65%, 90%)`;
    };
    const getColorForLetter = name => {
        let hash = 0;
        for (let i = 0; i < name?.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        // convert hash → hue (0–360)
        const hue = Math.abs(hash) % 360;
        // softer pastel tones
        return `hsl(${hue}, 90%, 40%)`;
    };

    const backgroundColor = getColorForBackground(userData.full_name);
    const letterColor = getColorForLetter(userData.full_name);


    return (
        isLoading
            ? <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
            // main container 
            : <View>
                {/* profile header */}
                <View style={{
                    // backgroundColor: 'red',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    backgroundColor: '#0070a8ff',
                }}>
                    <View style={{
                        height: 80,
                        width: 80,
                        borderRadius: 80,
                        backgroundColor: backgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 5,

                    }}>
                        {userData.imageurl
                            ? <ImageBackground
                                source={{
                                    uri: `https://hyggeliteprodblobstorage.blob.core.windows.net/hyggemedia/uploadedFiles/${userData.imageurl}`,
                                }}
                                imageStyle={{
                                    borderRadius: 35,
                                }}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                resizeMode="cover"
                            ></ImageBackground>
                            : <Text
                                style={{
                                    color: letterColor,
                                    fontSize: 40
                                }}
                            >{userData.first_name?.charAt(0).toUpperCase()}</Text>
                        }
                    </View>
                    <View style={{
                        marginVertical:10,
                    }}>
                    <Text style={{
                        color:'white',
                        fontSize:18
                    }}>{userData.full_name}</Text>
                    </View>

                </View>
                {/* body */}
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}>
                    <Text style={{
                        color: '#3067ffff',
                        fontSize: 16,
                    }}>Account</Text>

                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{'+' + userData.country_code + ' ' + userData.contact_number}</Text>
                        <Text style={styles.subtitle}>Mobile</Text>
                    </View>
                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{userData.email_id}</Text>
                        <Text style={styles.subtitle}>Username</Text>
                    </View>
                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{userData.dob}</Text>
                        <Text style={styles.subtitle}>Birthday</Text>
                    </View>
                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{userData.dob}</Text>
                        <Text style={styles.subtitle}>Birthday</Text>
                    </View>
                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{userData.gender}</Text>
                        <Text style={styles.subtitle}>Gender</Text>
                    </View>
                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{userData.marital_status}</Text>
                        <Text style={styles.subtitle}>Marital Status</Text>
                    </View>
                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{userData.nationality}</Text>
                        <Text style={styles.subtitle}>Nationality</Text>
                    </View>
                    <View style={styles.infoTile}>
                        <Text style={styles.title}>{userData.passport_number || 'N/A'}</Text>
                        <Text style={styles.subtitle}>Passport Number</Text>
                    </View>
                    <TouchableOpacity
                        disabled={disabled.current}

                        style={{
                            backgroundColor: '#ffd2d2ff',
                            borderRadius: 20,
                            paddingVertical: 10,
                            paddingHorizontal: 30,
                        }}
                        onPress={async () => {
                            if (disabled.current) return;
                            disabled.current = true;

                            setIsLoadingButton(true);
                            setIsLoading(true);

                            await AsyncStorage.setItem('userId', '');
                            await AsyncStorage.setItem('auth', '');
                            await AsyncStorage.setItem('user_data', '');

                            navigation.replace('Login');
                        }}
                    >{isLoadingButton
                        ? <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ebebfcff" />
                        </View>
                        : <Text style={{
                            color: '#ff3333ff'
                        }}>LogOut</Text>}</TouchableOpacity>


                </View>

            </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        color: 'black',

    },
    subtitle: {
        color: 'grey',
    },
    infoTile: {
        marginVertical: 10,

    }

})