import Link from "next/link";
import React from "react";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";
import { Home, LogOut, Plus, User, User2 } from "lucide-react";

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
                            
                            <Button asChild className="nav-button cursor-pointer hover:text-primary transition-colors">
                                <Link href={"/"}>
                                    <Home/>
                                </Link>
                            </Button>
                            
                            <Button asChild className="nav-button hover:text-primary transition-colors cursor-pointer">
                                <Link href={"/create"}>
                                    <Plus/>
                                </Link>
                            </Button>
                            <form action={handleSignOut}>
                                <Button className="nav-button cursor-pointer hover:text-primary transition-colors" type="submit">
                                    <LogOut/>
                                </Button>
                            </form>

                            <Button asChild className="nav-button hover:text-primary transition-colors cursor-pointer">
                                <Link href={`/user/${session?.user?.id}`}>
                                    <User/>
                                </Link>
                            </Button>
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