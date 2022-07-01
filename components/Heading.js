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
            <header className="min-h-14 flex pt-5 px-5">
                <div className="text-xl">
                    <p className="font-bold text-2xl">digiDown_</p>
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
                <script src="https://js.stripe.com/v3/" async></script>
            </Head>

            <header className="min-h-14 flex flex-col pt-1 px-1 md:flex-row md:pt-5 md:px-5">
                <div className="flex flex-row w-full justify-between pb-4">
                    <div className="text-xl">
                        <p className="flex flex-row font-bold text-2xl">
                            digiDown<span className="blink"> _</span>
                        </p>
                    </div>
                    <div className="flex flex-row items-center md:justify-center justify-end text-right">
                        {router.asPath === "/" && (
                            <p className="text-l md:text-xl uppercase ">
                                welcome,
                                {session && session.user.name
                                    ? ` ${session.user.name}`
                                    : "stranger"}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grow ml-5 -mt-1"></div>

                <div className="flex flex-row justify-end">
                    {session && router.asPath === "/dashboard" && (
                        <>
                            <Link href={`/dashboard/sales`}>
                                <a className="button max-h-10 mr-1 md:mr-3">
                                    sales
                                </a>
                            </Link>

                            <Link href={`/dashboard/new`}>
                                <a className="button max-h-10 whitespace-nowrap  mr-1 md:mr-3">
                                    <p>create new product</p>
                                </a>
                            </Link>
                        </>
                    )}

                    {session && router.asPath !== "/dashboard" && (
                        <Link href={`/dashboard`}>
                            <a className="flex">
                                <p className="button max-h-10 mr-1 md:mr-3 ">
                                    dashboard
                                </p>
                            </a>
                        </Link>
                    )}

                    {router.asPath !== "/" && (
                        <Link href={`/`}>
                            <a className="flex">
                                <p className="button max-h-10 mr-1 md:mr-3 ">
                                    home
                                </p>
                            </a>
                        </Link>
                    )}

                    <a
                        className="button max-h-10"
                        href={
                            session ? "/api/auth/signout" : "/api/auth/signin"
                        }
                    >
                        {session ? "logout" : "login"}
                    </a>
                </div>
            </header>
        </>
    )
}
