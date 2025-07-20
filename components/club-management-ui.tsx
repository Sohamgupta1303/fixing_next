"use client"

import * as React from "react"
import { Search, Users, FileText, Bell, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Form from 'next/form'
import ClubSidebar from "./simple-sidebar"

// We'll use your real organization data structure
type Organization = {
  id: string
  name: string
  description: string | null
  category: string | null
  college: {
    id: string
    name: string
    domains: string[]
  } | null
  members: Array<{
    id: string
    role: string
    user: {
      id: string
      name: string | null
      email: string | null
    }
  }>
  createdAt: Date
}

// Generic placeholder data for UI state
const todoItems = [
  { id: 1, title: "Complete application for Programming Club", dueDate: "2024-01-15", completed: false },
  { id: 2, title: "Submit membership form", dueDate: "2024-01-20", completed: true },
  { id: 3, title: "Attend orientation meeting", dueDate: "2024-01-18", completed: false },
  { id: 4, title: "Review club guidelines", dueDate: "2024-01-22", completed: false },
]

const announcements = [
  {
    id: 1,
    title: "Welcome New Members!",
    content: "We're excited to welcome all our new club members. Please check your email for important onboarding information.",
    date: "2024-01-10",
  },
  {
    id: 2,
    title: "Upcoming Events",
    content: "Don't miss our upcoming workshops and networking events. Registration is now open!",
    date: "2024-01-08",
  },
]

// Icon mapping for different club categories
const getCategoryIcon = (category: string | null) => {
  const { Users, Trophy, Star, Music, Calendar } = require("lucide-react")
  const iconMap: { [key: string]: any } = {
    "academic": Users,
    "sports": Trophy,
    "arts": Star,
    "music": Music,
    "tech": Calendar,
    "default": Users
  }
  return iconMap[category?.toLowerCase() || 'default'] || iconMap.default
}

type ViewMode = "home" | "todo" | "application" | "search"

interface ClubManagementUIProps {
  organizations: Organization[]
  query?: string
}

export default function ClubManagementUI({ organizations, query }: ClubManagementUIProps) {
  const [currentView, setCurrentView] = React.useState<ViewMode>("search")
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(organizations[0] || null)
  const [activeTab, setActiveTab] = React.useState("announcements")
  const [searchQuery, setSearchQuery] = React.useState(query || "")
  const [todos, setTodos] = React.useState(todoItems)

  const handleOrgClick = (org: Organization) => {
    setSelectedOrg(org)
    // Check if user is a member (you can implement this logic based on auth)
    const isMember = true // For now, assume user can access
    if (isMember) {
      setCurrentView("home")
      setActiveTab("announcements")
    } else {
      setCurrentView("application")
    }
  }

  const handleTodoToggle = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const pendingTodos = todos.filter((t) => !t.completed).length
  const filteredOrgs = query ? organizations : organizations.slice(0, 10) // Show first 10 if no search

  // Convert organizations to the UI format
  const clubs = organizations.slice(0, 5).map((org, index) => ({
    id: org.id,
    name: org.name,
    icon: getCategoryIcon(org.category),
    status: Math.random() > 0.5 ? "joined" : "pending" as "joined" | "pending", // Random for demo
    color: "#488363"
  }))

  React.useEffect(() => {
    if (query) {
      setCurrentView("search")
      setSearchQuery(query)
    }
  }, [query])

  return (
    <div className="h-screen w-full bg-[#2a4a2d] overflow-hidden">
      <div className="flex h-full w-full">
        {/* Use the extracted Sidebar component */}
        <ClubSidebar
          organizations={organizations}
          selectedOrg={selectedOrg}
          pendingTodos={pendingTodos}
          onTodoClick={() => setCurrentView("todo")}
          onOrgClick={handleOrgClick}
        />

        {/* Main Panel */}
        <div className="flex-1 flex flex-col bg-[#f8f6f0] min-w-0 w-full h-full">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {currentView === "home" && selectedOrg && (
              <div className="p-6 w-full max-w-none">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-8 w-8 text-[#335035]" />
                  <h1 className="text-2xl font-bold text-[#335035]">{selectedOrg.name}</h1>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#e8e4d8]">
                    <TabsTrigger
                      value="announcements"
                      className="flex items-center gap-2 data-[state=active]:bg-[#C3BA88]"
                    >
                      <Bell className="h-4 w-4" />
                      Announcements
                    </TabsTrigger>
                    <TabsTrigger value="info" className="flex items-center gap-2 data-[state=active]:bg-[#C3BA88]">
                      <Info className="h-4 w-4" />
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="members" className="flex items-center gap-2 data-[state=active]:bg-[#C3BA88]">
                      <Users className="h-4 w-4" />
                      Members ({selectedOrg.members.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="announcements" className="space-y-4 w-full">
                    {announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <Card key={announcement.id} className="bg-white border-[#d4c5a0]">
                          <CardHeader>
                            <CardTitle className="text-lg text-[#335035]">{announcement.title}</CardTitle>
                            <CardDescription className="text-[#968054]">{announcement.date}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-[#4a5c4d]">{announcement.content}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-[#968054]">Nothing to see here.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="info" className="w-full">
                    <Card className="bg-white border-[#d4c5a0] w-full">
                      <CardHeader>
                        <CardTitle className="text-[#335035]">About {selectedOrg.name}</CardTitle>
                        <CardDescription>
                          <Badge className="bg-[#C3BA88] text-[#335035]">{selectedOrg.category || "General"}</Badge>
                          {selectedOrg.college && (
                            <span className="ml-2 text-[#968054]">• {selectedOrg.college.name}</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#4a5c4d]">
                          {selectedOrg.description || "No description available for this organization."}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="members" className="space-y-4 w-full">
                    {selectedOrg.members.map((member) => (
                      <Card key={member.id} className="bg-white border-[#d4c5a0]">
                        <CardContent className="flex items-center gap-3 p-4">
                          <div className="text-2xl">👤</div>
                          <div>
                            <div className="font-medium text-[#335035]">{member.user.name || "Anonymous"}</div>
                            <div className="text-sm text-[#968054]">{member.role}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {currentView === "todo" && (
              <div className="p-6">
                <h1 className="text-2xl font-bold text-[#335035] mb-6 flex items-center gap-2">
                  <CheckSquare className="h-8 w-8
                  " />
                  Task List
                </h1>

                {todos.length > 0 ? (
                  <div className="space-y-3">
                    {todos.map((todo) => (
                      <Card key={todo.id} className="bg-white border-[#d4c5a0]">
                        <CardContent className="flex items-center gap-3 p-4">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleTodoToggle(todo.id)}
                            className="data-[state=checked]:bg-[#C3BA88] data-[state=checked]:border-[#C3BA88]"
                          />
                          <div className="flex-1">
                            <div
                              className={cn(
                                "font-medium",
                                todo.completed ? "line-through text-[#968054]" : "text-[#335035]",
                              )}
                            >
                              {todo.title}
                            </div>
                            <div className="text-sm text-[#968054]">Due: {todo.dueDate}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#968054]">Nothing to see here.</div>
                )}
              </div>
            )}

            {currentView === "application" && selectedOrg && (
              <div className="p-6">
                <h1 className="text-2xl font-bold text-[#335035] mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Application for {selectedOrg.name}
                </h1>

                <Card className="bg-white border-[#d4c5a0]">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-[#335035]">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="border-[#d4c5a0] focus:border-[#C3BA88]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[#335035]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-[#d4c5a0] focus:border-[#C3BA88]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="year" className="text-[#335035]">
                        Academic Year
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#d4c5a0] focus:border-[#C3BA88]">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#335035]">Experience Level</Label>
                      <RadioGroup defaultValue="beginner" className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="beginner"
                            id="beginner"
                            className="border-[#C3BA88] text-[#C3BA88]"
                          />
                          <Label htmlFor="beginner" className="text-[#335035]">
                            Beginner
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="intermediate"
                            id="intermediate"
                            className="border-[#C3BA88] text-[#C3BA88]"
                          />
                          <Label htmlFor="intermediate" className="text-[#335035]">
                            Intermediate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="advanced"
                            id="advanced"
                            className="border-[#C3BA88] text-[#C3BA88]"
                          />
                          <Label htmlFor="advanced" className="text-[#335035]">
                            Advanced
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="motivation" className="text-[#335035]">
                        Why do you want to join?
                      </Label>
                      <Textarea
                        id="motivation"
                        placeholder="Tell us about your motivation..."
                        className="mt-2 border-[#d4c5a0] focus:border-[#C3BA88]"
                      />
                    </div>

                    <Button className="w-full bg-[#C3BA88] hover:bg-[#b8ad7a] text-[#335035] font-medium">
                      Submit Application
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === "search" && (
              <div className="p-6">
                <h1 className="text-2xl font-bold text-[#335035] mb-6 flex items-center gap-2">
                  <Search className="h-6 w-6" />
                  {query ? `Search Results for "${query}"` : "Organizations"}
                </h1>

                {filteredOrgs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrgs.map((org) => {
                      const IconComponent = getCategoryIcon(org.category)
                      return (
                        <Card
                          key={org.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow bg-white border-[#d4c5a0]"
                          onClick={() => handleOrgClick(org)}
                        >
                          <CardContent className="p-6">
                            <div className="w-16 h-16 bg-[#488363] rounded-xl flex items-center justify-center mx-auto mb-3">
                              <IconComponent className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-medium text-[#335035] text-center mb-2">{org.name}</h3>
                            <div className="text-center space-y-2">
                              <Badge className="bg-[#C3BA88] text-[#335035]">
                                {org.category || "General"}
                              </Badge>
                              {org.college && (
                                <p className="text-sm text-[#968054]">{org.college.name}</p>
                              )}
                              <p className="text-sm text-[#4a5c4d] line-clamp-2">
                                {org.description || "No description available"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#968054]">No organizations found.</div>
                )}
              </div>
            )}
          </div>

          {/* Search Bar - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 bg-[#f8f6f0] border-t border-[#d4c5a0]">
            <Form action="/" className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#968054]" />
              <Input
                name="query"
                placeholder="Search organizations..."
                defaultValue={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-center bg-white border-[#C3BA88] focus:border-[#968054] rounded-full text-[#335035] placeholder:text-[#968054]"
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
} 