import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Calculator,
  Target
} from 'lucide-react';
import { FinancialSummary } from '@/types/financial';

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
  // Cálculos de insights
  const eficienciaCobranca = summary.valorTotalOriginal > 0 
    ? (summary.valorTotalLiquido / summary.valorTotalOriginal) * 100 
    : 0;
    
  const impactoJuros = summary.valorTotalOriginal > 0 
    ? (summary.valorTotalJuros / summary.valorTotalOriginal) * 100 
    : 0;
    
  const impactoMultas = summary.valorTotalOriginal > 0 
    ? (summary.valorTotalMultas / summary.valorTotalOriginal) * 100 
    : 0;
    
  const impactoDescontos = summary.valorTotalOriginal > 0 
    ? (summary.valorTotalDescontos / summary.valorTotalOriginal) * 100 
    : 0;
    
  const impactoBolsas = summary.valorTotalOriginal > 0 
    ? (summary.valorTotalBolsas / summary.valorTotalOriginal) * 100 
    : 0;

  const valorMedioRegistro = summary.totalRecords > 0 
    ? summary.valorTotalOriginal / summary.totalRecords 
    : 0;

  const insights = [
    {
      title: 'Eficiência de Cobrança',
      value: formatPercentage(eficienciaCobranca),
      description: 'Percentual do valor original que foi efetivamente recebido',
      icon: eficienciaCobranca >= 80 ? CheckCircle : AlertCircle,
      color: eficienciaCobranca >= 80 ? 'text-success' : 'text-warning',
      bgColor: eficienciaCobranca >= 80 ? 'bg-success/10' : 'bg-warning/10',
    },
    {
      title: 'Impacto de Juros',
      value: formatPercentage(impactoJuros),
      description: 'Percentual de juros sobre o valor original',
      icon: TrendingUp,
      color: impactoJuros > 5 ? 'text-destructive' : 'text-success',
      bgColor: impactoJuros > 5 ? 'bg-destructive/10' : 'bg-success/10',
    },
    {
      title: 'Impacto de Multas',
      value: formatPercentage(impactoMultas),
      description: 'Percentual de multas sobre o valor original',
      icon: TrendingDown,
      color: impactoMultas > 3 ? 'text-destructive' : 'text-success',
      bgColor: impactoMultas > 3 ? 'bg-destructive/10' : 'bg-success/10',
    },
    {
      title: 'Benefício Descontos',
      value: formatPercentage(impactoDescontos),
      description: 'Percentual de descontos concedidos',
      icon: Target,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Impacto Bolsas',
      value: formatPercentage(impactoBolsas),
      description: 'Percentual de bolsas de estudo concedidas',
      icon: CheckCircle,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Valor Médio por Registro',
      value: formatCurrency(valorMedioRegistro),
      description: 'Valor médio original por transação',
      icon: Calculator,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Insights Financeiros</h2>
          <p className="text-sm text-muted-foreground">
            Análise automática dos dados filtrados
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title} className="relative overflow-hidden">
            <div className={`absolute inset-0 ${insight.bgColor} opacity-50`} />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {insight.title}
              </CardTitle>
              <insight.icon className={`h-4 w-4 ${insight.color}`} />
            </CardHeader>
            <CardContent className="relative space-y-1">
              <div className={`text-2xl font-bold ${insight.color}`}>
                {insight.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Resumo Executivo */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Performance de Cobrança:</strong>
              <p className="text-muted-foreground">
                {eficienciaCobranca >= 80 
                  ? "Excelente eficiência de cobrança, acima de 80%." 
                  : eficienciaCobranca >= 60 
                  ? "Boa eficiência de cobrança, mas há espaço para melhoria." 
                  : "Eficiência de cobrança baixa, requer atenção urgente."}
              </p>
            </div>
            <div>
              <strong>Gestão de Inadimplência:</strong>
              <p className="text-muted-foreground">
                {impactoJuros + impactoMultas < 5 
                  ? "Baixo impacto de juros e multas, boa gestão de inadimplência." 
                  : "Alto impacto de juros e multas indica necessidade de melhor gestão de inadimplência."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};