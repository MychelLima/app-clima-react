import type { Clima } from "./types";

interface CartaoClimaProps {
  clima: Clima;
  carregandoPrevisao: boolean;
  onVerPrevisao: () => void;
}

function CartaoClima({ clima, carregandoPrevisao, onVerPrevisao }: CartaoClimaProps) {
  return (
    <section className="cartao-clima">
      <h2>{clima.cidade}</h2>
      <p className="temperatura">{Math.round(clima.temperatura)}°C</p>
      <p className="descricao">{clima.descricao}</p>
      <button
        className="botao-secundario"
        type="button"
        onClick={onVerPrevisao}
        disabled={carregandoPrevisao}
      >
        {carregandoPrevisao ? "Carregando..." : "Ver previsão dos próximos dias"}
      </button>
    </section>
  );
}

export default CartaoClima;