"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../card";
import ProfileButtons from "./button";
import { IconType } from "./icons";
import { useRouter } from "next/navigation";
import { Logout } from "./icons/logout";
import { initialsGenerator } from "./initialsGenerator";
import { NextResponse } from "next/server";

type ProfileProps = {
  active: boolean;
};

export default function Profile({ active }: ProfileProps) {
  const { push } = useRouter();
  const [profile, setProfile] = useState({
    id: "user-email",
    name: "",
    email: "",
    items: [
      {
        id: "user-agency",
        title: "Agência",
        content: "0",
        icon: "Copy",
      },
      {
        id: "user-account",
        title: "Conta",
        content: "0",
        icon: "Copy",
      },
      {
        id: "user-instituition",
        title: "Instituição",
        content: "0",
        icon: "Copy",
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/wallet`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar dados da carteira");
        }

        const responseData = await response.json();
        setProfile({
          id: responseData.data.id,
          name: responseData.data.name,
          email: responseData.data.email,
          items: profile.items.map((item, index) => {
            if (index === 0)
              return { ...item, content: responseData.data.agency };
            if (index === 1)
              return { ...item, content: responseData.data.account };
            if (index === 2)
              return { ...item, content: responseData.data.organization };
            return item;
          }),
        });
        return NextResponse.json(responseData);
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    }

    fetchData();
  }, []);

  if (!active) {
    return null;
  }

  return (
    <div
      id="profile-modal"
      className="fixed top-[10.5rem] -right-[8.8rem] transform -translate-x-1/2 -translate-y-1/2 z-60"
    >
      <Card className="w-[22.5rem] h-[13.625rem] rounded-lg rounded-tr-none flex flex-col justify-center items-center gap-4 profile-modal">
        <CardHeader className="flex flex-row gap-3 items-center w-full">
          <div
            className="w-9 h-9 bg-[#475569] flex items-center justify-center text-white rounded-lg"
            id="profile-image"
          >
            {initialsGenerator(profile.name)}
          </div>
          <div className="flex flex-col justify-center h-full -mt-10">
            <CardTitle
              id="profile-username"
              className="text-[13px] text-[#1E293B] md:text-[13px] lg:text-[14px]"
            >
              {profile.name}
            </CardTitle>
            <ProfileButtons
              id={profile.id}
              key={profile.id}
              title={profile.email}
              content={profile.email}
              icon={"Copy" as IconType}
              separator={false}
              showContent={false}
            />
          </div>
        </CardHeader>
        <hr className="bg-[#F1F1F1] w-[88%] -mt-7" />
        <CardContent className="w-full">
          <div className="flex flex-row justify-between items-center w-full border-2 border-dashed border-gray-200 rounded-lg p-4 h-16">
            {profile.items.map((item, index) => (
              <ProfileButtons
                id={item.id}
                key={item.id}
                title={item.title}
                content={item.content}
                icon={item.icon as IconType}
                separator={index === profile.items.length - 1 ? false : true}
                showContent={true}
              />
            ))}
          </div>
        </CardContent>
        <hr className="bg-[#F1F1F1] w-[88%] -mt-7" />
        <CardFooter className="flex w-full justify-between">
          <button
            className="text-red-600 text-sm"
            onClick={() => push("/")}
            id="logout"
          >
            Sair
          </button>
          <button onClick={() => push("/")} id="logout-door">
            <Logout color="#E21B0C" />
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
