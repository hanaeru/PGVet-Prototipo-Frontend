/* PGVet — Prototipo funcional (vanilla JS + localStorage) */

const USERS = [
  { email: "admin@pgvet.cl", password: "1234", role: "ADMIN", name: "Administrador PGVet" },
  { email: "veterinario@pgvet.cl", password: "1234", role: "VETERINARIO", name: "Dr. Kenji Hanaeru" },
  { email: "recepcionista@pgvet.cl", password: "1234", role: "RECEPCIONISTA", name: "Camila Fuentes" },
  { email: "tutor@pgvet.cl", password: "1234", role: "TUTOR", name: "Carlos Mendoza" },
];

const MENU = [
  { id: "dashboard", label: "Dashboard", roles: ["ADMIN", "VETERINARIO", "RECEPCIONISTA"] },
  { id: "patients", label: "Patients", roles: ["ADMIN", "VETERINARIO", "RECEPCIONISTA", "TUTOR"] },
  { id: "appointments", label: "Appointments", roles: ["ADMIN", "VETERINARIO", "RECEPCIONISTA", "TUTOR"] },
  { id: "clinical-records", label: "Clinical Record", roles: ["ADMIN", "VETERINARIO"] },
  { id: "vaccines", label: "Vaccines", roles: ["ADMIN", "VETERINARIO", "TUTOR"] },
  { id: "recipes", label: "Recipes", roles: ["ADMIN", "VETERINARIO"] },
  { id: "inventory", label: "Inventory", roles: ["ADMIN"] },
  { id: "staff", label: "Staff", roles: ["ADMIN"] },
  { id: "payments", label: "Payments", roles: ["ADMIN", "RECEPCIONISTA", "TUTOR"] },
  { id: "notifications", label: "Notifications", roles: ["ADMIN", "VETERINARIO", "RECEPCIONISTA", "TUTOR"] },
];

const STORAGE = {
  session: "pgvet_session",
  patients: "pgvet_patients",
  appointments: "pgvet_appointments",
  clinicalRecords: "pgvet_clinical_records",
  vaccines: "pgvet_vaccines",
  recipes: "pgvet_recipes",
  inventory: "pgvet_inventory",
  staff: "pgvet_staff",
  payments: "pgvet_payments",
  notifications: "pgvet_notifications",
  seeded: "pgvet_seeded",
};

let currentUser = null;
let currentPage = "dashboard";
let editingId = null;

// ─── Storage ────────────────────────────────────────────────────────────────

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(list) {
  if (!list.length) return 1;
  return Math.max(...list.map((i) => i.id)) + 1;
}

function seedData() {
  if (localStorage.getItem(STORAGE.seeded)) return;

  save(STORAGE.patients, [
    { id: 1, name: "Max", species: "Perro", breed: "Golden Retriever", age: "3 años", weight: "28 kg", ownerName: "Carlos Mendoza", ownerEmail: "tutor@pgvet.cl", ownerPhone: "555-0101", status: "Hospitalizado", lastVisit: "2026-06-16", notes: "Post-op castración." },
    { id: 2, name: "Luna", species: "Gato", breed: "DSH", age: "1 año", weight: "3.5 kg", ownerName: "Sofía Torres", ownerEmail: "sofia@email.cl", ownerPhone: "555-0102", status: "Activo", lastVisit: "2026-06-15", notes: "Vacunación al día." },
    { id: 3, name: "Charlie", species: "Perro", breed: "Beagle", age: "5 años", weight: "12 kg", ownerName: "Ana Gómez", ownerEmail: "ana@email.cl", ownerPhone: "555-0103", status: "Hospitalizado", lastVisit: "2026-06-14", notes: "Gastroenteritis aguda." },
    { id: 4, name: "Rocky", species: "Perro", breed: "Labrador", age: "2 años", weight: "32 kg", ownerName: "Carlos Mendoza", ownerEmail: "tutor@pgvet.cl", ownerPhone: "555-0101", status: "Activo", lastVisit: "2026-06-10", notes: "Sano." },
  ]);

  save(STORAGE.appointments, [
    { id: 1, date: "2026-06-19", time: "10:00", procedure: "Control post-operatorio", patientId: 1, patientName: "Max", vet: "Dr. Kenji Hanaeru", priority: "Moderado", status: "Pendiente", notes: "" },
    { id: 2, date: "2026-06-19", time: "11:30", procedure: "Vacunación Rabia", patientId: 2, patientName: "Luna", vet: "Dra. Isabel Vargas", priority: "Rutina", status: "Pendiente", notes: "" },
    { id: 3, date: "2026-06-19", time: "14:00", procedure: "Consulta general", patientId: 4, patientName: "Rocky", vet: "Dr. Kenji Hanaeru", priority: "Rutina", status: "Pendiente", notes: "Control anual." },
    { id: 4, date: "2026-06-18", time: "09:00", procedure: "Cirugía — Castración", patientId: 1, patientName: "Max", vet: "Dr. Kenji Hanaeru", priority: "Urgente", status: "Completado", notes: "" },
  ]);

  save(STORAGE.clinicalRecords, [
    { id: 1, patientId: 1, patientName: "Max", vet: "Dr. Kenji Hanaeru", date: "2026-06-16", symptoms: "Preparación quirúrgica", diagnosis: "Indicación castración", treatment: "Ayuno 12h, premedicación", weight: "28 kg", temperature: "38.5°C", observations: "Paciente estable." },
  ]);

  save(STORAGE.vaccines, [
    { id: 1, patientId: 4, patientName: "Rocky", vet: "Dr. Kenji Hanaeru", vaccineName: "Antirrábica", applicationDate: "2026-03-10", nextDose: "2027-03-10", batch: "AR-2026-001", observation: "Sin reacciones." },
    { id: 2, patientId: 1, patientName: "Max", vet: "Dra. Isabel Vargas", vaccineName: "DHLPP", applicationDate: "2026-01-15", nextDose: "2027-01-15", batch: "DH-2026-042", observation: "" },
  ]);

  save(STORAGE.recipes, [
    { id: 1, patientId: 3, patientName: "Charlie", vet: "Dr. Kenji Hanaeru", medication: "Metronidazol 250mg", dose: "1 tableta", frequency: "Cada 12 horas", duration: "7 días", indications: "Administrar con alimento." },
  ]);

  save(STORAGE.inventory, [
    { id: 1, name: "Amoxicilina 500mg", category: "Medicamento", stock: 120, minStock: 50, price: 0.8, expiry: "2027-03-01", supplier: "FarmVet" },
    { id: 2, name: "Ketamina 10%", category: "Medicamento", stock: 8, minStock: 10, price: 45, expiry: "2026-12-31", supplier: "MediPet" },
    { id: 3, name: "Suero Fisiológico 1L", category: "Insumo", stock: 30, minStock: 15, price: 3.5, expiry: "2027-06-01", supplier: "InsuVet" },
    { id: 4, name: "Vacuna Antirrábica", category: "Medicamento", stock: 15, minStock: 20, price: 12, expiry: "2026-09-01", supplier: "BioPet" },
  ]);

  save(STORAGE.staff, [
    { id: 1, name: "Dr. Kenji Hanaeru", role: "Veterinario/a", specialty: "Cirugía y Medicina Interna", phone: "555-2001", email: "k.hanaeru@pgvet.cl", status: "Activo", joinDate: "2020-03-01" },
    { id: 2, name: "Dra. Isabel Vargas", role: "Veterinario/a", specialty: "Dermatología", phone: "555-2002", email: "i.vargas@pgvet.cl", status: "Activo", joinDate: "2021-07-15" },
    { id: 3, name: "Tomás Herrera", role: "Técnico/a", specialty: "Laboratorio", phone: "555-2003", email: "t.herrera@pgvet.cl", status: "Activo", joinDate: "2022-01-10" },
    { id: 4, name: "Camila Fuentes", role: "Recepcionista", specialty: "Atención al Cliente", phone: "555-2005", email: "c.fuentes@pgvet.cl", status: "Activo", joinDate: "2022-08-01" },
  ]);

  save(STORAGE.payments, [
    { id: 1, tutorName: "Carlos Mendoza", tutorEmail: "tutor@pgvet.cl", appointmentId: 4, appointmentDesc: "Cirugía — Max", amount: 85000, method: "Tarjeta crédito", status: "Pagado", receipt: "BOL-2026-001" },
    { id: 2, tutorName: "Sofía Torres", tutorEmail: "sofia@email.cl", appointmentId: 2, appointmentDesc: "Vacunación — Luna", amount: 15000, method: "Efectivo", status: "Pendiente", receipt: "" },
  ]);

  save(STORAGE.notifications, [
    { id: 1, type: "cita", title: "Recordatorio cita Max", message: "Cita mañana 10:00 — Control post-operatorio", recipient: "tutor@pgvet.cl", status: "Enviada", date: "2026-06-18" },
    { id: 2, type: "vacuna", title: "Vacuna próxima Rocky", message: "Próxima dosis antirrábica en 9 meses", recipient: "tutor@pgvet.cl", status: "Pendiente", date: "2026-06-19" },
    { id: 3, type: "pago", title: "Pago pendiente Luna", message: "Vacunación pendiente de pago", recipient: "sofia@email.cl", status: "Pendiente", date: "2026-06-19" },
    { id: 4, type: "general", title: "Sistema online", message: "PGVet operativo — todos los módulos disponibles", recipient: "todos", status: "Enviada", date: "2026-06-19" },
  ]);

  localStorage.setItem(STORAGE.seeded, "1");
}

// ─── Auth & access ──────────────────────────────────────────────────────────

function getSession() {
  return load(STORAGE.session);
}

function setSession(user) {
  save(STORAGE.session, { email: user.email, role: user.role, name: user.name });
  currentUser = user;
}

function clearSession() {
  localStorage.removeItem(STORAGE.session);
  currentUser = null;
}

function canAccess(pageId) {
  const item = MENU.find((m) => m.id === pageId);
  return item && item.roles.includes(currentUser.role);
}

function filterForTutor(list, emailField = "ownerEmail") {
  if (currentUser.role !== "TUTOR") return list;
  return list.filter((item) => item[emailField] === currentUser.email || item.tutorEmail === currentUser.email || item.recipient === currentUser.email);
}

function filterPatientsForUser(list) {
  if (currentUser.role === "TUTOR") return list.filter((p) => p.ownerEmail === currentUser.email);
  return list;
}

function filterByPatientOwnership(list, patientIdField = "patientId") {
  if (currentUser.role !== "TUTOR") return list;
  const patients = filterPatientsForUser(load(STORAGE.patients) || []);
  const ids = new Set(patients.map((p) => p.id));
  return list.filter((item) => ids.has(item[patientIdField]));
}

// ─── UI helpers ─────────────────────────────────────────────────────────────

function $(sel) {
  return document.querySelector(sel);
}

function bevel(cls) {
  return cls === "in" ? "bevel-in" : "bevel-out";
}

function toast(msg, type = "success") {
  const el = document.createElement("div");
  el.className = `toast toast-${type} bevel-out`;
  el.textContent = msg;
  $("#toast-container").appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function openModal(title, html, onSubmit) {
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = html;
  $("#modal-overlay").classList.remove("hidden");
  editingId = null;

  const form = $("#modal-body").querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = validateForm(form);
      if (errors.length) {
        toast(errors[0], "error");
        return;
      }
      onSubmit(new FormData(form));
    });
  }

  $("#modal-close").onclick = closeModal;
  $("#modal-overlay").onclick = (e) => {
    if (e.target === $("#modal-overlay")) closeModal();
  };
}

function closeModal() {
  $("#modal-overlay").classList.add("hidden");
  editingId = null;
}

function validateForm(form) {
  const errors = [];
  form.querySelectorAll("[required]").forEach((field) => {
    if (!field.value.trim()) errors.push(`El campo "${field.dataset.label || field.name}" es obligatorio.`);
  });
  form.querySelectorAll("[data-min='0']").forEach((field) => {
    const v = parseFloat(field.value);
    if (field.value !== "" && (isNaN(v) || v < 0)) errors.push(`"${field.dataset.label}" debe ser mayor o igual a 0.`);
  });
  form.querySelectorAll("[data-min='1']").forEach((field) => {
    const v = parseFloat(field.value);
    if (field.value !== "" && (isNaN(v) || v < 0)) errors.push(`"${field.dataset.label}" no puede ser negativo.`);
  });
  return errors;
}

function formField(label, name, type = "text", value = "", opts = {}) {
  const req = opts.required !== false ? "required" : "";
  const extra = opts.extraAttrs || "";
  const cls = `bevel-in ${opts.className || ""}`;
  if (type === "select") {
    const options = (opts.options || []).map((o) => `<option value="${o}" ${o === value ? "selected" : ""}>${o}</option>`).join("");
    return `<div class="form-group ${opts.full ? "full" : ""}"><label>${label}</label><select name="${name}" class="${cls}" data-label="${label}" ${req} ${extra}>${options}</select></div>`;
  }
  if (type === "textarea") {
    return `<div class="form-group ${opts.full ? "full" : ""}"><label>${label}</label><textarea name="${name}" class="${cls}" data-label="${label}" ${req} ${extra}>${value}</textarea></div>`;
  }
  return `<div class="form-group ${opts.full ? "full" : ""}"><label>${label}</label><input type="${type}" name="${name}" value="${value}" class="${cls}" data-label="${label}" ${req} ${extra}></div>`;
}

function patientOptions(selectedId) {
  const patients = filterPatientsForUser(load(STORAGE.patients) || []);
  return patients.map((p) => `<option value="${p.id}" ${p.id == selectedId ? "selected" : ""}>${p.name} (${p.ownerName})</option>`).join("");
}

function staffVetOptions(selected = "") {
  const staff = (load(STORAGE.staff) || []).filter((s) => s.role === "Veterinario/a" && s.status === "Activo");
  return staff.map((s) => `<option value="${s.name}" ${s.name === selected ? "selected" : ""}>${s.name}</option>`).join("");
}

// ─── Navigation ─────────────────────────────────────────────────────────────

function renderSidebar() {
  const nav = $("#sidebar-nav");
  nav.innerHTML = "";
  MENU.filter((m) => m.roles.includes(currentUser.role)).forEach((item) => {
    const btn = document.createElement("button");
    btn.className = `nav-item ${item.id === currentPage ? "active" : ""}`;
    btn.textContent = item.label;
    btn.onclick = () => navigate(item.id);
    nav.appendChild(btn);
  });
}

function navigate(page) {
  if (!canAccess(page)) {
    toast("No tiene permiso para acceder a este módulo.", "error");
    return;
  }
  currentPage = page;
  renderSidebar();
  renderPage();
}

function showLogin() {
  $("#view-login").classList.remove("hidden");
  $("#view-app").classList.add("hidden");
}

function showApp() {
  $("#view-login").classList.add("hidden");
  $("#view-app").classList.remove("hidden");
  $("#user-name").textContent = currentUser.name;
  $("#user-role").textContent = currentUser.role;
  const defaultPage = MENU.find((m) => m.roles.includes(currentUser.role));
  currentPage = defaultPage ? defaultPage.id : "dashboard";
  renderSidebar();
  renderPage();
}

function renderPage() {
  const titles = {
    dashboard: "Dashboard",
    patients: currentUser.role === "TUTOR" ? "Mis Mascotas" : "Patients",
    appointments: currentUser.role === "TUTOR" ? "Mis Citas" : "Appointments",
    "clinical-records": "Clinical Record",
    vaccines: currentUser.role === "TUTOR" ? "Mis Vacunas" : "Vaccines",
    recipes: "Recipes",
    inventory: "Inventory",
    staff: "Staff",
    payments: currentUser.role === "TUTOR" ? "Mis Pagos" : "Payments",
    notifications: "Notifications",
  };
  $("#page-title").textContent = titles[currentPage] || currentPage;

  const renderers = {
    dashboard: renderDashboard,
    patients: renderPatients,
    appointments: renderAppointments,
    "clinical-records": renderClinicalRecords,
    vaccines: renderVaccines,
    recipes: renderRecipes,
    inventory: renderInventory,
    staff: renderStaff,
    payments: renderPayments,
    notifications: renderNotifications,
  };

  const fn = renderers[currentPage];
  $("#page-content").innerHTML = fn ? fn() : "<p>Módulo no disponible.</p>";
  bindPageEvents();
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

function renderDashboard() {
  const appts = load(STORAGE.appointments) || [];
  const patients = load(STORAGE.patients) || [];
  const payments = load(STORAGE.payments) || [];
  const today = "2026-06-19";

  const todayAppts = appts.filter((a) => a.date === today && a.status !== "Cancelado");
  const hospitalized = patients.filter((p) => p.status === "Hospitalizado");
  const todayIncome = payments.filter((p) => p.status === "Pagado").reduce((s, p) => s + p.amount, 0);
  const attended = appts.filter((a) => a.status === "Completado").length;

  const apptRows = todayAppts.map((a) => `
    <tr><td>${a.time}</td><td>${a.patientName}</td><td>${a.procedure}</td><td>${a.vet}</td><td>${a.priority}</td><td>${a.status}</td></tr>
  `).join("") || `<tr><td colspan="6" class="empty-state">Sin citas hoy</td></tr>`;

  const hospRows = hospitalized.map((p) => `
    <tr><td>${p.name}</td><td>${p.species}</td><td>${p.ownerName}</td><td>${p.ownerPhone}</td><td>${p.notes}</td></tr>
  `).join("") || `<tr><td colspan="5" class="empty-state">Sin hospitalizados</td></tr>`;

  return `
    <div class="system-banner">Sistema PGVet en línea — Todos los módulos operativos</div>
    <div class="stat-grid">
      <div class="stat-card bevel-out"><div class="stat-value">$${todayIncome.toLocaleString("es-CL")}</div><div class="stat-label">Ingresos del día</div></div>
      <div class="stat-card bevel-out"><div class="stat-value">${todayAppts.filter(a => a.status === "Pendiente").length}</div><div class="stat-label">Citas pendientes</div></div>
      <div class="stat-card bevel-out"><div class="stat-value">${attended}</div><div class="stat-label">Pacientes atendidos</div></div>
      <div class="stat-card bevel-out"><div class="stat-value">${hospitalized.length}</div><div class="stat-label">Hospitalizados</div></div>
    </div>
    <div class="grid-2">
      <div class="card bevel-out">
        <div class="card-header">Citas de hoy</div>
        <div class="card-body table-wrap"><table><thead><tr><th>Hora</th><th>Paciente</th><th>Procedimiento</th><th>Vet</th><th>Prioridad</th><th>Estado</th></tr></thead><tbody>${apptRows}</tbody></table></div>
      </div>
      <div class="card bevel-out">
        <div class="card-header">Pacientes hospitalizados</div>
        <div class="card-body table-wrap"><table><thead><tr><th>Nombre</th><th>Especie</th><th>Propietario</th><th>Teléfono</th><th>Notas</th></tr></thead><tbody>${hospRows}</tbody></table></div>
      </div>
    </div>`;
}

// ─── Patients ───────────────────────────────────────────────────────────────

function renderPatients() {
  const list = filterPatientsForUser(load(STORAGE.patients) || []);
  const canEdit = currentUser.role !== "TUTOR";
  const rows = list.map((p) => `
    <tr>
      <td>${p.name}</td><td>${p.species}</td><td>${p.breed}</td><td>${p.age}</td><td>${p.weight}</td>
      <td>${p.ownerName}</td><td>${p.ownerPhone}</td><td>${p.lastVisit}</td><td>${p.status}</td>
      <td class="td-actions">${canEdit ? `<button class="btn btn-sm bevel-out" data-edit-patient="${p.id}">Editar</button><button class="btn btn-sm btn-danger bevel-out" data-del-patient="${p.id}">Eliminar</button>` : "—"}</td>
    </tr>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header">
        <span>${currentUser.role === "TUTOR" ? "Mis Mascotas" : "Listado de Pacientes"}</span>
        ${canEdit ? `<button class="btn bevel-out" id="btn-new-patient">+ Nuevo Paciente</button>` : ""}
      </div>
      <div class="card-body table-wrap">
        <table><thead><tr><th>Nombre</th><th>Especie</th><th>Raza</th><th>Edad</th><th>Peso</th><th>Propietario</th><th>Teléfono</th><th>Última visita</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="10" class="empty-state">Sin pacientes</td></tr>`}</tbody></table>
      </div>
    </div>`;
}

function patientForm(data = {}) {
  return `<form>${formField("Nombre", "name", "text", data.name || "")}${formField("Especie", "species", "text", data.species || "")}${formField("Raza", "breed", "text", data.breed || "")}${formField("Edad", "age", "text", data.age || "")}${formField("Peso", "weight", "text", data.weight || "")}${formField("Propietario", "ownerName", "text", data.ownerName || "")}${formField("Email propietario", "ownerEmail", "email", data.ownerEmail || "")}${formField("Teléfono", "ownerPhone", "text", data.ownerPhone || "")}${formField("Última visita", "lastVisit", "date", data.lastVisit || "")}${formField("Estado", "status", "select", data.status || "Activo", { options: ["Activo", "Hospitalizado", "Inactivo"] })}${formField("Notas", "notes", "textarea", data.notes || "", { full: true, required: false })}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Appointments ───────────────────────────────────────────────────────────

function renderAppointments() {
  let list = load(STORAGE.appointments) || [];
  list = filterByPatientOwnership(list);
  const canEdit = currentUser.role !== "TUTOR";
  const rows = list.map((a) => `
    <tr>
      <td>${a.date}</td><td>${a.time}</td><td>${a.procedure}</td><td>${a.patientName}</td><td>${a.vet}</td><td>${a.priority}</td><td>${a.status}</td>
      <td class="td-actions">${canEdit ? `<button class="btn btn-sm bevel-out" data-edit-appt="${a.id}">Editar</button><button class="btn btn-sm bevel-out" data-cancel-appt="${a.id}">Cancelar</button><button class="btn btn-sm btn-danger bevel-out" data-del-appt="${a.id}">Eliminar</button>` : "—"}</td>
    </tr>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Citas</span>${canEdit ? `<button class="btn bevel-out" id="btn-new-appt">+ Nueva Cita</button>` : ""}</div>
      <div class="card-body table-wrap">
        <table><thead><tr><th>Fecha</th><th>Hora</th><th>Procedimiento</th><th>Paciente</th><th>Veterinario</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="8" class="empty-state">Sin citas</td></tr>`}</tbody></table>
      </div>
    </div>`;
}

function apptForm(data = {}) {
  return `<form>${formField("Fecha", "date", "date", data.date || "", { required: true })}${formField("Hora", "time", "time", data.time || "")}${formField("Procedimiento", "procedure", "text", data.procedure || "")}<div class="form-group"><label>Paciente</label><select name="patientId" class="bevel-in" required data-label="Paciente"><option value="">— Seleccionar —</option>${patientOptions(data.patientId)}</select></div><div class="form-group"><label>Veterinario</label><select name="vet" class="bevel-in" required data-label="Veterinario">${staffVetOptions(data.vet)}</select></div>${formField("Prioridad", "priority", "select", data.priority || "Rutina", { options: ["Urgente", "Moderado", "Rutina"] })}${formField("Estado", "status", "select", data.status || "Pendiente", { options: ["Pendiente", "En Curso", "Completado", "Cancelado"] })}${formField("Notas", "notes", "textarea", data.notes || "", { full: true, required: false })}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Clinical Records ───────────────────────────────────────────────────────

function renderClinicalRecords() {
  const list = load(STORAGE.clinicalRecords) || [];
  const rows = list.map((r) => `
    <tr><td>${r.patientName}</td><td>${r.vet}</td><td>${r.date}</td><td>${r.diagnosis}</td><td>${r.treatment}</td>
    <td class="td-actions"><button class="btn btn-sm bevel-out" data-edit-record="${r.id}">Editar</button><button class="btn btn-sm btn-danger bevel-out" data-del-record="${r.id}">Eliminar</button></td></tr>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Fichas Clínicas</span><button class="btn bevel-out" id="btn-new-record">+ Nueva Ficha Clínica</button></div>
      <div class="card-body table-wrap">
        <table><thead><tr><th>Paciente</th><th>Veterinario</th><th>Fecha</th><th>Diagnóstico</th><th>Tratamiento</th><th>Acciones</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6" class="empty-state">Sin fichas</td></tr>`}</tbody></table>
      </div>
    </div>`;
}

function recordForm(data = {}) {
  return `<form class="form-grid">${formField("Fecha", "date", "date", data.date || "", { required: true })}<div class="form-group"><label>Paciente</label><select name="patientId" class="bevel-in" required data-label="Paciente"><option value="">— Seleccionar —</option>${patientOptions(data.patientId)}</select></div><div class="form-group full"><label>Veterinario</label><select name="vet" class="bevel-in" required data-label="Veterinario">${staffVetOptions(data.vet)}</select></div>${formField("Síntomas", "symptoms", "textarea", data.symptoms || "", { full: true })}${formField("Diagnóstico", "diagnosis", "text", data.diagnosis || "", { full: true })}${formField("Tratamiento", "treatment", "textarea", data.treatment || "", { full: true })}${formField("Peso", "weight", "text", data.weight || "")}${formField("Temperatura", "temperature", "text", data.temperature || "")}${formField("Observaciones", "observations", "textarea", data.observations || "", { full: true, required: false })}<div class="form-actions full"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Vaccines ───────────────────────────────────────────────────────────────

function renderVaccines() {
  let list = load(STORAGE.vaccines) || [];
  list = filterByPatientOwnership(list);
  const canEdit = currentUser.role !== "TUTOR";
  const rows = list.map((v) => `
    <tr><td>${v.patientName}</td><td>${v.vet}</td><td>${v.vaccineName}</td><td>${v.applicationDate}</td><td>${v.nextDose}</td><td>${v.batch}</td><td>${v.observation || "—"}</td>
    <td class="td-actions">${canEdit ? `<button class="btn btn-sm bevel-out" data-edit-vaccine="${v.id}">Editar</button><button class="btn btn-sm btn-danger bevel-out" data-del-vaccine="${v.id}">Eliminar</button>` : "—"}</td></tr>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Vacunas</span>${canEdit ? `<button class="btn bevel-out" id="btn-new-vaccine">+ Registrar Vacuna</button>` : ""}</div>
      <div class="card-body table-wrap">
        <table><thead><tr><th>Mascota</th><th>Veterinario</th><th>Vacuna</th><th>Aplicación</th><th>Próxima dosis</th><th>Lote</th><th>Observación</th><th>Acciones</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="8" class="empty-state">Sin vacunas</td></tr>`}</tbody></table>
      </div>
    </div>`;
}

function vaccineForm(data = {}) {
  return `<form>${formField("Fecha aplicación", "applicationDate", "date", data.applicationDate || "", { required: true })}<div class="form-group"><label>Mascota</label><select name="patientId" class="bevel-in" required data-label="Mascota"><option value="">— Seleccionar —</option>${patientOptions(data.patientId)}</select></div><div class="form-group"><label>Veterinario</label><select name="vet" class="bevel-in" required data-label="Veterinario">${staffVetOptions(data.vet)}</select></div>${formField("Nombre vacuna", "vaccineName", "text", data.vaccineName || "")}${formField("Próxima dosis", "nextDose", "date", data.nextDose || "")}${formField("Lote", "batch", "text", data.batch || "")}${formField("Observación", "observation", "textarea", data.observation || "", { full: true, required: false })}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Recipes ────────────────────────────────────────────────────────────────

function renderRecipes() {
  const list = load(STORAGE.recipes) || [];
  const rows = list.map((r) => `
    <tr><td>${r.patientName}</td><td>${r.vet}</td><td>${r.medication}</td><td>${r.dose}</td><td>${r.frequency}</td><td>${r.duration}</td><td>${r.indications}</td>
    <td class="td-actions"><button class="btn btn-sm bevel-out" data-edit-recipe="${r.id}">Editar</button><button class="btn btn-sm btn-danger bevel-out" data-del-recipe="${r.id}">Eliminar</button></td></tr>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Recetas</span><button class="btn bevel-out" id="btn-new-recipe">+ Nueva Receta</button></div>
      <div class="card-body table-wrap">
        <table><thead><tr><th>Mascota</th><th>Veterinario</th><th>Medicamento</th><th>Dosis</th><th>Frecuencia</th><th>Duración</th><th>Indicaciones</th><th>Acciones</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="8" class="empty-state">Sin recetas</td></tr>`}</tbody></table>
      </div>
    </div>`;
}

function recipeForm(data = {}) {
  return `<form>${formField("Medicamento", "medication", "text", data.medication || "")}<div class="form-group"><label>Mascota</label><select name="patientId" class="bevel-in" required data-label="Mascota"><option value="">— Seleccionar —</option>${patientOptions(data.patientId)}</select></div><div class="form-group"><label>Veterinario</label><select name="vet" class="bevel-in" required data-label="Veterinario">${staffVetOptions(data.vet)}</select></div>${formField("Dosis", "dose", "text", data.dose || "")}${formField("Frecuencia", "frequency", "text", data.frequency || "")}${formField("Duración", "duration", "text", data.duration || "")}${formField("Indicaciones", "indications", "textarea", data.indications || "", { full: true })}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Inventory ──────────────────────────────────────────────────────────────

function renderInventory() {
  const list = load(STORAGE.inventory) || [];
  const rows = list.map((i) => `
    <tr class="${i.stock < i.minStock ? "low-stock" : ""}">
      <td>${i.name}</td><td>${i.category}</td><td>${i.stock}</td><td>${i.minStock}</td><td>$${i.price}</td><td>${i.expiry || "—"}</td><td>${i.supplier}</td>
      <td class="td-actions"><button class="btn btn-sm bevel-out" data-edit-inv="${i.id}">Editar</button><button class="btn btn-sm btn-danger bevel-out" data-del-inv="${i.id}">Eliminar</button></td>
    </tr>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Inventario</span><button class="btn bevel-out" id="btn-new-inv">+ Agregar Producto</button></div>
      <div class="card-body table-wrap">
        <table><thead><tr><th>Nombre</th><th>Categoría</th><th>Stock</th><th>Stock mín.</th><th>Precio</th><th>Vencimiento</th><th>Proveedor</th><th>Acciones</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="8" class="empty-state">Sin productos</td></tr>`}</tbody></table>
      </div>
    </div>`;
}

function invForm(data = {}) {
  return `<form>${formField("Nombre", "name", "text", data.name || "")}${formField("Categoría", "category", "select", data.category || "Medicamento", { options: ["Medicamento", "Insumo", "Equipo", "Otro"] })}${formField("Stock", "stock", "number", data.stock ?? "", { extraAttrs: 'data-min="1" min="0" step="1"' })}${formField("Stock mínimo", "minStock", "number", data.minStock ?? "", { extraAttrs: 'data-min="0" min="0" step="1"' })}${formField("Precio", "price", "number", data.price ?? "", { extraAttrs: 'data-min="0" min="0" step="0.01"' })}${formField("Vencimiento", "expiry", "date", data.expiry || "", { required: false })}${formField("Proveedor", "supplier", "text", data.supplier || "")}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Staff ──────────────────────────────────────────────────────────────────

function roleBadge(role) {
  const map = { "Veterinario/a": "badge-vet", "Técnico/a": "badge-tech", Recepcionista: "badge-recep", Asistente: "badge-asist" };
  return `<span class="badge ${map[role] || ""}">${role}</span>`;
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function renderStaff() {
  const list = load(STORAGE.staff) || [];
  const cards = list.map((s) => `
    <div class="staff-card bevel-out">
      <div class="staff-card-header">${roleBadge(s.role)}<span class="badge ${s.status === "Activo" ? "badge-active" : "badge-inactive"}">${s.status}</span></div>
      <div class="staff-card-body">
        <div class="staff-avatar bevel-out">${initials(s.name)}</div>
        <div class="staff-info"><h3>${s.name}</h3><p>${s.specialty}</p><p>${s.email}</p><p>${s.phone}</p><p>Desde: ${s.joinDate}</p></div>
      </div>
      <div class="staff-card-actions">
        <button class="btn btn-sm bevel-out" data-edit-staff="${s.id}">Editar</button>
        <button class="btn btn-sm btn-danger bevel-out" data-del-staff="${s.id}">Eliminar</button>
      </div>
    </div>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Personal de la Clínica</span><button class="btn bevel-out" id="btn-new-staff">+ Agregar Personal</button></div>
      <div class="card-body"><div class="staff-grid">${cards || `<p class="empty-state">Sin personal</p>`}</div></div>
    </div>`;
}

function staffForm(data = {}) {
  return `<form>${formField("Nombre completo", "name", "text", data.name || "")}${formField("Rol", "role", "select", data.role || "Veterinario/a", { options: ["Veterinario/a", "Técnico/a", "Recepcionista", "Asistente"] })}${formField("Especialidad", "specialty", "text", data.specialty || "")}${formField("Teléfono", "phone", "text", data.phone || "")}${formField("Email", "email", "email", data.email || "")}${formField("Estado", "status", "select", data.status || "Activo", { options: ["Activo", "Inactivo"] })}${formField("Fecha incorporación", "joinDate", "date", data.joinDate || "")}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Payments ───────────────────────────────────────────────────────────────

function renderPayments() {
  let list = load(STORAGE.payments) || [];
  list = filterForTutor(list, "tutorEmail");
  const canEdit = currentUser.role !== "TUTOR";
  const rows = list.map((p) => `
    <tr><td>${p.tutorName}</td><td>${p.appointmentDesc}</td><td>$${p.amount.toLocaleString("es-CL")}</td><td>${p.method}</td><td>${p.status}</td><td>${p.receipt || "—"}</td>
    <td class="td-actions">${canEdit ? `<button class="btn btn-sm bevel-out" data-edit-pay="${p.id}">Editar</button><button class="btn btn-sm btn-danger bevel-out" data-del-pay="${p.id}">Eliminar</button>` : "—"}</td></tr>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Pagos</span>${canEdit ? `<button class="btn bevel-out" id="btn-new-pay">+ Registrar Pago</button>` : ""}</div>
      <div class="card-body table-wrap">
        <table><thead><tr><th>Tutor</th><th>Cita</th><th>Monto</th><th>Método</th><th>Estado</th><th>Boleta</th><th>Acciones</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="7" class="empty-state">Sin pagos</td></tr>`}</tbody></table>
      </div>
    </div>`;
}

function payForm(data = {}) {
  const appts = load(STORAGE.appointments) || [];
  const apptOpts = appts.map((a) => `<option value="${a.id}" ${a.id == data.appointmentId ? "selected" : ""}>${a.date} — ${a.patientName}: ${a.procedure}</option>`).join("");
  return `<form>${formField("Fecha", "date", "date", data.date || "2026-06-19", { required: true })}${formField("Tutor", "tutorName", "text", data.tutorName || "")}${formField("Email tutor", "tutorEmail", "email", data.tutorEmail || "")}<div class="form-group"><label>Cita</label><select name="appointmentId" class="bevel-in" required data-label="Cita"><option value="">— Seleccionar —</option>${apptOpts}</select></div>${formField("Monto", "amount", "number", data.amount ?? "", { extraAttrs: 'data-min="0" min="0" step="1"' })}${formField("Método de pago", "method", "select", data.method || "Efectivo", { options: ["Efectivo", "Tarjeta débito", "Tarjeta crédito", "Transferencia"] })}${formField("Estado", "status", "select", data.status || "Pendiente", { options: ["Pendiente", "Pagado", "Anulado"] })}${formField("N° boleta", "receipt", "text", data.receipt || "", { required: false })}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Guardar</button></div></form>`;
}

// ─── Notifications ────────────────────────────────────────────────────────────

function renderNotifications() {
  let list = load(STORAGE.notifications) || [];
  if (currentUser.role === "TUTOR") list = list.filter((n) => n.recipient === currentUser.email || n.recipient === "todos");
  else if (currentUser.role !== "ADMIN") list = list.filter((n) => n.recipient === "todos" || n.recipient === currentUser.email);

  const canSend = ["ADMIN", "VETERINARIO", "RECEPCIONISTA"].includes(currentUser.role);
  const statusClass = { Pendiente: "notif-pending", Enviada: "notif-sent", Fallida: "notif-failed" };

  const items = list.map((n) => `
    <li class="notif-item">
      <div><span class="notif-type">${n.type}</span><strong>${n.title}</strong><p>${n.message}</p><small>${n.date} · ${n.recipient}</small></div>
      <span class="${statusClass[n.status] || ""}">${n.status}</span>
    </li>`).join("");

  return `
    <div class="card bevel-out">
      <div class="card-header"><span>Notificaciones</span>${canSend ? `<button class="btn bevel-out" id="btn-new-notif">+ Enviar Notificación</button>` : ""}</div>
      <div class="card-body"><ul class="notif-list">${items || `<li class="empty-state">Sin notificaciones</li>`}</ul></div>
    </div>`;
}

function notifForm() {
  return `<form>${formField("Tipo", "type", "select", "general", { options: ["cita", "vacuna", "pago", "general"] })}${formField("Título", "title", "text", "")}${formField("Mensaje", "message", "textarea", "", { full: true })}${formField("Destinatario (email o 'todos')", "recipient", "text", "todos")}${formField("Fecha", "date", "date", "2026-06-19", { required: true })}<div class="form-actions"><button type="button" class="btn bevel-out" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Cancelar</button><button type="submit" class="btn btn-primary bevel-out">Enviar</button></div></form>`;
}

// ─── Event binding ────────────────────────────────────────────────────────────

function getPatientName(id) {
  const p = (load(STORAGE.patients) || []).find((x) => x.id === parseInt(id));
  return p ? p.name : "";
}

function bindPageEvents() {
  const bind = (sel, fn) => document.querySelector(sel)?.addEventListener("click", fn);

  // Patients
  bind("#btn-new-patient", () => openModal("Nuevo Paciente", patientForm(), (fd) => {
    const list = load(STORAGE.patients) || [];
    list.push({ id: nextId(list), name: fd.get("name"), species: fd.get("species"), breed: fd.get("breed"), age: fd.get("age"), weight: fd.get("weight"), ownerName: fd.get("ownerName"), ownerEmail: fd.get("ownerEmail"), ownerPhone: fd.get("ownerPhone"), lastVisit: fd.get("lastVisit"), status: fd.get("status"), notes: fd.get("notes") });
    save(STORAGE.patients, list);
    closeModal(); toast("Paciente registrado correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-patient]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editPatient);
    const item = (load(STORAGE.patients) || []).find((p) => p.id === id);
    editingId = id;
    openModal("Editar Paciente", patientForm(item), (fd) => {
      const list = (load(STORAGE.patients) || []).map((p) => p.id === id ? { ...p, name: fd.get("name"), species: fd.get("species"), breed: fd.get("breed"), age: fd.get("age"), weight: fd.get("weight"), ownerName: fd.get("ownerName"), ownerEmail: fd.get("ownerEmail"), ownerPhone: fd.get("ownerPhone"), lastVisit: fd.get("lastVisit"), status: fd.get("status"), notes: fd.get("notes") } : p);
      save(STORAGE.patients, list);
      closeModal(); toast("Paciente actualizado"); renderPage();
    });
  });

  document.querySelectorAll("[data-del-patient]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar paciente?")) return;
    save(STORAGE.patients, (load(STORAGE.patients) || []).filter((p) => p.id !== parseInt(btn.dataset.delPatient)));
    renderPage();
  });

  // Appointments
  bind("#btn-new-appt", () => openModal("Nueva Cita", apptForm(), (fd) => {
    const list = load(STORAGE.appointments) || [];
    const pid = parseInt(fd.get("patientId"));
    list.push({ id: nextId(list), date: fd.get("date"), time: fd.get("time"), procedure: fd.get("procedure"), patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), priority: fd.get("priority"), status: fd.get("status"), notes: fd.get("notes") });
    save(STORAGE.appointments, list);
    closeModal(); toast("Cita registrada correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-appt]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editAppt);
    const item = (load(STORAGE.appointments) || []).find((a) => a.id === id);
    openModal("Editar Cita", apptForm(item), (fd) => {
      const pid = parseInt(fd.get("patientId"));
      const list = (load(STORAGE.appointments) || []).map((a) => a.id === id ? { ...a, date: fd.get("date"), time: fd.get("time"), procedure: fd.get("procedure"), patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), priority: fd.get("priority"), status: fd.get("status"), notes: fd.get("notes") } : a);
      save(STORAGE.appointments, list);
      closeModal(); toast("Cita actualizada"); renderPage();
    });
  });

  document.querySelectorAll("[data-cancel-appt]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.cancelAppt);
    const list = (load(STORAGE.appointments) || []).map((a) => a.id === id ? { ...a, status: "Cancelado" } : a);
    save(STORAGE.appointments, list);
    toast("Cita cancelada"); renderPage();
  });

  document.querySelectorAll("[data-del-appt]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar cita?")) return;
    save(STORAGE.appointments, (load(STORAGE.appointments) || []).filter((a) => a.id !== parseInt(btn.dataset.delAppt)));
    renderPage();
  });

  // Clinical records
  bind("#btn-new-record", () => openModal("Nueva Ficha Clínica", recordForm(), (fd) => {
    const list = load(STORAGE.clinicalRecords) || [];
    const pid = parseInt(fd.get("patientId"));
    list.push({ id: nextId(list), patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), date: fd.get("date"), symptoms: fd.get("symptoms"), diagnosis: fd.get("diagnosis"), treatment: fd.get("treatment"), weight: fd.get("weight"), temperature: fd.get("temperature"), observations: fd.get("observations") });
    save(STORAGE.clinicalRecords, list);
    closeModal(); toast("Ficha clínica guardada correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-record]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editRecord);
    const item = (load(STORAGE.clinicalRecords) || []).find((r) => r.id === id);
    openModal("Editar Ficha", recordForm(item), (fd) => {
      const pid = parseInt(fd.get("patientId"));
      const list = (load(STORAGE.clinicalRecords) || []).map((r) => r.id === id ? { ...r, patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), date: fd.get("date"), symptoms: fd.get("symptoms"), diagnosis: fd.get("diagnosis"), treatment: fd.get("treatment"), weight: fd.get("weight"), temperature: fd.get("temperature"), observations: fd.get("observations") } : r);
      save(STORAGE.clinicalRecords, list);
      closeModal(); toast("Ficha clínica guardada correctamente"); renderPage();
    });
  });

  document.querySelectorAll("[data-del-record]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar ficha?")) return;
    save(STORAGE.clinicalRecords, (load(STORAGE.clinicalRecords) || []).filter((r) => r.id !== parseInt(btn.dataset.delRecord)));
    renderPage();
  });

  // Vaccines
  bind("#btn-new-vaccine", () => openModal("Registrar Vacuna", vaccineForm(), (fd) => {
    const list = load(STORAGE.vaccines) || [];
    const pid = parseInt(fd.get("patientId"));
    list.push({ id: nextId(list), patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), vaccineName: fd.get("vaccineName"), applicationDate: fd.get("applicationDate"), nextDose: fd.get("nextDose"), batch: fd.get("batch"), observation: fd.get("observation") });
    save(STORAGE.vaccines, list);
    closeModal(); toast("Vacuna registrada correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-vaccine]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editVaccine);
    const item = (load(STORAGE.vaccines) || []).find((v) => v.id === id);
    openModal("Editar Vacuna", vaccineForm(item), (fd) => {
      const pid = parseInt(fd.get("patientId"));
      const list = (load(STORAGE.vaccines) || []).map((v) => v.id === id ? { ...v, patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), vaccineName: fd.get("vaccineName"), applicationDate: fd.get("applicationDate"), nextDose: fd.get("nextDose"), batch: fd.get("batch"), observation: fd.get("observation") } : v);
      save(STORAGE.vaccines, list);
      closeModal(); toast("Vacuna actualizada"); renderPage();
    });
  });

  document.querySelectorAll("[data-del-vaccine]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar vacuna?")) return;
    save(STORAGE.vaccines, (load(STORAGE.vaccines) || []).filter((v) => v.id !== parseInt(btn.dataset.delVaccine)));
    renderPage();
  });

  // Recipes
  bind("#btn-new-recipe", () => openModal("Nueva Receta", recipeForm(), (fd) => {
    const list = load(STORAGE.recipes) || [];
    const pid = parseInt(fd.get("patientId"));
    list.push({ id: nextId(list), patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), medication: fd.get("medication"), dose: fd.get("dose"), frequency: fd.get("frequency"), duration: fd.get("duration"), indications: fd.get("indications") });
    save(STORAGE.recipes, list);
    closeModal(); toast("Receta registrada correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-recipe]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editRecipe);
    const item = (load(STORAGE.recipes) || []).find((r) => r.id === id);
    openModal("Editar Receta", recipeForm(item), (fd) => {
      const pid = parseInt(fd.get("patientId"));
      const list = (load(STORAGE.recipes) || []).map((r) => r.id === id ? { ...r, patientId: pid, patientName: getPatientName(pid), vet: fd.get("vet"), medication: fd.get("medication"), dose: fd.get("dose"), frequency: fd.get("frequency"), duration: fd.get("duration"), indications: fd.get("indications") } : r);
      save(STORAGE.recipes, list);
      closeModal(); toast("Receta actualizada"); renderPage();
    });
  });

  document.querySelectorAll("[data-del-recipe]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar receta?")) return;
    save(STORAGE.recipes, (load(STORAGE.recipes) || []).filter((r) => r.id !== parseInt(btn.dataset.delRecipe)));
    renderPage();
  });

  // Inventory
  bind("#btn-new-inv", () => openModal("Agregar Producto", invForm(), (fd) => {
    const stock = parseInt(fd.get("stock"));
    if (stock < 0) { toast("Stock no puede ser negativo", "error"); return; }
    const list = load(STORAGE.inventory) || [];
    list.push({ id: nextId(list), name: fd.get("name"), category: fd.get("category"), stock, minStock: parseInt(fd.get("minStock")), price: parseFloat(fd.get("price")), expiry: fd.get("expiry"), supplier: fd.get("supplier") });
    save(STORAGE.inventory, list);
    closeModal(); toast("Producto agregado correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-inv]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editInv);
    const item = (load(STORAGE.inventory) || []).find((i) => i.id === id);
    openModal("Editar Producto", invForm(item), (fd) => {
      const stock = parseInt(fd.get("stock"));
      if (stock < 0) { toast("Stock no puede ser negativo", "error"); return; }
      const list = (load(STORAGE.inventory) || []).map((i) => i.id === id ? { ...i, name: fd.get("name"), category: fd.get("category"), stock, minStock: parseInt(fd.get("minStock")), price: parseFloat(fd.get("price")), expiry: fd.get("expiry"), supplier: fd.get("supplier") } : i);
      save(STORAGE.inventory, list);
      closeModal(); toast("Producto actualizado"); renderPage();
    });
  });

  document.querySelectorAll("[data-del-inv]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar producto?")) return;
    save(STORAGE.inventory, (load(STORAGE.inventory) || []).filter((i) => i.id !== parseInt(btn.dataset.delInv)));
    renderPage();
  });

  // Staff
  bind("#btn-new-staff", () => openModal("Agregar Personal", staffForm(), (fd) => {
    const list = load(STORAGE.staff) || [];
    list.push({ id: nextId(list), name: fd.get("name"), role: fd.get("role"), specialty: fd.get("specialty"), phone: fd.get("phone"), email: fd.get("email"), status: fd.get("status"), joinDate: fd.get("joinDate") });
    save(STORAGE.staff, list);
    closeModal(); toast("Personal registrado correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-staff]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editStaff);
    const item = (load(STORAGE.staff) || []).find((s) => s.id === id);
    openModal("Editar Personal", staffForm(item), (fd) => {
      const list = (load(STORAGE.staff) || []).map((s) => s.id === id ? { ...s, name: fd.get("name"), role: fd.get("role"), specialty: fd.get("specialty"), phone: fd.get("phone"), email: fd.get("email"), status: fd.get("status"), joinDate: fd.get("joinDate") } : s);
      save(STORAGE.staff, list);
      closeModal(); toast("Personal actualizado"); renderPage();
    });
  });

  document.querySelectorAll("[data-del-staff]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar personal?")) return;
    save(STORAGE.staff, (load(STORAGE.staff) || []).filter((s) => s.id !== parseInt(btn.dataset.delStaff)));
    renderPage();
  });

  // Payments
  bind("#btn-new-pay", () => openModal("Registrar Pago", payForm(), (fd) => {
    const amount = parseFloat(fd.get("amount"));
    if (amount < 0) { toast("Monto debe ser mayor o igual a 0", "error"); return; }
    const apptId = parseInt(fd.get("appointmentId"));
    const appt = (load(STORAGE.appointments) || []).find((a) => a.id === apptId);
    const list = load(STORAGE.payments) || [];
    list.push({ id: nextId(list), date: fd.get("date"), tutorName: fd.get("tutorName"), tutorEmail: fd.get("tutorEmail"), appointmentId: apptId, appointmentDesc: appt ? `${appt.procedure} — ${appt.patientName}` : "", amount, method: fd.get("method"), status: fd.get("status"), receipt: fd.get("receipt") });
    save(STORAGE.payments, list);
    closeModal(); toast("Pago registrado correctamente"); renderPage();
  }));

  document.querySelectorAll("[data-edit-pay]").forEach((btn) => btn.onclick = () => {
    const id = parseInt(btn.dataset.editPay);
    const item = (load(STORAGE.payments) || []).find((p) => p.id === id);
    openModal("Editar Pago", payForm(item), (fd) => {
      const amount = parseFloat(fd.get("amount"));
      if (amount < 0) { toast("Monto debe ser mayor o igual a 0", "error"); return; }
      const apptId = parseInt(fd.get("appointmentId"));
      const appt = (load(STORAGE.appointments) || []).find((a) => a.id === apptId);
      const list = (load(STORAGE.payments) || []).map((p) => p.id === id ? { ...p, date: fd.get("date"), tutorName: fd.get("tutorName"), tutorEmail: fd.get("tutorEmail"), appointmentId: apptId, appointmentDesc: appt ? `${appt.procedure} — ${appt.patientName}` : p.appointmentDesc, amount, method: fd.get("method"), status: fd.get("status"), receipt: fd.get("receipt") } : p);
      save(STORAGE.payments, list);
      closeModal(); toast("Pago actualizado"); renderPage();
    });
  });

  document.querySelectorAll("[data-del-pay]").forEach((btn) => btn.onclick = () => {
    if (!confirm("¿Eliminar pago?")) return;
    save(STORAGE.payments, (load(STORAGE.payments) || []).filter((p) => p.id !== parseInt(btn.dataset.delPay)));
    renderPage();
  });

  // Notifications
  bind("#btn-new-notif", () => openModal("Enviar Notificación", notifForm(), (fd) => {
    const list = load(STORAGE.notifications) || [];
    list.push({ id: nextId(list), type: fd.get("type"), title: fd.get("title"), message: fd.get("message"), recipient: fd.get("recipient"), status: "Enviada", date: fd.get("date") });
    save(STORAGE.notifications, list);
    closeModal(); toast("Notificación enviada correctamente"); renderPage();
  }));
}

function handleCaptureMode() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("capture")) return false;

  const view = params.get("view") || "login";
  if (view === "login") {
    clearSession();
    showLogin();
    return true;
  }

  const admin = USERS.find((u) => u.role === "ADMIN");
  setSession(admin);
  currentPage = MENU.some((m) => m.id === view) ? view : "dashboard";
  showApp();
  return true;
}

// ─── Init ───────────────────────────────────────────────────────────────────

function init() {
  seedData();

  document.querySelectorAll("#login-form input").forEach((el) => el.classList.add("bevel-in"));

  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#login-email").value.trim();
    const password = $("#login-password").value;
    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      $("#login-error").classList.remove("hidden");
      return;
    }
    $("#login-error").classList.add("hidden");
    setSession(user);
    showApp();
  });

  $("#btn-logout").addEventListener("click", () => {
    clearSession();
    showLogin();
    $("#login-email").value = "";
    $("#login-password").value = "";
  });

  if (handleCaptureMode()) return;

  const session = getSession();
  if (session) {
    const user = USERS.find((u) => u.email === session.email);
    if (user) {
      currentUser = user;
      showApp();
    } else {
      showLogin();
    }
  } else {
    showLogin();
  }
}

document.addEventListener("DOMContentLoaded", init);
