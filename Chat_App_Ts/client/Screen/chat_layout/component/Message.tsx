import { Alert, Image, KeyboardAvoidingView, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Messages } from 'common/interface/Messages';
import { useConversations } from 'client/hooks/user-conversations';
import { useAuth } from 'client/hooks/use-auth';
import { fetcher } from 'common/utils/fetcher';
import { Response } from 'common/types/res/response.type';
import { UploadFile } from 'antd';
import Chat_Line from './Chat_Line';
import { useSocket } from 'common/hooks/use-socket';
import { Socket } from 'socket.io-client';
import { MessageType } from 'common/enum/message-type';
import EmojiSelector from 'react-native-emoji-selector';
import { ConversationEnum } from 'common/enum/conversation.enum';
import { Roommembers } from 'common/interface/Roommembers';
import { MesssageActionEnum } from 'common/enum/message-actions.enum';
import { MesssageState } from 'common/enum/message-state';
import { ConversationType } from 'common/types/conversation/cvs.type';
import { SocketProps } from 'common/types/other/socket.type';
import { useOnline } from 'common/context/use-online';
import { isOnline } from 'common/utils/ultils';
import { Rooms } from 'common/interface/Rooms';
import Toast from 'react-native-toast-message';

const Message: FC = () => {
    // Roommembers State
    const [roommembers, setRoommembers] = useState<Roommembers[] | []>([]);
    // Socket
    const socket: Socket = useSocket();
    // const cvsId = route.params;
    // Conversations
    // Conversations
    const cvsContext: ConversationType = useConversations();
    // user 
    const user: any = useAuth();

    // Chat messages
    const [messages, setMessages] = useState<Messages[]>([]);
    // Message State
    const [message, setMessage] = useState<string>('');

    const [currCvsLoading, setCurrCsvLoading] = useState<boolean>(true);

    // File list
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // File list
    const [imageList, setImageList] = useState<UploadFile[]>([]);
    // Current conversation id
    const cvsId: string = cvsContext.current.get?._id;
    // Onlines
    const onlines: SocketProps[] = useOnline();
    useEffect(() => {
        // Caling
        cvsId &&
            (async () => {
                // Get messages
                const res: Response = await fetcher({
                    method: 'GET',
                    url: '/messages/page',
                    payload: { conversation: cvsId, page: 1 },
                });

                // Check status
                if (res?.status === 200)
                    setMessages(res?.data);
            })();


        // Return clean
        return () => {
            // Clean message
            setMessages([]);

            // Clean file list
            setFileList([]);

            // Clean image list
            setImageList([]);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cvsContext.current.get]);

    // First Loading Use Effect
    useEffect(() => {
        // Check socket connected
        if (socket) {
            // Subscribes events
            socket?.on('chat:client', async (mes: Messages) => {
                // Find conversation
                const find = cvsContext.list.get?.find(
                    (item) => item._id === mes.conversation,
                );

                // Check find
                if (find) {
                    // Destructure
                    const { last_message, ...data }: Messages = mes;

                    // Updated conversation
                    const updated = {
                        ...find,
                        last_message,
                        last_send: data.send_at,
                    };

                    // Check conversation
                    if (mes?.conversation === cvsContext.current.get?._id) {
                        // Set current conversation
                        await cvsContext.current.update(updated);

                        // Set message
                        setMessages((prev) => [data, ...prev]);
                    } else {
                        // Set current conversation
                        await cvsContext.list.update(updated);
                    }
                }
            });
            // Chat actions client
            socket?.on(
                'chat.actions:client',
                async (client: { action: MesssageActionEnum; message: Messages }) => {
                    // Client message
                    const mes = client?.message;

                    // Check conversation
                    if (mes?.conversation === cvsContext.current.get?._id) {
                        // Check is not tranfert
                        if (client?.action === MesssageActionEnum.TRANSFERT) {
                            // Update conversation last message
                            // cvsContext.current.update({
                            //   ...tranfCvs,
                            //   last_message: res.data.last_message,
                            //   last_send: res.data.send_at,
                            // });
                        } else {
                            // Set message
                            setMessages((prev) => {
                                // Filter message
                                const newMessages = prev
                                    ?.map((mesa) => {
                                        // Check message
                                        if (mesa?._id === mes?._id) {
                                            // Updated message
                                            return {
                                                ...mesa,
                                                state: mes.state,
                                            };
                                        }

                                        // Return
                                        return mesa;
                                    })
                                    ?.filter((mesa) => mesa !== null) as Messages[];

                                // Rreturn
                                return newMessages;
                            });
                        }
                        // Check and show message
                        Toast.show({
                            type: 'success',
                            text1:
                                client?.action === MesssageActionEnum.TRANSFERT
                                    ? 'Chuyển tiếp tin nhán thành công'
                                    : client?.action === MesssageActionEnum.DELETE
                                        ? 'Xoá tin nhán thành công'
                                        : 'Thu hồi tin nhán thành công',
                            visibilityTime:1000,
                        })
                    }
                },
            );
        }

        // Cleanup
        return () => {
            socket?.off('chat:client');
            socket?.off('chat.actions:client');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cvsContext.current.get, socket]);


    const handleSend = () => {

        // Handle Messages
        const promise = async (): Promise<any> => {
            // Handle promise
            return new Promise(async (resolve, reject) => {
                // User data
                const _user = user.get;

                // Check has file
                const hasFile = fileList.length > 0 || imageList.length > 0;

                // Check message valid
                const isValid = Boolean(message) && message.trim() !== '';
                if (!isValid) {
                    Toast.show({
                        type: 'error',
                        text1: "Gửi tin nhắn thất bại",
                        text2: "Vui lòng nhập tin nhắn!",
                        visibilityTime:1000
                    })
                } else {
                    // Create message info
                    const info: Messages = {
                        files: [],
                        sender: {
                            user: _user?._id,
                            avatar: _user?.avatar,
                            nickname: _user?.nickname,
                        },
                        state: MesssageState.BOTH,
                        messages: message.trim(),
                        conversation: cvsContext.current.get?._id,
                        type: hasFile ? MessageType.FILES : MessageType.TEXT,
                    };

                    // Check message valid or has file
                    if (hasFile || isValid) {
                        // Has file
                        if (hasFile) {
                            // Each and add file to form data
                            const formData = new FormData();

                            // Add files
                            [...fileList, ...imageList]?.forEach((file: UploadFile) => {
                                // File original
                                const orf = file?.originFileObj;

                                if (orf) {
                                    // Append only if `orf` is not undefined
                                    formData.append('files[]', orf);
                                }
                            });

                            // Clear file list
                            setFileList([]);

                            // Clear image list
                            setImageList([]);

                            // Upload Image
                            const uploaded: Response = await fetcher({
                                method: 'UPLOAD',
                                url: '/messages/upload',
                                payload: formData,
                            });

                            // Check is uploaed success
                            if (uploaded?.status === 201) {
                                // Push files name
                                info.files = uploaded.data;
                            }
                        }
                    }
                    // Clear message
                    setMessage('');

                    // Resolve Data

                    resolve(info);

                    // Resject
                    reject();
                }
            });
        };
        // Handle messages promise
        promise()
            .then((res) => {
                // Send Message
                socket.emit('chat:server', res);
            })
            .catch(() => { });

    }
    const cvs = cvsContext.current.get
    // Is Rooms
    const isRooms: boolean = cvs?.type === ConversationEnum.ROOMS;

    const chats = cvs?.chats?.[0];

    const isInviter = user.get?._id === chats?.inviter?.user;

    const cvsName = isRooms
        ? cvs?.rooms[0]?.name
        : isInviter
            ? chats?.friend?.nickname
            : chats?.inviter?.nickname;

    // Data
    const nav = useNavigation();

    type NavType = {
        navigate: (screen: string) => void;
    }
    const goback = (nav: NavType) => {
        cvsContext.current.set([])
        nav.navigate("Chat");
    };

    const [showEmojiSelector, setshowEmojiSelector] = useState(false);

    const handleEmoji = () => {

        setshowEmojiSelector(!showEmojiSelector);
    }
    // Use Effect
    useEffect(() => {
        // Load roommembers
        cvsContext.current.get?.type === ConversationEnum.ROOMS &&
            (async () => {
                // Response
                const res: Response = await fetcher({
                    method: 'GET',
                    url: '/roommembers/page',
                    payload: { room: cvsContext.current.get?.rooms?.[0]?._id, page: 1 },
                });

                // If response success
                if (res?.status === 200) {
                    // Set members
                    setRoommembers(res?.data);
                }
            })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cvsContext.current.get?.type]);


    // Data
    const data = isRooms
        ? cvs?.rooms?.[0]
        : isInviter
            ? cvs?.chats?.[0]?.friend
            : cvs?.chats?.[0]?.inviter;


    return (

        <View
            style={styles.container}
        >

            <View style={styles.header}>
                <LinearGradient
                    colors={["#77caea", "#38A2CF", "#156DBA"]}
                    start={[0, 0]}
                    end={[1, 2]}
                    style={styles.gradienthead}
                >

                    <TouchableOpacity style={styles.backBTN} onPress={() => goback(nav)}>
                        <Image
                            source={require("../../../../Images/back.png")}
                            style={styles.headerIcon}
                        />
                    </TouchableOpacity>

                    <Image
                        source={require("../../../../Images/male.png")}
                        style={{ height: 50, width: 50, resizeMode: 'cover', marginTop: 40 }}
                    />

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginTop: 40, fontWeight: 'bold', fontSize: 17, color: 'white', paddingLeft: 13 }}>{cvsName}</Text>

                        {isOnline(onlines, isRooms, data) ? (
                            <View>
                                {isRooms ? (
                                    <Text
                                        style={{ fontSize: 13, color: "white", paddingLeft: 15 }} >
                                        {(data as Rooms)?.members_count}3 thành viên
                                    </Text>
                                ) : (
                                    <Text style={{ fontSize: 13, color: "white", paddingLeft: 15 }}>
                                        đang hoạt động
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <View>
                                {isRooms ? (
                                    <Text
                                        style={{ fontSize: 13.5, fontWeight: '400' }} >
                                        {(data as Rooms)?.members_count} thành viên
                                    </Text>
                                ) : (
                                    <Text style={{ fontSize: 13, color: "white", paddingLeft: 15 }}>
                                        đang ngoại tuyến
                                    </Text>
                                )}
                            </View>


                        )}
                    </View>

                    <TouchableOpacity>
                        <Image
                            source={require("../../../../Images/menu.png")}
                            style={{ height: 20, width: 20, marginLeft: 150, marginTop: 40, }}
                        />
                    </TouchableOpacity>

                </LinearGradient>
            </View >
            <KeyboardAvoidingView
                style={styles.body}
                enabled>
                <ScrollView
                >
                    {/* Cho nay hien tin nhan */}
                    {messages.length > 0 ? (
                        <View
                            style={{
                                display: 'flex',
                                //flexDirection: 'column',

                            }}
                        >
                            {messages.slice().reverse().map((msg) => (
                                <Chat_Line key={msg._id} data={msg} />
                            ))}

                        </View>
                    ) : (
                        <View>
                            <Text> Không có tin nhắn nào</Text>
                        </View>

                    )
                    }
                </ScrollView >


                <View style={styles.viewText} >

                    <TouchableOpacity onPress={handleEmoji}>
                        <Image
                            source={require("../../../../Images/emoji.png")}
                            style={{ width: 30, height: 30, marginRight: 10 }}
                        />
                    </TouchableOpacity>


                    <TextInput style={styles.inputMessage}
                        placeholder='Nhập tin nhắn.....'
                        value={message}
                        onChangeText={(text) => setMessage(text)}
                    />

                    <TouchableOpacity>
                        <Image
                            source={require("../../../../Images/camera_685655.png")}
                            style={{ width: 30, height: 30, marginLeft: 10 }}
                        />
                    </TouchableOpacity>

                    <Pressable style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#38A2CF',
                        }, styles.btnSend
                    ]} onPress={() => handleSend()}>
                        <Text style={{ color: "white" }} >Send</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
            {
                showEmojiSelector && (
                    <View style={styles.emojiSelectorContainer}>
                        <EmojiSelector
                            onEmojiSelected={(emoji: any) => {
                                setMessage((prevMessage) => prevMessage + emoji);
                                setshowEmojiSelector(false)
                            }}

                        />
                    </View>
                )
            }
        </View >
    );
};

export default Message

const styles = StyleSheet.create({
    inputMessage: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    header: {
        flex: 1,
        width: "100%",
        height: 90,
        paddingVertical: 10,
        top: -10,
        position: 'relative',
        zIndex: 10
    },
    gradienthead: {
        flexDirection: "row",
        //justifyContent: "space-between",
        alignItems: "center",
        height: 100,
        width: "100%",
    },
    headerIcon: {
        marginTop: 60,
        margin: 20,
        resizeMode: "contain",
        height: 25,
        width: 25,
    },
    backBTN: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: 'center'
    },
    body: {

        // top:47,
        height: "88%",
        paddingLeft: 10,
        width: "100%",
        // bottom:47,
    },
    viewText: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#dddddd",
        marginBottom: 25

    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    btnSend: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginLeft: 12,
    },
    emojiSelectorContainer: {
        height: 350, // chiều cao của EmojiSelector
    },
})