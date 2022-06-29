import Link from "next/link"
import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"
import prisma from "lib/prisma"
import { getProducts } from "lib/data"

export default function Dashboard({ products }) {
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
            <h1 className="flex justify-center mt-5 text-xl">Dashboard</h1>

            <div className="flex justify-center my-5 ">
                <Link href={`/dashboard/new`}>
                    <p className="button text-xl p-2">create a new product</p>
                </Link>
            </div>

            <div className="flex justify-center mt-5 pt-5 font-bold text-amber-500 uppercase w-full border-t-2 border-green-500 ">
                your listed products
            </div>
            <div className="flex flex-col content-center justify-between w-2/3 mx-auto mt-5">
                {products &&
                    products.map((product, index) => (
                        <div
                            className="flex flex-row items-center justify-between mb-4"
                            key={index}
                        >
                            {product.image ? (
                                <img
                                    src={product.image}
                                    className="w-14 h-14 basis-1/10"
                                />
                            ) : (
                                <img
                                    src="/digid.ico"
                                    className="w-14 h-14 basis-1/10 border border-green-400 rounded-full"
                                />
                            )}
                            <p className="basis-3/10 font-bold">
                                {product.title}
                            </p>
                            <p className="basis-2/5 ">{product.description}</p>

                            {product.free ? (
                                <span className="basis-1/10 bg-green-500 text-green-900 px-2">
                                    free
                                </span>
                            ) : (
                                <span className="basis-1/10 ">
                                    € {product.price / 100}
                                </span>
                            )}
                            <Link href={`/dashboard/product/${product.id}`}>
                                <a className="button h-fit uppercase basis-1/10">
                                    Edit
                                </a>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return { props: {} }
    let products = await getProducts({ author: session.user.id }, prisma)
    products = JSON.parse(JSON.stringify(products))

    return {
        props: {
            products,
        },
    }
}
