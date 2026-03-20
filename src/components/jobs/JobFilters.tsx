"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function JobFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Input placeholder="Job title, skills..." />
      <Input placeholder="Location" />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Job Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="full_time">Full Time</SelectItem>
          <SelectItem value="part_time">Part Time</SelectItem>
        </SelectContent>
      </Select>
      <Button className="md:col-span-1">Search</Button>
    </div>
  )
}

