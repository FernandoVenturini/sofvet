import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Upload,
  HardDrive,
  Save,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Usb,
  Database,
  RefreshCw,
  Cloud,
  ShieldCheck,
  History,
  FileArchive,
  FileText,
  Server,
  Layers,
  Copy,
  AlertCircle,
  Zap,
  Bell,
  Settings,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function BackupDiario() {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupLocation, setBackupLocation] = useState('pendrive');
  const [lastBackup, setLastBackup] = useState<Date | null>(new Date('2024-01-01T10:30:00'));
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  // Simular processo de backup
  const simulateBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          setLastBackup(new Date());
          toast.success('Backup concluído com sucesso!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Formatador de data
  const formatDate = (date: Date | null) => {
    if (!date) return 'Nunca';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular dias desde o último backup
  const getDaysSinceLastBackup = () => {
    if (!lastBackup) return Infinity;
    const diffTime = Math.abs(new Date().getTime() - lastBackup.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysSinceLastBackup = getDaysSinceLastBackup();
  const needsBackup = daysSinceLastBackup > 1;

  const backupStats = {
    totalFiles: 1248,
    totalSize: 2.4,
    avgDuration: '2m 30s',
    successRate: 99.8
  };

  const backupHistory = [
    { id: '1', date: new Date('2024-01-01T10:30:00'), type: 'Completo', size: 2.4, location: 'Pen Drive', status: 'success' },
    { id: '2', date: new Date('2023-12-31T18:45:00'), type: 'Incremental', size: 0.15, location: 'Nuvem', status: 'success' },
    { id: '3', date: new Date('2023-12-25T15:20:00'), type: 'Completo', size: 2.3, location: 'HD Externo', status: 'success' },
    { id: '4', date: new Date('2023-12-20T09:15:00'), type: 'Incremental', size: 0.12, location: 'Pen Drive', status: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
              <ShieldCheck className="h-6 w-6 text-red-400" />
            </div>
            <Badge className={cn(
              "bg-gradient-to-r border",
              needsBackup 
                ? "from-red-600/20 to-pink-600/20 text-red-300 border-red-500/30"
                : "from-emerald-600/20 to-green-600/20 text-emerald-300 border-emerald-500/30"
            )}>
              {needsBackup ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Backup Pendente
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Backup em Dia
                </>
              )}
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Backup Diário
          </h1>
          <p className="text-gray-400 mt-2">
            Proteja seus dados com cópias de segurança regulares
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-sm text-gray-400">Último backup</p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <p className="font-medium text-white">{formatDate(lastBackup)}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30 gap-2"
            onClick={() => {
              toast.info('Relatório gerado com sucesso');
            }}
          >
            <FileText className="h-4 w-4" />
            Relatório
          </Button>
          <Button 
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 gap-2"
            onClick={simulateBackup}
            disabled={isBackingUp}
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Backup em andamento...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Fazer Backup Agora
              </>
            )}
          </Button>
        </div>
      </div>

      {needsBackup && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-600/10 to-pink-600/10 border border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-300">Atenção: Backup necessário</p>
              <p className="text-red-400/80 text-sm mt-1">
                O último backup foi feito há {daysSinceLastBackup} dias. Recomenda-se fazer backup diariamente para proteger seus dados.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Arquivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{backupStats.totalFiles.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Arquivos protegidos</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                <FileArchive className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tamanho Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{backupStats.totalSize} GB</p>
                <p className="text-sm text-gray-400">Dados armazenados</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                <Database className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{backupStats.successRate}%</p>
                <p className="text-sm text-gray-400">Backups bem-sucedidos</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Duração Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{backupStats.avgDuration}</p>
                <p className="text-sm text-gray-400">Por backup</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendrive" className="w-full">
        <TabsList className="grid grid-cols-4 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
          <TabsTrigger 
            value="pendrive" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
          >
            <Usb className="h-4 w-4 mr-2" />
            Pen Drive
          </TabsTrigger>
          <TabsTrigger 
            value="windows" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
          >
            <HardDrive className="h-4 w-4 mr-2" />
            Windows
          </TabsTrigger>
          <TabsTrigger 
            value="automatico" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Automático
          </TabsTrigger>
          <TabsTrigger 
            value="restaurar" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30"
          >
            <Upload className="h-4 w-4 mr-2" />
            Restaurar
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: BACKUP EM PEN DRIVE */}
        <TabsContent value="pendrive" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Usb className="h-5 w-5 text-red-400" />
                  Backup em Pen Drive
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Siga os passos abaixo para fazer backup no Pen Drive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: "Insira o Pen Drive",
                      description: "Conecte o Pen Drive na porta USB do seu computador"
                    },
                    {
                      step: 2,
                      title: "Abra o Windows Explorer",
                      description: "Localize o Disco Local (C:) do SERVIDOR"
                    },
                    {
                      step: 3,
                      title: "Localize a pasta SOFVETW",
                      description: 'Clique com o botão direito do mouse sobre a pasta SOFVETW e selecione "ENVIAR PARA" → "disco removível"'
                    },
                    {
                      step: 4,
                      title: "Aguarde a transferência",
                      description: 'Ao finalizar, retire o Pen Drive depois de escolher a opção "REMOVER HARDWARE COM SEGURANÇA"'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 transition-colors group">
                      <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 text-red-300 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-800/50" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                    <Label htmlFor="auto-eject" className="flex items-center gap-2 text-white">
                      <Shield className="h-4 w-4 text-red-400" />
                      Remover com segurança
                    </Label>
                    <Switch id="auto-eject" defaultChecked />
                  </div>

                  <Button
                    onClick={simulateBackup}
                    disabled={isBackingUp}
                    className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    {isBackingUp ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Fazendo Backup...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Iniciar Backup no Pen Drive
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Informações Importantes
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Dicas e recomendações essenciais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30">
                  <h4 className="font-medium text-blue-300 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Por que fazer backup diário?
                  </h4>
                  <p className="text-blue-400/80 text-sm mt-2">
                    Fazer o backup diariamente vai preveni-lo de grandes problemas. Caso ocorra algum problema com seu computador você pode recuperar todos os dados perdidos até a realização do último backup.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-red-600/10 to-pink-600/10 border border-red-500/30">
                  <h4 className="font-medium text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Atenção Windows 98
                  </h4>
                  <p className="text-red-400/80 text-sm mt-2">
                    A rotina interna de backup do SOFVET (Diversos → Backup diário) é compatível apenas para usuários de versões do Windows até a 98. Para versões mais recentes, use o método do Pen Drive.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Outras maneiras de backup</h4>
                  <p className="text-sm text-gray-400">
                    No nosso site você encontra o passo a passo de outras maneiras de fazer o backup.
                  </p>
                  <Button variant="outline" className="w-full gap-2 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30">
                    <ExternalLink className="h-4 w-4" />
                    Acessar Tutorial Completo
                  </Button>
                </div>

                <Separator className="bg-gray-800/50" />

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Histórico de Backups</h4>
                  <div className="space-y-2">
                    {backupHistory.slice(0, 2).map((backup) => (
                      <div key={backup.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <div>
                            <p className="font-medium text-white">Backup {backup.type.toLowerCase()}</p>
                            <p className="text-xs text-gray-400">{backup.location} - {backup.size} GB</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{formatDate(backup.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA 2: WINDOWS */}
        <TabsContent value="windows" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-blue-400" />
                Backup para Windows 7/10/11
              </CardTitle>
              <CardDescription className="text-gray-400">
                Procedimento para versões mais recentes do Windows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30">
                <p className="text-amber-400 text-sm">
                  <strong>Atenção:</strong> Para versões do Windows superiores ao 98, faça o backup copiando toda a pasta SOFVETW do seu servidor para um pendrive ou outra mídia externa.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-white text-lg">Localização padrão do SOFVET:</h3>
                <div className="p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 font-mono text-sm text-cyan-300">
                  C:\SOFVETW\
                </div>
                <p className="text-sm text-gray-400">
                  Esta pasta contém todos os dados do sistema, incluindo fichas de animais, movimentos, tabelas, etc.
                </p>
              </div>

              <Separator className="bg-gray-800/50" />

              <div className="space-y-4">
                <h3 className="font-medium text-white text-lg">Locais alternativos de backup:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Usb, title: 'Pen Drive', desc: 'Recomendado para backup rápido', color: 'from-blue-600/20 to-cyan-600/20' },
                    { icon: HardDrive, title: 'HD Externo', desc: 'Para grandes volumes de dados', color: 'from-purple-600/20 to-pink-600/20' },
                    { icon: Cloud, title: 'Serviço de Nuvem', desc: 'Backup automático e remoto', color: 'from-emerald-600/20 to-green-600/20' },
                  ].map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-black/30 border border-gray-800/50 hover:border-red-500/30 transition-colors text-center group">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} inline-block group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <p className="font-medium text-white mt-3">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-800/50" />

              <div className="space-y-4">
                <h3 className="font-medium text-white text-lg">Agendamento de Backup</h3>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                  <div>
                    <Label htmlFor="schedule-backup" className="font-medium text-white">
                      Backup Automático Diário
                    </Label>
                    <p className="text-sm text-gray-400">
                      Executar backup automaticamente às 18:00
                    </p>
                  </div>
                  <Switch
                    id="schedule-backup"
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Horário do backup</Label>
                    <Input type="time" defaultValue="18:00" className="bg-gray-900/50 border-gray-700/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Manter backups por</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="30" className="w-20 bg-gray-900/50 border-gray-700/50 text-white" />
                      <span className="text-sm text-gray-400">dias</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: BACKUP AUTOMÁTICO */}
        <TabsContent value="automatico" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-cyan-400" />
                Backup Automático
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure backups automáticos para não se preocupar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-white text-lg">Configurações</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                      <Label className="text-white">Backup diário automático</Label>
                      <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Frequência</Label>
                      <select className="w-full p-2 rounded-lg bg-gray-900/50 border-gray-700/50 text-white">
                        <option>Diário</option>
                        <option>Semanal</option>
                        <option>Mensal</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Horário preferencial</Label>
                      <Input type="time" defaultValue="18:00" className="bg-gray-900/50 border-gray-700/50 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-white text-lg">Destino do Backup</h3>

                  <div className="space-y-3">
                    {[
                      { icon: Usb, name: 'Pen Drive', status: 'Disponível', badge: 'Primário' },
                      { icon: HardDrive, name: 'HD Externo', status: 'Conectar', badge: 'Secundário' },
                      { icon: Cloud, name: 'Google Drive', status: 'Configurar', badge: 'Nuvem' },
                    ].map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <location.icon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-white">{location.name}</p>
                            <p className="text-xs text-gray-400">{location.status}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-gray-700 text-gray-400">
                          {location.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-800/50" />

              <div className="space-y-4">
                <h3 className="font-medium text-white text-lg">Notificações</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                    <Label className="text-white">Notificar após backup</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                    <Label className="text-white">Alertar se não fizer backup em 2 dias</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                    <Label className="text-white">Enviar relatório por email</Label>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 4: RESTAURAR BACKUP */}
        <TabsContent value="restaurar" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-400" />
                Restaurar Backup
              </CardTitle>
              <CardDescription className="text-gray-400">
                Recupere seus dados a partir de um backup anterior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-600/10 to-pink-600/10 border border-red-500/30">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-300">Atenção: Operação crítica</p>
                    <p className="text-red-400/80 text-sm mt-1">
                      A restauração de backup irá sobrescrever todos os dados atuais. Certifique-se de ter um backup recente antes de prosseguir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-white text-lg">Selecione o backup para restaurar</h3>

                <div className="space-y-3">
                  {backupHistory.map((backup) => (
                    <div 
                      key={backup.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all",
                        selectedBackup === backup.id
                          ? "bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30"
                          : "bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/50 border border-gray-800/30"
                      )}
                      onClick={() => setSelectedBackup(backup.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "rounded-full p-2",
                          backup.status === 'success' 
                            ? "bg-gradient-to-br from-emerald-600/20 to-green-600/20"
                            : "bg-gradient-to-br from-amber-600/20 to-orange-600/20"
                        )}>
                          <Database className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Backup {backup.type}</p>
                          <p className="text-sm text-gray-400">
                            {formatDate(backup.date)} • {backup.size} GB • {backup.location}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant={selectedBackup === backup.id ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          selectedBackup === backup.id
                            ? "bg-gradient-to-r from-red-600 to-pink-600"
                            : "border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/30"
                        )}
                      >
                        {selectedBackup === backup.id ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-800/50" />

              <div className="space-y-4">
                <h3 className="font-medium text-white text-lg">Opções de restauração</h3>

                <div className="space-y-3">
                  {[
                    { label: 'Restaurar apenas fichas de animais', description: 'Mantém configurações atuais', default: false },
                    { label: 'Restaurar configurações do sistema', description: 'Inclui tabelas e preferências', default: true },
                    { label: 'Restaurar movimento financeiro', description: 'Histórico de vendas e pagamentos', default: true },
                  ].map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                      <div>
                        <Label className="font-medium text-white">{option.label}</Label>
                        <p className="text-sm text-gray-400">{option.description}</p>
                      </div>
                      <Switch defaultChecked={option.default} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-white text-lg">Confirmação</h3>
                <div className="p-4 rounded-lg bg-gradient-to-r from-gray-800/30 to-transparent">
                  <p className="text-sm text-gray-300">
                    <strong>Arquivo selecionado:</strong> backup_20240101_1030.zip<br />
                    <strong>Tamanho:</strong> 2.4 GB<br />
                    <strong>Data do backup:</strong> 01/01/2024 10:30<br />
                    <strong>Itens a restaurar:</strong> 1.248 arquivos
                  </p>
                </div>

                <Button variant="destructive" className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                  <Upload className="h-4 w-4" />
                  Iniciar Restauração
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Backup em Andamento */}
      {isBackingUp && (
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-red-400 animate-spin" />
              Backup em Andamento
            </CardTitle>
            <CardDescription className="text-gray-400">
              Não desligue o computador durante o processo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={backupProgress} className="h-2 bg-gray-800/50 [&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-pink-500" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Copiando arquivos...</span>
                <span className="text-white font-medium">{backupProgress}%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-black/30 border border-gray-800/50">
                  <p className="text-2xl font-bold text-white">{backupStats.totalFiles}</p>
                  <p className="text-xs text-gray-400">Arquivos</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-black/30 border border-gray-800/50">
                  <p className="text-2xl font-bold text-white">{backupStats.totalSize} GB</p>
                  <p className="text-xs text-gray-400">Tamanho total</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-black/30 border border-gray-800/50">
                  <p className="text-2xl font-bold text-white">
                    {backupProgress < 50 ? '01:30' : '00:45'}
                  </p>
                  <p className="text-xs text-gray-400">Tempo restante</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lembretes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Backup Diário</h4>
                <p className="text-sm text-gray-400">Faça backup todos os dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-600/20">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Prevenção</h4>
                <p className="text-sm text-gray-400">Evite perda de dados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Atenção Windows</h4>
                <p className="text-sm text-gray-400">Método diferente para Win 7+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}