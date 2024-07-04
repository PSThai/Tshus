import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useConfig } from 'common/hooks/use-config';
import { ThemeEnum } from 'common/enum/theme.enum';
import { useAuth } from 'client/hooks/use-auth';
import { useConversations } from 'client/hooks/user-conversations';
import { Conversations } from 'common/interface/Conversations';
import { theme } from 'antd';
import { MessageType } from 'common/enum/message-type';
import { AWS_URL, BASE_URL, fetcher } from "common/utils/fetcher";
import { MesssageState } from 'common/enum/message-state';
import { Response } from 'common/types/res/response.type';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import { TshusSocket } from 'common/types/other/socket.type';
import { useSocket } from 'common/hooks/use-socket';
import { MesssageActionEnum } from 'common/enum/message-actions.enum';
import Toast from 'react-native-toast-message';



type Props = { data: any };

type FileMessage = {
    files: any;
    msg?: string;
    token: any;
    isSender: boolean;
};

type TextMessage = {
    msg: string;
    token: any;
    isSender: boolean;
};

// // // Download file
// const download = (file: any) => {
//     fetch(`${AWS_URL}/${file.filename}`)
//         .then((response) => response.blob())
//         .then((blob) => {
//             const url = URL.createObjectURL(new Blob([blob]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = file.originalname;
//             document.body.appendChild(link);
//             link.click();
//             URL.revokeObjectURL(url);
//             link.remove();
//         });
// };

const { useToken } = theme;
// Message Node
const MessageNode = ({ data, token, isSender }: any) => {
    const justify = isSender ? 'flex-end' : 'flex-start';
    // Return
    return (
        <View style={{ justifyContent: `${justify}` }}>
            {data?.type === MessageType.TEXT ? (
                <MessageTextLine
                    token={token}
                    isSender={isSender}
                    msg={data?.messages}
                />
            ) : (
                <MessageFileLine
                    token={token}
                    isSender={isSender}
                    files={data?.files}
                />
            )}
        </View>
    );
}
const UnsendMessage: React.FC<any> = ({ isSender, token, msg }: TextMessage) => {
    // Config
    const config: any = useConfig();

    // ligght theme
    const isLight: boolean = config?.theme === ThemeEnum.LIGHT;

    // Return
    return (
        <View
            style={{
                height: 40,
                borderRadius: 5,
                padding: 8,
                position: "relative",
                marginRight: 12,
                borderColor: `${token.colorBorder}`,
                backgroundColor: "gray"
            }}
        >
            {isSender ? (
                <Text
                    style={{
                        color: `${token.colorText}`
                    }}
                >
                    {msg}
                </Text>
            ) : (
                <Text
                    style={{
                        color: `${isLight ? '#000' : 'rgb(97, 97, 97)'}`
                    }}
                >
                    {msg}
                </Text>
            )}
        </View>
    );
};
const renderMessage = (props: any) => {
    // Check sw
    switch (props.data.state) {
        case MesssageState.RECEIVER:
            return !props.isSender ? <MessageNode {...props} /> : <UnsendMessage isSender={props.isSender} token={props.token} msg="Tin nhắn đã bị xoá" />;
        case MesssageState.NONE:
            return <UnsendMessage isSender={props.isSender} token={props.token} msg="Tin nhắn đã bị thu hồi" />;
        default:
            return <MessageNode {...props} />
    }
}

const Chat_Line = ({ data }: Props) => {

    // Socket
    const socket: TshusSocket = useSocket();

    const { token } = useToken();
    // User
    const user: any = useAuth();

    const isSender = user.get?._id === data?.sender?.user;

    const cvsContext = useConversations();

    const [tranfModelOpen, setTranfModelOpen] = useState(false);

    // Set tranf conversation id
    const [tranfCvs, setTransfCvs] = useState<Conversations | null>(null);

    const showModal = () => setTranfModelOpen(true);

    // Handle deleteMessage
    const handleDelteMessage = async () => {
        // Exception
        try {
            // Check socket
            if (socket) {
                // Send socket
                socket?.emit('chat.actions:server', {
                    message: data,
                    action: MesssageActionEnum.DELETE,
                });
            }
        } catch (error) {
            // Show error
            Toast.show({
                type: 'error',
                text1: "Xóa tin nhắn thất bại",
                visibilityTime:1000
            })
        }
    };

    // Handle unMessage
    const handleUnmessage = async () => {
        // Exception
        try {
            // Check socket
            if (socket) {
                // Send socket
                socket?.emit('chat.actions:server', {
                    message: data,
                    action: MesssageActionEnum.UNMESSAGE,
                });
            }
        } catch (error) {
            // Show error
            Toast.show({
                type: 'error',
                text1: "Thu hồi tin nhắn thất bại",
                visibilityTime:1000
            })
        }
    };
    const menuRef = useRef<Menu>(null);

    const handlePress = () => {
        menuRef.current!.open(); // Mở menu khi tin nhắn được chạm
    };
    const justify = isSender ? 'flex-end' : 'flex-start';

    return (
        <View >
            <View style={{ alignSelf: `${justify}`, marginBottom: 7 }}>
                <View >
                    <Text
                        style={{ alignSelf: `${justify}`, fontSize: 12.5, marginRight: 10 }}
                    >
                        {data?.sender?.nickname}
                    </Text>
                    
                    <Menu ref={menuRef}>
                        <MenuTrigger customStyles={triggerStyles}>
                            <TouchableOpacity style={{}} onLongPress={handlePress}>
                                <View style={{ alignSelf: `${justify}` }}>
                                    {renderMessage({ data, justify, token, isSender })}
                                </View>
                            </TouchableOpacity>
                        </MenuTrigger>
                        <MenuOptions customStyles={optionsStyles}>
                            <MenuOption onSelect={handleDelteMessage}>
                                <Text style={{}}>Xóa</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => alert('Chuyển tiếp')}>
                                <Text style={{}}>Chuyển tiếp</Text>
                            </MenuOption>
                            <MenuOption onSelect={handleUnmessage}>
                                <Text style={{}}>Thu hồi</Text>
                            </MenuOption>

                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        </View>
    )
}

const MessageTextLine: React.FC<any> = ({
    isSender,
    token,
    msg,
}: TextMessage) => {
    // Config

    const config: any = useConfig();

    // ligght theme
    const isLight: boolean = config?.theme === ThemeEnum.LIGHT;

    const colors: string = isSender
        ? token.colorPrimary
        : isLight
            ? '#999'
            : '#fff';

    // Return
    return (
        <View
            style={{
                height: 40,
                borderRadius: 5, padding: 8,
                position: "relative",
                backgroundColor: `${colors}`,
                marginRight: 12
            }}
        >
            {
                isSender ? (
                    <Text
                        style={
                            {
                                color: `${token.colorWhite}`
                            }
                        }
                    >
                        {msg}
                    </Text >
                ) : (
                    <Text
                        style={{
                            color: `${isLight ? '#000' : 'rgb(97, 97, 97)'} `
                        }}
                    >
                        {msg}
                    </Text>
                )
            }
        </View >
    );
};

const MessageFileLine: React.FC<FileMessage> = ({
    token,
    files,
    isSender,
    msg,
}: FileMessage) => {


    const config: any = useConfig();

    // ligght theme
    const isLight: boolean = config?.theme === ThemeEnum.LIGHT;

    const colors: string = isSender
        ? '#87CEFA'
        : '#fff';
    // Color text
    const color: string = isSender ? 'white' : 'rgb(97, 97, 97)';

    return (
        <View
            style={{
                position: "relative",
                backgroundColor: `${colors}`,
                marginRight: 12,
                padding: 6,
                borderRadius: 5,
            }}>
            {files?.map((file: any, index: number) => (
                <View key={index} style={{ display: 'flex' }}>
                    <View
                        // onPress={() => download(file)}
                        style={{ justifyContent: isSender ? "flex-end" : "flex-start" }}>
                        {!file.mimetype.startsWith('image') ? (
                            <>
                                <View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={[styles.fileName, { color }]}>
                                            {file.originalname}
                                        </Text>

                                        <View style={{ justifyContent: 'space-between' }}>
                                            <Text style={[styles.fileSize, { color }]}>{file.size} Kb</Text>
                                            <Image
                                                source={require("../../../../Images/download.png")}
                                                style={{ width: 30, height: 30, }}
                                            />
                                        </View>
                                    </View>

                                </View>
                            </>
                        ) : (
                            <Image
                                style={styles.image}
                                source={{ uri: `${AWS_URL}/${file.filename}` }}
                                onError={() => console.log('Error loading image')}
                            />
                        )}
                    </View>
                </View>
            ))}
            {/* {msg?.trim() !== '' && (
                <View style={styles.messageContainer}>
                    <MessageTextLine token={token} isSender={isSender} msg={msg} />
                </View>
            )} */}
        </View>
    );
};
const optionsStyles = {
    optionsContainer: {
        padding: 5,
        width: 120,
    },
    optionWrapper: {
        margin: 5,
    },
};
const triggerStyles = {
    triggerTouchable: {
        activeOpacity: 1,
        underlayColor: 'transparent',
    },
};
const styles = StyleSheet.create({
    fileName: {
        fontSize: 14,
    },
    fileSize: {
        fontSize: 12,
        alignSelf: 'flex-end'
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    messageContainer: {
        padding: 5,
    },
});
export default Chat_Line