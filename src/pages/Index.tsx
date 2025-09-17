import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DashboardFilters } from '@/components/DashboardFilters';
import { FinancialSummaryCards } from '@/components/FinancialSummaryCards';
import { FinancialCharts } from '@/components/FinancialCharts';
import { DataTable } from '@/components/DataTable';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileSpreadsheet, TrendingUp } from 'lucide-react';

const Index = () => {
  const {
    data,
    loading,
    filters,
    setFilters,
    processExcelFile,
    summary,
    chartData,
    statusData,
    uniqueValues,
  } = useFinancialData();

  const [showDashboard, setShowDashboard] = useState(false);

  const handleFileUpload = async (file: File) => {
    await processExcelFile(file);
    setShowDashboard(true);
  };

  if (!showDashboard || data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
                <p className="text-muted-foreground">Análise e visualização de dados educacionais</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full">
                  <FileSpreadsheet className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Bem-vindo ao Dashboard Financeiro</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Importe sua planilha Excel e transforme seus dados financeiros em insights visuais 
                com gráficos interativos e filtros dinâmicos.
              </p>
            </div>

            <FileUpload onFileSelect={handleFileUpload} loading={loading} />

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Visualizações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gráficos de barras, pizza e linha para análise visual dos seus dados financeiros.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Métricas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Resumos automáticos de valores totais, juros, multas e descontos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-info" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Filtros dinâmicos por período, filial, status financeiro e forma de pagamento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Dashboard Financeiro</h1>
                <p className="text-sm text-muted-foreground">
                  {data.length} registros carregados
                </p>
              </div>
            </div>
            <FileUpload onFileSelect={handleFileUpload} loading={loading} />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Filtros */}
        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          uniqueValues={uniqueValues}
        />

        {/* Resumo Financeiro */}
        <FinancialSummaryCards summary={summary} />

        {/* Gráficos */}
        <FinancialCharts 
          monthlyData={chartData} 
          statusData={statusData} 
        />

        {/* Tabela de Dados */}
        <DataTable data={data} />
      </main>
    </div>
  );
};

export default Index;
