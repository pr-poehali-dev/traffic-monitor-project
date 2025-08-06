import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Типы данных для мониторинга
interface NetworkMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface ProtocolData {
  name: string;
  percentage: number;
  bytes: string;
  packets: number;
  color: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface TrafficData {
  time: string;
  bandwidth: number;
  packets: number;
  latency: number;
}

interface PacketDetail {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  flags: string[];
  payload: string;
}

interface FilterOptions {
  protocol: string;
  source: string;
  destination: string;
  timeRange: string;
}

const Index = () => {
  // Состояние для live данных
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [networkLoad, setNetworkLoad] = useState(67);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Состояние для графиков
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  
  // Состояние для анализа пакетов
  const [packetData, setPacketData] = useState<PacketDetail[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<PacketDetail | null>(null);
  
  // Состояние для фильтрации
  const [filters, setFilters] = useState<FilterOptions>({
    protocol: 'all',
    source: '',
    destination: '',
    timeRange: '1h'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Инициализация данных для графиков
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      const now = new Date();
      for (let i = 59; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        data.push({
          time: time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          bandwidth: Math.random() * 1000 + 200,
          packets: Math.random() * 50000 + 10000,
          latency: Math.random() * 20 + 5
        });
      }
      return data;
    };
    setTrafficData(generateInitialData());
    
    // Генерация пакетов
    const generatePackets = () => {
      const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'ICMP', 'SSH', 'FTP'];
      const ips = ['192.168.1.100', '10.0.0.15', '172.16.0.1', '8.8.8.8', '1.1.1.1'];
      const packets = [];
      
      for (let i = 0; i < 100; i++) {
        const time = new Date(Date.now() - Math.random() * 3600000);
        packets.push({
          id: `pkt_${i}`,
          timestamp: time.toLocaleTimeString(),
          source: ips[Math.floor(Math.random() * ips.length)],
          destination: ips[Math.floor(Math.random() * ips.length)],
          protocol: protocols[Math.floor(Math.random() * protocols.length)],
          size: Math.floor(Math.random() * 1500) + 64,
          flags: ['SYN', 'ACK'].slice(0, Math.floor(Math.random() * 3)),
          payload: 'HTTP GET /api/data...'
        });
      }
      return packets.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    };
    setPacketData(generatePackets());
  }, []);

  // Обновление времени и данных каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Имитация изменения нагрузки
      setNetworkLoad(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + change));
      });
      
      // Обновление графиков
      if (isMonitoring) {
        setTrafficData(prev => {
          const newData = [...prev.slice(1), {
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            bandwidth: Math.random() * 1000 + 200,
            packets: Math.random() * 50000 + 10000,
            latency: Math.random() * 20 + 5
          }];
          return newData;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isMonitoring]);

  // Mock данные для демонстрации
  const metrics: NetworkMetric[] = [
    { label: 'Bandwidth', value: '1.2 Gbps', trend: 'up', change: '+15%' },
    { label: 'Latency', value: '12.3 ms', trend: 'down', change: '-8%' },
    { label: 'Packet Loss', value: '0.02%', trend: 'stable', change: '0%' },
    { label: 'Connections', value: '2,847', trend: 'up', change: '+23%' },
  ];

  const protocols: ProtocolData[] = [
    { name: 'HTTP/HTTPS', percentage: 45.2, bytes: '2.1 GB', packets: 156789, color: '#00D4FF' },
    { name: 'TCP', percentage: 28.7, bytes: '1.3 GB', packets: 89456, color: '#4ECDC4' },
    { name: 'UDP', percentage: 15.8, bytes: '720 MB', packets: 45123, color: '#FFD93D' },
    { name: 'ICMP', percentage: 6.1, bytes: '278 MB', packets: 12456, color: '#FF6B6B' },
    { name: 'Other', percentage: 4.2, bytes: '192 MB', packets: 8765, color: '#95A5A6' },
  ];

  const alerts: Alert[] = [
    { id: '1', type: 'warning', message: 'High bandwidth usage detected on interface eth0', timestamp: '14:32:15' },
    { id: '2', type: 'info', message: 'New device connected: 192.168.1.124', timestamp: '14:28:43' },
    { id: '3', type: 'error', message: 'Connection timeout to server 10.0.0.15', timestamp: '14:25:12' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Фильтрация пакетов
  const filteredPackets = packetData.filter(packet => {
    if (filters.protocol !== 'all' && packet.protocol !== filters.protocol) return false;
    if (filters.source && !packet.source.includes(filters.source)) return false;
    if (filters.destination && !packet.destination.includes(filters.destination)) return false;
    if (searchTerm && !packet.payload.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Заголовок с статусом */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Icon name="Network" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Network Monitor</h1>
              <p className="text-muted-foreground">Real-time network traffic analysis</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-sm font-medium">
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </span>
          </div>
          <div className="text-sm font-mono text-muted-foreground">
            {currentTime.toLocaleTimeString()}
          </div>
          <Button 
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
          >
            <Icon name={isMonitoring ? "Square" : "Play"} size={16} className="mr-2" />
            {isMonitoring ? 'Stop' : 'Start'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="packets">Packet Analysis</TabsTrigger>
          <TabsTrigger value="filters">Filters & Search</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Основные метрики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold font-mono">{metric.value}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                      <Icon name={getTrendIcon(metric.trend)} size={16} />
                      <span className="text-sm font-medium">{metric.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Графики и статистика */}
            <div className="lg:col-span-2 space-y-6">
              {/* Нагрузка сети */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Activity" size={20} />
                    <span>Network Load</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Usage</span>
                      <span className="text-sm font-mono">{networkLoad.toFixed(1)}%</span>
                    </div>
                    <Progress value={networkLoad} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold font-mono text-emerald-400">98.7%</p>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono text-blue-400">847</p>
                        <p className="text-xs text-muted-foreground">Active Flows</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono text-purple-400">23.4k</p>
                        <p className="text-xs text-muted-foreground">Packets/sec</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Статистика протоколов */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="PieChart" size={20} />
                    <span>Protocol Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {protocols.map((protocol, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: protocol.color }}
                            />
                            <span className="font-medium">{protocol.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono">{protocol.percentage}%</div>
                            <div className="text-xs text-muted-foreground">{protocol.bytes}</div>
                          </div>
                        </div>
                        <Progress 
                          value={protocol.percentage} 
                          className="h-1"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Уведомления */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Bell" size={20} />
                    <span>Alerts</span>
                    <Badge variant="secondary">{alerts.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <Icon 
                        name={alert.type === 'error' ? 'AlertCircle' : alert.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                        size={16} 
                        className={`mt-0.5 ${
                          alert.type === 'error' ? 'text-red-400' : 
                          alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground font-mono">{alert.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Конфигурация */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Settings" size={20} />
                    <span>Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      <Icon name="Download" size={14} className="mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="Filter" size={14} className="mr-2" />
                      Filters
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto-refresh</span>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Interface</span>
                      <span className="text-sm font-mono">eth0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Capture filter</span>
                      <span className="text-sm font-mono">All</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Быстрые действия */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Zap" size={20} />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Icon name="FileText" size={14} className="mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Icon name="AlertTriangle" size={14} className="mr-2" />
                    View Incidents
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Icon name="BarChart3" size={14} className="mr-2" />
                    Traffic Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* График пропускной способности */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} />
                  <span>Bandwidth Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bandwidth" 
                      stroke="#00D4FF" 
                      fill="#00D4FF20"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* График задержки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Clock" size={20} />
                  <span>Network Latency</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="latency" 
                      stroke="#4ECDC4" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* График количества пакетов */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Package" size={20} />
                  <span>Packet Flow</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="packets" 
                      stroke="#FFD93D" 
                      fill="#FFD93D20"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Круговая диаграмма протоколов */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="PieChart" size={20} />
                  <span>Protocol Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={protocols}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {protocols.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="packets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Список пакетов */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="List" size={20} />
                  <span>Packet Capture</span>
                  <Badge variant="secondary">{filteredPackets.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {filteredPackets.slice(0, 50).map((packet) => (
                      <div 
                        key={packet.id}
                        onClick={() => setSelectedPacket(packet)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedPacket?.id === packet.id ? 'bg-primary/20 border-primary' : 'border-border'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant={packet.protocol === 'HTTP' ? 'default' : 'secondary'}>
                            {packet.protocol}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">{packet.timestamp}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-2">
                            <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                            <span className="font-mono text-xs">{packet.source} → {packet.destination}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{packet.size} bytes</span>
                            <div className="flex space-x-1">
                              {packet.flags.map(flag => (
                                <Badge key={flag} variant="outline" className="text-xs px-1 py-0">{flag}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Детали пакета */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} />
                  <span>Packet Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPacket ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                        <div className="font-mono text-sm">{selectedPacket.timestamp}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Protocol</label>
                        <Badge>{selectedPacket.protocol}</Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Source</label>
                        <div className="font-mono text-sm">{selectedPacket.source}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Destination</label>
                        <div className="font-mono text-sm">{selectedPacket.destination}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Size</label>
                      <div className="font-mono text-sm">{selectedPacket.size} bytes</div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Flags</label>
                      <div className="flex space-x-1">
                        {selectedPacket.flags.map(flag => (
                          <Badge key={flag} variant="outline">{flag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Payload Preview</label>
                      <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
                        {selectedPacket.payload}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Icon name="MousePointer" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a packet to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Фильтры */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Filter" size={20} />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Protocol</label>
                  <Select value={filters.protocol} onValueChange={(value) => setFilters(prev => ({ ...prev, protocol: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Protocols</SelectItem>
                      <SelectItem value="HTTP">HTTP</SelectItem>
                      <SelectItem value="HTTPS">HTTPS</SelectItem>
                      <SelectItem value="TCP">TCP</SelectItem>
                      <SelectItem value="UDP">UDP</SelectItem>
                      <SelectItem value="ICMP">ICMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source IP</label>
                  <Input 
                    placeholder="e.g. 192.168.1.100"
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination IP</label>
                  <Input 
                    placeholder="e.g. 10.0.0.15"
                    value={filters.destination}
                    onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Range</label>
                  <Select value={filters.timeRange} onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Payload</label>
                  <Input 
                    placeholder="Search in packet content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setFilters({ protocol: 'all', source: '', destination: '', timeRange: '1h' });
                    setSearchTerm('');
                  }}
                >
                  <Icon name="RotateCcw" size={14} className="mr-2" />
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
            
            {/* Результаты поиска */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Search" size={20} />
                  <span>Search Results</span>
                  <Badge variant="secondary">{filteredPackets.length} packets</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {filteredPackets.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No packets match your filters</p>
                      </div>
                    ) : (
                      filteredPackets.map((packet) => (
                        <div key={packet.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant={packet.protocol === 'HTTP' ? 'default' : 'secondary'}>
                                {packet.protocol}
                              </Badge>
                              <span className="text-sm font-mono">{packet.timestamp}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">{packet.size} bytes</div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-mono text-sm">{packet.source}</span>
                            <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                            <span className="font-mono text-sm">{packet.destination}</span>
                          </div>
                          
                          <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
                            {packet.payload}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;