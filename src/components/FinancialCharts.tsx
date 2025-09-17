import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface FinancialChartsProps {
  monthlyData: any[];
  statusData: { name: string; value: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
};

export const FinancialCharts = ({ monthlyData, statusData }: FinancialChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Valores por Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Valores por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                fontSize={12}
                tickFormatter={(value) => value.split('-')[1] || value}
              />
              <YAxis 
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Bar dataKey="valorOriginal" fill="hsl(var(--primary))" name="Valor Original" />
              <Bar dataKey="valorLiquido" fill="hsl(var(--success))" name="Valor Líquido" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Status Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Juros e Multas por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Juros e Multas por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                fontSize={12}
                tickFormatter={(value) => value.split('-')[1] || value}
              />
              <YAxis 
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="valorJuros" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                name="Juros"
              />
              <Line 
                type="monotone" 
                dataKey="valorMultas" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="Multas"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Área - Comparativo de Valores */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Valores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                fontSize={12}
                tickFormatter={(value) => value.split('-')[1] || value}
              />
              <YAxis 
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Bar dataKey="valorOriginal" stackId="a" fill="hsl(var(--info))" name="Original" />
              <Bar dataKey="valorJuros" stackId="a" fill="hsl(var(--warning))" name="Juros" />
              <Bar dataKey="valorMultas" stackId="a" fill="hsl(var(--destructive))" name="Multas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};