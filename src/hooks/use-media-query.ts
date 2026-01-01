import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Estado para armazenar se a query corresponde
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Criar MediaQueryList
    const media = window.matchMedia(query);

    // Atualizar estado com o valor inicial
    setMatches(media.matches);

    // Definir callback para quando a media query mudar
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adicionar listener (usando addListener para compatibilidade)
    if (media.addEventListener) {
      media.addEventListener("change", handler);
    } else {
      // Fallback para navegadores mais antigos
      media.addListener(handler);
    }

    // Cleanup function
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handler);
      } else {
        // Fallback para navegadores mais antigos
        media.removeListener(handler);
      }
    };
  }, [query]); // Apenas query como dependência

  return matches;
}