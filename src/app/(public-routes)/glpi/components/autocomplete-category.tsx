'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { ControllerRenderProps } from 'react-hook-form'
import { listGLPICategories } from '@/app/server/(glpi)/actions_glpi'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

interface FieldValues {
  name: string
  content: string
  locations_id: string
  itilcategories_id: string
  picture?: FileList
}

interface Props {
  formControl?: React.ElementType
  field: ControllerRenderProps<FieldValues, 'itilcategories_id'>
  setValue: (value: string) => void
}

export default function AutocompleteCategories({
  formControl,
  field,
  setValue,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const { data: listCategory, isSuccess: isSuccessCategory } = useQuery({
    queryKey: ['list-category'],
    queryFn: async () => listGLPICategories(),
    enabled: true,
    refetchOnWindowFocus: false,
  })

  function renderButtonField(value: string) {
    if (value && isSuccessCategory && listCategory) {
      return listCategory.find(
        (category) => category.id.toString() === field.value,
      )?.name
    }
    return 'Selecione o assunto'
  }

  function renderTrigger(FormControlComponent: typeof formControl) {
    if (!FormControlComponent) {
      return (
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-md:text-xs"
        >
          {renderButtonField(field.value)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      )
    }

    return (
      <FormControlComponent>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-md:text-xs"
        >
          {renderButtonField(field.value)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </FormControlComponent>
    )
  }

  return listCategory ? (
    <>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{renderTrigger(formControl)}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command
            onBlur={field.onBlur}
            filter={(value, search) => {
              if (value.toLowerCase().indexOf(search.toLowerCase()) !== -1)
                return 1
              return 0
            }}
          >
            <CommandInput placeholder="Selecione o assunto" />
            <CommandList className="scrollbar-styled">
              <CommandEmpty>Não foi achada o assunto</CommandEmpty>
              {listCategory
                ?.filter(
                  (item) => item.level === 1 && item.is_helpdeskvisible !== 0,
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((cat, index) => {
                  return (
                    <CommandGroup
                      key={index}
                      heading={cat.name}
                      value={cat.name}
                    >
                      {listCategory.filter(
                        (item) =>
                          item.itilcategories_id === cat.id &&
                          item.is_helpdeskvisible !== 0,
                      ).length === 0 ? (
                        <CommandItem
                          key={cat.id}
                          value={cat.completename}
                          onSelect={() => {
                            setValue(cat.id.toString())
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              cat.id.toString() === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {cat.name}
                        </CommandItem>
                      ) : (
                        <>
                          {listCategory
                            .filter(
                              (item) =>
                                item.itilcategories_id === cat.id &&
                                item.id !== 3,
                            )
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.completename}
                                onSelect={() => {
                                  setValue(category.id.toString())
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    category.id.toString() === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))}
                          <CommandItem
                            key={cat.id}
                            value={cat.completename}
                            onSelect={() => {
                              setValue(cat.id.toString())
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                cat.id.toString() === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {cat.name}
                          </CommandItem>
                        </>
                      )}
                    </CommandGroup>
                  )
                })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  ) : (
    <div className="flex justify-center">
      <Skeleton className="h-[30px] w-[220px] rounded-full" />
    </div>
  )
}
