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

            <header className="min-h-14 flex pt-5 px-5 pb-2 border-b-green-500">
                <div className="text-xl">
                    <p className="font-bold text-2xl">
                        digiDown<span className="blink"> _</span>
                    </p>
                </div>
                <div className="flex flex-row items-center justify-center w-full">
                    {router.asPath === "/" && (
                        <p className="text-amber-400 text-xl font-bold">
                            welcome
                        </p>
                    )}

                    {router.asPath === "/dashboard" && (
                        <p className="text-amber-400 text-xl font-bold uppercase">
                            dashboard
                        </p>
                    )}
                </div>

                <div className="grow ml-10 -mt-1"></div>

                {session && router.asPath !== "/dashboard" && (
                    <Link href={`/dashboard`}>
                        <a className="flex">
                            <p className="button max-h-10 mr-3 hover:underline hover:text-amber-400">
                                dashboard
                            </p>
                        </a>
                    </Link>
                )}

                {session && router.asPath !== "/" && (
                    <Link href={`/`}>
                        <a className="flex">
                            <p className="button max-h-10 mr-3 hover:underline hover:text-amber-400">
                                home
                            </p>
                        </a>
                    </Link>
                )}

                <a
                    className="button max-h-10"
                    href={session ? "/api/auth/signout" : "/api/auth/signin"}
                >
                    {session ? "logout" : "login"}
                </a>
            </header>
        </>
    )
}
