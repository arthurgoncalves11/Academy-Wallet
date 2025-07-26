import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch('http://localhost:3000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 409) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'E-mail, CPF ou RG já cadastrados' },
        { status: 409 }
      );
    }
   
    if (!response.ok) {
      throw new Error('Erro ao cadastrar usuário');
    }
  
    const user = await response.json();
    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}