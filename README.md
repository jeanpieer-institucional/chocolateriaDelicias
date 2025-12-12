# Choco Delicia - Guía Rápida de Instalación

## 🚀 Instalación Rápida

### Requisitos
- Node.js 18+
- MySQL 8.0+
- Expo CLI (opcional)

### 1. Base de Datos
```bash
mysql -u root -p
CREATE DATABASE choco_delisias;
exit

mysql -u root -p choco_delisias < database_setup.sql
mysql -u root -p choco_delisias < database_addresses_migration.sql
mysql -u root -p choco_delisias < database_cart_migration.sql
mysql -u root -p choco_delisias < database_orders_migration.sql
mysql -u root -p choco_delisias < database_orders_update_migration.sql
mysql -u root -p choco_delisias < database_payments_migration.sql
mysql -u root -p choco_delisias < database_profile_picture_migration.sql
```

### 2. Backend
```bash
cd backend
npm install
```

Crear `backend/.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=choco_delisias
JWT_SECRET=tu_clave_secreta_muy_segura
CULQI_PUBLIC_KEY=pk_test_gNTifPiXYBIwk0kW
CULQI_SECRET_KEY=sk_test_VqIt9q0HrO5fHrjo
```

```bash
npm run dev
```

### 3. Frontend
```bash
cd ..
npm install
```

Crear `.env` en la raíz:
```env
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Dispositivo físico (reemplaza con tu IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

```bash
npm start
```

## 📦 Dependencias Principales

### Backend
- express - Framework web
- mysql2 - Base de datos
- bcryptjs - Encriptación
- jsonwebtoken - Autenticación
- multer - Subida de archivos
- cors - CORS
- dotenv - Variables de entorno

### Frontend
- expo - Framework React Native
- expo-router - Navegación
- axios - HTTP client
- react-native-webview - Para Culqi
- @react-native-async-storage/async-storage - Almacenamiento local

## 🔗 URLs

- Backend: http://localhost:3000
- Frontend: Expo DevTools (se abre automáticamente)

## 📚 Documentación Completa

Ver [INSTALLATION_GUIDE.md](file:///C:/Users/jeanp/.gemini/antigravity/brain/a3e14718-3583-442b-97ab-19454ac581b7/INSTALLATION_GUIDE.md) para instrucciones detalladas.
