
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { calculatePercentage, calculateClassesToMiss, calculateClassesToAttend, getAttendanceMessage } from '@/lib/attendance';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

type Subject = {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
};

const Dashboard = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  // Sample data - in a real app, this would come from a backend
  useEffect(() => {
    // Simulate loading subjects from storage
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      // Default subjects if none exist
      const defaultSubjects: Subject[] = [
        { id: '1', name: 'Mathematics', totalClasses: 20, attendedClasses: 16, percentage: 80 },
        { id: '2', name: 'Physics', totalClasses: 15, attendedClasses: 12, percentage: 80 },
        { id: '3', name: 'Computer Science', totalClasses: 25, attendedClasses: 22, percentage: 88 }
      ];
      setSubjects(defaultSubjects);
      localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
    }
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      // Calculate overall attendance
      const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
      const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
      const overallPercentage = calculatePercentage(totalAttended, totalClasses);
      
      // Get a random message based on overall attendance
      const message = getAttendanceMessage(overallPercentage);
      setAttendanceMessage(message);
    }
  }, [subjects]);

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    
    // Generate a new random message
    const message = getAttendanceMessage(subject.percentage);
    setAttendanceMessage(message);
    
    // Show toast with the message
    toast({
      title: `${subject.name} Attendance`,
      description: message,
    });
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 75) return '#EF4444'; // Red for low attendance
    if (percentage < 90) return '#F59E0B'; // Amber for medium attendance
    return '#10B981'; // Green for high attendance
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="app-container animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track and manage your class attendance
          </p>
        </header>

        {attendanceMessage && (
          <div className="bg-secondary/60 backdrop-blur-xs rounded-lg p-4 mb-8 text-sm text-secondary-foreground border border-secondary animate-slide-up">
            <p className="italic">{attendanceMessage}</p>
          </div>
        )}

        {subjects.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">No subjects added yet</h2>
            <p className="text-muted-foreground mb-6">Add your first subject to start tracking attendance</p>
            <Link to="/subjects">
              <Button className="bg-app-blue hover:bg-app-blue-dark">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id} 
                  className="overflow-hidden card-hover"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Classes</p>
                        <p className="text-2xl font-semibold">{subject.totalClasses}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Attended</p>
                        <p className="text-2xl font-semibold">{subject.attendedClasses}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div 
                        className="h-2 flex-1 rounded-full bg-secondary overflow-hidden"
                      >
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${subject.percentage}%`,
                            backgroundColor: getColorByPercentage(subject.percentage)
                          }}
                        />
                      </div>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getColorByPercentage(subject.percentage) }}
                      >
                        {subject.percentage}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedSubject && (
              <div className="bg-white rounded-xl shadow-app p-6 animate-slide-up">
                <h2 className="text-xl font-semibold mb-4">{selectedSubject.name} Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Attendance</p>
                        <p className="text-2xl font-semibold">{selectedSubject.percentage}%</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className={`text-sm font-medium rounded-full px-2 py-0.5 inline-block ${
                          selectedSubject.percentage >= 75 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedSubject.percentage >= 75 ? 'Good Standing' : 'Warning'}
                        </p>
                      </div>
                    </div>

                    {selectedSubject.percentage >= 75 ? (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Classes you can miss</p>
                        <p className="text-xl font-medium">
                          {calculateClassesToMiss(
                            selectedSubject.attendedClasses, 
                            selectedSubject.totalClasses
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Classes to attend consecutively</p>
                        <p className="text-xl font-medium">
                          {calculateClassesToAttend(
                            selectedSubject.attendedClasses, 
                            selectedSubject.totalClasses
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="h-48 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Attended', value: selectedSubject.attendedClasses },
                            { name: 'Missed', value: selectedSubject.totalClasses - selectedSubject.attendedClasses }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          animationDuration={800}
                          animationBegin={200}
                          label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                          labelLine={false}
                        >
                          <Cell fill={getColorByPercentage(selectedSubject.percentage)} />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
