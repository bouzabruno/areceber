import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Receipt,
  Target,
  CreditCard 
} from 'lucide-react';
import { FinancialSummary } from '@/types/financial';

interface FinancialSummaryCardsProps {
  summary: FinancialSummary;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const FinancialSummaryCards = ({ summary }: FinancialSummaryCardsProps) => {
  const cards = [
    {
      title: 'Total de Registros',
      value: summary.totalRecords.toLocaleString('pt-BR'),
      icon: Receipt,
      color: 'text-primary',
    },
    {
      title: 'Valor Original',
      value: formatCurrency(summary.valorTotalOriginal),
      icon: DollarSign,
      color: 'text-info',
    },
    {
      title: 'Valor Líquido',
      value: formatCurrency(summary.valorTotalLiquido),
      icon: Target,
      color: 'text-success',
    },
    {
      title: 'Juros',
      value: formatCurrency(summary.valorTotalJuros),
      icon: TrendingUp,
      color: 'text-warning',
    },
    {
      title: 'Multas',
      value: formatCurrency(summary.valorTotalMultas),
      icon: TrendingDown,
      color: 'text-destructive',
    },
    {
      title: 'Descontos',
      value: formatCurrency(summary.valorTotalDescontos),
      icon: CreditCard,
      color: 'text-accent-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-card to-card/50" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};