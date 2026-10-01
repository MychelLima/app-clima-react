import { useState } from "react";
import "./App.css";
import FormularioBusca from "./FormularioBusca";
import CartaoClima from "./CartaoClima";
import TelaPrevisao from "./TelaPrevisao";
import type { Clima, DiaPrevisao } from "./types";

const descricoesClima: Record<number, string> = {
  0: "Céu limpo",
  1: "Predominantemente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  61: "Chuva fraca",
  63: "Chuva moderada",
  65: "Chuva forte",
  80: "Pancadas de chuva",
  95: "Tempestade",
};

type Tela = "clima" | "previsao";

interface RespostaClima {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

interface RespostaGeocoding {
  results?: {
    name: string;
    latitude: number;
    longitude: number;
  }[];
}

interface RespostaPrevisao {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}


function App() {

    const [tela, setTela] = useState<Tela>("clima");
    const [previsao, setPrevisao] = useState<DiaPrevisao[]>([]);
    const [cidade, setCidade] = useState("");
    const [climaAtual, setClimaAtual] = useState<Clima | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [carregandoPrevisao, setCarregandoPrevisao] = useState(false);

    async function handleSubmit (evento: React.FormEvent) {

      try {

        setCarregando(true);

        evento.preventDefault();

        const textoCidade = cidade.trim();
        if (textoCidade === "") return;

        const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(textoCidade)}`;
        const respostaGeocoding = await fetch(urlGeocoding);
        const dadosGeocoding: RespostaGeocoding = await respostaGeocoding.json();

        if (!dadosGeocoding.results) {
          alert("Cidade não encontrada.");
          return;
        }

        const { latitude, longitude, name } = dadosGeocoding.results[0];
        const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
        const respostaClima = await fetch(urlClima);
        const dadosClima: RespostaClima = await respostaClima.json();
        
        setClimaAtual({
          cidade: name,
          temperatura: dadosClima.current.temperature_2m,
          descricao: descricoesClima[dadosClima.current.weather_code] ?? "Condição desconhecida",
          latitude: latitude,
          longitude: longitude,
        });

        setTela("clima");

      } catch (erro) {
        alert("Não foi possível buscar o clima. Verifique sua conexão e tente de novo.");
      } finally {
        setCarregando(false);
      }
    }

    async function handleVerPrevisao() {

      try{

        if (!climaAtual) return;

        const urlPrevisao = `https://api.open-meteo.com/v1/forecast?latitude=${climaAtual.latitude}&longitude=${climaAtual.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const respostaPrevisao = await fetch(urlPrevisao);
        const dadosPrevisao: RespostaPrevisao = await respostaPrevisao.json();

        const dias: DiaPrevisao[] = dadosPrevisao.daily.time.map((data, i) => ({
          data,
          temperaturaMax: dadosPrevisao.daily.temperature_2m_max[i],
          temperaturaMin: dadosPrevisao.daily.temperature_2m_min[i],
          descricao: descricoesClima[dadosPrevisao.daily.weather_code[i]] ?? "Condição desconhecida",
        }));

        setPrevisao(dias);
        setTela("previsao");  

      }catch(erro){
        alert("Não foi possível carregar a previsão. Verifique sua conexão e tente de novo.");

      }finally{
        setCarregandoPrevisao(false);
      }

    }

    return (

      <div className="app">
        <h1>App do Clima</h1>

        <FormularioBusca
          cidade={cidade}
          setCidade={setCidade}
          carregando={carregando}
          onSubmit={handleSubmit}
        />

        {climaAtual && tela === "clima" && (
          <CartaoClima
            clima={climaAtual}
            carregandoPrevisao={carregandoPrevisao}
            onVerPrevisao={handleVerPrevisao}
          />
        )}

        {tela === "previsao" && climaAtual && (
          <TelaPrevisao
            nomeCidade={climaAtual.cidade}
            dias={previsao}
            onVoltar={() => setTela("clima")}
          />
        )}

      </div>
    );
  }


export default App;