# PGVet — Prototipo Web Funcional

Plataforma de Gestión Veterinaria navegable en el navegador, con datos simulados en **localStorage**. No requiere backend ni base de datos real.

## Demo en línea

**https://hanaeru.github.io/PGVet-Prototipo-Frontend/**

## Cómo ejecutarlo en local

### Opción A — Servidor local

```bash
npm start
```

Abre **http://localhost:3456**

Alternativa sin instalar dependencias:

```bash
npx serve . -l 3456
```

### Opción B — Abrir el archivo

Abre `index.html` directamente en Chrome, Edge o Firefox.

> **Nota:** Los datos se guardan en `localStorage`. Para reiniciar el prototipo, abre las herramientas de desarrollador (F12) → Application → Local Storage → elimina las claves que empiezan con `pgvet_`.

## Usuarios de prueba

| Correo | Contraseña | Rol |
|--------|------------|-----|
| admin@pgvet.cl | 1234 | ADMIN |
| veterinario@pgvet.cl | 1234 | VETERINARIO |
| recepcionista@pgvet.cl | 1234 | RECEPCIONISTA |
| tutor@pgvet.cl | 1234 | TUTOR |

- Login incorrecto → mensaje **"Credenciales inválidas"**.
- El tutor `tutor@pgvet.cl` está asociado a las mascotas **Max** y **Rocky** (propietario Carlos Mendoza).

## Módulos incluidos

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Login** | Autenticación con 4 roles |
| 2 | **Dashboard** | KPIs, citas del día, hospitalizados, banner sistema online |
| 3 | **Patients** | CRUD de pacientes (tabla + modal) |
| 4 | **Appointments** | CRUD de citas; cancelar cita |
| 5 | **Clinical Record** | Fichas clínicas con síntomas, diagnóstico, tratamiento |
| 6 | **Vaccines** | Registro de vacunas con fechas y lote |
| 7 | **Recipes** | Recetas médicas |
| 8 | **Inventory** | Inventario con alerta visual de bajo stock |
| 9 | **Staff** | Personal en tarjetas con roles |
| 10 | **Payments** | Pagos con métodos y estados |
| 11 | **Notifications** | Notificaciones por tipo y estado |

## Control de acceso por rol

| Módulo | ADMIN | VETERINARIO | RECEPCIONISTA | TUTOR |
|--------|:-----:|:-----------:|:-------------:|:-----:|
| Dashboard | ✓ | ✓ | ✓ | — |
| Patients | ✓ | ✓ | ✓ | ✓ (solo sus mascotas) |
| Appointments | ✓ | ✓ | ✓ | ✓ (solo sus citas) |
| Clinical Record | ✓ | ✓ | — | — |
| Vaccines | ✓ | ✓ | — | ✓ (solo sus mascotas) |
| Recipes | ✓ | ✓ | — | — |
| Inventory | ✓ | — | — | — |
| Staff | ✓ | — | — | — |
| Payments | ✓ | — | ✓ | ✓ (solo sus pagos) |
| Notifications | ✓ | ✓ | ✓ | ✓ (filtradas) |

## Requisitos funcionales representados

- Login obligatorio antes de acceder al sistema
- Navegación SPA sin recarga de página
- CRUD simulado en todos los módulos principales
- Mensajes de éxito al registrar: paciente, cita, ficha, vacuna, receta, producto, pago, notificación
- Validación de formularios vacíos
- Fecha obligatoria en citas, vacunas, fichas y pagos
- Stock no negativo; precio/monto ≥ 0
- Productos bajo stock mínimo resaltados en rojo
- Filtrado de datos para el rol TUTOR (protección de datos)

## Requisitos no funcionales representados

| Requisito | Implementación |
|-----------|----------------|
| **Seguridad** | Login obligatorio; sesión en localStorage |
| **Control de acceso** | Menú y datos filtrados por rol |
| **Usabilidad** | Sidebar clara, modales centrados, toasts de feedback |
| **Organización** | Un módulo por sección, código separado en 3 archivos |
| **Rendimiento simulado** | Navegación instantánea sin peticiones de red |
| **Protección de datos** | Tutor no accede a Staff, Inventory ni pagos ajenos |

## Archivos del proyecto

```
index.html   → Estructura HTML (login, shell, modal)
styles.css   → Estilo retro Windows 98 / PGVet
script.js    → Lógica, rutas, CRUD y localStorage
README.md    → Esta documentación
```

## Diseño visual

- Fondo verde suave
- Sidebar con marca **PGVET**
- Tarjetas azul claro con bordes tipo Windows 98
- Tablas simples y botones con relieve
- Modales centrados para formularios

---

Prototipo académico — PGVet © 2026
