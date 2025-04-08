"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Medical Admin System",
    email: "admin@medical.com",
    phone: "+1 (555) 123-4567",
    address: "123 Medical St, Health City, HC 12345",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    stockAlerts: true,
    newCustomers: false,
  })

  const { toast } = useToast()

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings updated",
      description: "Your general settings have been updated successfully",
    })
  }

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been updated successfully",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" description="Manage your dashboard settings" />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleGeneralSubmit}>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your basic company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={generalSettings.companyName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={generalSettings.phone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleNotificationSubmit}>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                    <span>Email Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">Receive notifications via email</span>
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="order-updates" className="flex flex-col space-y-1">
                    <span>Order Updates</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified when an order status changes
                    </span>
                  </Label>
                  <Switch
                    id="order-updates"
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        orderUpdates: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="stock-alerts" className="flex flex-col space-y-1">
                    <span>Stock Alerts</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified when products are low in stock
                    </span>
                  </Label>
                  <Switch
                    id="stock-alerts"
                    checked={notificationSettings.stockAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        stockAlerts: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="new-customers" className="flex flex-col space-y-1">
                    <span>New Customers</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified when new customers register
                    </span>
                  </Label>
                  <Switch
                    id="new-customers"
                    checked={notificationSettings.newCustomers}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        newCustomers: checked,
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="border rounded-md p-2 cursor-pointer bg-background">
                      <div className="w-full h-20 bg-background border-b"></div>
                      <div className="w-full h-40 bg-muted/40"></div>
                    </div>
                    <span className="text-sm">Light</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="border rounded-md p-2 cursor-pointer bg-zinc-950">
                      <div className="w-full h-20 bg-zinc-950 border-b border-zinc-800"></div>
                      <div className="w-full h-40 bg-zinc-900"></div>
                    </div>
                    <span className="text-sm">Dark</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="border rounded-md p-2 cursor-pointer bg-background">
                      <div className="w-full h-20 bg-background border-b"></div>
                      <div className="w-full h-40 bg-muted/40"></div>
                    </div>
                    <span className="text-sm">System</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

