# VidFlow – Instruccions

Document dividit en **Frontend**, **Backend** i **Execució**, amb només les funcionalitats **essencials** i el mínim necessari per entendre i posar en marxa el projecte.

---

# 1. FRONTEND (React + Vite + TypeScript)

## Funcionalitats principals
### **1. Autenticació (JWT)**
- Login / Register via `AuthModal`.
- `AuthProvider` gestiona token, usuari, `signIn`, `signUp`, `signOut`.
- `fetchMe()` per obtenir dades d’usuari des de `/user/me`.

### **2. Home**
- Carrega vídeos amb `useAllVideos()` (`GET /api/videos`).
- Seccions per categories (`Home`,`Recommended`, `Tots els videos`, `Contacte`).
- Sidebar amb navegació, login, i upload.

### **3. Visualització de vídeo (`/watch/:id`)**
- Reprodueix `<video>` HTML amb les URLs reals del backend.
- Likes:
    - `POST /api/videos/{id}/likes`
    - `DELETE /api/videos/{id}/likes`
- Comentaris:
    - Llistat des de `GET /api/videos/{id}`
    - Afegir comentari amb `POST /api/videos/{id}/comments`
- Subscripcions de canal:
    - `GET /api/channels/{username}/subscription`
    - `POST /api/channels/{username}/subscription`

### **4. Upload de vídeos**
- `UploadModal` envia `FormData` a:
    - `POST /api/videos`
- Utilitza token JWT per autoritzar.

### **5. Perfil d’usuari (`/profile`)**
- Actualitzar dades personals: `PUT /user/me`
- Canviar avatar: `POST /user/me/avatar`
- Canviar contrasenya: `POST /user/change-password`

---

# 2. BACKEND (Spring Boot 3 + JWT + JPA)

## Funcionalitats principals
### **1. Autenticació i gestió d’usuari**
- `POST /user/login` — retorna JWT.
- `POST /user/register` — crea usuari.
- `GET /user/me` — dades del compte.
- `PUT /user/me` — actualització de perfil.
- `POST /user/me/avatar` — upload imatge.
- `POST /user/change-password`.

### **2. Vídeos**
- `GET /api/videos` — llista de vídeos.
- `GET /api/videos/{id}` — detall complet (`likes`, `comments`, `thumbnailURL`, etc.).
- `POST /api/videos` — upload vídeo + thumbnail.
- `DELETE /api/videos/{id}` — eliminar vídeo del propietari.

### **3. Likes**
- `POST /api/videos/{id}/likes`
- `DELETE /api/videos/{id}/likes`
- Retornen el **detall de vídeo actualitzat**.

### **4. Comentaris**
- Inclòs dins `GET /api/videos/{id}`.
- Afegir comentari: `POST /api/videos/{id}/comments`.

### **5. Subscripcions**
- `GET /api/channels/{username}/subscription`
- `POST /api/channels/{username}/subscription`
- Retorna `{ subscribed: boolean }`.

---

# 3. EXECUCIÓ DEL PROJECTE

## Dependències i llibreries principals

### **Frontend**
- React 18
- React Router DOM
- Vite
- TypeScript
- react-icons
- JWT guardat en `localStorage`
- CSS modularitzat (home.css, profile.css, watch.css)

### **Backend**
- Spring Boot 3
- Spring Web
- Spring Security + JWT (HS512)
- JPA + Hibernate
- H2
- Maven
- Gestió de fitxers per vídeos/miniatures (`pro-tube.store-dir`)
- DTOs per vídeo, likes, comments, perfil

---

## Comandes d'execució

### **Backend**
```bash
mvn spring-boot:run
```
### **Frontend**
```bash
npm run dev
```
