import Image from "next/image";

export function Header() {
    return (
        <header className="w-full h-12 px-4 md:px-20 top-0 flex items-end justify-center">
            <div className="w-full max-w-[1440px] flex items-center justify-end pb-1">
               <Image
               id="logo-header"
               src="/logo-hat.svg"
               alt="Logo da fintech Academy Wallet, representando um chapéu de graduação estilizado, simbolizando educação financeira e aprendizado"
               title="Logo da fintech Academy Wallet"
               width={32}
               height={30}
               className="w-auto h-auto"
               />
            </div>
        </header>
    )
}