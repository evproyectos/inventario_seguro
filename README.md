# Inventario Seguro — Blue Team

## Stack tecnológico
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL 15
- **ORM**: Sequelize
- **Autenticación**: JWT en cookie HttpOnly
- **Seguridad**: Helmet, express-rate-limit, bcryptjs (cost=12)
- **Frontend**: HTML + CSS + JavaScript vanilla
- **Infraestructura**: Docker Compose + nginx

## Justificación del stack
Node.js con Express es maduro, ampliamente soportado y tiene un ecosistema
robusto de librerías de seguridad. Sequelize como ORM previene SQL injection
de forma automática mediante prepared statements. bcryptjs implementa hashing
adaptativo sin dependencias nativas. Helmet configura todos los headers de
seguridad HTTP requeridos en una sola línea.

## Cómo ejecutar

### Requisitos
- Docker Desktop
- ngrok (integrado en Docker Compose)

### Levantar el proyecto
```bash
docker-compose up --build
```

### Ver la URL pública de ngrok
Una vez levantado, abrí http://localhost:4040 en el navegador.
La URL pública tipo `https://abc123.ngrok-free.app` aparece ahí.

### Documentación de la API
Requiere estar autenticado primero.
`http://localhost:8080/api/docs`

## Credenciales iniciales

| Usuario | Contraseña | Rol |
|---|---|---|
| superadmin | Admin1234! | SuperAdmin |
| auditora | Admin1234! | Auditor |
| auditor2 | Admin1234! | Auditor |
| registrador1 | Admin1234! | Registrador |
| registrador2 | Admin1234! | Registrador |

## URL pública (ngrok)
> Actualizar antes de cada sesión de pentest

**URL actual**: https://ACTUALIZAR-ANTES-DEL-PENTEST.ngrok-free.app

## Roles del sistema
| Rol | Permisos |
|---|---|
| SuperAdmin | CRUD usuarios, CRUD productos, ver auditoría |
| Auditor | Solo lectura en usuarios y productos |
| Registrador | CRUD productos, lectura de usuarios |