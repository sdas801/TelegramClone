import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState, } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'

const Login = ({ navigation }) => {
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [disabled, setDisabled] = useState(false);

    let userId;


    useFocusEffect(
        useCallback(() => {
            setIsLoading(false);
            setDisabled(false);
            setIsLoadingButton(false);
            return () => { };
        }, [])
    );

    const ApiRequest = async (email) => {
        let flag;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "organisation_id": 18,
            "useremail": email,
            "tz": "Asia/Kolkata",
            "deviceType": "Android"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        await fetch("https://dev.myhygge.io/hygmapi/api/v1/login/mlogin", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const obj = JSON.parse(result)
                flag = obj.status;
                userId = obj.response.userId


            })
            .catch((error) => ToastAndroid.show(String(error), ToastAndroid.SHORT));
        console.log('flag from login', flag)
        return flag



    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#e9f8ffff',


            }}>
            {isLoading
                ? <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
                :
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        // backgroundColor:'white',
                        paddingHorizontal: 20,

                    }}>
                    {/* top container */}
                    <View
                        style={{
                            flex: 1,
                            // backgroundColor:'blue',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start'

                        }}>
                        {/* logo */}
                        <View
                            style={{
                                marginVertical: 20,
                                height: 80,
                                width: 80,
                                backgroundColor: 'orange'
                            }}>
                            <Text>logo</Text>
                        </View>
                        {/* title */}
                        <Text style={{
                            fontSize: 40,
                            fontWeight: 'bold'
                        }}>Welcome.</Text>
                        {/* subtitle */}
                        <Text style={{ fontSize: 20 }}> Log in to your account</Text>
                        <TextInput
                            editable={!disabled}
                            style={{
                                marginTop: 40,
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: focus ? 'blue' : '#cececeff',
                                // backgroundColor:'red',
                                width: '100%',
                                borderRadius: 10,
                                paddingVertical: 17
                            }}
                            placeholder='Work Email'
                            value={value}
                            onChangeText={(e) => setValue(e)}
                            onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                        />
                        <Text style={{
                            color: 'red'
                        }}>{error}</Text>
                    </View>


                    {/* bottom container */}
                    <View
                        style={{
                            flex: 1,
                            // backgroundColor:'red',
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                        }}>
                        {/* Terms of Service */}
                        <Text style={{ fontSize: 17, textAlign: 'center' }}>By  continue, you agree to our Trems of Service and Privacy Policy</Text>
                        {/* next botton */
                        }
                        <TouchableOpacity
                            onPress={async () => {
                                setError(null)

                                setIsLoadingButton(true)
                                setDisabled(true);
                                const apiCheck = await ApiRequest(value)
                                if (apiCheck === 200) {
                                    setError(null)

                                    setIsLoading(true);
                                    navigation.navigate('Otp', { userId: userId })

                                }
                                else if (apiCheck === 404 || apiCheck === 500 || apiCheck === 1004) {
                                    setDisabled(false);
                                    setIsLoadingButton(false)
                                    setError('Invalid Email')
                                }
                                else if (apiCheck === undefined) {
                                    setDisabled(false);
                                    setIsLoadingButton(false)
                                    setError('network issue')
                                }
                                else if (apiCheck === 1001) {
                                    setDisabled(false);
                                    setIsLoadingButton(false)
                                    setError('Empty field')
                                }
                                else {
                                    setDisabled(false);
                                    setIsLoadingButton(false)
                                    setError('uncaught error')
                                }

                            }}
                            disabled={disabled}
                            style={{
                                width: '100%',
                                height: 60,
                                backgroundColor: '#3128ce',
                                paddingVertical: 17,
                                borderRadius: 30,
                                marginVertical: 18,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            {
                                isLoadingButton
                                    ? <ActivityIndicator size="22" color="#e9e9ffff" />
                                    : <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>Log in</Text>
                            }
                        </TouchableOpacity>
                        <Text>Powered by HYGGH Digital</Text>
                    </View>
                </KeyboardAvoidingView>}
        </SafeAreaView>
    )
}
export default Login;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
})