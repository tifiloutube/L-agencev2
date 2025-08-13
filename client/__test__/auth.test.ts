import { POST } from '@/app/api/auth/[...nextauth]/route'

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(() => {
        return async (req: any) => {
            return new Response(
                JSON.stringify({ user: { id: '123', email: 'test@example.com' } }),
                { status: 200 }
            )
        }
    }),
}))

describe('Auth API Route', () => {
    it('retourne une session valide', async () => {
        const req = new Request('http://localhost/api/auth', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })

        const res = await POST(req)
        expect(res.status).toBe(200)

        const data = await res.json()
        expect(data).toEqual({
            user: { id: '123', email: 'test@example.com' },
        })
    })
})