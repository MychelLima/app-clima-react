interface FormularioBuscaProps {
  cidade: string;
  setCidade: (valor: string) => void;
  carregando: boolean;
  onSubmit: (evento: React.FormEvent) => void;
}

function FormularioBusca({ cidade, setCidade, carregando, onSubmit }: FormularioBuscaProps) {
  return (
    <form className="form-busca" onSubmit={onSubmit}>
      <input
        type="text"
        value={cidade}
        onChange={(evento) => setCidade(evento.target.value)}
      />
      <button type="submit" disabled={carregando}>
        {carregando ? "Carregando..." : "Buscar"}
      </button>
    </form>
  );
}

export default FormularioBusca;