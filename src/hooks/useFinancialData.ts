import { useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { FinancialRecord, DashboardFilters, FinancialSummary } from '@/types/financial';
import { toast } from '@/hooks/use-toast';

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({});

  const processExcelFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json<FinancialRecord>(worksheet);
      
      // Validar e processar os dados
      const processedData = jsonData.map((row, index) => {
        try {
          return {
            ...row,
            CodFilial: Number(row.CodFilial) || 0,
            PeriodoLetivo: Number(row.PeriodoLetivo) || 0,
            RefLancamento: Number(row.RefLancamento) || 0,
            RA: Number(row.RA) || 0,
            ValorOriginal: Number(row.ValorOriginal) || 0,
            Bolsa: Number(row.Bolsa) || 0,
            ValorJuros: Number(row.ValorJuros) || 0,
            ValorMulta: Number(row.ValorMulta) || 0,
            ValorDesconto: Number(row.ValorDesconto) || 0,
            ValorRenegociado: Number(row.ValorRenegociado) || 0,
            ValorLiquido: Number(row.ValorLiquido) || 0,
          } as FinancialRecord;
        } catch (error) {
          console.warn(`Erro ao processar linha ${index + 1}:`, error);
          return null;
        }
      }).filter(Boolean) as FinancialRecord[];

      setData(processedData);
      toast({
        title: "Sucesso!",
        description: `${processedData.length} registros carregados com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Verifique se o arquivo está no formato correto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (filters.periodoLetivo && record.PeriodoLetivo !== filters.periodoLetivo) return false;
      if (filters.mes && record.Mes !== filters.mes) return false;
      if (filters.codFilial && record.CodFilial !== filters.codFilial) return false;
      if (filters.statusFinanceiro && record.StatusFinanceiro !== filters.statusFinanceiro) return false;
      if (filters.formaPagamento && record.FormaPagamento !== filters.formaPagamento) return false;
      if (filters.situacaoContrato && record.SituacaoContrato !== filters.situacaoContrato) return false;
      return true;
    });
  }, [data, filters]);

  const summary = useMemo((): FinancialSummary => {
    return filteredData.reduce(
      (acc, record) => ({
        totalRecords: acc.totalRecords + 1,
        valorTotalOriginal: acc.valorTotalOriginal + record.ValorOriginal,
        valorTotalLiquido: acc.valorTotalLiquido + record.ValorLiquido,
        valorTotalJuros: acc.valorTotalJuros + record.ValorJuros,
        valorTotalMultas: acc.valorTotalMultas + record.ValorMulta,
        valorTotalDescontos: acc.valorTotalDescontos + record.ValorDesconto,
        valorTotalBolsas: acc.valorTotalBolsas + record.Bolsa,
      }),
      {
        totalRecords: 0,
        valorTotalOriginal: 0,
        valorTotalLiquido: 0,
        valorTotalJuros: 0,
        valorTotalMultas: 0,
        valorTotalDescontos: 0,
        valorTotalBolsas: 0,
      }
    );
  }, [filteredData]);

  const chartData = useMemo(() => {
    const monthlyData = filteredData.reduce((acc, record) => {
      const month = record.Mes;
      if (!acc[month]) {
        acc[month] = {
          mes: month,
          valorOriginal: 0,
          valorLiquido: 0,
          valorJuros: 0,
          valorMultas: 0,
        };
      }
      acc[month].valorOriginal += record.ValorOriginal;
      acc[month].valorLiquido += record.ValorLiquido;
      acc[month].valorJuros += record.ValorJuros;
      acc[month].valorMultas += record.ValorMulta;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData);
  }, [filteredData]);

  const statusData = useMemo(() => {
    const statusCount = filteredData.reduce((acc, record) => {
      const status = record.StatusFinanceiro;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const uniqueValues = useMemo(() => ({
    periodos: [...new Set(data.map(r => r.PeriodoLetivo))].sort(),
    meses: [...new Set(data.map(r => r.Mes))],
    filiais: [...new Set(data.map(r => r.CodFilial))].sort(),
    statusFinanceiro: [...new Set(data.map(r => r.StatusFinanceiro))],
    formasPagamento: [...new Set(data.map(r => r.FormaPagamento))],
    situacoesContrato: [...new Set(data.map(r => r.SituacaoContrato))],
  }), [data]);

  return {
    data: filteredData,
    rawData: data,
    loading,
    filters,
    setFilters,
    processExcelFile,
    summary,
    chartData,
    statusData,
    uniqueValues,
  };
};