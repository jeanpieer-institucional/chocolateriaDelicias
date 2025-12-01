# Instalación Manual de Dependencias

Debido a la política de ejecución de PowerShell, necesitas instalar las dependencias manualmente.

## Pasos para instalar:

### 1. Abrir PowerShell como Administrador

### 2. Habilitar la ejecución de scripts (temporalmente):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### 3. Instalar multer en el backend:
```bash
cd backend
npm install multer
```

### 4. Instalar expo-image-picker en el frontend:
```bash
cd..
npm install expo-image-picker
```

### 5. Ejecutar migración de base de datos:
Abre phpMyAdmin (http://localhost/phpmyadmin) y ejecuta:
```sql
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) NULL;
```

O bien, importa el archivo `database_profile_picture_migration.sql`

### 6. Reiniciar el backend:
```bash
cd backend
npm start
```

### 7. Reiniciar Metro Bundler:
```bash
npm start -- --clear
```

## Verificar instalación:

- Backend debe imprimir las URLs de red
- Frontend debe compilar sin errores de módulos faltantes
- La carpeta `backend/uploads` debe existir
