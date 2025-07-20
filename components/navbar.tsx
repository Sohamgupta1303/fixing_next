import Link from "next/link";
import React from "react";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";

async function handleSignIn() {
    "use server";
    await signIn('github');
}

async function handleSignOut() {
    "use server";
    await signOut({redirectTo : "/"});
}

const Navbar = async () => {
    const session = await auth()
    return (
        <div className="absolute top-3 right-6 z-50 nav-widget">

                <div className="flex items-center gap-5 text-black" >
                    {session && session ?.user ? (
                        <>
                            <Button className="nav-button">
                                <span className="hover:text-primary transition-colors">
                                    create
                                </span>
                            </Button>
                            <form action={handleSignOut}>
                                <Button className = "nav-button" type="submit">
                                    <span className="hover:text-primary transition-colors" >logout</span>
                                </Button>
                            </form>

                            <Link href={`/user/${session?.user?.id}`}>
                                <Button className="nav-button hover:text-primary transition-colors">
                                    {session?.user?.name}
                                </Button>
                            </Link>
                        </>
                    )  : (
                        <form action={handleSignIn}>
                            <button className = "nav-button" type="submit">
                                <span className="hover:text-primary transition-colors">login</span>
                            </button>
                        </form>
                    )}
                </div>
        </div>
    )
}

export default Navbar