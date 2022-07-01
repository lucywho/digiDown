import { getSession, useSession } from "next-auth/react"
import Link from "next/link"
import prisma from "lib/prisma"
import { getProducts } from "lib/data"

export default function Home({ products }) {
    return (
        <div>
            <div className="flex justify-center mt-5 pt-5 font-bold text-amber-500 uppercase w-full ">
                products available
            </div>
            <div className="flex flex-col w-full md:w-2/3 lg:w-3/5 mx-auto mt-1 ">
                {products &&
                    products.map((product, index) => (
                        <div
                            className="flex flex-row items-center justify-between mb-2 md:mb-4"
                            key={index}
                        >
                            <div className="w-10 md:w-14">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        className="w-10 h-10 md:w-14 md:h-14 mx-1 "
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
                            <p className="font-bold flex-grow ml-6">
                                {product.title}
                            </p>
                            <div className="w-14 mr-2 md:mr-4 text-left text-sm md:text-base font-bold">
                                {product.free ? (
                                    <span className="bg-green-500 text-green-900 px-2 uppercase">
                                        free
                                    </span>
                                ) : (
                                    <span className="">
                                        € {product.price / 100}
                                    </span>
                                )}
                            </div>
                            <div className="w-14 text-sm md:text-base">
                                <Link href={`/product/${product.id}`}>
                                    <a className="button h-fit uppercase ">
                                        View
                                    </a>
                                </Link>{" "}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    let products = await getProducts({ take: 4 }, prisma)
    products = JSON.parse(JSON.stringify(products))

    return {
        props: {
            products,
        },
    }
}
