import { useState } from 'react';
import { SlidersHorizontal, Building2, Home, Laptop, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { WorkMode } from '@/http/recruitment-api/jobs/types';
import type { JobFiltersState } from '@/pages/jobs';

interface JobFiltersProps {
  filters: JobFiltersState;
  onFiltersChange: (filters: JobFiltersState) => void;
  availableLabels: string[];
}

const workModeOptions: { value: WorkMode; label: string; icon: typeof Building2 }[] = [
  { value: 'on_site', label: 'Presencial', icon: Building2 },
  { value: 'hybrid', label: 'Híbrido', icon: Home },
  { value: 'remote', label: 'Remoto', icon: Laptop },
];

const JobFilters = ({ filters, onFiltersChange, availableLabels }: JobFiltersProps) => {
  const [open, setOpen] = useState(false);

  const activeCount = filters.workModes.length + filters.labels.length;

  const toggleWorkMode = (mode: WorkMode) => {
    const next = filters.workModes.includes(mode)
      ? filters.workModes.filter((m) => m !== mode)
      : [...filters.workModes, mode];
    onFiltersChange({ ...filters, workModes: next });
  };

  const toggleLabel = (label: string) => {
    const next = filters.labels.includes(label)
      ? filters.labels.filter((l) => l !== label)
      : [...filters.labels, label];
    onFiltersChange({ ...filters, labels: next });
  };

  const clearAll = () => {
    onFiltersChange({ workModes: [], labels: [] });
  };

  const removeWorkMode = (mode: WorkMode) => {
    onFiltersChange({ ...filters, workModes: filters.workModes.filter((m) => m !== mode) });
  };

  const removeLabel = (label: string) => {
    onFiltersChange({ ...filters, labels: filters.labels.filter((l) => l !== label) });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-12 gap-2 cursor-pointer shrink-0">
            <SlidersHorizontal className="size-4" />
            Filtros
            {activeCount > 0 && (
              <Badge className="size-5 p-0 justify-center rounded-full text-[10px]">
                {activeCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <div className="p-4 space-y-4">
            {/* Work Mode */}
            <div>
              <p className="text-sm font-medium mb-2">Modelo de trabalho</p>
              <div className="space-y-2">
                {workModeOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Checkbox
                        checked={filters.workModes.includes(opt.value)}
                        onCheckedChange={() => toggleWorkMode(opt.value)}
                      />
                      <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Labels */}
            {availableLabels.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Labels</p>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {availableLabels.map((label) => {
                    const isActive = filters.labels.includes(label);
                    return (
                      <Badge
                        key={label}
                        variant={isActive ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleLabel(label)}
                      >
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {activeCount > 0 && (
            <div className="border-t px-4 py-2.5">
              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Active filter chips */}
      {filters.workModes.map((mode) => {
        const opt = workModeOptions.find((o) => o.value === mode);
        if (!opt) return null;
        return (
          <Badge
            key={mode}
            variant="secondary"
            className="gap-1 pl-2 pr-1 cursor-pointer"
            onClick={() => removeWorkMode(mode)}
          >
            {opt.label}
            <X className="size-3" />
          </Badge>
        );
      })}
      {filters.labels.map((label) => (
        <Badge
          key={label}
          variant="secondary"
          className="gap-1 pl-2 pr-1 cursor-pointer"
          onClick={() => removeLabel(label)}
        >
          {label}
          <X className="size-3" />
        </Badge>
      ))}
    </div>
  );
};

export { JobFilters };
