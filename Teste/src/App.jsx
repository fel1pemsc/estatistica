import { useState } from "react";
import Home from "./pages/Home";
import Central from "./pages/Central";

function App() {

  const [pagina, setPagina] =
    useState("home");

  return (
    <>
      <header className="header">

        <h1>
          Estatística Descritiva
        </h1>

        <nav>

          <button
            onClick={() =>
              setPagina("home")
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              setPagina("central")
            }
          >
            Calculadora
          </button>

        </nav>

      </header>

      <main className="conteudo">

        {pagina === "home" &&
          <Home />
        }

        {pagina === "central" &&
          <Central />
        }

      </main>
    </>
  );
}

export default App;