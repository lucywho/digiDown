import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "lib/prisma"

let data

if (process.env.NODE_ENV === "development") {
    data = {
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
    }
} else {
    data = {
        server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        },
        from: process.env.EMAIL_FROM,
    }
}

export default NextAuth({
    providers: [EmailProvider(data)],

    database: process.env.DATABASE_URL,
    secret: process.env.SECRET,

    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    debug: true,
    adapter: PrismaAdapter(prisma),

    callbacks: {
        session: async ({ session, user }) => {
            session.user.id = user.id
            session.user.image = user.image
            session.user.username = user.username
            session.user.name = user.name
            return Promise.resolve(session)
        },
    },
})
