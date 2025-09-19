import { FileUpload } from '@/components/FileUpload';
import { DashboardFilters } from '@/components/DashboardFilters';
import { FinancialSummaryCards } from '@/components/FinancialSummaryCards';
import { FinancialInsights } from '@/components/FinancialInsights';
import { FinancialCharts } from '@/components/FinancialCharts';
import { DataTable } from '@/components/DataTable';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileSpreadsheet, TrendingUp, RefreshCw } from 'lucide-react';

const Index = () => {
  const {
    data,
    rawData, // dados brutos antes dos filtros
    loading,
    filters,
    setFilters,
    processExcelFile,
    resetData,
    summary,
    chartData,
    paymentMethodData,
    branchData,
    uniqueValues,
  } = useFinancialData();

  const handleFileUpload = async (file: File) => {
    console.log('📁 handleFileUpload chamado com arquivo:', file.name, 'tipo:', file.type);
    console.log('📁 Estado antes do processamento - rawData.length:', rawData.length, 'hasData:', hasData);
    
    try {
      await processExcelFile(file);
      console.log('📊 processExcelFile concluído sem erro');
    } catch (error) {
      console.error('❌ Erro em handleFileUpload:', error);
    }
    
    console.log('📁 Estado após processamento - rawData.length:', rawData.length, 'hasData:', hasData);
  };

  // Usa rawData.length para verificar se há dados carregados
  // rawData contém todos os dados antes dos filtros
  const hasData = rawData.length > 0;

  console.log('🔍 Estado atual - hasData:', hasData, 'rawData.length:', rawData.length, 'loading:', loading);

  if (!hasData) {
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
                <h1 className="text-2xl font-bold">Análise de Inadimplência</h1>
                <p className="text-muted-foreground">Dashboard de controle de inadimplência escolar</p>
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
              <h2 className="text-3xl font-bold">Bem-vindo à Análise de Inadimplência</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                 Importe sua planilha Excel de inadimplência e obtenha insights detalhados 
                com análises por forma de pagamento e indicadores de cobrança.
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
                    Gráficos de barras, pizza e linha para análise visual da inadimplência.
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
                    Resumos automáticos de valores em aberto e indicadores de inadimplência.
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
                <h1 className="text-xl font-bold">Análise de Inadimplência</h1>
                <p className="text-sm text-muted-foreground">
                  {rawData.length} registros carregados
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Nova Planilha
            </Button>
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

        {/* Insights Financeiros */}
        <FinancialInsights summary={summary} />

        {/* Gráficos */}
            <FinancialCharts 
              monthlyData={chartData} 
              paymentMethodData={paymentMethodData}
              branchData={branchData}
            />

        {/* Tabela de Dados */}
        <DataTable data={data} />
      </main>
    </div>
  );
};

export default Index;
