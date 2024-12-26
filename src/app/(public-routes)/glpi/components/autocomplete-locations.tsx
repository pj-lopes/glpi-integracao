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
import { useQuery } from '@tanstack/react-query'
import { listGLPILocation } from '@/app/server/(glpi)/actions_glpi'
import { Skeleton } from '@/components/ui/skeleton'

interface FieldValues {
  name: string
  content: string
  locations_id: string
  itilcategories_id: string
  picture?: FileList
}

interface Props {
  formControl: React.ElementType
  field: ControllerRenderProps<FieldValues, 'locations_id'>
  setValue: (value: string) => void
}

export default function AutocompleteLocations({
  formControl,
  field,
  setValue,
}: Props) {
  const [open, setOpen] = React.useState(false)

  const { data: listLocation, isSuccess: isSuccessLocation } = useQuery({
    queryKey: ['list-location'],
    queryFn: async () => listGLPILocation(),
    enabled: true,
    refetchOnWindowFocus: false,
  })

  function renderButtonField(value: string) {
    if (value && isSuccessLocation && listLocation) {
      return listLocation.find(
        (location) => location.id.toString() === field.value,
      )?.name
    }
    return 'Selecione o setor'
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

  return listLocation ? (
    <>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{renderTrigger(formControl)}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command onBlur={field.onBlur}>
            <CommandInput placeholder="Selecione o setor" className="text-xs" />
            <CommandList>
              <CommandEmpty>O setor não foi encontrado</CommandEmpty>
              <CommandGroup>
                {isSuccessLocation &&
                  listLocation
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((setor) => (
                      <CommandItem
                        key={setor.id}
                        value={setor.name}
                        onSelect={() => {
                          setValue(setor.id.toString())
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            setor.id.toString() === field.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {setor.name}
                      </CommandItem>
                    ))}
              </CommandGroup>
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
