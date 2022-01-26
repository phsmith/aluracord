import { Box, Text } from '@skynexui/components';
import appConfig from '../config.json';

export default function ChatPage() {
    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%',
                        height: '95%',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals['200'],
                        opacity: 0.85
                    }}
                >
                    <Text
                        styleSheet={{
                            fontSize: '50px',
                        }}
                    >
                        Página do Chat!
                    </Text>
                </Box>
            </Box>
        </>
    );
}
