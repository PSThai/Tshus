import { Alert, Button, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetcher } from 'common/utils/fetcher';
import { User } from 'common/interface/User';
import { useAuth } from 'client/hooks/use-auth';
import { AuthHookType, HookType, SpecialHookType } from 'common/types/other/hook.type';
import { UserHasFriend } from 'common/types/chat/user-has-friend.type';
import { Response } from 'common/types/res/response.type';
import { FriendStateEnum } from 'common/enum/friend-state.enum'
import Item from 'antd/es/list/Item';
import { ChaterType } from 'common/types/chat/chater.type';
import { Conversations } from 'common/interface/Conversations';
import { useConversations } from 'client/hooks/user-conversations';
import { RoomRoleEnum } from 'common/enum/room-role.enum';
import Toast from 'react-native-toast-message';


type FormFindType = {
    name: string;
    members: UserValue[];
};
// Usage of DebounceSelect
interface UserValue {
    label: string;
    value: string;
    title: string;
}
const CreateGroup = () => {
    // Auth
    const auth = useAuth();

    // Conversations
    const cvsContext: SpecialHookType<Conversations> = useConversations();
    // List friends state
    const [friendsList, setFriendsList] = useState<any[]>([]);
    // Name Rooms
    const [name, setName] = useState("");
    const nav = useNavigation();

    type NavType = {
        navigate: (screen: string) => void;
    }
    const goToContact = (nav: NavType) => {
        nav.navigate("Contact");
    };
    // Effect
    useEffect(() => {
        // Load friends
        (async () => {
            // Response
            const res: Response = await fetcher({
                method: 'GET',
                url: '/friends/page',
                payload: { user: auth?.get?._id },
            });

            if (res?.status === 200) {
                // Set data
                setFriendsList(res?.data);
            }

            // Return
        })();
    }, [auth?.get?._id]);
    const [selectedFriends, setSelectedFriends] = useState<{ [key: string]: ChaterType }>({});


    const handleSelect = (friend: ChaterType) => {
        setSelectedFriends((prevState) => {
            if (prevState[friend.user]) {
                // If the friend is already selected, remove them from the selectedFriends
                const { [friend.user]: removed, ...rest } = prevState;
                return rest;
            } else {
                // Otherwise, add them to the selectedFriends
                return {
                    ...prevState,
                    [friend.user]: friend
                };
            }
        });

    };
    const onFinish = async () => {
        // Exception handling
        try {

           // Response
            const res: Response = await fetcher({
                method: 'POST',
                url: '/rooms/create',
                payload: {
                    image: '',
                    name: name, // Assuming values.name contains the room name
                    conversation: cvsContext?.current.get._id, // The conversation ID
                    creater: {
                        role: RoomRoleEnum.MANAGER,
                        member: {
                            user: auth?.get?._id, // User ID of the creator
                            avatar: auth?.get?.avatar, // Avatar of the creator
                            nickname: auth?.get?.nickname, // Nickname of the creator
                        },
                    },
                    members: Object.values(selectedFriends).map((friend) => ({
                        role: RoomRoleEnum.MEMBER,
                        member: {
                            user: friend.user, // User ID of the member
                            avatar: friend.avatar, // Avatar of the member
                            nickname: friend.nickname, // Nickname of the member
                        },
                    })),
                }
            });
            console.log(res?.status);
            
            // Check response status
            if (res?.status === 201) {
                // Show success message
                Toast.show({
                    type: 'success',
                    text1: "Tạo nhóm thành công",
                    text2: "Bạn đã tạo nhóm thành công !",
                    visibilityTime:1000
                  })
            } else {
                // Show error message
                Toast.show({
                    type: 'error',
                    text1: "Tạo nhóm không thành công",
                    text2: "Vui lòng thử lại!",
                    visibilityTime:1000
                  })
            }
        } catch (error) {
            console.log("Lỗi tạo nhóm", error);
            // Show error message
            Toast.show({
                type: 'success',
                text1: "Tạo nhóm thành công",
                text2: "Bạn đã tạo nhóm thành công !",
                visibilityTime:1000
              })
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <LinearGradient
                    colors={["#77caea", "#38A2CF", "#156DBA"]}
                    start={[0, 0]}
                    end={[1, 2]}
                    style={styles.gradienthead}
                >
                    {/* Back */}
                    <TouchableOpacity style={styles.backBTN} onPress={() => goToContact(nav)}>
                        <Image
                            source={require("../../Images/back.png")}
                            style={styles.headerIcon}
                        />
                        <Text style={{ marginTop: 42, fontWeight: 'bold', fontSize: 17, color: 'white' }}>Tạo Nhóm </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            {/* Body */}
            <View style={styles.body}>
                <View style={styles.SetForm}>
                    <TouchableOpacity style={{ width: 70, height: 70, backgroundColor: 'black', borderRadius: 100 }}>

                    </TouchableOpacity>

                    <TextInput
                        style={{ padding: 10, borderBottomWidth: 1, borderRadius: 12, height: 55, width: 180 }}
                        placeholder='Nhập Tên Nhóm '
                        onChangeText={(text) => setName(text)}

                    >
                    </TextInput>

                </View>
                <Text>Nhóm :</Text>
                <View style={{ flexDirection: 'row' }}>
                    {Object.values(selectedFriends).map((friend) => (
                        <View >
                            <View key={friend.user} style={{ flexDirection: 'column', alignItems: 'center', padding: 5 }}>
                                <Image
                                    source={require('../../Images/male.png')}
                                    style={{ height: 50, width: 50, resizeMode: 'cover', marginBottom: 10 }}
                                />
                                <Text>{friend.nickname}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.addfrom}>
                    <TextInput
                        style={styles.inputView}
                        placeholder="Nhập tên bạn bè ..."
                        placeholderTextColor="gray"

                    />
                    <TouchableOpacity style={styles.searchBTN}>
                        <Image
                            source={require("../../Images/search_4687318.png")}
                            style={styles.seacrhIcon}
                        />
                    </TouchableOpacity>


                </View>
                <View style={{ paddingLeft: 13, paddingTop: 5 }}>
                    <Text style={{ fontSize: 15 }}>Bạn bè:</Text>
                </View>
                <View>
                    {Array.from(Object.keys(friendsList))?.map((key: string, index: number) => (
                        <View key={index}>
                            {friendsList?.[key as keyof typeof friendsList]?.map((friend: ChaterType) => (
                                <TouchableOpacity key={friend.user} onPress={() => handleSelect(friend)}>
                                    <View style={{ paddingLeft: 12, marginTop: 20, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: "gray" }}>
                                        <Image
                                            source={require('../../Images/male.png')}
                                            style={{ height: 50, width: 50, resizeMode: 'cover', marginBottom: 10 }}
                                        />
                                        <Text style={{ paddingTop: 16, paddingLeft: 10, width: 100 }}>
                                            {friend.nickname}
                                        </Text>

                                        <View style={{ paddingLeft: 200, paddingTop: 10 }}>
                                            {selectedFriends[friend.user] ? (
                                                <Image
                                                    source={require('../../Images/checked.png')}
                                                    style={{ height: 20, width: 20 }}
                                                />
                                            ) : (
                                                <View
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        borderWidth: 1,
                                                        borderColor: 'black',
                                                        backgroundColor: 'white',
                                                        borderRadius: 5
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}

                        </View>
                    ))}
                </View>

            </View>
            <View style={styles.footer}>

                <TouchableOpacity style={styles.footerBTN} onPress={() => onFinish()}>
                    <LinearGradient
                        colors={["#77caea", "#38A2CF", "#156DBA"]}
                        start={[0, 0]}
                        end={[1, 2]}
                        style={styles.gradienthead}
                    >
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Tạo nhóm</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </View>
    );
}

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
        position: "absolute",
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
    body: {
        width: "100%",
        marginTop: 115
    },
    userData: {

    },
    addfrom: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        alignContent: 'center',

    },
    inputView: {
        width: "70%",
        height: 50,
        backgroundColor: "#ced4da",
        borderRadius: 10,
        paddingLeft: 20,
        marginRight: 5,
    },
    searchBTN: {
        paddingTop: 10,
        paddingLeft: 10,
        width: 75,
        height: 50,
        borderRadius: 10,
        overflow: "hidden",
    },
    gradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    seacrhIcon: {

        resizeMode: "contain",
        width: 25,
        height: 25,
    },
    itemList: {

    },
    SetForm: {
        paddingLeft: 25,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'row',
        borderBottomColor: "gray",
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    footer: {
        flex: 1
    },
    footerBTN: {
        width: 100,
        height: 50,
        borderRadius: 10,
        overflow: "hidden",
    }
});

export default CreateGroup;
