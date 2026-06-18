import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Smartphone, Swords, Users, Code2, Save } from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false,
    contestAlerts: true,
    battleAlerts: true,
    communityAlerts: true,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await apiClient.get('/notifications/preferences');
        setPrefs(res.data);
      } catch (err) {
        console.error('Failed to load preferences', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/notifications/preferences', prefs);
      toast.success('Notification preferences saved successfully.');
    } catch (err) {
      toast.error('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container py-10 px-4">Loading preferences...</div>;

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Notification Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Control how and when DevBattle communicates with you.
        </p>
      </div>

      <div className="space-y-6">
        {/* Delivery Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Delivery Methods
            </CardTitle>
            <CardDescription>Choose where you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" /> Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive weekly digests and important alerts via email.</p>
              </div>
              <Switch checked={prefs.emailNotifications} onCheckedChange={() => handleToggle('emailNotifications')} />
            </div>
            <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" /> Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive native device notifications. (Coming Soon)</p>
              </div>
              <Switch checked={false} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Alert Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Alert Categories
            </CardTitle>
            <CardDescription>Customize the types of alerts you receive in-app and via email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-500" /> Contest Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Reminders before a registered contest begins.</p>
              </div>
              <Switch checked={prefs.contestAlerts} onCheckedChange={() => handleToggle('contestAlerts')} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Swords className="w-4 h-4 text-red-500" /> Battle Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Invitations and results from 1v1 Battles.</p>
              </div>
              <Switch checked={prefs.battleAlerts} onCheckedChange={() => handleToggle('battleAlerts')} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" /> Community Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Mentions, replies, and discussion updates.</p>
              </div>
              <Switch checked={prefs.communityAlerts} onCheckedChange={() => handleToggle('communityAlerts')} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Preferences
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Inline imports since I didn't import Activity and Settings at the top
import { Activity, Settings } from 'lucide-react';
