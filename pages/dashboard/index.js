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
        return null
    }

    if (session && !session.user.name) {
        router.push("/setup")
        return null
    }

    return (
        <>
            {router.asPath === "/dashboard" && (
                <p className="w-full text-center text-amber-500 text-2xl font-bold uppercase mt-5 md:mb-5">
                    dashboard
                </p>
            )}
            {products.length === 0 && purchases.length === 0 && (
                <h1 className="flex justify-center mt-5 pt-5 text-amber-500 uppercase w-full">
                    when you upload or download files, they will appear here
                </h1>
            )}

            <div className="flex flex-col w-full md:w-3/5 lg:w-3/5  md:mx-auto mt-1">
                {products.length > 0 && (
                    <>
                        <h1 className="flex justify-center font-bold text-amber-500 uppercase w-full md:mb-4">
                            your listed products
                        </h1>
                        {products.map((product, index) => (
                            <div
                                className="flex flex-row items-center justify-between my-2 md:mb-4 h-fit border-b pb-4 border-green-500"
                                key={index}
                            >
                                <div className="w-14 pl-1  md:pl-0">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            className="w-10 h-10 md:w-14 md:h-14 "
                                            alt="product image"
                                        />
                                    ) : (
                                        <img
                                            src="/digid.ico"
                                            className="w-10 h-10 md:w-14 md:h-14 mx-1 border border-green-400 rounded-full"
                                            alt="default icon"
                                        />
                                    )}
                                </div>
                                <div className="flex-grow ml-6 ">
                                    <p className="font-bold text-left">
                                        {product.title}
                                    </p>
                                    <div className="text-amber-400">
                                        {product.purchases &&
                                            product.purchases.length > 0 && (
                                                <p className="text-left pt-1">
                                                    {product.purchases.length >
                                                    1
                                                        ? `${product.purchases.length} sales`
                                                        : `${product.purchases.length} sale`}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <div className="w-14 mr-2 text-left  font-bold text-sm md:text-base">
                                    {product.free ? (
                                        <span className="bg-green-500 text-green-900 px-2 mt-0 uppercase">
                                            free
                                        </span>
                                    ) : (
                                        <span className="">
                                            € {product.price / 100}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-col text-sm md:text-base w-26 md:w-28 max-h-full justify-between">
                                    <Link
                                        href={`/dashboard/product/${product.id}`}
                                    >
                                        <a className="button h-fit uppercase mr-1">
                                            Edit
                                        </a>
                                    </Link>
                                    <Link href={`/product/${product.id}`}>
                                        <a className="button h-fit uppercase">
                                            View
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {purchases.length > 0 && (
                    <>
                        <h1 className="flex justify-center font-bold text-amber-500 uppercase w-full md:my-4 ">
                            your purchases
                        </h1>
                        {purchases.map((purchase, index) => (
                            <div
                                className="flex flex-row items-center justify-between my-2 md:mb-4 h-fit border-b pb-4 border-green-500"
                                key={index}
                            >
                                <div className="w-10 md:w-14">
                                    {purchase.product.image ? (
                                        <img
                                            src={purchase.product.image}
                                            className="w-10 h-10 md:w-14 md:h-14 "
                                            alt="product image"
                                        />
                                    ) : (
                                        <img
                                            src="/digid.ico"
                                            className="w-10 h-10 md:w-14 md:h-14 border border-green-400 rounded-full"
                                            alt="default icon"
                                        />
                                    )}
                                </div>
                                <p className="flex-grow font-bold ml-6 text-left">
                                    {purchase.product.title}
                                </p>
                                <div className="w-14 mr-2 md:mr-4 text-right text-sm md:text-base font-bold">
                                    {parseInt(purchase.amount) === 0 ? (
                                        <span className="bg-green-500 text-green-900 px-1 uppercase font-bold">
                                            free
                                        </span>
                                    ) : (
                                        <p>€{purchase.amount / 100}</p>
                                    )}{" "}
                                </div>

                                <a
                                    className="button h-fit uppercase text-center text-sm md:text-base whitespace-nowrap w-26 md:w-28"
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
