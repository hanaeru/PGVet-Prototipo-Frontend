# Publicar PGVet en GitHub Pages (gratis)

## Por qué sale el error 404

GitHub Pages busca **`index.html` en la raíz del repositorio**. El 404 aparece cuando:

- El repo solo tiene `README.md` y no subiste los archivos del sitio
- Los archivos están dentro de una subcarpeta (ej. `pgvet figma/index.html`)
- Pages está configurado en `/docs` pero los archivos están en `/`

## Estructura correcta del repo

La raíz del repositorio debe verse así:

```
index.html      ← obligatorio
styles.css
script.js
.nojekyll       ← evita problemas con Jekyll
README.md
```

**No** metas todo dentro de una carpeta extra.

## Pasos (desde cero)

### 1. Crear repo en GitHub

- Nombre sugerido: `pgvet`
- Público
- **No** marques "Add a README" si vas a subir esta carpeta entera

### 2. Subir estos archivos a la raíz

Desde PowerShell, en esta carpeta:

```powershell
cd "c:\Users\Hanane\Desktop\pgvet figma"
git init
git add index.html styles.css script.js .nojekyll README.md
git commit -m "Publicar sitio PGVet"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/pgvet.git
git push -u origin main
```

(Cambia `TU-USUARIO/pgvet` por tu repo real.)

### 3. Activar GitHub Pages

1. Repo en GitHub → **Settings** → **Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` → carpeta **`/ (root)`**
4. **Save**
5. Espera 1–3 minutos

### 4. URL del sitio

Si el repo se llama `pgvet`:

```
https://TU-USUARIO.github.io/pgvet/
```

Si el repo se llama `TU-USUARIO.github.io` (sitio personal):

```
https://TU-USUARIO.github.io/
```

## Comprobar que funciona

- Debe abrir la pantalla de **login PGVet** (fondo verde)
- Prueba: `admin@pgvet.cl` / `1234`

## Si sigue el 404

1. En GitHub, abre el repo y confirma que **`index.html` está en la raíz** (no dentro de otra carpeta)
2. Settings → Pages → branch `main`, folder **`/ (root)`**
3. Espera unos minutos y recarga con Ctrl+F5
4. La URL debe terminar en `/pgvet/` si el repo no es `usuario.github.io`
