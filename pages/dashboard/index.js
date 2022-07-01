import Link from "next/link"
import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"
import prisma from "lib/prisma"
import { getProducts, getPurchases } from "lib/data"

export default function Dashboard({ products, purchases }) {
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
        <>
            {products.length === 0 && purchases.length === 0 && (
                <h1 className="flex justify-center mt-5 pt-5 font-bold text-amber-500 uppercase w-full">
                    when you upload or download files, they will appear here
                </h1>
            )}

            <div className="flex flex-col content-center justify-between w-2/3 mx-auto mt-5">
                {products.length > 0 && (
                    <>
                        <h1 className="flex justify-center mt-5 pt-5 font-bold text-amber-500 uppercase w-full">
                            your listed products
                        </h1>

                        {products.map((product, index) => (
                            <div
                                className="flex flex-row items-center justify-between mb-4"
                                key={index}
                            >
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        className="w-14 h-14 basis-1/10 flex-initial"
                                        alt="product image"
                                    />
                                ) : (
                                    <img
                                        src="/digid.ico"
                                        className="w-14 h-14 basis-1/10 border border-green-400 rounded-full"
                                        alt="default icon"
                                    />
                                )}
                                <p className="basis-3/10 font-bold">
                                    {product.title}
                                </p>

                                {product.free ? (
                                    <span className="bg-green-500 text-green-900 px-1 uppercase font-bold">
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
                                <Link href={`/product/${product.id}`}>
                                    <a className="button h-fit uppercase basis-1/10">
                                        View
                                    </a>
                                </Link>
                                <div className="text-amber-400">
                                    {product.purchases &&
                                        product.purchases.length > 0 && (
                                            <p className="mt-3 text-right">
                                                {product.purchases.length > 1
                                                    ? `${product.purchases.length} sales`
                                                    : `${product.purchases.length} sale`}
                                            </p>
                                        )}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {purchases.length > 0 && (
                    <>
                        <h1 className="flex justify-center mt-5 pt-5 font-bold text-amber-500 uppercase w-full">
                            your purchases
                        </h1>
                        {purchases.map((purchase, index) => (
                            <div
                                className="flex flex-row items-center justify-between mb-4"
                                key={index}
                            >
                                {purchase.product.image ? (
                                    <img
                                        src={purchase.product.image}
                                        className="w-14 h-14 basis-1/10 flex-initial"
                                        alt="product image"
                                    />
                                ) : (
                                    <img
                                        src="/digid.ico"
                                        className="w-14 h-14 basis-1/10 border border-green-400 rounded-full"
                                        alt="default icon"
                                    />
                                )}
                                <p className="basis-3/10 font-bold">
                                    {purchase.product.title}
                                </p>
                                {parseInt(purchase.amount) === 0 ? (
                                    <span className="bg-green-500 text-green-900 px-1 uppercase font-bold">
                                        free
                                    </span>
                                ) : (
                                    <p>€{purchase.amount / 100}</p>
                                )}{" "}
                                <a
                                    className="button h-fit uppercase basis-1/10"
                                    href={purchase.product.url}
                                >
                                    get files
                                </a>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return { props: {} }

    let products = await getProducts(
        { author: session.user.id, includePurchases: true },
        prisma
    )
    products = JSON.parse(JSON.stringify(products))

    let purchases = await getPurchases({ author: session.user.id }, prisma)
    purchases = JSON.parse(JSON.stringify(purchases))

    return {
        props: {
            products,
            purchases,
        },
    }
}
