import Link from "next/link"
import { useSession, getSession } from "next-auth/react"
import prisma from "lib/prisma"
import { getProduct, alreadyPurchased } from "lib/data"
import { useRouter } from "next/router"

export default function Product({ product, purchased }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const loading = status === "loading"

    if (loading) {
        return <p className="loading">. . . loading</p>
    }
    if (!product) {
        return <p className="loading">this product does not exist</p>
    }

    return (
        <div className="flex justify-center border border-green-500 flex flex-col w-full md:w-2/3 xl:w-1/3 mx-auto px-10 mt-10">
            <div className="flex justify-between py-10 ">
                {product.image ? (
                    <img
                        src={product.image}
                        className="w-14 h-14 flex-initial"
                        alt="product image"
                    />
                ) : (
                    <img
                        src="/digid.ico"
                        className="w-14 h-14 flex-initial border border-green-500 rounded-full"
                        alt="default icon"
                    />
                )}
                <div className="flex-1 ml-3">
                    <p className=" font-bold">{product.title}</p>
                    {product.free ? (
                        <span className="bg-green-500 text-green-900 px-1 uppercase font-bold">
                            free
                        </span>
                    ) : (
                        <p>${product.price / 100}</p>
                    )}
                </div>

                {!session && <p>login to download</p>}

                {session && (
                    <>
                        {purchased ? (
                            <div className="flex flex-col justify-center text-center button bg-green-500 text-green-900 w-1/4">
                                <p>already purchased</p>
                            </div>
                        ) : (
                            <>
                                {session.user.id !== product.author.id ? (
                                    <button
                                        className="text-sm border px-2 font-bold uppercase button"
                                        onClick={async () => {
                                            if (product.free) {
                                                await fetch("/api/download", {
                                                    body: JSON.stringify({
                                                        product_id: product.id,
                                                    }),
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                    method: "POST",
                                                })
                                                router.push("/dashboard")
                                            } else {
                                                const res = await fetch(
                                                    "/api/stripe/session",
                                                    {
                                                        body: JSON.stringify({
                                                            amount: product.price,
                                                            title: product.title,
                                                            product_id:
                                                                product.id,
                                                        }),
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        method: "POST",
                                                    }
                                                )

                                                const data = await res.json()

                                                if (data.status === "error") {
                                                    alert(data.message)
                                                    return
                                                }

                                                const sessionId = data.sessionId
                                                const stripePublicKey =
                                                    data.stripePublicKey

                                                const stripe =
                                                    Stripe(stripePublicKey)

                                                const { error } =
                                                    await stripe.redirectToCheckout(
                                                        {
                                                            sessionId,
                                                        }
                                                    )
                                            }
                                        }}
                                    >
                                        {product.free ? "DOWNLOAD" : "PURCHASE"}
                                    </button>
                                ) : (
                                    <div className="flex flex-col justify-center text-center button bg-green-500 text-green-900 w-1/4">
                                        <p>your product</p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
            <div className="mb-10">{product.description}</div>
            <div className="mb-10">
                sold by
                <Link href={`/profile/${product.author.id}`}>
                    <a className="font-bold underline ml-1">
                        {product.author.name}
                    </a>
                </Link>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    let product = await getProduct(context.params.id, prisma)
    product = JSON.parse(JSON.stringify(product))

    let purchased = null

    if (session) {
        purchased = await alreadyPurchased(
            { author: session.user.id, product: context.params.id },
            prisma
        )
    }

    return {
        props: {
            product,
            purchased,
        },
    }
}
