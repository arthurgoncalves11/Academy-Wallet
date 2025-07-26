import "../../globals.css";
import { cookies } from "next/headers";
import RootLayout from "./layoutWrapper";

export default async function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    let personName = "";
    let id = "";
    let isFirstAccess = false;

    if (token) {
        try {
            const response = await fetch(`http://localhost:3000/user/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store", // This ensures the request isn't cached
            });

            const { data } = await response.json();
            personName = data.name;
            id = data.id;
            isFirstAccess = data.firstAccess ?? false;
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }

    return (
        <RootLayout token={token || ""} id={id} isFirstAccess={isFirstAccess} name={personName}>
            {children}
        </RootLayout>
    );
}
