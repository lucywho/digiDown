import Link from "next/link"
export default function Home() {
    return (
        <>
            <h1 className="h-60 flex flex-col justify-between items-center text-xl">
                <p>+++OUT OF CHEESE ERROR+++</p>
                <p>404 PAGE NOT FOUND</p>
                <p className="hover:underline hover:text-amber-400">
                    <Link href={`/`}>+++REDO FROM START+++</Link>
                </p>
            </h1>
        </>
    )
}
