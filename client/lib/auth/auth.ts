import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../prisma/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user || !user.password) return null

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}