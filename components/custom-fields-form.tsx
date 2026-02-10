"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface CustomFieldsFormProps {
  fields: Record<string, string>
  onChange: (fields: Record<string, string>) => void
}

export function CustomFieldsForm({ fields, onChange }: CustomFieldsFormProps) {
  const [newFieldName, setNewFieldName] = useState("")

  const handleAddField = () => {
    if (newFieldName.trim()) {
      onChange({ ...fields, [newFieldName]: "" })
      setNewFieldName("")
    }
  }

  const handleRemoveField = (fieldName: string) => {
    const newFields = { ...fields }
    delete newFields[fieldName]
    onChange(newFields)
  }

  const handleUpdateField = (fieldName: string, value: string) => {
    onChange({ ...fields, [fieldName]: value })
  }

  return (
    <div className="space-y-6">
      {/* Add New Field */}
      <Card className="p-4 bg-muted/30">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter field name (e.g., 'Tides and Currents', 'Restricted Areas')"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddField()
                }
              }}
            />
          </div>
          <Button onClick={handleAddField} disabled={!newFieldName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      </Card>

      {/* Existing Fields */}
      {Object.keys(fields).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No custom fields added yet.</p>
          <p className="text-sm mt-2">Add fields above to include additional information in your documents.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(fields).map(([fieldName, fieldValue]) => (
            <Card key={fieldName} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">{fieldName}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveField(fieldName)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder={`Enter content for ${fieldName}...`}
                  value={fieldValue}
                  onChange={(e) => handleUpdateField(fieldName, e.target.value)}
                  rows={4}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {Object.keys(fields).length < 3 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h4 className="font-semibold text-sm mb-2">Suggested Fields</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Restricted Areas",
              "Tides and Currents",
              "Safety Requirements",
              "Equipment Requirements",
              "Declaration Requirements",
              "Weather Information",
              "Protest Procedures",
              "Radio Communication",
            ]
              .filter((suggestion) => !fields[suggestion])
              .map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange({ ...fields, [suggestion]: "" })
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}
