# VidFlow – Instruccions

Document dividit en **Frontend**, **Backend** i **Execució**, amb només les funcionalitats **essencials** i el mínim necessari per entendre i posar en marxa el projecte.

---

# EXECUCIÓ DEL PROJECTE

## **Registre d'usuari**
Es recomana usar un usuari similar a l’exemple per complir el **patró de contrasenya** i millorar la seguretat:
- Email: tecnocampus@gmail.com
- Contrasenya: TecnoCampus12345?#

**Estrictament necessari l'ús d'aquests caràcters especials per donar-te d'alta.**

## Comandes d'execució

### **Backend**
```bash
mvn spring-boot:run
```
### **Frontend**
```bash
npm run dev
```

---

## Dependències i llibreries principals

### **Frontend**
- React 18
- Vite
- TypeScript
- CSS (home.css, profile.css, watch.css)

### **Backend**
- Spring Boot 3
- Spring Security + JWT (HS512)
- JPA + Hibernate
- H2
- Maven
- Gestió de fitxers per vídeos/miniatures (`pro-tube.store-dir`)
- DTOs per vídeo, likes, comments, perfil

---

# FRONTEND (React + Vite + TypeScript)

## Funcionalitats principals
### **1. Autenticació (JWT)**
- Login / Register via `AuthModal`.
- `useAuth` gestiona token, usuari, `signIn`, `signUp`, `signOut`.

### **2. Home**
- Carrega vídeos amb `useAllVideos()`.
- Seccions per categories (`Home`,`Recommended`, `Tots els videos`, `Contacte`).
- Sidebar amb navegació, login, i upload de vídeos.

### **3. Visualització de vídeo (`/watch/:id`)**
- Reprodueix `<video>` HTML amb les URLs reals del backend.
- Permet donar `Like` al vídeo.
- Si estàs amb un compte d'usuari es pot comentar sino no.
- Si estàs amb compte d'usuari et pots subscriure a un canal.

### **4. Upload de vídeos**
- `UploadModal` permet penjar vídeos.

### **5. Perfil d’usuari (`/profile`)**
- Actualitzar dades personals.
- Canviar avatar.
- Canviar contrasenya.

---

# BACKEND (Spring Boot 3 + JWT + JPA)

## Funcionalitats principals
### **1. Autenticació i gestió d’usuari**
- `POST /user/login` - retorna JWT.
- `POST /user/register` — crea usuari.
- `GET /user/me` — dades del compte.
- `PUT /user/me` — actualització de perfil.
- `POST /user/me/avatar` — upload imatge.
- `POST /user/change-password` - canviar contrasenya.

### **2. Vídeos**
- `GET /api/videos` — llista de vídeos.
- `GET /api/videos/{id}` — detall complet (`likes`, `comments`, `thumbnailURL`, etc.).
- `POST /api/videos` — upload vídeo + thumbnail.
- `DELETE /api/videos/{id}` — eliminar vídeo.

### **3. Likes**
- `POST /api/videos/{id}/likes`
- `DELETE /api/videos/{id}/likes`

### **4. Comentaris**
- Afegir comentari: `POST /api/videos/{id}/comments`.

### **5. Subscripcions**
- `GET /api/channels/{username}/subscription`
- `POST /api/channels/{username}/subscription`
