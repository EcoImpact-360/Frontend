import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Container from "./Container";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-6 sm:py-10">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
