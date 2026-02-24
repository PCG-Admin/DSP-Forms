'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CINTASIGN_USERS, RINGOMODE_USERS } from '@/lib/user-lists'

interface NameSelectorProps {
  brand: 'ringomode' | 'cintasign'
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
  placeholder?: string
}

export function NameSelector({ 
  brand, 
  value, 
  onChange, 
  label, 
  required = false, 
  placeholder = "Select name" 
}: NameSelectorProps) {
  const users = brand === 'cintasign' ? CINTASIGN_USERS : RINGOMODE_USERS

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {users.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}