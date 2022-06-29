import { useState } from "react"
import { useSession, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import prisma from "lib/prisma"
import { getProduct } from "lib/data"

export default function Product({ product }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [title, setTitle] = useState(product.title)
    const [image, setImage] = useState(null)
    const [newproduct, setNewproduct] = useState(null)
    const [imageUrl, setImageUrl] = useState(product.image)
    const [description, setDescription] = useState(product.description)
    const [price, setPrice] = useState(product.price / 100)
    const [free, setFree] = useState(product.free)
    const [changedLink, setChangedLink] = useState(false)

    if (!product) {
        return <p className="loading">this product does not exist</p>
    }

    const loading = status === "loading"

    if (loading) {
        return <p className="loading">. . . loading</p>
    }

    if (session && !session.user.name) {
        router.push("/setup")
    }

    return (
        <>
            <div className="flex justify-center">
                <form
                    className="mt-4"
                    onSubmit={async (e) => {
                        e.preventDefault()

                        const body = new FormData()
                        body.append("id", product.id)
                        body.append("image", image)
                        body.append("product", newproduct)
                        body.append("title", title)
                        body.append("free", free)
                        body.append("price", price)
                        body.append("description", description)

                        await fetch("/api/edit", {
                            body,
                            method: "POST",
                        })

                        router.push("/dashboard")
                    }}
                >
                    <div className="flex-1 mb-5">
                        <div className="flex-1 mb-2">
                            product title (required)
                        </div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input mb-5"
                            required
                        />

                        <div className="relative flex items-start mt-2">
                            <div className="flex items-center h-5 ">
                                <input
                                    type="checkbox"
                                    checked={free}
                                    onChange={(e) => setFree(!free)}
                                />
                            </div>

                            <div className="ml-3 text-sm mb-2 ">
                                <label>check if the product is free</label>
                            </div>
                        </div>

                        {!free && (
                            <>
                                <div className="flex-1 mb-2">
                                    product price in € (required)
                                </div>
                                <input
                                    value={price}
                                    pattern="^\d*(\.\d{0,2})?$"
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="border p-1 mb-5 text-amber-900 appearance-none"
                                    required
                                />
                            </>
                        )}

                        <div className="flex-1 mb-2">description</div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24 text-amber-900"
                        />
                    </div>

                    <div className="text-sm ">
                        <label className="relative font-medium cursor-pointer  my-3 block">
                            <p className="">product image {image && "✅"}</p>{" "}
                            (800 x 450 suggested)
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                    if (
                                        event.target.files &&
                                        event.target.files[0]
                                    ) {
                                        if (
                                            event.target.files[0].size > 3072000
                                        ) {
                                            alert("Maximum size allowed is 3MB")
                                            return false
                                        }
                                        setImage(event.target.files[0])
                                        setImageUrl(
                                            URL.createObjectURL(
                                                event.target.files[0]
                                            )
                                        )
                                    }
                                }}
                            />
                        </label>
                        <img src={imageUrl} className="w-20 h-20" />
                    </div>

                    <div className="text-sm  ">
                        <label className="relative font-medium cursor-pointer  my-3 block">
                            <p className="">
                                product {product && `changed ✅`}
                            </p>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(event) => {
                                    if (
                                        event.target.files &&
                                        event.target.files[0]
                                    ) {
                                        if (
                                            event.target.files[0].size >
                                            20480000
                                        ) {
                                            alert(
                                                "Maximum size allowed is 20MB"
                                            )
                                            return false
                                        }
                                        setNewproduct(event.target.files[0])
                                        setChangedLink(true)
                                    }
                                }}
                            />
                        </label>
                        {!changedLink && (
                            <a className="underline" href={product.url}>
                                Link
                            </a>
                        )}
                    </div>
                    <div className="flex justify-center w-full">
                        <button
                            disabled={
                                title && product && (free || price)
                                    ? false
                                    : true
                            }
                            className={`button p-4 mt-6 mb-2 font-bold w-full  ${
                                title && (free || price)
                                    ? ""
                                    : "cursor-not-allowed text-gray-600 border-gray-600 hover:text-grey-600 hover:text-gray-600 hover:bg-green-900"
                            }`}
                        >
                            save changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return { props: {} }

    let product = await getProduct(context.params.id, prisma)
    product = JSON.parse(JSON.stringify(product))
    if (!product) {
        return { props: {} }
    }

    if (session.user.id !== product.author.id)
        return {
            props: {},
        }

    return {
        props: {
            product,
        },
    }
}
