import Link from "next/link";

/**
 * Chrome compartido por el portal público (mockup guide): header navy
 * de ancho completo con la marca. Cada page.tsx sigue envolviendo su
 * propio contenido en `.pagina` — este layout solo agrega la cabecera,
 * no toca el ancho de columna de lectura.
 */
export default function PortalPublicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="cabecera">
        <div className="cabecera__contenido">
          <Link href="/" className="cabecera__marca">
            RISC
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
