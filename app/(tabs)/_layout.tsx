// app/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'productos') iconName = 'cube';
          else if (route.name === 'blogs') iconName = 'book';
          else if (route.name === 'contacto') iconName = 'call';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#964B00',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="inicio" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="productos" options={{ title: 'Productos' }} />
      <Tabs.Screen name="blogs" options={{ title: 'Blogs/Recetas' }} />
      <Tabs.Screen name="contacto" options={{ title: 'Contacto' }} />
      <Tabs.Screen name="carrito" options={{ href: null }} />
      <Tabs.Screen name="perfil" options={{ href: null }} />
    </Tabs>
  );
}
