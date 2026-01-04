import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/DesignSystem';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'inicio') iconName = 'home';
          else if (route.name === 'productos') iconName = 'grid';
          else if (route.name === 'blogs') iconName = 'document-text';
          else if (route.name === 'contacto') iconName = 'chatbubble';
          else if (route.name === 'favoritos') iconName = 'heart';
          else if (route.name === 'perfil') iconName = 'person';
          else if (route.name === 'carrito') iconName = 'cart';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: Colors.primary.main,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: Colors.dark.surface,
          borderTopColor: Colors.border.default,
          borderTopWidth: 1,
          height: 80, // Aumentado para dar espacio
          paddingBottom: 25, // Mayor padding inferior
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      })}
    >
      <Tabs.Screen name="inicio" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="productos" options={{ title: 'Productos' }} />
      <Tabs.Screen name="blogs" options={{ title: 'Blogs' }} />
      <Tabs.Screen name="contacto" options={{ title: 'Contacto' }} />
      <Tabs.Screen name="favoritos" options={{ href: null }} />
      <Tabs.Screen name="carrito" options={{ href: null }} />
      <Tabs.Screen name="perfil" options={{ href: null }} />
    </Tabs>
  );
}
