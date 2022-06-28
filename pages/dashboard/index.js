import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const loading = status === "loading"

    if (loading) {
        return <p>. . . loading</p>
    }

    if (!session) {
        router.push("/")
    }

    if (session && !session.user.name) {
        router.push("/setup")
    }

    return (
        <div>
            <p>dashboard index</p>
        </div>
    )
}
