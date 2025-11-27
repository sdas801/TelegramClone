import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
const StartScreen = ({ navigation }) => {
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState(null);
    const [logo, setLogo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(false);


    const ApiRequest = async (code) => {
        let flag;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "companycode": code,
            "tz": "Asia/Kolkata",
            "deviceType": "Android"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        await fetch("https://dev.myhygge.io/hygmapi/api/v1/login/getCmpDtlByCmpCode", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log(result)
                const obj = JSON.parse(result)
                flag = obj.status;



            })
            .catch((error) => {
                ToastAndroid.show(String(error), ToastAndroid.SHORT);
            });
        return flag


    }



    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#e9f8ffff',


            }}>
            {isLoading
                ?
                <View style={styles.loadingContainer}>
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
                            // source={{ uri: logo }}

                            style={{
                                marginVertical: 10,
                                width: 100,
                                height: 100,
                                // resizeMode: 'contain',
                                backgroundColor: 'orange'
                            }} />

                        {/* title */}
                        <Text style={{
                            fontSize: 40,
                            fontWeight: 'bold'
                        }}>Welcome.</Text>
                        {/* subtitle */}
                        <Text style={{ fontSize: 20 }}> Log in to your account</Text>
                        {/* TextInput Company Code */}
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
                            placeholder='Company Code'
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
                            disabled={disabled}
                            onPress={async () => {
                                setError(null)

                                setIsLoadingButton(true)

                                setDisabled(true);
                                const apiCheck = await ApiRequest(value)
                                // const apiCheck = true
                                if (apiCheck === 200) {
                                    setError(null)

                                    setIsLoading(true);

                                    navigation.replace('Login')
                                } else if (apiCheck === 404 || apiCheck === 500 || apiCheck === 1004) {
                                    setDisabled(false);
                                    setIsLoadingButton(false)
                                    setError('Code invalid')

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
                            style={{
                                width: '100%',
                                height: 60,
                                backgroundColor: 'blue',
                                paddingVertical: 17,
                                borderRadius: 30,
                                marginVertical: 18
                            }}>

                            {isLoadingButton
                                ? <ActivityIndicator size="22" color="#e9e9ffff" />
                                : <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>Next</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>}
        </SafeAreaView >
    )
}

export default StartScreen

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
})