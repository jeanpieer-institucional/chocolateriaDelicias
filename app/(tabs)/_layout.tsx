import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'index') iconName = 'home'; // Esto probablemente debería ser 'inicio' si el archivo es inicio.tsx, pero mantendré la lógica actual si funciona o la ajustaré.
          // Revisando el archivo original, route.name 'inicio' usa 'home'.
          // Espera, el archivo original tiene Tabs.Screen name="inicio".
          // La lógica original era: if (route.name === 'index') iconName = 'home';
          // Pero las screens son: inicio, productos, blogs, contacto.
          // 'index' no parece ser una ruta en este tabs layout explícito, a menos que haya un index.tsx que no vi en la lista de Tabs.Screen.
          // El archivo original tiene: tabs.screen name="inicio", productos, blogs, contacto, favoritos, carrito, perfil.
          // Voy a mantener la lógica de iconos pero adaptada a los nombres de las rutas correctos si es necesario, o dejarla como está si 'index' se refería a inicio implícitamente?
          // Ah, en expo router (tabs)/index.tsx sería la ruta inicial.
          // Pero aquí las pantallas tienen nombres explícitos.
          // Voy a asumir que la lógica de iconos original estaba un poco desalineada o 'index' mapea a inicio.
          // Mejor: replicaré la lógica exacta de iconos pero dentro del componente funcional con useTheme.

          if (route.name === 'inicio') iconName = 'home';
          else if (route.name === 'productos') iconName = 'cube';
          else if (route.name === 'blogs') iconName = 'book';
          else if (route.name === 'contacto') iconName = 'call';
          else if (route.name === 'favoritos') iconName = 'heart';
          else if (route.name === 'perfil') iconName = 'person';
          else if (route.name === 'carrito') iconName = 'cart';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
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
