import { Link } from "react-router-dom";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 mt-10">
      <Container className="py-8 flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
        <div className="max-w-sm">
          <h2 className="font-semibold text-black">EcoImpact 360</h2>
          <p className="text-sm text-black/60 mt-2">
            Plataforma educativa para visualizar y reducir el impacto ambiental en
            centros formativos.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-black">Enlaces</span>
          <Link to="/" className="text-black/70 hover:text-black">
            Contacto
          </Link>
          <Link to="/" className="text-black/70 hover:text-black">
            Enlaces
          </Link>
          <Link to="/" className="text-black/70 hover:text-black">
            About
          </Link>
        </div>

        <div className="text-sm text-black/60">
          <p>© 2026 EcoImpact 360</p>
          <p>Proyecto educativo Hackathon F5.</p>
        </div>
      </Container>
    </footer>
  );
}
