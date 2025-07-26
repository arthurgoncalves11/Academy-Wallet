"use client";
import "../../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AcademySidebar } from "@/components/ui/sidebar/AcademySidebar";
import AcademyNavbar from "@/components/AcademyNavbar";
import { useEffect, useState } from "react";
import Shepherd from "shepherd.js";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
  token,
  name,
  id,
  isFirstAccess,
}: Readonly<{
  children: React.ReactNode;
  token: string;
  name: string;
  id: string;
  isFirstAccess: boolean;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);

  const patchFirstAccess = async () => {
    if (token) {
      try {
        await fetch(`http://localhost:3000/user/${id}/first-access`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error updating first access:", error);
      }
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      router.refresh();
    };

    handleRouteChange();
  }, [pathname, router]);

  useEffect(() => {
    console.log(isFirstAccess);
    if (pathname === "/wallet" && isFirstAccess) {
      setShowProfile(true);
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          cancelIcon: { enabled: false },
          highlightClass: "highlight-border",
          classes: "shepherd-theme-custom",
          modalOverlayOpeningPadding: 0,
          modalOverlayOpeningRadius: {
            topLeft: 10,
            topRight: 0,
            bottomLeft: 10,
            bottomRight: 10,
          },
          arrow: false,
        },
        keyboardNavigation: false,
      });

      const tourTimeout = setTimeout(() => {
        tour.addStep({
          id: "first-step",
          title: "Acesso a informações da conta",
          text: `Aqui você terá fácil acesso as informações da sua conta, caso queira visualizar ou copiar para compartilhar. É possível também editar sua foto de perfil e sair da conta.`,
          attachTo: {
            element: ".profile-modal",
            on: "bottom",
          },
          extraHighlights: [".first-step"],
          buttons: [
            {
              text: "Pular",
              action: () => {
                setShowProfile(false);
                patchFirstAccess();
                tour.cancel();
              },
              classes: "shepherd-button-secondary",
            },
            {
              text: "Próximo",
              action: () => {
                setShowProfile(false);
                tour.next();
              },
            },
          ],
        });

        tour.addStep({
          id: "second-step",
          title: "Conta corrente",
          text: `Aqui será possível visualizar o valor que está em conta \ncorrente`,
          attachTo: {
            element: ".account",
            on: "right-start",
          },
          buttons: [
            {
              text: "Pular",
              action: () => {
                setShowProfile(false);
                patchFirstAccess();
                tour.cancel();
              },
              classes: "shepherd-button-secondary",
            },
            {
              text: "Próximo",
              action: () => {
                tour.next();
              },
            },
          ],
          modalOverlayOpeningRadius: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
        });

        tour.addStep({
          id: "third-step",
          title: "Meus investimentos",
          text: `Você também poderá investir e acompanhar seus \ninvestimentos.`,
          attachTo: {
            element: ".investment",
            on: "bottom-start",
          },
          buttons: [
            {
              text: "Concluir",
              action: () => {
                patchFirstAccess();
                tour.complete();
              },
            },
          ],
          modalOverlayOpeningRadius: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 10,
            bottomRight: 10,
          },
        });

        tour.start();
      }, 10);

      return () => {
        tour.complete();
        clearTimeout(tourTimeout);
      };
    }
  }, [pathname]);

  return (
    <>
      <AcademyNavbar isOnBoarding={showProfile} personName={name} />
      <SidebarProvider className="bg-[#F7F8FA] flex justify-center ">
        <AcademySidebar />
        <main className="w-full max-h-full mt-20 mb-5 [&>*]:mx-10 [&>*]:rounded-2xl">
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
