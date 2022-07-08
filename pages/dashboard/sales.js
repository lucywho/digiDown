import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"

import prisma from "lib/prisma"
import { getSales } from "lib/data"

export default function Sales({ sales }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    const loading = status === "loading"

    if (loading) {
        return <p className="loading">. . . loading</p>
    }

    if (!session) {
        router.push("/")
        return null
    }

    if (session && !session.user.name) {
        router.push("/setup")
        return null
    }
    return (
        <>
            <h1 className="w-full text-center text-amber-500 text-2xl font-bold mt-5 uppercase">
                Sales
            </h1>
            <h3 className="flex justify-center mt-5 text-lg mb-10">
                Total earned $
                {sales.reduce((accumulator, sale) => {
                    return accumulator + parseFloat(sale.amount)
                }, 0) / 100}
            </h3>

            {sales.length > 0 && (
                <div className="flex flex-col w-full">
                    {sales.map((sale, index) => (
                        <div
                            className="border flex justify-between w-full md:w-2/3  mx-auto py-5 "
                            key={index}
                        >
                            {sale.product.image && (
                                <img
                                    src={sale.product.image}
                                    className="w-14 h-14 flex-initial"
                                />
                            )}

                            <div className="ml-3 flex-1">
                                <p>{sale.product.title}</p>
                                {parseInt(sale.amount) === 0 ? (
                                    <span className="bg-green-500 text-green-900 px-1 uppercase font-bold">
                                        free
                                    </span>
                                ) : (
                                    <p>${sale.amount / 100}</p>
                                )}
                            </div>

                            <div className="">
                                <p className="text-sm p-2">
                                    {sale.author.name}
                                    <br />
                                    {sale.author.email}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return { props: {} }

    let sales = await getSales({ author: session.user.id }, prisma)
    sales = JSON.parse(JSON.stringify(sales))

    return {
        props: {
            sales,
        },
    }
}
