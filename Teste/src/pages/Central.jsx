import { useState } from "react";
import * as XLSX from "xlsx";

import FileUpload from "../../components/FileUpload";
import ResultCard from "../../components/ResultCard";

export default function Central() {
  const [dados, setDados] = useState("");
  const [tipo, setTipo] = useState("brutos");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  function calcular() {
    setErro("");
    setResultado(null);

    if (!dados.trim()) {
      setErro("Insira os dados para realizar o cálculo.");
      return;
    }

    let numeros = [];

    if (tipo === "brutos") {
      numeros = dados
        .split(/[\n,;]+/)
        .map((valor) => valor.trim())
        .filter(Boolean)
        .map(Number);

      if (numeros.some((numero) => !Number.isFinite(numero))) {
        setErro("Informe apenas números válidos.");
        return;
      }
    }

    if (tipo === "frequencia") {
      const linhas = dados
        .trim()
        .split(/\r?\n/)
        .map((linha) => linha.trim())
        .filter(Boolean);

      for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        if (
          linha.toLowerCase() === "valor;frequencia" ||
          linha.toLowerCase() === "valor;frequência"
        ) {
          continue;
        }

        const partes = linha.split(";");

        if (partes.length !== 2) {
          setErro(
            `Linha ${i + 1} inválida. O formato deve ser valor;frequencia.`
          );
          return;
        }

        const valorTexto = partes[0].trim();
        const frequenciaTexto = partes[1].trim();

        const valor = Number(valorTexto);
        const frequencia = Number(frequenciaTexto);

        if (!Number.isFinite(valor)) {
          setErro(
            `O valor "${valorTexto}" na linha ${i + 1} não é válido.`
          );
          return;
        }

        if (
          !Number.isInteger(frequencia) ||
          frequencia <= 0
        ) {
          setErro(
            `A frequência "${frequenciaTexto}" na linha ${i + 1} deve ser um número inteiro maior que zero.`
          );
          return;
        }

        for (let j = 0; j < frequencia; j++) {
          numeros.push(valor);
        }
      }
    }

    if (numeros.length === 0) {
      setErro("Nenhum dado válido foi informado.");
      return;
    }

    const ordenados = [...numeros].sort((a, b) => a - b);

    const soma = numeros.reduce(
      (total, numero) => total + numero,
      0
    );

    const media = soma / numeros.length;

    const meio = Math.floor(ordenados.length / 2);

    const mediana =
      ordenados.length % 2 === 0
        ? (ordenados[meio - 1] + ordenados[meio]) / 2
        : ordenados[meio];

    const frequencias = {};

    numeros.forEach((numero) => {
      frequencias[numero] =
        (frequencias[numero] || 0) + 1;
    });

    const maiorFrequencia = Math.max(
      ...Object.values(frequencias)
    );

    const modas =
      maiorFrequencia > 1
        ? Object.keys(frequencias)
            .filter(
              (numero) =>
                frequencias[numero] === maiorFrequencia
            )
            .map(Number)
            .sort((a, b) => a - b)
        : [];

    setResultado({
      media: media.toFixed(2),
      mediana: mediana.toFixed(2),
      moda:
        modas.length > 0
          ? modas.join(", ")
          : "Não existe",
    });
  }

  function exportarResultado() {
    if (!resultado) return;

    const dadosExportacao = [
      ["Medida", "Resultado"],
      ["Média", resultado.media],
      ["Mediana", resultado.mediana],
      ["Moda", resultado.moda],
    ];

    const planilha =
      XLSX.utils.aoa_to_sheet(dadosExportacao);

    const csv = XLSX.utils.sheet_to_csv(planilha, {
      FS: ";",
    });

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "resultado-medidas-centrais.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function mudarTipo(novoTipo) {
    setTipo(novoTipo);
    setResultado(null);
    setErro("");
  }

  return (
    <div className="card">
      <h2>Medidas de Posição Central</h2>

      <FileUpload
        onDataLoaded={(conteudo) => {
          setDados(conteudo);
          setResultado(null);
          setErro("");
        }}
      />

      <textarea
        value={dados}
        onChange={(e) => {
          setDados(e.target.value);
          setResultado(null);
          setErro("");
        }}
        placeholder={
          tipo === "brutos"
            ? "Exemplo:\n1\n2\n2\n3\n3\n3\n4"
            : "Exemplo:\nvalor;frequencia\n2;3\n6;2\n7;6\n1;2"
        }
      />

      {erro && (
        <div className="erro">
          {erro}
        </div>
      )}

      <div className="actions">
        <button className="btn" onClick={calcular}>
          Calcular
        </button>

        {resultado && (
          <button
            className="btn success"
            onClick={exportarResultado}
          >
            Exportar CSV
          </button>
        )}
      </div>

      {resultado && (
        <div className="resultado">
          <ResultCard
            titulo="Média"
            valor={resultado.media}
          />

          <ResultCard
            titulo="Mediana"
            valor={resultado.mediana}
          />

          <ResultCard
            titulo="Moda"
            valor={resultado.moda}
          />
        </div>
      )}
    </div>
  );
}
