import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Eye, Calendar, User } from 'lucide-react';

interface HazardMapProps {
  reports: any[];
}

export function HazardMap({ reports }: HazardMapProps) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Simple coordinate to pixel conversion for demo map
  const coordinateToPixel = (lat: number, lng: number, bounds: any) => {
    const x = ((lng + 180) / 360) * bounds.width;
    const y = ((90 - lat) / 180) * bounds.height;
    return { x, y };
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'oil-spill': return '#DC2626';
      case 'plastic-waste': return '#EA580C';
      case 'dangerous-tide': return '#2563EB';
      case 'stranded-animal': return '#7C3AED';
      case 'chemical-spill': return '#CA8A04';
      default: return '#6B7280';
    }
  };

  const getMarkerOpacity = (status: string) => {
    switch (status) {
      case 'approved': return 1;
      case 'pending': return 0.7;
      default: return 0.4;
    }
  };

  const formatHazardType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getHazardTypeColor = (type: string) => {
    switch (type) {
      case 'oil-spill': return 'bg-red-100 text-red-800';
      case 'plastic-waste': return 'bg-orange-100 text-orange-800';
      case 'dangerous-tide': return 'bg-blue-100 text-blue-800';
      case 'stranded-animal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-sm text-gray-600">Oil Spill</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-orange-600"></div>
            <span className="text-sm text-gray-600">Plastic Waste</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span className="text-sm text-gray-600">Dangerous Tide</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
            <span className="text-sm text-gray-600">Stranded Animal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
            <span className="text-sm text-gray-600">Chemical Spill</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Map View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Eye className="h-4 w-4 mr-1" />
            List View
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="relative w-full h-96 bg-blue-100 rounded-lg border overflow-hidden">
          {/* Simple world map background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-300">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 800 400">
                {/* Simple continent shapes */}
                <path d="M150 150 Q200 120 280 140 L320 160 Q350 180 380 170 L420 180 Q450 160 480 170 L520 160 Q550 140 580 150 L620 170 Q650 180 680 160 L680 200 Q650 220 620 210 L580 220 Q550 240 520 230 L480 240 Q450 220 420 230 L380 240 Q350 220 320 230 L280 220 Q200 200 150 190 Z" fill="#10B981" opacity="0.6"/>
                <path d="M200 250 Q250 230 300 240 L340 260 Q370 280 400 270 L440 280 Q470 260 500 270 L540 260 Q570 240 600 250 L600 290 Q570 310 540 300 L500 310 Q470 330 440 320 L400 330 Q370 310 340 320 L300 310 Q250 290 200 300 Z" fill="#10B981" opacity="0.6"/>
                <path d="M450 100 Q500 80 550 90 L590 110 Q620 130 650 120 L690 130 Q720 110 750 120 L750 160 Q720 180 690 170 L650 180 Q620 200 590 190 L550 200 Q500 180 450 190 Z" fill="#10B981" opacity="0.6"/>
              </svg>
            </div>
            
            {/* Plot hazard markers */}
            {reports.map((report, index) => {
              if (!report.latitude || !report.longitude) return null;
              
              // Normalize coordinates to fit our 800x400 view
              const x = ((report.longitude + 180) / 360) * 100;
              const y = ((90 - report.latitude) / 180) * 100;
              
              return (
                <div
                  key={report.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                  style={{
                    left: `${Math.max(2, Math.min(98, x))}%`,
                    top: `${Math.max(2, Math.min(98, y))}%`,
                    opacity: getMarkerOpacity(report.status)
                  }}
                  onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: getMarkerColor(report.type) }}
                  />
                  {selectedReport === report.id && (
                    <div className="absolute z-10 bg-white p-3 rounded-lg shadow-lg border mt-2 min-w-64 max-w-80">
                      <h3 className="text-sm mb-1">{formatHazardType(report.type)}</h3>
                      <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                      <div className="flex gap-2 mb-2">
                        <Badge className={getHazardTypeColor(report.type)} variant="secondary">
                          {formatHazardType(report.type)}
                        </Badge>
                        <Badge className={getStatusColor(report.status)} variant="secondary">
                          {report.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{report.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{report.latitude.toFixed(3)}, {report.longitude.toFixed(3)}</span>
                        </div>
                        {report.upvotes > 0 && (
                          <div>👍 {report.upvotes} verification{report.upvotes !== 1 ? 's' : ''}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {reports.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hazard reports to display</p>
                <p className="text-sm">Submit your first report to see it on the map!</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hazard reports to display</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex gap-2">
                    <Badge className={getHazardTypeColor(report.type)}>
                      {formatHazardType(report.type)}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{report.userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                  </div>
                  {report.upvotes > 0 && (
                    <span>👍 {report.upvotes}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <p className="text-sm text-gray-500 text-center">
        {viewMode === 'map' 
          ? "Click on markers to view hazard details. Opacity indicates status: bright (approved), medium (pending), faded (rejected)."
          : "Switch to map view to see hazard locations on an interactive map."
        }
      </p>
    </div>
  );
}