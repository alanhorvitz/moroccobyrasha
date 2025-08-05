import React, { useState, useEffect } from 'react';
import { AuditLogger, AuditLog } from '@/lib/admin/audit-logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Download, Filter, RefreshCw } from 'lucide-react';

interface AuditLogViewerProps {
  filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  };
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ filters }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = () => {
    setLoading(true);
    try {
      const filteredLogs = AuditLogger.getLogs({
        ...filters,
        action: searchTerm || filters?.action,
      });
      setLogs(filteredLogs);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadLogs();
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? 'Success' : 'Failed'}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audit Logs</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLogs}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName || 'System'}</div>
                          {log.userId && (
                            <div className="text-xs text-gray-500">ID: {log.userId}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <div>
                          <div>{log.resource}</div>
                          {log.resourceId && (
                            <div className="text-xs text-gray-500">{log.resourceId}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.success)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;