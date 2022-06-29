import Link from "next/link"

import prisma from "lib/prisma"
import { getProducts, getUser } from "lib/data"

export default function Profile({ user, products }) {
    if (!user) return <p className="loading">this user does not exist</p>

    return (
        <>
            <h1 className="flex justify-center text-xl md:text-2xl font-bold text-amber-400 md:mb-5">
                {products
                    ? `products listed by ${user.name}`
                    : `${user.name} has not listed any products`}
            </h1>

            <div className="flex flex-col w-full ">
                {products &&
                    products.map((product, index) => (
                        <div
                            className="border border-green-500 flex justify-between w-full md:w-2/3  mx-auto px-4 my-2 py-5 "
                            key={index}
                        >
                            {product.image ? (
                                <img
                                    src={product.image}
                                    className="w-14 h-14 flex-initial"
                                    alt="product image"
                                />
                            ) : (
                                <img
                                    src="/digid.ico"
                                    alt="default icon"
                                    className="w-14 h-14 flex-initial border border-green-500 rounded-full"
                                />
                            )}
                            <div className="flex-1 ml-3">
                                <p className="font-bold">{product.title}</p>
                                {product.free ? (
                                    <span className="bg-green-500 text-green-900 px-1 uppercase font-bold">
                                        free
                                    </span>
                                ) : (
                                    <p>${product.price / 100}</p>
                                )}
                            </div>
                            <div className="flex-1 mx-2">
                                {product.description}
                            </div>
                            <div className="">
                                <Link href={`/product/${product.id}`}>
                                    <a className="button text-sm border p-2 font-bold uppercase ml-2">
                                        view
                                    </a>
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    let user = await getUser(context.params.id, prisma)
    user = JSON.parse(JSON.stringify(user))
    if (!user) return { props: {} }

    let products = await getProducts({ author: context.params.id }, prisma)
    products = JSON.parse(JSON.stringify(products))

    return {
        props: {
            user,
            products,
        },
    }
}
