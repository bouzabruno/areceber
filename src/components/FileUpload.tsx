import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
}

export const FileUpload = ({ onFileSelect, loading = false }: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      
      const files = Array.from(e.dataTransfer.files);
      const excelFile = files.find(file => 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.toLowerCase().endsWith('.xlsx')
      );
      
      if (excelFile) {
        onFileSelect(excelFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            loading && "opacity-50 pointer-events-none"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Envie sua planilha financeira
              </h3>
              <p className="text-muted-foreground">
                Arraste e solte o arquivo Excel (.xlsx) ou clique para selecionar
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button
                variant="default"
                className="flex items-center gap-2"
                disabled={loading}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.xlsx';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      onFileSelect(file);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="h-4 w-4" />
                {loading ? 'Processando...' : 'Selecionar Arquivo'}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Apenas arquivos .xlsx são suportados
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};