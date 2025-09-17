import { useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { FinancialRecord, DashboardFilters, FinancialSummary } from '@/types/financial';
import { toast } from '@/hooks/use-toast';

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({});

  const processExcelFile = useCallback(async (file: File) => {
    console.log('🔄 Iniciando processamento do arquivo:', file.name, file.type, file.size);
    setLoading(true);
    
    try {
      console.log('📄 Criando buffer do arquivo...');
      const buffer = await file.arrayBuffer();
      console.log('📄 Buffer criado, tamanho:', buffer.byteLength);
      
      if (buffer.byteLength === 0) {
        throw new Error('Arquivo vazio ou corrompido');
      }
      
      console.log('📊 Lendo workbook...');
      const workbook = XLSX.read(buffer, { type: 'array' });
      console.log('📊 Workbook criado, sheets:', workbook.SheetNames);
      
      if (!workbook.SheetNames.length) {
        throw new Error('Nenhuma planilha encontrada no arquivo');
      }
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      console.log('📋 Worksheet selecionada:', sheetName);
      
      if (!worksheet) {
        throw new Error('Não foi possível acessar a planilha');
      }
      
      console.log('🔢 Convertendo para JSON...');
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });
      console.log('🔢 Dados brutos convertidos, linhas:', jsonData.length);
      console.log('📝 Primeira linha (cabeçalhos):', jsonData[0]);
      console.log('📝 Segunda linha (dados):', jsonData[1]);
      
      // Converter para objetos usando a primeira linha como cabeçalhos
      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1);
      
      const records = dataRows.map((row: any[]) => {
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = row[index];
        });
        return record;
      }).filter(record => {
        // Filtrar linhas vazias
        return Object.values(record).some(value => value !== null && value !== undefined && value !== '');
      });
      
      console.log('🔢 Registros criados:', records.length);
      console.log('📝 Primeiro registro completo:', records[0]);
      
      // Validar e processar os dados
      const processedData = records.map((row, index) => {
        try {
          return {
            CodFilial: Number(row.CodFilial) || 0,
            PeriodoLetivo: Number(row.PeriodoLetivo) || 0,
            Mes: String(row.Mes || ''),
            CodTurma: String(row.CodTurma || ''),
            DataVencimento: String(row.DataVencimento || ''),
            DataBaixa: String(row.DataBaixa || ''),
            RefLancamento: Number(row.RefLancamento) || 0,
            FormaPagamento: String(row.FormaPagamento || ''),
            ClienteFornecedor: String(row.ClienteFornecedor || ''),
            Historico: String(row.Historico || ''),
            RA: Number(row.RA) || 0,
            SituacaoContrato: String(row.SituacaoContrato || ''),
            StatusFinanceiro: String(row.StatusFinanceiro || ''),
            ValorOriginal: Number(row.ValorOriginal) || 0,
            Bolsa: Number(row.Bolsa) || 0,
            ValorJuros: Number(row.ValorJuros) || 0,
            ValorMulta: Number(row.ValorMulta) || 0,
            ValorDesconto: Number(row.ValorDesconto) || 0,
            ValorRenegociado: Number(row.ValorRenegociado) || 0,
            ValorLiquido: Number(row.ValorLiquido) || 0,
          } as FinancialRecord;
        } catch (error) {
          console.warn(`Erro ao processar linha ${index + 1}:`, error, row);
          return null;
        }
      }).filter(Boolean) as FinancialRecord[];

      console.log('✅ Dados processados com sucesso:', processedData.length, 'registros');
      console.log('📝 Primeiro registro processado:', processedData[0]);
      
      setData(processedData);
      
      toast({
        title: "Sucesso!",
        description: `${processedData.length} registros carregados com sucesso.`,
      });
      
    } catch (error) {
      console.error('❌ Erro detalhado ao processar arquivo:', error);
      console.error('❌ Stack trace:', (error as Error).stack);
      toast({
        title: "Erro ao processar arquivo",
        description: `Erro: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      console.log('🔄 Finalizando processamento, setLoading(false)');
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