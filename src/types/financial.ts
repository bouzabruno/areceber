export interface FinancialRecord {
  CodFilial: number;
  PeriodoLetivo: number;
  Mes: string;
  CodTurma: string;
  DataVencimento: string;
  DataBaixa: string;
  RefLancamento: number;
  FormaPagamento: string;
  ClienteFornecedor: string;
  Historico: string;
  RA: number;
  SituacaoContrato: string;
  StatusFinanceiro: string;
  ValorOriginal: number;
  Bolsa: number;
  ValorLiquido: number;
}

export interface DashboardFilters {
  periodoLetivo?: number;
  mes?: string;
  codFilial?: number;
  statusFinanceiro?: string;
  formaPagamento?: string;
  situacaoContrato?: string;
}

export interface FinancialSummary {
  totalRecords: number;
  valorTotalOriginal: number;
  valorTotalLiquido: number;
  valorTotalBolsas: number;
}