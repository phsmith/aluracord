import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { GithubUserInfoBox } from '../src/components/GithubUserInfoBox';
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
                <Header username={logedUser} />

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

function Header(props) {
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
                <Box>
                    <Image
                        styleSheet={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/${props.username}.png`}
                    />
                    <Text
                        variant='heading5'
                        styleSheet={{
                            display: 'inline-block',
                            position: 'relative',
                            bottom: '10px'
                        }}
                    >
                        {props.username}
                    </Text>
                </Box>

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
                    >
                        <GithubUserInfoBox username={message.from} date={message.created_at} />

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
