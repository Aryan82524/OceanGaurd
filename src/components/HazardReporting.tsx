import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Camera, 
  AlertTriangle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HazardReportingProps {
  user: any;
  onReportSubmitted: (profile: any) => void;
}

export function HazardReporting({ user, onReportSubmitted }: HazardReportingProps) {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    latitude: '',
    longitude: '',
    severity: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami', color: 'bg-red-100 text-red-800', severity: 'critical' },
    { value: 'storm-surge', label: 'Storm Surge', color: 'bg-red-100 text-red-800', severity: 'high' },
    { value: 'coastal-flooding', label: 'Coastal Flooding', color: 'bg-orange-100 text-orange-800', severity: 'high' },
    { value: 'abnormal-tide', label: 'Abnormal Tide', color: 'bg-blue-100 text-blue-800', severity: 'medium' },
    { value: 'high-waves', label: 'High Waves', color: 'bg-purple-100 text-purple-800', severity: 'medium' },
    { value: 'swell-surges', label: 'Swell Surges', color: 'bg-yellow-100 text-yellow-800', severity: 'medium' },
    { value: 'oil-spill', label: 'Oil Spill', color: 'bg-red-100 text-red-800', severity: 'high' },
    { value: 'plastic-waste', label: 'Plastic Waste', color: 'bg-orange-100 text-orange-800', severity: 'low' },
    { value: 'marine-debris', label: 'Marine Debris', color: 'bg-gray-100 text-gray-800', severity: 'low' },
    { value: 'other', label: 'Other Hazard', color: 'bg-gray-100 text-gray-800', severity: 'medium' }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast.success('Location detected successfully!');
        },
        (error) => {
          toast.error('Unable to get your location. Please enter coordinates manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description || !formData.latitude || !formData.longitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4387d93a/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          imageUrl: 'https://images.unsplash.com/photo-1698604832593-2984b65b5082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHBvbGx1dGlvbiUyMG9pbCUyMHNwaWxsfGVufDF8fHx8MTc1NzAwNDUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSubmittedReport(data.report);
      onReportSubmitted(data.userUpdate);
      
      // Reset form
      setFormData({
        type: '',
        description: '',
        latitude: '',
        longitude: '',
        severity: 'medium'
      });

      toast.success('Hazard report submitted successfully! You earned 10 points.');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedReport(null);
    setFormData({
      type: '',
      description: '',
      latitude: '',
      longitude: '',
      severity: 'medium'
    });
  };

  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Report Submitted Successfully!</CardTitle>
            <p className="text-gray-600">
              Thank you for helping protect our oceans. Your report has been submitted for review.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg mb-2">Report Details:</h3>
              <div className="space-y-2">
                <p><strong>Type:</strong> {hazardTypes.find(h => h.value === submittedReport.type)?.label}</p>
                <p><strong>Description:</strong> {submittedReport.description}</p>
                <p><strong>Location:</strong> {submittedReport.latitude}, {submittedReport.longitude}</p>
                <p><strong>Severity:</strong> {submittedReport.severity}</p>
                <p><strong>Status:</strong> 
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">Pending Review</Badge>
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg text-blue-800 mb-2">🎉 Points Earned!</h3>
              <p className="text-blue-700">You've earned 10 points for submitting this report!</p>
            </div>

            <Button onClick={resetForm} className="w-full">
              Submit Another Report
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <span>Report Ocean Hazard</span>
          </CardTitle>
          <p className="text-gray-600">
            Help protect marine environments by reporting hazards you observe
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Hazard Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hazard type" />
                </SelectTrigger>
                <SelectContent>
                  {hazardTypes.map((hazard) => (
                    <SelectItem key={hazard.value} value={hazard.value}>
                      {hazard.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the hazard in detail (what you observed, approximate size, any immediate dangers, etc.)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Location *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Use Current Location</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 40.7128"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g. -74.0060"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor environmental impact</SelectItem>
                  <SelectItem value="medium">Medium - Moderate concern</SelectItem>
                  <SelectItem value="high">High - Significant threat</SelectItem>
                  <SelectItem value="critical">Critical - Immediate action required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-blue-800 mb-2">📸 Photo Upload (Coming Soon)</h3>
              <p className="text-sm text-blue-700">
                The ability to upload photos will be available soon. For now, a sample hazard image will be attached to your report.
              </p>
              <div className="mt-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1698604832593-2984b65b5082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHBvbGx1dGlvbiUyMG9pbCUyMHNwaWxsfGVufDF8fHx8MTc1NzAwNDUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Sample hazard image"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-green-800 mb-2">🏆 Earn Points & Badges</h3>
              <p className="text-sm text-green-700">
                Submit reports to earn points and unlock badges! Each verified report earns you 10 points.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="text-sm text-amber-800 mb-2">⚠️ Emergency Protocols</h3>
              <p className="text-sm text-amber-700 mb-2">
                For critical hazards (Tsunami, Storm Surge), reports are automatically flagged for immediate review.
              </p>
              <p className="text-xs text-amber-600">
                • Reports are verified through AI-powered credibility scoring<br/>
                • Multiple verification sources increase report reliability<br/>
                • False reports may result in account restrictions
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-blue-800 mb-2">📱 Offline Support</h3>
              <p className="text-sm text-blue-700">
                Reports can be saved offline and will sync automatically when connection is restored. Critical reports are prioritized for emergency response.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                'Submit Hazard Report'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}