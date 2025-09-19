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
  
  // Análise por forma de pagamento
  const formasPagamento = filteredData.reduce((acc, record) => {
    if (!acc[record.FormaPagamento]) {
      acc[record.FormaPagamento] = { count: 0, valor: 0 };
    }
    acc[record.FormaPagamento].count += 1;
    acc[record.FormaPagamento].valor += record.ValorOriginal;
    return acc;
  }, {} as Record<string, { count: number; valor: number }>);

  // Taxa de inadimplência por forma de pagamento
  const taxaInadimplenciaPorForma = Object.entries(formasPagamento).map(([forma, dados]) => {
    const percentual = summary.totalRecords > 0 ? (dados.count / summary.totalRecords) * 100 : 0;
    return { forma, percentual, count: dados.count };
  }).sort((a, b) => b.percentual - a.percentual)[0];

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
      title: 'Impacto das Bolsas',
      value: formatPercentage(percentualBolsas),
      description: `${formatCurrency(summary.valorTotalBolsas)} em bolsas aplicadas`,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Inadimplência por Forma de Pagamento',
      value: taxaInadimplenciaPorForma?.forma || 'N/A',
      description: `${formatPercentage(taxaInadimplenciaPorForma?.percentual || 0)} dos registros`,
      icon: CreditCard,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
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
              <strong>Inadimplência por Forma de Pagamento:</strong>{' '}
              A forma de pagamento "{taxaInadimplenciaPorForma?.forma}" representa {formatPercentage(taxaInadimplenciaPorForma?.percentual || 0)} 
              dos registros de inadimplência ({taxaInadimplenciaPorForma?.count} registros). 
              {taxaInadimplenciaPorForma?.forma === 'Cobrança Eletrônica' ? 
                'Cobrança Eletrônica refere-se a pagamentos via boleto bancário.' : ''}
            </p>
            <p className="text-sm">
              <strong>Análise de Bolsas:</strong>{' '}
              {percentualBolsas > 15 
                ? 'Alto percentual de bolsas pode indicar estratégia de retenção de alunos ou necessidade de ajuste de preços.'
                : percentualBolsas > 5 
                ? 'Percentual moderado de bolsas, dentro de parâmetros normais para instituições de ensino.'
                : 'Baixo percentual de bolsas aplicadas.'
              }
            </p>
            <p className="text-sm">
              <strong>Ticket Médio:</strong>{' '}
              O valor médio de {formatCurrency(ticketMedio)} por registro indica o perfil financeiro da inadimplência da instituição.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};