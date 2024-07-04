import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import { fetcher } from 'common/utils/fetcher';
import { Response } from 'common/types/res/response.type';
import { useAuth } from 'client/hooks/use-auth';
import { ChaterType } from 'common/types/chat/chater.type';
import Toast from 'react-native-toast-message';
import { TshusSocket } from 'common/types/other/socket.type';
import { useSocket } from 'common/hooks/use-socket';

const FriendAcceptList = () => {
    const nav = useNavigation();
    type NavType = {
        navigate: (screen: string) => void;
    }
    const gobackContact = (nav: NavType) => {
        nav.navigate("Contact");
    };
    // Socket
    const socket: TshusSocket = useSocket();
    const [isAccepted, setIsAccepted] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    // List friends state
    const [friendSender, setFriendSender] = useState<any[]>([]);

    const [friendRequest, setFriendRequest] = useState<any[]>([]);

    const auth = useAuth();

    const acceptRequest = async (id: string) => {
        // Response
        const res: Response = await fetcher({
            method: 'POST',
            url: '/friends/accept',
            payload: { id },
        });

        // Check status
        if (res?.status === 200) {
            // Index
            const index = friendRequest.findIndex((i) => i?._id === id);

            // Temp friends sender
            const temp = friendRequest;

            // Remove
            if (index !== -1) {
                // Remove
                temp.splice(index, 1);

                // Set new
                index === 0 ? setFriendRequest([]) : setFriendRequest(temp);
            }
            // Handle cancel request action
            setIsAccepted(true);
            Toast.show({
                type: 'success',
                text1: "Đã đồng ý",
                text2: "Đồng ý kết bạn thành công",
                visibilityTime: 1000
            })
            // Success message
            console.log('Đồng ý lời mời kết bạn thành công');
        } else {

            // error message
            console.log('Đồng ý lời mời kết bạn thất bại');
        }
    };

    // Cancel request
    const cancelRequest = async (id: string) => {
        // Response
        const res: Response = await fetcher({
            method: 'DELETE',
            url: '/friends/cancel',
            payload: { id },
        });

        // Check status
        if (res?.status === 200) {
            // Index
            const index = friendRequest.findIndex((i) => i?._id === id);

            // Temp friends sender
            const temp = friendRequest;

            // Remove
            if (index !== -1) {
                // Remove
                temp.splice(index, 1);

                // Set new
                index === 0 ? setFriendRequest([]) : setFriendRequest(temp);
            }
            setIsRejected(true);
            // Success message
            console.log('Từ chối lời mời kết bạn thành công');
        } else {
            // error message
            console.log('Từ chối lời mời kết bạn thất bại');
        }
    };
    // Effect
    useEffect(() => {

        // Load request
        (async () => {
            // Response
            const res: Response = await fetcher({
                method: 'GET',
                url: '/friends/load_request',
                payload: { user: auth?.get?._id },
            });

            // Check status
            if (res?.status === 200) {
                // Set request
                setFriendRequest(res?.data?.request);

                // Set sended
                setFriendSender(res?.data?.sended);
            }
            // Return
        })();
    }, [auth?.get?._id]);
    return (
        <View>
            {/* Header */}
            <View style={styles.header}>
                <LinearGradient
                    colors={["#77caea", "#38A2CF", "#156DBA"]}
                    start={[0, 0]}
                    end={[1, 2]}
                    style={styles.gradienthead}
                >
                    {/* Back */}
                    <TouchableOpacity style={styles.backBTN} onPress={() => gobackContact(nav)}>
                        <Image
                            source={require("../../../Images/back.png")}
                            style={styles.headerIcon}
                        />
                        <Text style={{ marginTop: 42, fontWeight: 'bold', fontSize: 17, color: 'white' }}>Lời mời kết bạn</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "500", paddingBottom: 10 }}>Danh sách tất cả các lời mời kết bạn:</Text>
            {friendRequest?.length > 0 ? (
                friendRequest?.map(({ inviter, _id, createdAt }: any) => (
                    <View style={{ paddingTop: 10 }}>

                        <View
                            key={inviter?.user}
                            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, borderBottomColor: "#EFF0F2", borderBottomWidth: 1 }}>
                            <View style={{ marginLeft: 12, marginTop: 10 }}>
                                <Image
                                    source={require("../../../Images/male.png")}
                                    style={{ height: 50, width: 50, resizeMode: 'cover', marginBottom: 10 }}
                                />
                            </View>
                            <View style={{ marginBottom: 8, marginLeft: 12, flex: 1 }}>
                                <Text style={{ fontWeight: "bold" }}>{inviter?.nickname}</Text>
                                {/* <Text style={{ marginTop: 4, color: "gray" }}> {friendRequest?.phone}</Text> */}
                            </View>
                            <View style={{ flexDirection: "row", marginRight: 5 }}>
                                <TouchableOpacity
                                    disabled={isRejected}
                                    onPress={() => cancelRequest(_id)}
                                    style={[styles.buton, { backgroundColor: "grey" }]}>
                                    <Text style={{ color: "white" }}>Từ chối</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={isAccepted}
                                    onPress={() => acceptRequest(_id)}
                                    style={[styles.buton, { backgroundColor: "#38A2CF" }]}>
                                    <Text style={{ color: "white" }}>Chấp nhận</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <View>
                    <Text>Không có lời lời kết bạn nào</Text>
                </View>
            )}


        </View>
    )
}

export default FriendAcceptList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    header: {
        overflow: "hidden",
        width: "100%",
        height: 110,
        paddingVertical: 10,
        position: "relative",
        top: -10,
    },
    gradienthead: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        height: 90,
    },
    backBTN: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    headerIcon: {
        marginTop: 60,
        margin: 15,
        resizeMode: "contain",
        height: 25,
        width: 25,
    },
    buton: {

        height: 30,
        width: 90,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 8,
        borderRadius: 20,
    }
})
