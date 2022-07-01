import { useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

export default function NewProduct() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [image, setImage] = useState(null)
    const [product, setProduct] = useState(null)
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [free, setFree] = useState(false)

    const loading = status === "loading"

    if (loading) {
        return <p className="loading">. . . loading</p>
    }

    if (!session) {
        router.push("/")
    }

    return (
        <div>
            <h1 className="flex justify-center text-2xl font-bold text-amber-400">
                create a new product
            </h1>

            <div className="flex justify-center">
                <form
                    className="mt-4"
                    onSubmit={async (e) => {
                        e.preventDefault()

                        const body = new FormData()
                        body.append("image", image)
                        body.append("product", product)
                        body.append("title", title)
                        body.append("free", free)
                        body.append("price", price)
                        body.append("description", description)

                        await fetch("/api/new", {
                            body,
                            method: "POST",
                        })

                        router.push(`/dashboard`)
                    }}
                >
                    <div className="flex-1 mb-5">
                        <div className="flex-1 mb-2">
                            product title (required)
                        </div>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            className="mb-5 text-amber-900"
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
                                    pattern="^\d*(\.\d{0,2})?$"
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="border p-1 mb-5 text-amber-900 appearance-none"
                                    required
                                />
                            </>
                        )}
                        <div className="flex-1 mb-2">description</div>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full  text-amber-900"
                        />
                    </div>

                    <div className="text-sm  ">
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
                                    }
                                }}
                            />
                        </label>
                    </div>

                    <div className="text-sm  ">
                        <label className="relative font-medium cursor-pointer  my-3 block">
                            <p className="">product {product && "✅"}</p>{" "}
                            (required)
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
                                        setProduct(event.target.files[0])
                                    }
                                }}
                            />
                        </label>
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
                            create product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
