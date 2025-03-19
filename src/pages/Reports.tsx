
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePercentage } from '@/lib/attendance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

type Subject = {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
};

const Reports = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [subjectsBelow75, setSubjectsBelow75] = useState(0);
  const [subjectsAbove90, setSubjectsAbove90] = useState(0);

  // Load subjects from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // Calculate statistics
  useEffect(() => {
    if (subjects.length > 0) {
      // Calculate overall attendance
      const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
      const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
      setOverallPercentage(calculatePercentage(totalAttended, totalClasses));
      
      // Count subjects below 75%
      setSubjectsBelow75(subjects.filter(subject => subject.percentage < 75).length);
      
      // Count subjects above 90%
      setSubjectsAbove90(subjects.filter(subject => subject.percentage >= 90).length);
    }
  }, [subjects]);

  const exportToCSV = () => {
    // Add headers
    let csvContent = "Subject,Total Classes,Attended Classes,Attendance Percentage\n";
    
    // Add data
    subjects.forEach(subject => {
      csvContent += `"${subject.name}",${subject.totalClasses},${subject.attendedClasses},${subject.percentage}%\n`;
    });
    
    // Calculate overall attendance
    const totalAttended = subjects.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const overall = calculatePercentage(totalAttended, totalClasses);
    
    csvContent += `\n"Overall",,,"${overall}%"\n`;
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_report.csv');
    link.style.visibility = 'hidden';
    
    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage < 75) return '#EF4444'; // Red for low attendance
    if (percentage < 90) return '#F59E0B'; // Amber for medium attendance
    return '#10B981'; // Green for high attendance
  };

  // Format data for pie chart
  const pieData = [
    { name: 'Poor (<75%)', value: subjectsBelow75, color: '#EF4444' },
    { name: 'Good (75-90%)', value: subjects.length - subjectsBelow75 - subjectsAbove90, color: '#F59E0B' },
    { name: 'Excellent (>90%)', value: subjectsAbove90, color: '#10B981' },
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="app-container animate-fade-in">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">View and export your attendance reports</p>
          </div>
          <Button 
            onClick={exportToCSV}
            disabled={subjects.length === 0}
            className="bg-app-blue hover:bg-app-blue-dark"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </header>

        {subjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-app animate-slide-up">
            <h2 className="text-xl font-semibold mb-4">No attendance data available</h2>
            <p className="text-muted-foreground">Add subjects and track attendance to generate reports</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Overall Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: getColorByPercentage(overallPercentage) }}>
                    {overallPercentage}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {subjects.length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Subjects Below 75%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">
                    {subjectsBelow75}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Attendance by Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjects}
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end"
                          height={60}
                          interval={0}
                        />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                        <Bar 
                          dataKey="percentage" 
                          name="Attendance" 
                          fill="#2196F3"
                          animationDuration={1000}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Attendance Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          animationDuration={1000}
                          label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                          labelLine={true}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Report Table */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Detailed Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Subject</th>
                        <th className="py-3 px-4 text-right font-medium">Total Classes</th>
                        <th className="py-3 px-4 text-right font-medium">Attended</th>
                        <th className="py-3 px-4 text-right font-medium">Percentage</th>
                        <th className="py-3 px-4 text-right font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject.id} className="border-b">
                          <td className="py-3 px-4 text-left">{subject.name}</td>
                          <td className="py-3 px-4 text-right">{subject.totalClasses}</td>
                          <td className="py-3 px-4 text-right">{subject.attendedClasses}</td>
                          <td className="py-3 px-4 text-right font-medium" style={{ color: getColorByPercentage(subject.percentage) }}>
                            {subject.percentage}%
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              subject.percentage < 75 
                                ? 'bg-red-100 text-red-800' 
                                : subject.percentage < 90
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {subject.percentage < 75 
                                ? 'Poor' 
                                : subject.percentage < 90
                                  ? 'Good'
                                  : 'Excellent'
                              }
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
