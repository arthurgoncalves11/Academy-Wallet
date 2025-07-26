interface TokenData {
  token: string;
  idWallet: string;
}

export const getTokenFromCookies = (): TokenData | null => {
  try {
    const cookieObj = document.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

    const token = cookieObj.token;
    if (!token) throw new Error('Token não encontrado nos cookies');

    const payload = JSON.parse(atob(token.split('.')[1]));
    const idWallet = payload.idWallet;

    if (!idWallet) throw new Error('idWallet não encontrado no token');
    if (payload.exp * 1000 < Date.now()) throw new Error('Token expirado');

    return { token, idWallet };
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const tokenData = getTokenFromCookies();
  if (!tokenData?.token) throw new Error("Token não encontrado ou expirado");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${tokenData.token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

  return response.json();
};

export { fetchWithAuth };
