import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

export default function BackupDiario() {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupLocation, setBackupLocation] = useState('pendrive');
  const [lastBackup, setLastBackup] = useState<Date | null>(new Date('2024-01-01T10:30:00'));

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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="h-8 w-8" />
              Backup Diário
            </h1>
            <p className="text-muted-foreground mt-2">
              Proteja seus dados com cópias de segurança regulares
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={needsBackup ? "destructive" : "success"} className="gap-2">
              {needsBackup ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              {needsBackup ? 'Backup Pendente' : 'Backup em Dia'}
            </Badge>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Último backup</p>
              <p className="font-medium">{formatDate(lastBackup)}</p>
            </div>
          </div>
        </div>

        {needsBackup && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <p className="font-medium text-yellow-800">Atenção: Backup necessário</p>
                <p className="text-yellow-700 text-sm mt-1">
                  O último backup foi feito há {daysSinceLastBackup} dias. Recomenda-se fazer backup diariamente para proteger seus dados.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="pen-drive" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="pen-drive" className="gap-2">
            <Usb className="h-4 w-4" />
            Pen Drive
          </TabsTrigger>
          <TabsTrigger value="windows" className="gap-2">
            <HardDrive className="h-4 w-4" />
            Windows
          </TabsTrigger>
          <TabsTrigger value="automatico" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Automático
          </TabsTrigger>
          <TabsTrigger value="restaurar" className="gap-2">
            <Upload className="h-4 w-4" />
            Restaurar
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: BACKUP EM PEN DRIVE (Baseado no manual) */}
        <TabsContent value="pen-drive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Usb className="h-5 w-5" />
                  Backup em Pen Drive
                </CardTitle>
                <CardDescription>
                  Siga os passos abaixo para fazer backup no Pen Drive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Insira o Pen Drive</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Conecte o Pen Drive na porta USB do seu computador
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Abra o Windows Explorer</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Localize o Disco Local (C:) do SERVIDOR
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Localize a pasta SOFVETW</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Clique com o botão direito do mouse sobre a pasta SOFVETW e selecione "ENVIAR PARA" → "disco removível"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Aguarde a transferência</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ao finalizar, retire o Pen Drive depois de escolher a opção "REMOVER HARDWARE COM SEGURANÇA"
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-eject" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Remover com segurança
                    </Label>
                    <Switch id="auto-eject" defaultChecked />
                  </div>

                  <Button
                    onClick={simulateBackup}
                    disabled={isBackingUp}
                    className="w-full gap-2"
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Importante
                </CardTitle>
                <CardDescription>
                  Informações essenciais sobre backup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Por que fazer backup diário?
                  </h4>
                  <p className="text-blue-700 text-sm mt-2">
                    Fazer o backup diariamente vai preveni-lo de grandes problemas. Caso ocorra algum problema com seu computador você pode recuperar todos os dados perdidos até a realização do último backup.
                  </p>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Atenção Windows 98
                  </h4>
                  <p className="text-red-700 text-sm mt-2">
                    A rotina interna de backup do SOFVET (Diversos → Backup diário) é compatível apenas para usuários de versões do Windows até a 98. Para versões mais recentes, use o método do Pen Drive.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Outras maneiras de backup</h4>
                  <p className="text-sm text-muted-foreground">
                    No nosso site você encontra o passo a passo de outras maneiras de fazer o backup.
                  </p>
                  <Button variant="outline" className="gap-2 w-full">
                    <ExternalLink className="h-4 w-4" />
                    Acessar Tutorial Completo
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Histórico de Backups</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Backup completo</p>
                          <p className="text-xs text-muted-foreground">Pen Drive - 2.4 GB</p>
                        </div>
                      </div>
                      <span className="text-sm">{formatDate(new Date('2024-01-01T10:30:00'))}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Backup incremental</p>
                          <p className="text-xs text-muted-foreground">Nuvem - 150 MB</p>
                        </div>
                      </div>
                      <span className="text-sm">{formatDate(new Date('2023-12-31T18:45:00'))}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isBackingUp && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Backup em Andamento
                </CardTitle>
                <CardDescription>
                  Não desligue o computador durante o processo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={backupProgress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Copiando arquivos...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 border rounded">
                      <p className="text-2xl font-bold">1,248</p>
                      <p className="text-xs text-muted-foreground">Arquivos</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-2xl font-bold">2.4 GB</p>
                      <p className="text-xs text-muted-foreground">Tamanho total</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-2xl font-bold">
                        {backupProgress < 50 ? '01:30' : '00:45'}
                      </p>
                      <p className="text-xs text-muted-foreground">Tempo restante</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ABA 2: WINDOWS (Para versões recentes) */}
        <TabsContent value="windows">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Backup para Windows 7/10/11
              </CardTitle>
              <CardDescription>
                Procedimento para versões mais recentes do Windows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Atenção:</strong> Para versões do Windows superiores ao 98, faça o backup copiando toda a pasta SOFVETW do seu servidor para um pendrive ou outra mídia externa.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Localização padrão do SOFVET:</h3>
                <div className="p-4 bg-gray-50 border rounded-lg font-mono text-sm">
                  C:\SOFVETW\
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta pasta contém todos os dados do sistema, incluindo fichas de animais, movimentos, tabelas, etc.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Locais alternativos de backup:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Usb className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">Pen Drive</p>
                    <p className="text-xs text-muted-foreground">Recomendado para backup rápido</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <HardDrive className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">HD Externo</p>
                    <p className="text-xs text-muted-foreground">Para grandes volumes de dados</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Database className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">Serviço de Nuvem</p>
                    <p className="text-xs text-muted-foreground">Backup automático e remoto</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Agendamento de Backup</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="schedule-backup" className="font-medium">
                      Backup Automático Diário
                    </Label>
                    <p className="text-sm text-muted-foreground">
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
                    <Label>Horário do backup</Label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Manter backups por</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" defaultValue="30" className="w-20" />
                      <span className="text-sm">dias</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: BACKUP AUTOMÁTICO */}
        <TabsContent value="automatico">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Backup Automático
              </CardTitle>
              <CardDescription>
                Configure backups automáticos para não se preocupar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Configurações</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Backup diário automático</Label>
                      <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                    </div>

                    <div className="space-y-2">
                      <Label>Frequência</Label>
                      <select className="w-full p-2 border rounded">
                        <option>Diário</option>
                        <option>Semanal</option>
                        <option>Mensal</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Horário preferencial</Label>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Destino do Backup</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Usb className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Pen Drive</p>
                          <p className="text-xs text-muted-foreground">Disponível</p>
                        </div>
                      </div>
                      <Badge variant="outline">Primário</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <HardDrive className="h-5 w-5" />
                        <div>
                          <p className="font-medium">HD Externo</p>
                          <p className="text-xs text-muted-foreground">Conectar</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Secundário</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Google Drive</p>
                          <p className="text-xs text-muted-foreground">Configurar</p>
                        </div>
                      </div>
                      <Badge variant="outline">Nuvem</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Notificações</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Notificar após backup</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Alertar se não fizer backup em 2 dias</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enviar relatório por email</Label>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button className="w-full gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 4: RESTAURAR BACKUP */}
        <TabsContent value="restaurar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Restaurar Backup
              </CardTitle>
              <CardDescription>
                Recupere seus dados a partir de um backup anterior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">Atenção: Operação crítica</p>
                    <p className="text-red-700 text-sm mt-1">
                      A restauração de backup irá sobrescrever todos os dados atuais. Certifique-se de ter um backup recente antes de prosseguir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Selecione o backup para restaurar</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-800 rounded-full p-2">
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Backup Completo</p>
                        <p className="text-sm text-muted-foreground">01/01/2024 10:30 • 2.4 GB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Selecionar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                        <Save className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Backup Incremental</p>
                        <p className="text-sm text-muted-foreground">31/12/2023 18:45 • 150 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Selecionar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full p-2">
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Backup Manual</p>
                        <p className="text-sm text-muted-foreground">25/12/2023 15:20 • 2.3 GB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Selecionar
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Opções de restauração</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Restaurar apenas fichas de animais</Label>
                      <p className="text-sm text-muted-foreground">Mantém configurações atuais</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Restaurar configurações do sistema</Label>
                      <p className="text-sm text-muted-foreground">Inclui tabelas e preferências</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Restaurar movimento financeiro</Label>
                      <p className="text-sm text-muted-foreground">Histórico de vendas e pagamentos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Confirmação</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm">
                    <strong>Arquivo selecionado:</strong> backup_20240101_1030.zip<br />
                    <strong>Tamanho:</strong> 2.4 GB<br />
                    <strong>Data do backup:</strong> 01/01/2024 10:30<br />
                    <strong>Itens a restaurar:</strong> 1.248 arquivos
                  </p>
                </div>

                <Button variant="destructive" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Iniciar Restauração
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lembretes baseados no manual */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium">Backup Diário</h4>
                <p className="text-sm text-muted-foreground">Faça backup todos os dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium">Prevenção</h4>
                <p className="text-sm text-muted-foreground">Evite perda de dados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <h4 className="font-medium">Atenção Windows</h4>
                <p className="text-sm text-muted-foreground">Método diferente para Win 7+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}