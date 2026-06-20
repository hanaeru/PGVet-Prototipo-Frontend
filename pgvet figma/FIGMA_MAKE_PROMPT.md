# Prompt para actualizar PGVet Dashboard en Figma Make

Copia y pega este texto en el **chat de Figma Make** del archivo:
https://www.figma.com/make/maB0lq8SLXTzwKFBweksln/PGVet-Dashboard

---

Actualiza este proyecto PGVet para que sea un prototipo funcional completo. Mantén el estilo visual actual (Windows 98 / RO, fondo verde `#8baf96`, tarjetas azul claro, bordes bevel, Tahoma).

## Login (nueva ruta `/login`)
- Campos: correo y contraseña
- Usuarios simulados en memoria:
  - admin@pgvet.cl / 1234 → ADMIN
  - veterinario@pgvet.cl / 1234 → VETERINARIO
  - recepcionista@pgvet.cl / 1234 → RECEPCIONISTA
  - tutor@pgvet.cl / 1234 → TUTOR
- Si login correcto → Dashboard; si no → "Credenciales inválidas"
- Proteger rutas: sin login no se accede al app

## Sidebar — agregar menú completo
Dashboard, Patients, Appointments, Clinical Record, Vaccines, Recipes, Inventory, Staff, Notifications, Payments, Log Out

## Control de acceso por rol
- ADMIN: todo
- VETERINARIO: Dashboard, Patients, Appointments, Clinical Record, Vaccines, Recipes, Notifications
- RECEPCIONISTA: Dashboard, Patients, Appointments, Payments, Notifications
- TUTOR: solo sus mascotas, citas, vacunas, pagos y notificaciones (filtrar por email tutor@pgvet.cl)

## Módulos nuevos (React + mockApi.ts)
1. **Clinical Record** — tabla + modal CRUD (paciente, vet, fecha, síntomas, diagnóstico, tratamiento, peso, temperatura, observaciones). Mensaje: "Ficha clínica guardada correctamente"
2. **Vaccines** — tabla + modal (mascota, vet, vacuna, fecha aplicación, próxima dosis, lote, observación). Mensaje: "Vacuna registrada correctamente"
3. **Recipes** — tabla + modal (mascota, vet, medicamento, dosis, frecuencia, duración, indicaciones). Mensaje: "Receta registrada correctamente"
4. **Payments** — tabla + modal (tutor, cita, monto, método: efectivo/tarjeta débito/crédito/transferencia, estado: pendiente/pagado/anulado, n° boleta). Mensaje: "Pago registrado correctamente"
5. **Notifications** — lista (tipos: cita/vacuna/pago/general; estados: pendiente/enviada/fallida) + botón enviar. Mensaje: "Notificación enviada correctamente"

## Validaciones
- No guardar formularios vacíos
- Fecha obligatoria en citas, vacunas, fichas y pagos
- Stock ≥ 0, precio/monto ≥ 0
- Inventario: resaltar rojo si stock < stock mínimo

## Datos seed
- tutor@pgvet.cl es dueño de Max y Rocky
- Mantener datos existentes de pacientes, citas, inventario y staff

Implementa todo con react-router, mockApi.ts ampliado, modales RoModal existentes, y mensajes toast de éxito/error.
