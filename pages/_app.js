import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import Heading from "components/Heading"

function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Heading />
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp
