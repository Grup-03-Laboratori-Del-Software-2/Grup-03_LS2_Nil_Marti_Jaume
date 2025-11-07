import { render, screen, waitFor } from "@testing-library/react";
import { useAllVideos } from "../../utils/useAllVideos";

jest.mock("../../utils/Env", () => ({
    getEnv: () => ({
        API_BASE_URL: "http://api.local/api",
        MEDIA_BASE_URL: "http://api.local/media",
        __vite__: {},
    }),
}));

function Probe() {
    const { data, loading, error } = useAllVideos();
    if (loading) return <div>state:loading</div>;
    if (error) return <div>state:error:{String(error)}</div>;
    return <div>state:success len:{data.length}</div>;
}

describe("useAllVideos", () => {
    afterEach(() => {
        (global.fetch as jest.Mock | undefined)?.mockReset?.();
    });

    it("resuelve listado (success)", async () => {
        (global as any).fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                items: [
                    { id: 1, title: "A", thumbnail: "/t1.jpg" },
                    { id: 2, title: "B", thumbnail: "/t2.jpg" },
                ],
            }),
        });

        render(<Probe />);
        expect(screen.getByText("state:loading")).toBeInTheDocument();

        await waitFor(() =>
            expect(screen.getByText(/state:success len:2/)).toBeInTheDocument()
        );
    });

    it("gestiona error de API con fallback", async () => {
        (global as any).fetch = jest.fn().mockResolvedValue({
            ok: false,
            text: async () => "boom",
        });

        render(<Probe />);

        // El hook usa fallback → esperamos success con alguna longitud
        await waitFor(() => {
            const el = screen.getByText(/state:success len:/);
            expect(el).toBeInTheDocument();
        });
    });
});
