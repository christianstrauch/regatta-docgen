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
  const [showDocumentList, setShowDocumentList] = useState(false)

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

  // Load documents when authenticated and show document list
  useEffect(() => {
    if (isAuthenticated) {
      loadDocuments()
      setShowDocumentList(true)
    }
  }, [isAuthenticated])

  // Update organizing authority when userInfo loads
  useEffect(() => {
    console.log('[v0] organizingAuthority effect triggered')
    console.log('[v0] userInfo:', userInfo)
    console.log('[v0] raceCommitteeName:', userInfo?.raceCommitteeName)
    console.log('[v0] current organizingAuthority:', eventData.organizingAuthority)
    
    if (userInfo?.raceCommitteeName && eventData.organizingAuthority === '') {
      console.log('[v0] Setting default organizing authority:', userInfo.raceCommitteeName)
      setEventData(prev => ({
        ...prev,
        organizingAuthority: userInfo.raceCommitteeName
      }))
    } else {
      console.log('[v0] Not setting organizing authority - conditions not met')
    }
  }, [userInfo?.raceCommitteeName, eventData.organizingAuthority])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Auth status response:', data)
        setIsAuthenticated(data.authenticated)
        setUserInfo(data.user)
        // Set logo from user's race committee
        if (data.user?.raceCommitteeLogo) {
          setLogoUrl(data.user.raceCommitteeLogo)
        }
        console.log('[v0] UserInfo set to:', data.user)
      } else {
        console.error('[v0] Auth status failed:', response.status)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('[v0] Auth check error:', error)
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
        // Only set logo from config if not already set from user session
        if (!logoUrl && data.logoUrl) {
          setLogoUrl(data.logoUrl)
        }
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

      console.log('[v0] Saving document data:', documentData)

      const url = currentDocId 
        ? `/api/documents/${currentDocId}` 
        : '/api/documents'
      
      const method = currentDocId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      })

      console.log('[v0] Save response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Save response data:', data)
        setCurrentDocId(data.document.id)
        toast.success(currentDocId ? 'Race document set updated' : 'Race document set saved')
        loadDocuments()
      } else {
        const errorData = await response.json()
        console.error('[v0] Save failed:', errorData)
        toast.error(`Failed to save race document set: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error('[v0] Save error:', error)
      toast.error('Failed to save race document set')
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
        setShowDocumentList(false)
        
        toast.success('Race document set loaded')
      } else {
        toast.error('Failed to load race document set')
      }
    } catch (error) {
      console.error('[v0] Load error:', error)
      toast.error('Failed to load race document set')
    }
  }

  function newDocument() {
    setCurrentDocId(undefined)
    setEventData({
      title: '',
      venue: '',
      dates: '',
      organizingAuthority: userInfo?.raceCommitteeName || '',
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
    setShowDocumentList(false)
    toast.success('New race document set created')
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
                  {userInfo?.raceCommitteeName && userInfo?.name 
                    ? `${userInfo.raceCommitteeName} / ${userInfo.name}`
                    : userInfo?.raceCommitteeName || userInfo?.name || 'Race Committee'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!showDocumentList && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setShowDocumentList(true)}>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    My Sets
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => saveDocument()}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
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
        {showDocumentList ? (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">My Race Document Sets</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {documents.length} document {documents.length === 1 ? 'set' : 'sets'} for {userInfo?.raceCommitteeName}
                </p>
              </div>
              <Button onClick={newDocument}>
                <FileText className="w-4 h-4 mr-2" />
                New Document Set
              </Button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No document sets yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first race document set to get started.
                </p>
                <Button onClick={newDocument}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create First Document Set
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card 
                    key={doc.id} 
                    className="p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => loadDocument(doc.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {new Date(doc.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          loadDocument(doc.id)
                        }}
                      >
                        Open
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        ) : (
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
        )}
      </main>
    </div>
  )
}
