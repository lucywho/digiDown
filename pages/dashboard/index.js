import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const loading = status === "loading"

    if (loading) {
        return <p className="loading">. . . loading</p>
    }

    if (!session) {
        router.push("/")
    }

    if (session && !session.user.name) {
        router.push("/setup")
    }

    return (
        <div>
            <h1 className="flex justify-center mt-20 text-xl">Dashboard</h1>

            <div className="flex justify-center mt-10">
                <Link href={`/dashboard/new`}>
                    <a className="button text-xl p-2">Create a new product</a>
                </Link>
            </div>
        </div>
    )
}
