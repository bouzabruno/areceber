import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Users,
  CreditCard,
  Calendar,
  Target
} from 'lucide-react';
import { FinancialSummary } from '@/types/financial';
import { useFinancialData } from '@/hooks/useFinancialData';

interface FinancialInsightsProps {
  summary: FinancialSummary;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const FinancialInsights = ({ summary }: FinancialInsightsProps) => {
  const { data: filteredData } = useFinancialData();

  // Análise de inadimplência
  const ticketMedio = summary.totalRecords > 0 ? summary.valorTotalOriginal / summary.totalRecords : 0;
  const percentualBolsas = summary.valorTotalOriginal > 0 ? (summary.valorTotalBolsas / summary.valorTotalOriginal) * 100 : 0;
  const efetividadeCobranca = summary.valorTotalOriginal > 0 ? (summary.valorTotalLiquido / summary.valorTotalOriginal) * 100 : 0;
  
  // Análise por forma de pagamento
  const formasPagamento = filteredData.reduce((acc, record) => {
    if (!acc[record.FormaPagamento]) {
      acc[record.FormaPagamento] = { count: 0, valor: 0 };
    }
    acc[record.FormaPagamento].count += 1;
    acc[record.FormaPagamento].valor += record.ValorOriginal;
    return acc;
  }, {} as Record<string, { count: number; valor: number }>);

  const formasMaisUtilizada = Object.entries(formasPagamento)
    .sort(([,a], [,b]) => b.count - a.count)[0];
  
  const formaMaiorValor = Object.entries(formasPagamento)
    .sort(([,a], [,b]) => b.valor - a.valor)[0];

  // Status da inadimplência
  const statusCount = filteredData.reduce((acc, record) => {
    acc[record.StatusFinanceiro] = (acc[record.StatusFinanceiro] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusPrincipal = Object.entries(statusCount)
    .sort(([,a], [,b]) => b - a)[0];

  const insights = [
    {
      title: 'Ticket Médio',
      value: formatCurrency(ticketMedio),
      description: 'Valor médio por registro de inadimplência',
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Taxa de Efetividade',
      value: formatPercentage(efetividadeCobranca),
      description: efetividadeCobranca > 70 ? 'Excelente recuperação' : efetividadeCobranca > 50 ? 'Boa recuperação' : 'Necessita atenção',
      icon: Target,
      color: efetividadeCobranca > 70 ? 'text-success' : efetividadeCobranca > 50 ? 'text-warning' : 'text-destructive',
      bgColor: efetividadeCobranca > 70 ? 'bg-success/10' : efetividadeCobranca > 50 ? 'bg-warning/10' : 'bg-destructive/10',
    },
    {
      title: 'Impacto das Bolsas',
      value: formatPercentage(percentualBolsas),
      description: `${formatCurrency(summary.valorTotalBolsas)} em bolsas aplicadas`,
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Forma de Pagamento Principal',
      value: formasMaisUtilizada?.[0] || 'N/A',
      description: `${formasMaisUtilizada?.[1]?.count || 0} registros`,
      icon: CreditCard,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Maior Volume Financeiro',
      value: formaMaiorValor?.[0] || 'N/A',
      description: formatCurrency(formaMaiorValor?.[1]?.valor || 0),
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Status Predominante',
      value: statusPrincipal?.[0] || 'N/A',
      description: `${statusPrincipal?.[1] || 0} registros`,
      icon: AlertTriangle,
      color: statusPrincipal?.[0] === 'Em Aberto' ? 'text-destructive' : 'text-warning',
      bgColor: statusPrincipal?.[0] === 'Em Aberto' ? 'bg-destructive/10' : 'bg-warning/10',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Insights de Inadimplência
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise detalhada dos indicadores de inadimplência e formas de pagamento
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <Card key={insight.title} className="relative overflow-hidden">
              <div className={`absolute inset-0 ${insight.bgColor}`} />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </CardTitle>
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </CardHeader>
              <CardContent className="relative">
                <div className={`text-2xl font-bold ${insight.color}`}>
                  {insight.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo Executivo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Resumo Executivo de Inadimplência
          </h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <strong>Status da Cobrança:</strong>{' '}
              {efetividadeCobranca > 70 
                ? 'A taxa de efetividade está excelente, demonstrando boa gestão de cobrança.'
                : efetividadeCobranca > 50 
                ? 'A taxa de efetividade está razoável, mas há espaço para melhorias.'
                : 'A taxa de efetividade está baixa, necessitando atenção urgente nos processos de cobrança.'
              }
            </p>
            <p className="text-sm">
              <strong>Gestão de Inadimplência:</strong>{' '}
              {statusPrincipal?.[0] === 'Em Aberto' 
                ? 'Alto volume de registros em aberto indica necessidade de estratégias mais agressivas de cobrança.'
                : 'A distribuição de status indica gestão ativa dos processos de cobrança.'
              }
            </p>
            <p className="text-sm">
              <strong>Análise de Pagamento:</strong>{' '}
              A forma de pagamento "{formasMaisUtilizada?.[0]}" é predominante com {formasMaisUtilizada?.[1]?.count} registros, 
              enquanto "{formaMaiorValor?.[0]}" concentra o maior volume financeiro com {formatCurrency(formaMaiorValor?.[1]?.valor || 0)}.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};