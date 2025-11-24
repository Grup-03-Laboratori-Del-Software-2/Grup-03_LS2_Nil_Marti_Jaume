import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './profile.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, updateAvatar, changePassword } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [surname, setSurname] = useState(user?.surname ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const maxDob = new Date().toISOString().slice(0, 10);

  if (!user) {
    return (
      <div className="pt-profile-page">
        <main className="pt-profile-main">
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </main>
      </div>
    );
  }

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // El input type="date" da "YYYY-MM-DD". Lo convertimos a LocalDateTime ISO.
    const dobIso = dateOfBirth ? `${dateOfBirth}T00:00:00` : null;

    await updateProfile({
      name,
      surname,
      email,
      dateOfBirth: dobIso,
    });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
  };

  const handleAvatarSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (avatarFile) {
      await updateAvatar(avatarFile);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || newPassword !== repeatPassword) return;
    await changePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setRepeatPassword('');
  };

  return (
    <div className="pt-profile-page">
      <header className="pt-profile-header">
        <button className="pt-profile-back" type="button" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1>Mi perfil</h1>
      </header>

      <main className="pt-profile-main">
        {/* Datos personales */}
        <section className="pt-profile-card">
          <h2>Datos personales</h2>
          <form className="pt-profile-form" onSubmit={handleProfileSubmit}>
            <div className="pt-field-row">
              <label>
                Nombre
                <input required value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Apellido
                <input required value={surname} onChange={(e) => setSurname(e.target.value)} />
              </label>
            </div>

            <label>
              Email
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
              Fecha de nacimiento
              <input type="date" max={maxDob} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </label>

            <button className="pt-profile-primary" type="submit">
              Guardar cambios
            </button>
          </form>
        </section>

        {/* Avatar */}
        <section className="pt-profile-card">
          <h2>Avatar</h2>
          <div className="pt-avatar-row">
            <img alt="Avatar" className="pt-avatar-preview" src={user.avatarURL || '/media/avatar.png'} />
            <form className="pt-avatar-form" onSubmit={handleAvatarSubmit}>
              <input
                accept="image/*"
                type="file"
                aria-label="Avatar"
                data-testid="file"
                onChange={handleAvatarChange}
              />
              <button className="pt-profile-secondary" type="submit">
                Actualizar avatar
              </button>
            </form>
          </div>
        </section>

        {/* Cambiar contraseña */}
        <section className="pt-profile-card">
          <h2>Cambiar contraseña</h2>
          <form className="pt-profile-form" onSubmit={handlePasswordSubmit}>
            <label>
              Contraseña actual
              <input
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>

            <label>
              Nueva contraseña
              <input
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <label>
              Repetir nueva contraseña
              <input
                type="password"
                autoComplete="new-password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </label>

            <button className="pt-profile-primary" type="submit">
              Cambiar contraseña
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
