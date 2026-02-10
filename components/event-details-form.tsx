"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EventDetailsFormProps {
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
}

export function EventDetailsForm({ data, onChange }: EventDetailsFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Rites of Spring Race 2026"
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">Venue *</Label>
          <Input
            id="venue"
            placeholder="e.g., Central Bay, San Francisco"
            value={data.venue}
            onChange={(e) => handleChange("venue", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dates">Event Dates *</Label>
          <Input
            id="dates"
            placeholder="e.g., Saturday, March 21, 2026"
            value={data.dates}
            onChange={(e) => handleChange("dates", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizingAuthority">Organizing Authority *</Label>
          <Input
            id="organizingAuthority"
            placeholder="e.g., Oakland Yacht Club"
            value={data.organizingAuthority}
            onChange={(e) => handleChange("organizingAuthority", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="vhfChannel">VHF Channel</Label>
          <Input
            id="vhfChannel"
            placeholder="e.g., Channel 69"
            value={data.vhfChannel}
            onChange={(e) => handleChange("vhfChannel", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="awardsDateTime">Awards Date/Time</Label>
          <Input
            id="awardsDateTime"
            placeholder="e.g., 1530-1730 hours, day of race"
            value={data.awardsDateTime}
            onChange={(e) => handleChange("awardsDateTime", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="registrationLink">Registration Link</Label>
          <Input
            id="registrationLink"
            placeholder="e.g., https://jibeset.net/..."
            value={data.registrationLink}
            onChange={(e) => handleChange("registrationLink", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="entryFee">Entry Fee</Label>
          <Input
            id="entryFee"
            placeholder="e.g., $10 (until March 14), $20 (after)"
            value={data.entryFee}
            onChange={(e) => handleChange("entryFee", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="classes">Classes / Divisions</Label>
          <Textarea
            id="classes"
            placeholder="e.g., PHRF Spinnaker, PHRF Non-Spinnaker, One-Design..."
            value={data.classes}
            onChange={(e) => handleChange("classes", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="racingArea">Racing Area</Label>
          <Textarea
            id="racingArea"
            placeholder="e.g., Central Bay, north of Bay Bridge"
            value={data.racingArea}
            onChange={(e) => handleChange("racingArea", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="courseLength">Course Length</Label>
          <Input
            id="courseLength"
            placeholder="e.g., 9-19 miles"
            value={data.courseLength}
            onChange={(e) => handleChange("courseLength", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeLimit">Time Limit</Label>
          <Input
            id="timeLimit"
            placeholder="e.g., 1700 hours"
            value={data.timeLimit}
            onChange={(e) => handleChange("timeLimit", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scoringSystem">Scoring System</Label>
          <Input
            id="scoringSystem"
            placeholder="e.g., Time-On-Distance PHRF"
            value={data.scoringSystem}
            onChange={(e) => handleChange("scoringSystem", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              placeholder="e.g., Race Committee Chair"
              value={data.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="e.g., racing@yachtclub.com"
              value={data.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="e.g., (510) 555-1234"
              value={data.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
