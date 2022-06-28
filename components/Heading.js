import Head from "next/head"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Heading() {
    const router = useRouter()

    const { data: session, status } = useSession()

    const loading = status === "loading"

    if (loading) {
        return (
            <header className="min-h-14 flex pt-5 px-5 pb-2">
                <div className="text-xl">
                    <p className="font-bold text-2xl">digiDown</p>
                </div>
            </header>
        )
    }

    return (
        <>
            <Head>
                <title>digiDown</title>
                <meta name="description" content="digital downloads site" />
                <link rel="icon" href="./digid.ico" />
            </Head>

            <header className="min-h-14 flex pt-5 px-5 pb-2">
                <div className="text-xl">
                    <p className="font-bold text-2xl">digiDown</p>
                    {router.asPath === "/" ? (
                        <p>Welcome</p>
                    ) : (
                        <Link href={`/`}>
                            <a className="underline">Home</a>
                        </Link>
                    )}
                </div>

                <div className="grow ml-10 -mt-1"></div>

                {session &&
                    (router.asPath === "/dashboard" ? (
                        <a className="flex">
                            <p className="mr-3 font-bold">Dashboard</p>
                        </a>
                    ) : (
                        <Link href={`/dashboard`}>
                            <a className="flex">
                                <p className="mr-3 hover:underline hover:text-amber-400">
                                    Dashboard
                                </p>
                            </a>
                        </Link>
                    ))}
                <a
                    className="button"
                    href={session ? "/api/auth/signout" : "/api/auth/signin"}
                >
                    {session ? "logout" : "login"}
                </a>
            </header>
        </>
    )
}
