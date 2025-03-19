
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [attendanceTarget, setAttendanceTarget] = useState('75');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, we would save these settings to a backend or localStorage
    toast.success('Settings saved successfully');
  };

  const handleResetData = () => {
    // Clear all subjects from localStorage
    localStorage.removeItem('subjects');
    toast.success('All attendance data has been reset');
    setIsResetDialogOpen(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="app-container animate-fade-in max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your attendance tracking preferences</p>
        </header>

        <div className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Attendance Settings</CardTitle>
              <CardDescription>
                Configure how your attendance is calculated and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="attendance-target">Attendance Target (%)</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimum attendance percentage required
                  </p>
                </div>
                <div className="w-20">
                  <Input
                    id="attendance-target"
                    type="number"
                    min="1"
                    max="100"
                    value={attendanceTarget}
                    onChange={(e) => setAttendanceTarget(e.target.value)}
                    className="input-reset"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when attendance drops below target
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings}
                className="bg-app-blue hover:bg-app-blue-dark"
              >
                Save Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="animate-slide-up border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that affect your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Resetting your data will permanently delete all your subjects and attendance records. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => setIsResetDialogOpen(true)}
              >
                Reset All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Reset All Data
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your subjects and attendance records will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-sm">
              Please confirm that you want to permanently delete all your data.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetData}
            >
              Yes, Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
