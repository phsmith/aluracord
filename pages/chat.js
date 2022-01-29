import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

function messagesListener(addMessage) {
    return supabaseClient
        .from('messages')
        .on('INSERT', (response) => {
            addMessage(response.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const router = useRouter();
    const logedUser = router.query.username;
    const [messageTyped, setMessageTyped] = React.useState('');
    const [messagesList, setMessagesList] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setMessagesList(data);
            });

        const subscription = messagesListener((newMessage) => {
            setMessagesList((currentMessagesList) => {
                return [
                    newMessage,
                    ...currentMessagesList,
                ]
            });
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function handleNewMessage(newMessage) {
        if (newMessage) {
            const message = {
                from: logedUser,
                text: newMessage
            }

            supabaseClient
                .from('messages')
                .insert([message])
                .then((data) => {
                    console.log(data)
                });

            setMessageTyped('')
        }
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[200],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                    opacity: 0.95
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessagesList messages={messagesList} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(':sticker: ' + sticker);
                            }}
                        />

                        <TextField
                            value={messageTyped}
                            onChange={(event) => {
                                const value = event.target.value;
                                setMessageTyped(value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleNewMessage(messageTyped);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '95%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                marginRight: '12px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            label='Send'
                            colorVariant='positive'
                            size='lg'
                            onClick={() => {
                                handleNewMessage(messageTyped);
                            }}
                            styleSheet={{
                                minWidth: '5%',
                                padding: '11px 8px',
                                marginRight: '12px',
                                marginBottom: '8px'
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{
                color: appConfig.theme.colors.neutrals[500],
                width: '100%',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }} >
                <Text variant='heading5'>Chat</Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessagesList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowX: 'hidden',
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                        onClick={async () => {
                            await fetch(`https://api.github.com/users/${message.from}`)
                                .then((response) => {
                                    response.json().then((data) => {
                                        <UserInfo data={data} />
                                    })
                                })
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text
                                tag="strong"
                                styleSheet={{
                                    display: 'inline-block'
                                }}
                            >
                                {message.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                    display: 'inline-block'
                                }}
                                tag="span"
                            >
                                {(
                                    new Date(message.created_at)
                                        .toLocaleDateString('pt-Br', {
                                            hour: 'numeric', minute: 'numeric', second: 'numeric'
                                        })
                                )}
                            </Text>
                        </Box>
                        {message.text.startsWith(':sticker:')
                            ? (
                                <Image
                                    src={message.text.replace(':sticker:', '')}
                                    styleSheet={{
                                        width: '150px',
                                        height: '150px'
                                    }}
                                />
                            )
                            : (
                                message.text
                            )}
                    </Text>
                )
            })}
        </Box>
    )
}

function UserInfo(props) {
    const [isOpen, setOpenState] = React.useState('');

    console.log(props);

    return (
        <Box
            styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '5px',
                position: 'absolute',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                width: {
                    xs: '200px',
                    sm: '290px',
                },
                height: '300px',
                left: '30px',
                bottom: '30px',
                padding: '16px',
                boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
            }}
            // onClick={() => setOpenState(false)}
        >
            <Text
                styleSheet={{
                    color: appConfig.theme.colors.neutrals["000"],
                    fontWeight: 'bold',
                }}
            >
                User Info
            </Text>
            <Box
                tag="ul"
                styleSheet={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    flex: 1,
                    paddingTop: '16px',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                }}
            >
                {Object.keys(props.data).map((key) => {
                    <Text
                        tag="li" key={key}
                        styleSheet={{
                            width: '50%',
                            borderRadius: '5px',
                            padding: '10px',
                            focus: {
                                backgroundColor: appConfig.theme.colors.neutrals[600],
                            },
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[600],
                            }
                        }}
                    >
                        <Text>
                            {`${key}: ${data[key]}`}
                        </Text>
                    </Text>
                })}
            </Box>
            )
        </Box>
    )
}
