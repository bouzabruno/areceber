import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { DashboardFilters as FilterType } from '@/types/financial';

interface DashboardFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  uniqueValues: {
    periodos: number[];
    meses: string[];
    filiais: number[];
    statusFinanceiro: string[];
    formasPagamento: string[];
    situacoesContrato: string[];
  };
}

export const DashboardFilters = ({ 
  filters, 
  onFiltersChange, 
  uniqueValues 
}: DashboardFiltersProps) => {
  const updateFilter = (key: keyof FilterType, value: string | undefined) => {
    const newFilters = { ...filters };
    if (value === undefined || value === '') {
      delete newFilters[key];
    } else {
      if (key === 'periodoLetivo' || key === 'codFilial') {
        newFilters[key] = Number(value);
      } else {
        newFilters[key] = value;
      }
    }
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg">Filtros</CardTitle>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 lg:px-3"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período Letivo</label>
            <Select
              value={filters.periodoLetivo?.toString() || ''}
              onValueChange={(value) => updateFilter('periodoLetivo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.periodos.map((periodo) => (
                  <SelectItem key={`periodo-${periodo}`} value={periodo.toString()}>
                    {periodo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mês</label>
            <Select
              value={filters.mes || ''}
              onValueChange={(value) => updateFilter('mes', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.meses.filter(mes => mes && mes.trim() !== '').map((mes) => (
                  <SelectItem key={`mes-${mes}`} value={mes}>
                    {mes}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filial</label>
            <Select
              value={filters.codFilial?.toString() || ''}
              onValueChange={(value) => updateFilter('codFilial', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.filiais.map((filial) => (
                  <SelectItem key={`filial-${filial}`} value={filial.toString()}>
                    Filial {filial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status Financeiro</label>
            <Select
              value={filters.statusFinanceiro || ''}
              onValueChange={(value) => updateFilter('statusFinanceiro', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.statusFinanceiro.filter(status => status && status.trim() !== '').map((status) => (
                  <SelectItem key={`status-${status}`} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Forma de Pagamento</label>
            <Select
              value={filters.formaPagamento || ''}
              onValueChange={(value) => updateFilter('formaPagamento', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.formasPagamento.filter(forma => forma && forma.trim() !== '').map((forma) => (
                  <SelectItem key={`forma-${forma}`} value={forma}>
                    {forma}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Situação do Contrato</label>
            <Select
              value={filters.situacaoContrato || ''}
              onValueChange={(value) => updateFilter('situacaoContrato', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueValues.situacoesContrato.filter(situacao => situacao && situacao.trim() !== '').map((situacao) => (
                  <SelectItem key={`situacao-${situacao}`} value={situacao}>
                    {situacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};