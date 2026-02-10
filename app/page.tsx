'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { EventDetailsForm } from '@/components/event-details-form'
import { RulesSelector } from '@/components/rules-selector'
import { CustomFieldsForm } from '@/components/custom-fields-form'
import { DocumentPreview } from '@/components/document-preview-v2'
import { FleetManager } from '@/components/fleet-manager'
import { Anchor, FileText, Settings, Eye, Save, FolderOpen, LogOut, LogIn, Flag } from 'lucide-react'
import type { Fleet, FleetSpecificProvision } from '@/lib/racing-rules'
import { toast } from 'sonner'

interface DocumentData {
  id?: number
  title: string
  eventData: any
  selectedRules: string[]
  modifiedRules: Record<string, string>
  customFields: Record<string, string>
  fleets: Fleet[]
  fleetProvisions: FleetSpecificProvision[]
}

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string>('')

  // Document state
  const [currentDocId, setCurrentDocId] = useState<number | undefined>()
  const [documents, setDocuments] = useState<any[]>([])
  const [eventData, setEventData] = useState({
    title: "",
    venue: "",
    dates: "",
    organizingAuthority: "",
    vhfChannel: "",
    awardsDateTime: "",
    registrationLink: "",
    entryFee: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    racingArea: "",
    courseLength: "",
    timeLimit: "",
    scoringSystem: "",
    classes: "",
  })

  const [selectedRules, setSelectedRules] = useState<string[]>([])
  const [modifiedRules, setModifiedRules] = useState<Record<string, string>>({})
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [fleets, setFleets] = useState<Fleet[]>([])
  const [fleetProvisions, setFleetProvisions] = useState<FleetSpecificProvision[]>([])

  // Check authentication on load
  useEffect(() => {
    checkAuth()
    loadConfig()
  }, [])

  // Load documents when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDocuments()
    }
  }, [isAuthenticated])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
        setUserInfo(data.user)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadConfig() {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const data = await response.json()
        setLogoUrl(data.logoUrl || '')
      }
    } catch (error) {
      console.error('[v0] Failed to load config:', error)
    }
  }

  async function loadDocuments() {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('[v0] Failed to load documents:', error)
      toast.error('Failed to load documents')
    }
  }

  async function saveDocument() {
    if (!eventData.title) {
      toast.error('Please enter an event title before saving')
      return
    }

    try {
      const documentData: DocumentData = {
        title: eventData.title,
        eventData,
        selectedRules,
        modifiedRules,
        customFields,
        fleets,
        fleetProvisions
      }

      const url = currentDocId 
        ? `/api/documents/${currentDocId}` 
        : '/api/documents'
      
      const method = currentDocId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentDocId(data.document.id)
        toast.success(currentDocId ? 'Document updated' : 'Document saved')
        loadDocuments()
      } else {
        toast.error('Failed to save document')
      }
    } catch (error) {
      console.error('[v0] Save error:', error)
      toast.error('Failed to save document')
    }
  }

  async function loadDocument(id: number) {
    try {
      const response = await fetch(`/api/documents/${id}`)
      if (response.ok) {
        const data = await response.json()
        const doc = data.document
        
        setCurrentDocId(doc.id)
        setEventData(JSON.parse(doc.event_details))
        setSelectedRules(JSON.parse(doc.selected_rules))
        setModifiedRules(JSON.parse(doc.custom_sections))
        const fleetsData = JSON.parse(doc.fleets)
        setFleets(fleetsData.fleets || [])
        setFleetProvisions(fleetsData.provisions || [])
        
        toast.success('Document loaded')
      } else {
        toast.error('Failed to load document')
      }
    } catch (error) {
      console.error('[v0] Load error:', error)
      toast.error('Failed to load document')
    }
  }

  function newDocument() {
    setCurrentDocId(undefined)
    setEventData({
      title: '',
      venue: '',
      dates: '',
      organizingAuthority: '',
      vhfChannel: '',
      awardsDateTime: '',
      registrationLink: '',
      entryFee: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      racingArea: '',
      courseLength: '',
      timeLimit: '',
      scoringSystem: '',
      classes: ''
    })
    setSelectedRules([])
    setModifiedRules({})
    setCustomFields({})
    setFleets([])
    setFleetProvisions([])
    toast.success('New document created')
  }

  function handleLogin() {
    window.location.href = '/api/auth/login'
  }

  function handleLogout() {
    window.location.href = '/api/auth/logout'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mx-auto">
            <Anchor className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">regatta.club Document Generator</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Professional Notice of Race & Sailing Instructions Generator
            </p>
          </div>
          <Button onClick={handleLogin} size="lg" className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Login to Continue
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Anchor className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight">regatta.club Document Generator</h1>
                <p className="text-xs text-muted-foreground">
                  {userInfo?.name || 'Race Committee'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={newDocument}>
                <FileText className="w-4 h-4 mr-2" />
                New
              </Button>
              <Button variant="outline" size="sm" onClick={() => saveDocument()}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              {documents.length > 0 && (
                <select
                  onChange={(e) => e.target.value && loadDocument(Number(e.target.value))}
                  className="border rounded-md px-3 py-2 text-sm"
                  value={currentDocId || ''}
                >
                  <option value="">Load Document...</option>
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title}
                    </option>
                  ))}
                </select>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="details" className="gap-2">
              <FileText className="w-4 h-4" />
              Event Details
            </TabsTrigger>
            <TabsTrigger value="fleets" className="gap-2">
              <Flag className="w-4 h-4" />
              Fleets
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Settings className="w-4 h-4" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="custom" className="gap-2">
              <FileText className="w-4 h-4" />
              Custom Fields
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Event Information</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the basic information for your regatta.
              </p>
              <EventDetailsForm data={eventData} onChange={setEventData} />
            </Card>
          </TabsContent>

          <TabsContent value="fleets" className="space-y-4">
            <FleetManager
              fleets={fleets}
              fleetProvisions={fleetProvisions}
              onFleetsChange={setFleets}
              onProvisionsChange={setFleetProvisions}
            />
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Racing Rules & Prescriptions</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select and customize the Racing Rules of Sailing (2025-2028) and US Sailing Prescriptions that will apply to your event.
              </p>
              <RulesSelector
                selectedRules={selectedRules}
                onSelectRules={setSelectedRules}
                modifiedRules={modifiedRules}
                onModifyRules={setModifiedRules}
              />
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Add any additional custom fields and information specific to your event.
              </p>
              <CustomFieldsForm
                fields={customFields}
                onChange={setCustomFields}
              />
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <DocumentPreview
              eventData={eventData}
              selectedRules={selectedRules}
              modifiedRules={modifiedRules}
              customFields={customFields}
              fleets={fleets}
              fleetProvisions={fleetProvisions}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
