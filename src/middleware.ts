import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = { matcher: ["/dashboard/:path*", "/members/:path*", "/attendance/:path*", "/events/:path*", "/chat/:path*"] }
