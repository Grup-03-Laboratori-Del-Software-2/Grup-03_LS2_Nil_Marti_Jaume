import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UploadModal from '../UploadModal';

afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockReset?.();
});

describe('UploadModal', () => {
  it('no renderiza nada si open es false', () => {
    const { container } = render(<UploadModal open={false} onClose={() => {}} token={null} username="user" />);
    expect(container.firstChild).toBeNull();
  });

  it('muestra error si faltan campos obligatorios y no llama a fetch', async () => {
    (global as any).fetch = jest.fn();

    render(<UploadModal open={true} onClose={() => {}} token={null} username="user" />);

    fireEvent.submit(screen.getByRole('button', { name: /Subir/i }));

    await waitFor(() => {
      expect(screen.getByText('Faltan campos obligatorios')).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('envía formulario correctamente y usa token en Authorization', async () => {
    const onClose = jest.fn();
    const onUploaded = jest.fn();

    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
    });

    render(<UploadModal open={true} onClose={onClose} token="my-token" username="tester" onUploaded={onUploaded} />);

    fireEvent.change(screen.getByLabelText(/Título/i), {
      target: { value: 'Mi vídeo' },
    });
    fireEvent.change(screen.getByLabelText(/Descripción/i), {
      target: { value: 'Una descripción' },
    });
    fireEvent.change(screen.getByLabelText(/Duración \(segundos\)/i), {
      target: { value: '120' },
    });

    const videoFile = new File(['dummy'], 'video.mp4', { type: 'video/mp4' });
    const thumbFile = new File(['dummy'], 'thumb.webp', { type: 'image/webp' });

    const videoInput = screen.getByLabelText(/Archivo de vídeo/i);
    const thumbInput = screen.getByLabelText(/Miniatura/i);

    fireEvent.change(videoInput, { target: { files: [videoFile] } });
    fireEvent.change(thumbInput, { target: { files: [thumbFile] } });

    fireEvent.submit(screen.getByRole('button', { name: /Subir/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/api/videos');
    expect((options as RequestInit).method).toBe('POST');
    expect((options as RequestInit).headers).toEqual({
      Authorization: 'Bearer my-token',
    });
    expect((options as RequestInit).body).toBeInstanceOf(FormData);

    expect(onUploaded).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('muestra error si el backend responde !ok', async () => {
    const onClose = jest.fn();

    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<UploadModal open={true} onClose={onClose} token={null} username="tester" />);

    const videoFile = new File(['dummy'], 'video.mp4', { type: 'video/mp4' });
    const thumbFile = new File(['dummy'], 'thumb.webp', { type: 'image/webp' });

    fireEvent.change(screen.getByLabelText(/Título/i), {
      target: { value: 'Mi vídeo' },
    });
    fireEvent.change(screen.getByLabelText(/Archivo de vídeo/i), {
      target: { files: [videoFile] },
    });
    fireEvent.change(screen.getByLabelText(/Miniatura/i), {
      target: { files: [thumbFile] },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Subir/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error al subir \(500\)/)).toBeInTheDocument();
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
