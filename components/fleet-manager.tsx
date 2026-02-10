'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Flag } from 'lucide-react'
import type { Fleet, FleetSpecificProvision } from '@/lib/racing-rules'

interface FleetManagerProps {
  fleets: Fleet[]
  fleetProvisions: FleetSpecificProvision[]
  onFleetsChange: (fleets: Fleet[]) => void
  onProvisionsChange: (provisions: FleetSpecificProvision[]) => void
}

export function FleetManager({ fleets, fleetProvisions, onFleetsChange, onProvisionsChange }: FleetManagerProps) {
  const [newFleetName, setNewFleetName] = useState('')
  const [newFleetDescription, setNewFleetDescription] = useState('')

  const addFleet = () => {
    if (!newFleetName.trim()) return
    
    const newFleet: Fleet = {
      id: `fleet-${Date.now()}`,
      name: newFleetName,
      description: newFleetDescription || undefined,
      color: getRandomColor()
    }
    
    onFleetsChange([...fleets, newFleet])
    setNewFleetName('')
    setNewFleetDescription('')
  }

  const removeFleet = (fleetId: string) => {
    onFleetsChange(fleets.filter(f => f.id !== fleetId))
    // Also remove provisions for this fleet
    onProvisionsChange(fleetProvisions.filter(p => p.fleetId !== fleetId))
  }

  const addProvision = (fleetId: string) => {
    const provision: FleetSpecificProvision = {
      id: `provision-${Date.now()}`,
      fleetId,
      content: '',
      section: 'both'
    }
    onProvisionsChange([...fleetProvisions, provision])
  }

  const updateProvision = (id: string, updates: Partial<FleetSpecificProvision>) => {
    onProvisionsChange(
      fleetProvisions.map(p => p.id === id ? { ...p, ...updates } : p)
    )
  }

  const removeProvision = (id: string) => {
    onProvisionsChange(fleetProvisions.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Fleets / Divisions
          </CardTitle>
          <CardDescription>
            Define racing fleets and fleet-specific provisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {fleets.map((fleet) => (
              <div key={fleet.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: fleet.color }}
                    />
                    <div>
                      <p className="font-medium">{fleet.name}</p>
                      {fleet.description && (
                        <p className="text-sm text-muted-foreground">{fleet.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFleet(fleet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Fleet-specific provisions */}
                <div className="ml-7 space-y-3">
                  <div className="text-sm font-medium">Fleet-Specific Provisions:</div>
                  {fleetProvisions
                    .filter(p => p.fleetId === fleet.id)
                    .map((provision) => (
                      <div key={provision.id} className="flex gap-2">
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="e.g., Autopilots are allowed for single-handed sailors"
                            value={provision.content}
                            onChange={(e) => updateProvision(provision.id, { content: e.target.value })}
                            className="min-h-[60px]"
                          />
                          <div className="flex gap-2">
                            <Label className="text-xs">Appears in:</Label>
                            <select
                              value={provision.section}
                              onChange={(e) => updateProvision(provision.id, { section: e.target.value as 'nor' | 'si' | 'both' })}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="nor">Notice of Race</option>
                              <option value="si">Sailing Instructions</option>
                              <option value="both">Both</option>
                            </select>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProvision(provision.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addProvision(fleet.id)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Provision for {fleet.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add new fleet */}
          <div className="border-t pt-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="new-fleet-name">Add New Fleet</Label>
              <Input
                id="new-fleet-name"
                placeholder="Fleet name (e.g., PHRF, One-Design, Single-Handed)"
                value={newFleetName}
                onChange={(e) => setNewFleetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFleet()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-fleet-desc">Description (optional)</Label>
              <Input
                id="new-fleet-desc"
                placeholder="Brief description"
                value={newFleetDescription}
                onChange={(e) => setNewFleetDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFleet()}
              />
            </div>
            <Button onClick={addFleet} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Fleet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getRandomColor(): string {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
