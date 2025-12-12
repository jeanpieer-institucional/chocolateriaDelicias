import { Stack } from 'expo-router';

export default function PerfilLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="direcciones" options={{ headerShown: false }} />
        </Stack>
    );
}
