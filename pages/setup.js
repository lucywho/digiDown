import { useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

export default function Setup() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const loading = status === "loading"

    const [name, setName] = useState("")

    if (!session || !session.user) return null

    if (loading) return <p>. . . loading</p>

    if (!loading && session.user.name) {
        router.push("/dashboard")
    }

    return (
        <form
            className="mt-10 text-center"
            onSubmit={async (e) => {
                e.preventDefault()

                await fetch("/api/setup", {
                    body: JSON.stringify({
                        name,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                })

                session.user.name = name
                router.push("/dashboard")
            }}
        >
            <h1 className="flex justify-center mt-20 text-xl">Welcome!</h1>

            <div className="flex-1 mb-5 mt-20">
                <div className="flex-1 mb-5">please enter your name</div>
                <input
                    type="text"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    className="my-2 p-2 text-amber-900"
                    required
                />
            </div>

            <button className="button">save</button>
        </form>
    )
}
