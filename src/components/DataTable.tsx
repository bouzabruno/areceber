import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Download 
} from 'lucide-react';
import { FinancialRecord } from '@/types/financial';

interface DataTableProps {
  data: FinancialRecord[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};

export const DataTable = ({ data }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = [
      'Cod Filial', 'Período Letivo', 'Mês', 'Cod Turma', 'Data Vencimento',
      'Data Baixa', 'Ref Lançamento', 'Forma Pagamento', 'Cliente/Fornecedor',
      'RA', 'Situação Contrato', 'Status Financeiro', 'Valor Original',
      'Bolsa', 'Valor Juros', 'Valor Multa', 'Valor Desconto', 'Valor Renegociado', 'Valor Líquido'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(record => [
        record.CodFilial,
        record.PeriodoLetivo,
        record.Mes,
        record.CodTurma,
        formatDate(record.DataVencimento),
        formatDate(record.DataBaixa),
        record.RefLancamento,
        record.FormaPagamento,
        `"${record.ClienteFornecedor}"`,
        record.RA,
        `"${record.SituacaoContrato}"`,
        `"${record.StatusFinanceiro}"`,
        record.ValorOriginal,
        record.Bolsa,
        record.ValorJuros,
        record.ValorMulta,
        record.ValorDesconto,
        record.ValorRenegociado,
        record.ValorLiquido
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'dados_financeiros.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Dados Detalhados</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filial</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>RA</TableHead>
                <TableHead>Status Financeiro</TableHead>
                <TableHead className="text-right">Valor Original</TableHead>
                <TableHead className="text-right">Valor Líquido</TableHead>
                <TableHead>Data Vencimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((record, index) => (
                <TableRow key={`${record.RefLancamento}-${index}`}>
                  <TableCell>{record.CodFilial}</TableCell>
                  <TableCell>{record.PeriodoLetivo}</TableCell>
                  <TableCell>{record.Mes}</TableCell>
                  <TableCell className="max-w-48 truncate">
                    {record.ClienteFornecedor}
                  </TableCell>
                  <TableCell>{record.RA}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      record.StatusFinanceiro === 'Renegociação' 
                        ? 'bg-warning/10 text-warning' 
                        : record.StatusFinanceiro === 'CONTRATO ATIVO'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {record.StatusFinanceiro}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(record.ValorOriginal)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(record.ValorLiquido)}
                  </TableCell>
                  <TableCell>{formatDate(record.DataVencimento)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} de{' '}
              {filteredData.length} registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};