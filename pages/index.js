import { getSession, useSession } from "next-auth/react"
import Link from "next/link"
import prisma from "lib/prisma"
import { getProducts } from "lib/data"

export default function Home({ products }) {
    return (
        <div>
            <div className="flex justify-center mt-5 pt-5 font-bold text-amber-500 uppercase w-full border-t-2 border-green-500 ">
                products available
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
                                    alt="product image"
                                />
                            ) : (
                                <img
                                    src="/digid.ico"
                                    className="w-14 h-14 basis-1/10 border border-green-400 rounded-full"
                                    alt="default icon"
                                />
                            )}
                            <p className="flex font-bold w-1/4">
                                {product.title}
                            </p>
                            <p className="flex basis-2/5 w-1/2">
                                {product.description}
                            </p>

                            {product.free ? (
                                <span className="flex basis-1/10 bg-green-500 text-green-900 px-2 justify-center m-0">
                                    free
                                </span>
                            ) : (
                                <span className="flex basis-1/10 justify-center m-0">
                                    € {product.price / 100}
                                </span>
                            )}

                            <Link href={`/product/${product.id}`}>
                                <a className="button h-fit uppercase basis-1/10">
                                    View
                                </a>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    let session = await getSession(context)
    if (!session) return { props: {} }

    let products = await getProducts(session, prisma)
    products = JSON.parse(JSON.stringify(products))

    return {
        props: {
            products,
        },
    }
}
