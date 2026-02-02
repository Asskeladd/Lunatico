# Backend Refactorizado - Taller Zambrano

## 🎯 Arquitectura Modular KISS

El backend ha sido completamente refactorizado siguiendo el principio **KISS (Keep It Simple, Stupid)**.

### Estructura

```
backend/
├── modules/              # Módulos auto-cargados
│   ├── auth/            # Login y perfil
│   ├── clientes/        # CRUD clientes
│   ├── materiales/      # CRUD materiales
│   ├── orders/          # CRUD órdenes
│   ├── machines/        # CRUD máquinas
│   ├── tracking/        # Tracking público
│   └── reports/         # Reportes mensuales
├── middleware/          # Auth, CORS, errores
├── config/              # Database pool
├── database/
│   └── schema.sql       # Schema completo MER
└── server.js            # Auto-load modules
```

Cada módulo tiene **exactamente 3 archivos**:
- `model.js` - Queries SQL
- `controller.js` - Lógica de negocio  
- `routes.js` - Endpoints REST

---

## 🚀 Instalación

### 1. Actualizar Base de Datos

**Opción A: MySQL Workbench (Recomendado)**
1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. File → Open SQL Script → `backend/database/schema.sql`
4. Ejecuta el script (⚡ icono de rayo)

**Opción B: Línea de comandos**
```bash
# Desde MySQL shell o terminal con mysql instalado
mysql -u root -p < backend/database/schema.sql
# Ingresa tu contraseña cuando te la pida
```

### 2. Actualizar contraseñas

```bash
cd backend
node fix-passwords.js
```

### 3. Reiniciar servidor

```bash
npm start
```

Deberías ver:
```
📦 Loading modules...
   ✅ /api/auth
   ✅ /api/clientes
   ✅ /api/materiales
   ✅ /api/orders
   ✅ /api/machines
   ✅ /api/tracking
   ✅ /api/reports

✅ Connected to MySQL database
🚀 Server running on http://localhost:3000
```

---

## 📡 Endpoints Disponibles

| Módulo | Endpoint | Descripción |
|--------|----------|-------------|
| auth | `POST /api/auth/login` | Login |
| | `GET /api/auth/profile` | Ver perfil |
| | `PUT /api/auth/profile` | Actualizar perfil |
| clientes | `GET /api/clientes` | Listar clientes |
| | `POST /api/clientes` | Crear cliente |
| | `PUT /api/clientes/:id` | Actualizar cliente |
| | `DELETE /api/clientes/:id` | Eliminar cliente |
| materiales | `GET /api/materiales` | Listar materiales |
| | `POST /api/materiales` | Crear material |
| | `PUT /api/materiales/:id` | Actualizar |
| | `DELETE /api/materiales/:id` | Eliminar |
| orders | `GET /api/orders` | Listar órdenes |
| | `POST /api/orders` | Crear orden |
| | `PUT /api/orders/:id` | Actualizar |
| | `DELETE /api/orders/:id` | Eliminar |
| machines | `GET /api/machines` | Listar máquinas |
| | `PUT /api/machines/:id` | Actualizar |
| tracking | `GET /api/tracking/:orderId` | Rastreo público |
| reports | `GET /api/reports` | Reportes mensuales |

---

## ➕ Agregar Nuevo Módulo

Lee [`MODULES_GUIDE.md`](./MODULES_GUIDE.md) - solo necesitas 3 archivos y se carga automáticamente.

---

## 🔧 Migración desde Frontend Viejo

El frontend necesitará actualizarse porque:

1. **Nombres de tablas cambiaron:**
   - `users` → `operarios`
   - `orders` tiene nuevos campos (`id_cliente`, `tipo_pieza`)
   - `machines` → `maquinas`

2. **Estructura de respuestas:**
   ```javascript
   // Antes
   { success: true, order: {...} }
   
   // Ahora
   { success: true, data: {...} }
   ```

3. **Nuevos endpoints:**
   - `/api/clientes` para gestión de clientes
   - `/api/materiales` para inventario

---

## 🐛 Troubleshooting

**Error: "Access denied for user 'root'"**
→ Verifica password en `.env`

**Error: "Table doesn't exist"**
→ Ejecuta `schema.sql` en MySQL

**Módulo no se carga**
→ Verifica que exista `routes.js` en la carpeta del módulo
