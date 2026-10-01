import type { DiaPrevisao } from "./types";

interface TelaPrevisaoProps {
  nomeCidade: string;
  dias: DiaPrevisao[];
  onVoltar: () => void;
}

function formatarData(dataISO: string): string {
  const data = new Date(`${dataISO}T00:00:00`);
  return data.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function TelaPrevisao({ nomeCidade, dias, onVoltar }: TelaPrevisaoProps) {
  return (
    <section className="tela-previsao">
      <button className="botao-voltar" type="button" onClick={onVoltar}>
        ← Voltar
      </button>
      <h2>Previsão para {nomeCidade}</h2>
      <ul className="lista-previsao">
        {dias.map((dia) => (
          <li key={dia.data}>
            <span>{formatarData(dia.data)}</span>
            <span>{dia.descricao}</span>
            <span>{Math.round(dia.temperaturaMax)}° / {Math.round(dia.temperaturaMin)}°</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TelaPrevisao;