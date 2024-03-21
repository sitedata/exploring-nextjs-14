import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Table } from '@tanstack/react-table';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import NextIcon from '@/components/NextIcon';
import { Input } from '@/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils/app.utils';

import type { DataTableFilterOption } from '@/types/app.type';

import DataTableFacetedFilter from '../DataTableFacetedFilter';

interface DataTableAdvancedFilterItemProps<TData> {
  table: Table<TData>;
  selectedOption: DataTableFilterOption<TData>;
  setSelectedOptions: Dispatch<SetStateAction<DataTableFilterOption<TData>[]>>;
}

const DataTableAdvancedFilterItem = <TData,>({
  table,
  selectedOption,
  setSelectedOptions,
}: DataTableAdvancedFilterItemProps<TData>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>('');
  const debounceValue = useDebounce(value, 500);
  const [open, setOpen] = useState<boolean>(true);

  const selectedValues =
    selectedOption.items.length > 0
      ? Array.from(
          new Set(
            table
              .getColumn(String(selectedOption.value))
              ?.getFilterValue() as string[],
          ),
        )
      : [];

  const filterVarieties =
    selectedOption.items.length > 0
      ? ['is', 'is not']
      : ['contains', 'does not contain', 'is', 'is not'];

  const [filterVariety, setFilterVariety] = useState(filterVarieties[0]);

  // Create query string
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (debounceValue.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          [selectedOption.value]: `${debounceValue}${
            debounceValue.length > 0 ? `.${filterVariety}` : ''
          }`,
        })}`,
        {
          scroll: false,
        },
      );
    }

    if (debounceValue.length === 0) {
      router.push(
        `${pathname}?${createQueryString({
          [selectedOption.value]: null,
        })}`,
        {
          scroll: false,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, filterVariety, selectedOption.value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outlined"
          className={cn(
            'h-7 truncate rounded-full',
            (selectedValues.length > 0 || value.length > 0) && 'bg-muted/50',
          )}
        >
          {value.length > 0 || selectedValues.length > 0 ? (
            <>
              <span className="font-medium capitalize">
                {selectedOption.label}:
              </span>
              {selectedValues.length > 0 ? (
                <span className="ml-1">
                  {selectedValues.length > 2
                    ? `${selectedValues.length} selected`
                    : selectedValues.join(', ')}
                </span>
              ) : (
                <span className="ml-1">{value}</span>
              )}
            </>
          ) : (
            <span className="capitalize">{selectedOption.label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 space-y-1 text-xs" align="start">
        <div className="flex items-center space-x-1">
          <div className="flex flex-1 items-center space-x-1">
            <div className="capitalize">{selectedOption.label}</div>
            <Select onValueChange={(value) => setFilterVariety(value)}>
              <SelectTrigger className="h-auto w-fit truncate border-none px-2 py-0.5 hover:bg-muted/50">
                <SelectValue placeholder={filterVarieties[0]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterVarieties.map((variety) => (
                    <SelectItem key={variety} value={variety}>
                      {variety}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <IconButton
            aria-label="Remove filter"
            className="size-8"
            onClick={() => {
              router.push(
                `${pathname}?${createQueryString({
                  [selectedOption.value]: null,
                })}`,
                {
                  scroll: false,
                },
              );
              setSelectedOptions((prev) =>
                prev.filter((item) => item.value !== selectedOption.value),
              );
            }}
          >
            <NextIcon
              src="/icons/trash.svg"
              size={6}
              aria-hidden="true"
            />
          </IconButton>
        </div>
        {selectedOption.items.length > 0 ? (
          table.getColumn(
            selectedOption.value ? String(selectedOption.value) : '',
          ) && (
            <DataTableFacetedFilter
              key={String(selectedOption.value)}
              column={table.getColumn(
                selectedOption.value ? String(selectedOption.value) : '',
              )}
              title={selectedOption.label}
              options={selectedOption.items}
              variant="command"
            />
          )
        ) : (
          <Input
            placeholder="Type here..."
            className="h-8"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DataTableAdvancedFilterItem;
