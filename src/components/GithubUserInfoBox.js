import React from 'react';
import appConfig from '../../config.json';
import { Box, Text, Icon, Image } from '@skynexui/components';

export function GithubUserInfoBox(props) {
    const [isOpen, setOpenState] = React.useState(false);
    const [userdata, setUserdata] = React.useState([])
    const userInfoKeys = [
        'name',
        'location',
        'bio',
        'public_repos',
        'public_gists',
        'followers',
        'following'
    ]

    React.useEffect(() => {
        return (
            fetch(`https://api.github.com/users/${props.username}`)
                .then((response) => {
                    response.json().then((data) => {
                        setUserdata(data);
                    })
                })
        )
    }, [])

    return (
        <>
            <Box
                styleSheet={{
                    marginBottom: '8px',
                }}
            >
                <Image
                    styleSheet={{
                        width: isOpen ? '100px' : '20px',
                        height: isOpen ? '100px' : '20px',
                        borderRadius: '50%',
                        display: 'inline-block',
                        marginRight: '8px',
                    }}
                    src={userdata.avatar_url}
                    onClick={() => {setOpenState(!isOpen)}}
                />
                {isOpen && (
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '5px',
                            position: 'absolute',
                            zIndex: 1,
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            width: {
                                xs: '200px',
                                sm: '290px',
                            },
                            height: '300px',
                            padding: '16px',
                            boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
                        }}
                    >
                        <Text
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals["000"],
                                fontWeight: 'bold',
                            }}
                        >
                            Github Info
                            <Icon
                                name='FaWindowClose'
                                styleSheet={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '10px'
                                }}
                                onClick={() => {setOpenState(false)}}
                            />
                        </Text>
                        <Box
                            tag="ul"
                            styleSheet={{
                                paddingTop: '16px'
                            }}
                        >
                            {Object.keys(userdata).map((key) => {
                                if (userInfoKeys.includes(key)) {
                                    return (
                                        <Box
                                            tag="li" key={key}
                                            styleSheet={{
                                                padding: '2px'
                                            }}
                                        >
                                            <Text
                                                tag='span'
                                                styleSheet={{
                                                    display: 'inline',
                                                    paddingRight: '5px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {key}:
                                            </Text>
                                            <Text
                                                tag='span'
                                                styleSheet={{
                                                    display: 'inline',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {userdata[key]}
                                            </Text>
                                        </Box>
                                    );
                                }
                            })}
                        </Box>
                    </Box>
                )}
                <Text
                    tag="strong"
                    styleSheet={{
                        display: 'inline-block'
                    }}
                >
                    {props.username}
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
                        new Date(props.date)
                            .toLocaleDateString('pt-Br', {
                                hour: 'numeric', minute: 'numeric', second: 'numeric'
                            })
                    )}
                </Text>
            </Box>
        </>
    )
}
