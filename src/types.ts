export interface Clima {
  cidade: string;
  latitude: number;
  longitude: number;
  temperatura: number;
  descricao: string;
}

export interface DiaPrevisao {
  data: string;
  temperaturaMax: number;
  temperaturaMin: number;
  descricao: string;
}