
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { calculatePercentage } from '@/lib/attendance';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

type Subject = {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
};

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [totalClasses, setTotalClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Load subjects from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const resetForm = () => {
    setSubjectName('');
    setTotalClasses('');
    setAttendedClasses('');
    setEditingSubject(null);
  };

  const handleAddSubject = () => {
    if (!subjectName.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    const total = parseInt(totalClasses || '0');
    const attended = parseInt(attendedClasses || '0');

    if (isNaN(total) || total < 0) {
      toast.error('Please enter a valid number for total classes');
      return;
    }

    if (isNaN(attended) || attended < 0) {
      toast.error('Please enter a valid number for attended classes');
      return;
    }

    if (attended > total) {
      toast.error('Attended classes cannot be more than total classes');
      return;
    }

    const percentage = calculatePercentage(attended, total);

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName.trim(),
      totalClasses: total,
      attendedClasses: attended,
      percentage
    };

    setSubjects([...subjects, newSubject]);
    toast.success(`${subjectName} added successfully`);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditSubject = () => {
    if (!editingSubject) return;
    
    if (!subjectName.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    const total = parseInt(totalClasses || '0');
    const attended = parseInt(attendedClasses || '0');

    if (isNaN(total) || total < 0) {
      toast.error('Please enter a valid number for total classes');
      return;
    }

    if (isNaN(attended) || attended < 0) {
      toast.error('Please enter a valid number for attended classes');
      return;
    }

    if (attended > total) {
      toast.error('Attended classes cannot be more than total classes');
      return;
    }

    const percentage = calculatePercentage(attended, total);

    const updatedSubjects = subjects.map(subject => 
      subject.id === editingSubject.id 
        ? { ...subject, name: subjectName.trim(), totalClasses: total, attendedClasses: attended, percentage } 
        : subject
    );

    setSubjects(updatedSubjects);
    toast.success(`${subjectName} updated successfully`);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteSubject = (id: string, name: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(updatedSubjects);
    toast.success(`${name} deleted successfully`);
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setTotalClasses(subject.totalClasses.toString());
    setAttendedClasses(subject.attendedClasses.toString());
    setIsEditDialogOpen(true);
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 75) return '#EF4444'; // Red for low attendance
    if (percentage < 90) return '#F59E0B'; // Amber for medium attendance
    return '#10B981'; // Green for high attendance
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="app-container animate-fade-in">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subjects</h1>
            <p className="text-muted-foreground">Manage your subjects and track attendance</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-app-blue hover:bg-app-blue-dark"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </header>

        {subjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-app animate-slide-up">
            <h2 className="text-xl font-semibold mb-4">No subjects added yet</h2>
            <p className="text-muted-foreground mb-6">Add your first subject to start tracking attendance</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-app-blue hover:bg-app-blue-dark"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="animate-slide-up card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-lg font-semibold truncate">{subject.name}</span>
                    <span 
                      className="text-sm font-medium ml-2"
                      style={{ color: getColorByPercentage(subject.percentage) }}
                    >
                      {subject.percentage}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Classes</p>
                      <p className="text-lg font-semibold">{subject.totalClasses}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Attended</p>
                      <p className="text-lg font-semibold">{subject.attendedClasses}</p>
                    </div>
                  </div>
                  
                  <div 
                    className="h-2 w-full rounded-full bg-secondary overflow-hidden mb-4"
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${subject.percentage}%`,
                        backgroundColor: getColorByPercentage(subject.percentage)
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(subject)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSubject(subject.id, subject.name)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Subject Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
            <DialogDescription>
              Enter the details of the subject you want to track.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                placeholder="e.g. Mathematics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="input-reset"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="total">Total Classes</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(e.target.value)}
                  className="input-reset"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attended">Attended Classes</Label>
                <Input
                  id="attended"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(e.target.value)}
                  className="input-reset"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubject}
              className="bg-app-blue hover:bg-app-blue-dark"
            >
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the details of the subject.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Subject Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Mathematics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="input-reset"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-total">Total Classes</Label>
                <Input
                  id="edit-total"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(e.target.value)}
                  className="input-reset"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-attended">Attended Classes</Label>
                <Input
                  id="edit-attended"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(e.target.value)}
                  className="input-reset"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubject}
              className="bg-app-blue hover:bg-app-blue-dark"
            >
              Update Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
