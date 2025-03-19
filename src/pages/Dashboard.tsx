
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAttendanceMessage, calculateClassesToMiss, calculateClassesToAttend } from '@/lib/attendance';
import { Link } from 'react-router-dom';
import { PlusCircle, Percent } from 'lucide-react';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [manualPercentage, setManualPercentage] = useState('75');
  const [calculationResult, setCalculationResult] = useState({
    canMiss: 0,
    needToAttend: 0
  });

  // Load subjects from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const handleCalculateAttendance = () => {
    const percentage = parseInt(manualPercentage, 10);
    
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error('Please enter a valid percentage between 0 and 100');
      return;
    }

    // Calculate how many classes can be missed or need to be attended
    // For this calculator, we'll use some example values:
    // Assuming 20 total classes with the entered percentage for calculations
    const total = 20;
    const attended = Math.round((percentage / 100) * total);
    
    const canMiss = calculateClassesToMiss(attended, total);
    const needToAttend = calculateClassesToAttend(attended, total);
    
    setCalculationResult({
      canMiss,
      needToAttend
    });

    // Generate a random message based on the percentage
    const message = getAttendanceMessage(percentage);
    setAttendanceMessage(message);
    
    toast.success('Attendance calculated');
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 75) return '#EF4444'; // Red for low attendance
    if (percentage < 90) return '#F59E0B'; // Amber for medium attendance
    return '#10B981'; // Green for high attendance
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="app-container animate-fade-in max-w-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Attendance Calculator</h1>
          <p className="text-muted-foreground">
            Calculate how many classes you can miss or need to attend
          </p>
        </header>

        <Card className="mb-8 animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Enter Attendance Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-percentage">Current Attendance (%)</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="manual-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={manualPercentage}
                    onChange={(e) => setManualPercentage(e.target.value)}
                    className="pr-10" 
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleCalculateAttendance}
                className="w-full bg-app-blue hover:bg-app-blue-dark"
              >
                Calculate Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        {attendanceMessage && (
          <div className="bg-secondary/60 backdrop-blur-xs rounded-lg p-4 mb-8 text-sm text-secondary-foreground border border-secondary animate-slide-up">
            <p className="italic">{attendanceMessage}</p>
          </div>
        )}

        {(calculationResult.canMiss > 0 || calculationResult.needToAttend > 0) && (
          <div className="bg-white rounded-xl shadow-app p-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-semibold">{manualPercentage}%</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`text-sm font-medium rounded-full px-2 py-0.5 inline-block ${
                    parseInt(manualPercentage) >= 75 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {parseInt(manualPercentage) >= 75 ? 'Good Standing' : 'Warning'}
                  </p>
                </div>

                {parseInt(manualPercentage) >= 75 ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Classes you can miss</p>
                    <p className="text-xl font-medium">
                      {calculationResult.canMiss}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Classes to attend consecutively</p>
                    <p className="text-xl font-medium">
                      {calculationResult.needToAttend}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Attended', value: parseInt(manualPercentage) },
                        { name: 'Missed', value: 100 - parseInt(manualPercentage) }
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
                      <Cell fill={getColorByPercentage(parseInt(manualPercentage))} />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Want to track attendance for specific subjects?</p>
          <Link to="/subjects">
            <Button className="bg-app-blue hover:bg-app-blue-dark">
              <PlusCircle className="mr-2 h-4 w-4" />
              Manage Subjects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
