# PGVet — Crear Make nuevo (prompt completo)

## Pasos (2 minutos)

1. Abre **Figma** → menú **+** → **Make** (o ve a https://www.figma.com/make)
2. Crea un archivo nuevo y nómbralo: **PGVet — Plataforma Completa**
3. Copia **todo el bloque entre las líneas `--- INICIO PROMPT ---` y `--- FIN PROMPT ---`** y pégalo en el chat de Make
4. Espera a que genere el proyecto y pulsa **Preview** para probarlo
5. Prueba login con: `admin@pgvet.cl` / `1234`

> **Nota:** El MCP de Figma no puede crear archivos Make automáticamente (solo Design, FigJam y Slides). Este prompt replica el prototipo funcional local (`index.html` + `script.js` + `styles.css`).

---

--- INICIO PROMPT ---

Crea desde cero un prototipo funcional completo de **PGVet — Plataforma de Gestión Veterinaria**.

## Stack obligatorio
- React 18 + TypeScript
- react-router-dom v6 (rutas protegidas)
- Tailwind CSS
- Estado en memoria con `mockApi.ts` (simular CRUD, sin backend real)
- Modales reutilizables + toasts de éxito/error

## Estilo visual — Windows 98 / retro clínica
- Fondo verde: `#8fbc8f`
- Tarjetas azul claro: `rgba(195, 212, 229, 0.95)`
- Headers tarjeta: `#9bb2cc`
- Barra título ventana: gradiente `#0a246a` → `#3a6ea5`, texto blanco
- Bordes bevel (claro arriba/izq, oscuro abajo/derecha): `#ffffff` / `#7a8ba3`
- Botón primario: `#316ac5`
- Fuente: Tahoma / Segoe UI, 13px
- Sidebar fija 200px izquierda con marca **🐾 PGVET**
- Tablas con scroll horizontal, filas alternas
- Stock bajo inventario: fila roja (`stock < minStock`)

## Layout app (post-login)
```
┌─────────────┬──────────────────────────────────┐
│  Sidebar    │  Header: título + badge usuario  │
│  nav items  │  ─────────────────────────────── │
│  Log Out    │  Contenido del módulo activo     │
└─────────────┴──────────────────────────────────┘
```

## Login — ruta `/login`
- Ventana centrada estilo Windows con título "PGVet — Iniciar Sesión"
- Campos: correo + contraseña
- Usuarios simulados:
  - `admin@pgvet.cl` / `1234` → ADMIN
  - `veterinario@pgvet.cl` / `1234` → VETERINARIO
  - `recepcionista@pgvet.cl` / `1234` → RECEPCIONISTA
  - `tutor@pgvet.cl` / `1234` → TUTOR
- Login OK → `/dashboard`; error → "Credenciales inválidas"
- Sin sesión no se accede a rutas internas (redirect a `/login`)
- Log Out limpia sesión y vuelve a login

## Menú sidebar (filtrar por rol)
| Ruta | Label | Roles |
|------|-------|-------|
| `/dashboard` | Dashboard | ADMIN, VETERINARIO, RECEPCIONISTA |
| `/patients` | Patients | ADMIN, VETERINARIO, RECEPCIONISTA, TUTOR |
| `/appointments` | Appointments | ADMIN, VETERINARIO, RECEPCIONISTA, TUTOR |
| `/clinical-records` | Clinical Record | ADMIN, VETERINARIO |
| `/vaccines` | Vaccines | ADMIN, VETERINARIO, TUTOR |
| `/recipes` | Recipes | ADMIN, VETERINARIO |
| `/inventory` | Inventory | ADMIN |
| `/staff` | Staff | ADMIN |
| `/payments` | Payments | ADMIN, RECEPCIONISTA, TUTOR |
| `/notifications` | Notifications | ADMIN, VETERINARIO, RECEPCIONISTA, TUTOR |

TUTOR ve títulos adaptados: "Mis Mascotas", "Mis Citas", "Mis Vacunas", "Mis Pagos".
TUTOR solo ve datos donde `ownerEmail` o `tutorEmail` o `recipient` = su email.
TUTOR no puede crear/editar/eliminar (solo lectura).

## mockApi.ts — datos seed iniciales

### Pacientes
```json
[
  {"id":1,"name":"Max","species":"Perro","breed":"Golden Retriever","age":"3 años","weight":"28 kg","ownerName":"Carlos Mendoza","ownerEmail":"tutor@pgvet.cl","ownerPhone":"555-0101","status":"Hospitalizado","lastVisit":"2026-06-16","notes":"Post-op castración."},
  {"id":2,"name":"Luna","species":"Gato","breed":"DSH","age":"1 año","weight":"3.5 kg","ownerName":"Sofía Torres","ownerEmail":"sofia@email.cl","ownerPhone":"555-0102","status":"Activo","lastVisit":"2026-06-15","notes":"Vacunación al día."},
  {"id":3,"name":"Charlie","species":"Perro","breed":"Beagle","age":"5 años","weight":"12 kg","ownerName":"Ana Gómez","ownerEmail":"ana@email.cl","ownerPhone":"555-0103","status":"Hospitalizado","lastVisit":"2026-06-14","notes":"Gastroenteritis aguda."},
  {"id":4,"name":"Rocky","species":"Perro","breed":"Labrador","age":"2 años","weight":"32 kg","ownerName":"Carlos Mendoza","ownerEmail":"tutor@pgvet.cl","ownerPhone":"555-0101","status":"Activo","lastVisit":"2026-06-10","notes":"Sano."}
]
```

### Citas
```json
[
  {"id":1,"date":"2026-06-19","time":"10:00","procedure":"Control post-operatorio","patientId":1,"patientName":"Max","vet":"Dr. Kenji Hanaeru","priority":"Moderado","status":"Pendiente","notes":""},
  {"id":2,"date":"2026-06-19","time":"11:30","procedure":"Vacunación Rabia","patientId":2,"patientName":"Luna","vet":"Dra. Isabel Vargas","priority":"Rutina","status":"Pendiente","notes":""},
  {"id":3,"date":"2026-06-19","time":"14:00","procedure":"Consulta general","patientId":4,"patientName":"Rocky","vet":"Dr. Kenji Hanaeru","priority":"Rutina","status":"Pendiente","notes":"Control anual."},
  {"id":4,"date":"2026-06-18","time":"09:00","procedure":"Cirugía — Castración","patientId":1,"patientName":"Max","vet":"Dr. Kenji Hanaeru","priority":"Urgente","status":"Completado","notes":""}
]
```

### Fichas clínicas, vacunas, recetas, inventario, staff, pagos, notificaciones
Usa los mismos datos del seed del prototipo PGVet (4 staff, 4 inventario, 2 pagos, 4 notificaciones, 1 ficha clínica, 2 vacunas, 1 receta).

Staff: Dr. Kenji Hanaeru, Dra. Isabel Vargas, Tomás Herrera (Técnico), Camila Fuentes (Recepcionista).

## Módulos — funcionalidad CRUD

Cada módulo (excepto Dashboard): tabla/lista + botón "Nuevo/Agregar" + modal con formulario + Editar + Eliminar (confirmar eliminación).

### 1. Dashboard
- Banner: "Sistema PGVet en línea — Todos los módulos operativos"
- 4 stat cards: Ingresos del día (pagos Pagado), Citas pendientes hoy, Pacientes atendidos (Completado), Hospitalizados
- Tabla "Citas de hoy" (fecha 2026-06-19)
- Tabla "Pacientes hospitalizados"

### 2. Patients
Campos: nombre, especie, raza, edad, peso, propietario, email, teléfono, última visita, estado (Activo/Hospitalizado/Inactivo), notas.
Toast: "Paciente guardado correctamente"

### 3. Appointments
Campos: fecha*, hora, procedimiento, paciente (select), veterinario (select activos), prioridad (Urgente/Moderado/Rutina), estado, notas.
Botón Cancelar cita → estado "Cancelado".
Toast: "Cita guardada correctamente"

### 4. Clinical Record
Campos: fecha*, paciente, vet, síntomas, diagnóstico, tratamiento, peso, temperatura, observaciones.
Toast: "Ficha clínica guardada correctamente"

### 5. Vaccines
Campos: fecha aplicación*, mascota, vet, nombre vacuna, próxima dosis, lote, observación.
Toast: "Vacuna registrada correctamente"

### 6. Recipes
Campos: mascota, vet, medicamento, dosis, frecuencia, duración, indicaciones.
Toast: "Receta registrada correctamente"

### 7. Inventory
Campos: nombre, categoría (Medicamento/Insumo/Equipo/Otro), stock, stock mín., precio, vencimiento, proveedor.
Resaltar fila roja si stock < minStock.
Toast: "Producto guardado correctamente"

### 8. Staff
Grid de tarjetas (avatar iniciales, badge rol, badge estado, nombre, especialidad, email, teléfono, fecha incorporación).
Roles: Veterinario/a, Técnico/a, Recepcionista, Asistente.
Toast: "Personal guardado correctamente"

### 9. Payments
Campos: fecha*, tutor, email tutor, cita (select), monto, método (Efectivo/Tarjeta débito/Tarjeta crédito/Transferencia), estado (Pendiente/Pagado/Anulado), n° boleta.
Montos formato CLP `$85.000`.
Toast: "Pago registrado correctamente"

### 10. Notifications
Lista con tipo (cita/vacuna/pago/general), título, mensaje, destinatario, fecha, estado (Pendiente/Enviada/Fallida).
Botón enviar nueva notificación (modal).
Al enviar → estado "Enviada".
Toast: "Notificación enviada correctamente"

## Validaciones globales
- No guardar formularios con campos required vacíos
- Fecha obligatoria en citas, vacunas, fichas, pagos y notificaciones
- stock, precio, monto ≥ 0
- Mensajes error en toast rojo

## Estructura de archivos sugerida
```
src/
  App.tsx
  main.tsx
  index.css
  context/AuthContext.tsx
  api/mockApi.ts
  components/
    Layout.tsx, Sidebar.tsx, Modal.tsx, Toast.tsx, DataTable.tsx
  pages/
    Login.tsx, Dashboard.tsx, Patients.tsx, Appointments.tsx,
    ClinicalRecords.tsx, Vaccines.tsx, Recipes.tsx,
    Inventory.tsx, Staff.tsx, Payments.tsx, Notifications.tsx
```

Implementa **todo** en una sola generación: login, 10 módulos, roles, CRUD, modales, toasts y datos seed. El preview debe ser completamente navegable e interactivo.

--- FIN PROMPT ---

## Referencia local (100% funcional)

Si Make no genera todo de una vez, el prototipo de referencia corre en:

```bash
npx serve "c:\Users\Hanane\Desktop\pgvet figma" -l 3456
```

Abre http://localhost:3456 — mismo comportamiento, mismos datos y roles.
