import React from 'react'
import Image from "next/image"

export default function EmptyPageInvestments() {
    return (
        <div className='flex justify-center items-center h-[24rem]'>
            <div>
                <Image
                    src="/EmptyPageInvestment.svg"
                    width={256}
                    height={256}
                    alt="Computador"

                />
                <h1 className='text-lg'>Sem resultados para essa pesquisa</h1>
            </div>

        </div>
    )
}
