# Lista de Dependencias - Choco Delicia

## Backend Dependencies

### Production Dependencies
```bash
npm install bcryptjs@^2.4.3
npm install cors@^2.8.5
npm install dotenv@^16.3.1
npm install express@^4.18.2
npm install jsonwebtoken@^9.0.2
npm install multer@^2.0.2
npm install mysql2@^3.6.5
```

### Development Dependencies
```bash
npm install --save-dev nodemon@^3.0.2
```

### Instalación en un solo comando
```bash
cd backend
npm install bcryptjs cors dotenv express jsonwebtoken multer mysql2
npm install --save-dev nodemon
```

---

## Frontend Dependencies

### Core Dependencies
```bash
npm install @expo/vector-icons@^15.0.3
npm install @react-native-async-storage/async-storage@^2.2.0
npm install @react-navigation/native@^7.1.8
npm install axios@^1.13.2
npm install expo@~54.0.25
npm install expo-constants@~18.0.10
npm install expo-font@~14.0.9
npm install expo-image-picker@^17.0.8
npm install expo-linking@~8.0.9
npm install expo-router@~6.0.15
npm install expo-splash-screen@~31.0.11
npm install expo-status-bar@~3.0.8
npm install expo-web-browser@~15.0.9
npm install react@19.1.0
npm install react-dom@19.1.0
npm install react-native@0.81.5
npm install react-native-reanimated@~4.1.1
npm install react-native-safe-area-context@~5.6.0
npm install react-native-screens@~4.16.0
npm install react-native-web@~0.21.0
npm install react-native-webview@13.15.0
npm install react-native-worklets@0.5.1
```

### Development Dependencies
```bash
npm install --save-dev @types/react@~19.1.0
npm install --save-dev react-test-renderer@19.1.0
npm install --save-dev typescript@~5.9.2
```

### Instalación Recomendada
```bash
# En la raíz del proyecto
npm install
```

Esto instalará todas las dependencias listadas en `package.json` automáticamente.

---

## Software Adicional Requerido

### Obligatorio
- **Node.js** v18.x o superior - https://nodejs.org/
- **MySQL** v8.0 o superior - https://dev.mysql.com/downloads/mysql/

### Opcional (para desarrollo móvil)
- **Expo CLI** - `npm install -g expo-cli`
- **Android Studio** - Para emulador Android
- **Xcode** - Para emulador iOS (solo macOS)
- **Expo Go App** - Para probar en dispositivo físico

---

## Verificación de Instalación

### Verificar Node.js
```bash
node --version  # Debe ser v18.x o superior
npm --version
```

### Verificar MySQL
```bash
mysql --version  # Debe ser 8.0 o superior
```

### Verificar Expo CLI (opcional)
```bash
expo --version
```

---

## Notas Importantes

1. **No instalar culqi-node**: Aunque está en package.json, ya no se usa. El sistema ahora usa llamadas HTTP directas a la API de Culqi.

2. **Versiones de Expo**: Asegúrate de usar las versiones compatibles con Expo SDK 54.

3. **React Native**: La versión 0.81.5 es específica para Expo SDK 54.

4. **Node Modules**: Después de clonar el proyecto, siempre ejecuta `npm install` tanto en la raíz como en la carpeta `backend/`.
