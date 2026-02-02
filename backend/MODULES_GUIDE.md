# Agregar Nuevo Módulo - Guía KISS

## ¿Qué necesitas?

Solo **3 archivos** para un módulo completo.

---

## Paso 1: Crear la carpeta

```bash
mkdir backend/modules/mi-modulo
```

---

## Paso 2: Crear `model.js`

```javascript
const { pool } = require('../../config/database');

module.exports = {
    getAll: () => pool.execute('SELECT * FROM mi_tabla'),
    
    getById: (id) => pool.execute('SELECT * FROM mi_tabla WHERE id = ?', [id]),
    
    create: (data) => pool.execute('INSERT INTO mi_tabla SET ?', [data]),
    
    update: (id, data) => pool.execute('UPDATE mi_tabla SET ? WHERE id = ?', [data, id]),
    
    remove: (id) => pool.execute('DELETE FROM mi_tabla WHERE id = ?', [id])
};
```

---

## Paso 3: Crear `controller.js`

```javascript
const model = require('./model');

module.exports = {
    async getAll(req, res, next) {
        try {
            const [rows] = await model.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const [result] = await model.create(req.body);
            const [rows] = await model.getById(result.insertId);
            res.status(201).json({ success: true, data: rows[0] });
        } catch (error) {
            next(error);
        }
    }
    // ... más métodos según necesites
};
```

---

## Paso 4: Crear `routes.js`

```javascript
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyToken } = require('../../middleware/auth');

router.use(verifyToken); // Proteger todas las rutas

router.get('/', controller.getAll);
router.post('/', controller.create);
// ... más rutas

module.exports = router;
```

---

## Paso 5: ¡Listo!

El módulo se carga **automáticamente**. No necesitas modificar `server.js`.

Reinicia el servidor y tendrás:
- `GET /api/mi-modulo`
- `POST /api/mi-modulo`
- etc.

---

## Convenciones

| Archivo | Responsabilidad |
|---------|-----------------|
| `model.js` | Solo SQL queries |
| `controller.js` | Lógica de negocio |
| `routes.js` | Definir endpoints |

**Regla de oro:** Si un archivo tiene más de 100 líneas, divide la funcionalidad.
