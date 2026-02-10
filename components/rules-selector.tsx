"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { racingRules, type RacingRule } from "@/lib/racing-rules"
import { Edit2, Check, X } from "lucide-react"

interface RulesSelectorProps {
  selectedRules: string[]
  onSelectRules: (rules: string[]) => void
  modifiedRules: Record<string, string>
  onModifyRules: (rules: Record<string, string>) => void
}

export function RulesSelector({
  selectedRules,
  onSelectRules,
  modifiedRules,
  onModifyRules,
}: RulesSelectorProps) {
  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleToggleRule = (ruleId: string) => {
    if (selectedRules.includes(ruleId)) {
      onSelectRules(selectedRules.filter((id) => id !== ruleId))
      // Remove modification if rule is deselected
      const newModified = { ...modifiedRules }
      delete newModified[ruleId]
      onModifyRules(newModified)
    } else {
      onSelectRules([...selectedRules, ruleId])
    }
  }

  const startEditing = (rule: RacingRule) => {
    setEditingRule(rule.id)
    setEditText(modifiedRules[rule.id] || rule.defaultText)
  }

  const saveEdit = (ruleId: string) => {
    onModifyRules({ ...modifiedRules, [ruleId]: editText })
    setEditingRule(null)
  }

  const cancelEdit = () => {
    setEditingRule(null)
    setEditText("")
  }

  const removeModification = (ruleId: string) => {
    const newModified = { ...modifiedRules }
    delete newModified[ruleId]
    onModifyRules(newModified)
  }

  const rrsRules = racingRules.filter((r) => r.category === "rrs")
  const prescriptions = racingRules.filter((r) => r.category === "prescription")
  const appendices = racingRules.filter((r) => r.category === "appendix")

  const renderRule = (rule: RacingRule) => {
    const isSelected = selectedRules.includes(rule.id)
    const isModified = !!modifiedRules[rule.id]
    const isEditing = editingRule === rule.id

    return (
      <div key={rule.id} className="border rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id={rule.id}
            checked={isSelected}
            onCheckedChange={() => handleToggleRule(rule.id)}
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Label htmlFor={rule.id} className="font-semibold cursor-pointer">
                Rule {rule.number}: {rule.title}
              </Label>
              {rule.appliesIfMentioned && (
                <Badge variant="outline" className="text-xs">
                  Applies if mentioned
                </Badge>
              )}
              {isModified && (
                <Badge variant="secondary" className="text-xs">
                  Modified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{rule.description}</p>
            {rule.section !== "both" && (
              <p className="text-xs text-muted-foreground">
                Appears in: {rule.section === "nor" ? "Notice of Race" : "Sailing Instructions"}
              </p>
            )}
          </div>
        </div>

        {isSelected && !isEditing && (
          <div className="pl-8 space-y-2">
            <div className="bg-muted/50 p-3 rounded text-sm">
              {modifiedRules[rule.id] || rule.defaultText}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEditing(rule)}
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Modify Text
              </Button>
              {isModified && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeModification(rule.id)}
                >
                  <X className="w-3 h-3 mr-1" />
                  Reset to Default
                </Button>
              )}
            </div>
          </div>
        )}

        {isSelected && isEditing && (
          <div className="pl-8 space-y-3">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              placeholder="Enter custom rule text..."
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => saveEdit(rule.id)}>
                <Check className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["rrs", "prescriptions", "appendices"]} className="space-y-4">
        <AccordionItem value="rrs" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Racing Rules of Sailing (2025-2028)</h3>
              <Badge variant="secondary">
                {rrsRules.filter((r) => selectedRules.includes(r.id)).length} / {rrsRules.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            {rrsRules.map(renderRule)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prescriptions" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">US Sailing Prescriptions</h3>
              <Badge variant="secondary">
                {prescriptions.filter((r) => selectedRules.includes(r.id)).length} /{" "}
                {prescriptions.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            {prescriptions.map(renderRule)}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="appendices" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Appendices</h3>
              <Badge variant="secondary">
                {appendices.filter((r) => selectedRules.includes(r.id)).length} / {appendices.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            {appendices.map(renderRule)}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
