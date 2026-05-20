import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Loader2, Upload, Camera, Dog, Cat, User, Phone, MapPin,
  Calendar, Syringe, Shield, FileText, AlertCircle, CheckCircle,
  Plus, Trash2, Edit, History, Thermometer, Heart, Tag,
  Droplets, Palette, Ruler, Scale, Stethoscope, ArrowLeft,
  PawPrint, DollarSign, Eye, Mail, Ban, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const NovaFicha = () => {
  const [codigo, setCodigo] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagemUrl, setImagemUrl] = useState('');
  const [activeTab, setActiveTab] = useState('dados');

  const [formData, setFormData] = useState({
    nomeAnimal: '',
    especie: '',
    raca: '',
    pelagem: '',
    sexo: '',
    dataNascimento: '',
    cor: '',
    peso: '',
    altura: '',
    microchip: '',
    nomeProprietario: '',
    telefoneProprietario: '',
    emailProprietario: '',
    enderecoProprietario: '',
    observacoes: '',
    alergias: '',
    doencasCronicas: '',
    medicamentos: '',
  });

  // Estados para vacinas
  const [vacinasTabela, setVacinasTabela] = useState<Array<{ id: string, nome: string, doses: number, intervaloDias: number }>>([]);
  const [vacinaSelecionada, setVacinaSelecionada] = useState('');
  const [doseAtual, setDoseAtual] = useState(1);
  const [dataDose, setDataDose] = useState('');
  const [vacinasAplicadas, setVacinasAplicadas] = useState<Array<{
    nomeVacina: string;
    dose: number;
    dataAplicacao: string;
    proximaData?: string;
  }>>([]);

  // Estados para proprietários (simplificados)
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [dataNascimentoProp, setDataNascimentoProp] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [complemento, setComplemento] = useState('');
  const [ddd, setDdd] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [telefone3, setTelefone3] = useState('');
  const [marcado, setMarcado] = useState(false);
  const [motivoMarcacao, setMotivoMarcacao] = useState('');
  const [restricao, setRestricao] = useState(false);
  const [motivoRestricao, setMotivoRestricao] = useState('');

  // Carrega vacinas da tabela
  useEffect(() => {
    const carregarVacinasTabela = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'vacinas'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setVacinasTabela(lista);
      } catch (error) {
        console.error('Erro ao carregar vacinas tabela:', error);
      }
    };
    carregarVacinasTabela();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `animais/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImagemUrl(url);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  const adicionarVacina = () => {
    if (!vacinaSelecionada || !dataDose) {
      toast.error('Selecione a vacina e a data da dose');
      return;
    }

    const vacina = vacinasTabela.find(v => v.id === vacinaSelecionada);
    if (!vacina) return;

    const novaLista = [...vacinasAplicadas];

    // Dose aplicada
    novaLista.push({
      nomeVacina: vacina.nome,
      dose: doseAtual,
      dataAplicacao: dataDose,
      proximaData: '',
    });

    // Programação automática das próximas doses
    if (doseAtual < vacina.doses) {
      let dataAtual = new Date(dataDose);
      for (let i = doseAtual + 1; i <= vacina.doses; i++) {
        dataAtual = new Date(dataAtual.getTime() + vacina.intervaloDias * 24 * 60 * 60 * 1000);
        const dataFormatada = dataAtual.toISOString().split('T')[0];

        novaLista.push({
          nomeVacina: vacina.nome,
          dose: i,
          dataAplicacao: '',
          proximaData: dataFormatada,
        });
      }
    }

    setVacinasAplicadas(novaLista);
    setVacinaSelecionada('');
    setDoseAtual(1);
    setDataDose('');
    toast.success('Vacina registrada com sucesso!');
  };

  const removerVacina = (index: number) => {
    const novaLista = vacinasAplicadas.filter((_, i) => i !== index);
    setVacinasAplicadas(novaLista);
    toast.success('Vacina removida');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'animais'), {
        ...formData,
        imagemUrl,
        userId: user.uid,
        vacinas: vacinasAplicadas,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Ficha cadastrada com sucesso!');
      navigate('/fichas/lista');
    } catch (error) {
      console.error('Erro ao salvar ficha:', error);
      toast.error('Erro ao salvar ficha');
    } finally {
      setLoading(false);
    }
  };

  const gerarCodigoAutomatico = () => {
    const randomCodigo = `AN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setCodigo(randomCodigo);
  };

  const especies = [
    { value: 'canino', label: 'Canino', icon: Dog },
    { value: 'felino', label: 'Felino', icon: Cat },
    { value: 'ave', label: 'Ave', icon: Thermometer },
    { value: 'roedor', label: 'Roedor', icon: Heart },
    { value: 'outro', label: 'Outro', icon: Tag },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
              <Dog className="h-6 w-6 text-primary" />
            </div>
            <Badge className="bg-primary/20 text-primary-foreground/80 border border-primary/30">
              <Plus className="h-3 w-3 mr-1" />
              Nova Ficha
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gradient">
            Cadastrar Novo Animal
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados para criar uma nova ficha de paciente
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-input text-muted-foreground hover:text-foreground hover:bg-muted gap-2"
            onClick={() => navigate('/fichas/lista')}
          >
            <History className="h-4 w-4" />
            Ver Todas
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 gap-2"
            onClick={(e) => handleSubmit(e)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Salvar Ficha
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 bg-muted border border-border p-1 rounded-lg">
          <TabsTrigger value="dados" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            <Dog className="h-4 w-4 mr-2" />
            Dados
          </TabsTrigger>
          <TabsTrigger value="proprietario" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            <User className="h-4 w-4 mr-2" />
            Proprietário
          </TabsTrigger>
          <TabsTrigger value="vacinas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            <Syringe className="h-4 w-4 mr-2" />
            Vacinas
          </TabsTrigger>
          <TabsTrigger value="saude" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            <Heart className="h-4 w-4 mr-2" />
            Saúde
          </TabsTrigger>
          <TabsTrigger value="foto" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            <Camera className="h-4 w-4 mr-2" />
            Foto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Foto do Animal */}
            <Card className="lg:col-span-1 bg-card border border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Camera className="h-5 w-5 text-primary" />
                  Foto do Animal
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Envie uma foto para identificar melhor
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-border bg-muted">
                  {imagemUrl ? (
                    <img
                      src={imagemUrl}
                      alt="Animal"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Camera className="h-20 w-20 mb-4 opacity-30" />
                      <span className="text-sm">Nenhuma foto</span>
                    </div>
                  )}
                </div>
                <label className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="foto-animal"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage}
                    className="w-full gap-2 border-input text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => document.getElementById('foto-animal')?.click()}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {imagemUrl ? 'Alterar Foto' : 'Adicionar Foto'}
                      </>
                    )}
                  </Button>
                </label>
              </CardContent>
            </Card>

            {/* Dados do Animal */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border border-primary/20 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Dog className="h-5 w-5 text-blue-500" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Nome do Animal *</Label>
                      <Input
                        name="nomeAnimal"
                        value={formData.nomeAnimal}
                        onChange={handleChange}
                        required
                        className="bg-background border-input focus:border-primary focus:ring-primary"
                        placeholder="Ex: Rex, Luna, Thor"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-card-foreground">Espécie</Label>
                      <Select onValueChange={handleSelectChange('especie')} value={formData.especie}>
                        <SelectTrigger className="bg-background border-input">
                          <SelectValue placeholder="Selecione a espécie" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {especies.map((especie) => (
                            <SelectItem key={especie.value} value={especie.value} className="flex items-center gap-2">
                              <especie.icon className="h-4 w-4" />
                              {especie.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-card-foreground">Raça</Label>
                      <Input
                        name="raca"
                        value={formData.raca}
                        onChange={handleChange}
                        className="bg-background border-input focus:border-primary focus:ring-primary"
                        placeholder="Ex: Labrador, Siames"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-card-foreground">Sexo</Label>
                      <Select onValueChange={handleSelectChange('sexo')} value={formData.sexo}>
                        <SelectTrigger className="bg-background border-input">
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="macho">Macho</SelectItem>
                          <SelectItem value="femea">Fêmea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-card-foreground">Data de Nascimento</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          name="dataNascimento"
                          value={formData.dataNascimento}
                          onChange={handleChange}
                          className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-card-foreground">Cor</Label>
                      <div className="relative">
                        <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="cor"
                          value={formData.cor}
                          onChange={handleChange}
                          className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                          placeholder="Ex: Marrom, Branco"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-card-foreground">Pelagem</Label>
                      <div className="relative">
                        <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="pelagem"
                          value={formData.pelagem}
                          onChange={handleChange}
                          className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                          placeholder="Ex: Curta, Longa"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-card-foreground">Peso (kg)</Label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="peso"
                          value={formData.peso}
                          onChange={handleChange}
                          className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                          placeholder="Ex: 25.5"
                          type="number"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-primary/20 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Stethoscope className="h-5 w-5 text-purple-500" />
                    Identificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Número do Microchip</Label>
                      <Input
                        name="microchip"
                        value={formData.microchip}
                        onChange={handleChange}
                        className="bg-background border-input focus:border-primary focus:ring-primary"
                        placeholder="Código único de identificação"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="proprietario" className="mt-6">
          <Card className="bg-card border border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <User className="h-5 w-5 text-emerald-500" />
                Informações do Proprietário
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Dados de contato do responsável pelo animal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Nome *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="nomeProprietario"
                      value={formData.nomeProprietario}
                      onChange={handleChange}
                      required
                      className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                      placeholder="Nome completo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="telefoneProprietario"
                      value={formData.telefoneProprietario}
                      onChange={handleChange}
                      className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">E-mail</Label>
                  <Input
                    name="emailProprietario"
                    value={formData.emailProprietario}
                    onChange={handleChange}
                    className="bg-background border-input focus:border-primary focus:ring-primary"
                    placeholder="email@exemplo.com"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Endereço</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      name="enderecoProprietario"
                      value={formData.enderecoProprietario}
                      onChange={handleChange}
                      rows={3}
                      className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                      placeholder="Rua, número, bairro, cidade - Estado"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacinas" className="mt-6">
          <Card className="bg-card border border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Syringe className="h-5 w-5 text-cyan-500" />
                Controle de Vacinação
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Registre as vacinas aplicadas e programe as próximas doses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Vacina</Label>
                  <Select onValueChange={(value) => setVacinaSelecionada(value)} value={vacinaSelecionada}>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Selecione uma vacina" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {vacinasTabela.map((vacina) => (
                        <SelectItem key={vacina.id} value={vacina.id} className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {vacina.nome} ({vacina.doses} doses)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground">Dose Atual</Label>
                  <Select onValueChange={(value) => setDoseAtual(Number(value))} value={doseAtual.toString()}>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Dose" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {[1, 2, 3, 4].map((dose) => (
                        <SelectItem key={dose} value={dose.toString()}>
                          {dose}ª dose
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground">Data da Dose</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dataDose}
                      onChange={(e) => setDataDose(e.target.value)}
                      className="bg-background border-input focus:border-primary focus:ring-primary pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={adicionarVacina}
                    type="button"
                    disabled={!vacinaSelecionada || !dataDose}
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    Aplicar Dose
                  </Button>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Lista de vacinas aplicadas e programadas */}
              {vacinasAplicadas.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-card-foreground">Histórico de Vacinação</h3>
                    <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/30">
                      {vacinasAplicadas.length} registro{vacinasAplicadas.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Vacina</TableHead>
                          <TableHead className="text-muted-foreground">Dose</TableHead>
                          <TableHead className="text-muted-foreground">Data Aplicação</TableHead>
                          <TableHead className="text-muted-foreground">Próxima Dose</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                          <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vacinasAplicadas.map((v, index) => (
                          <TableRow key={index} className="border-border hover:bg-muted/50">
                            <TableCell className="font-medium text-card-foreground">{v.nomeVacina}</TableCell>
                            <TableCell className="text-card-foreground">{v.dose}ª dose</TableCell>
                            <TableCell className="text-card-foreground">
                              {v.dataAplicacao ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  {new Date(v.dataAplicacao).toLocaleDateString('pt-BR')}
                                </div>
                              ) : '-'}
                            </TableCell>
                            <TableCell className="text-card-foreground">
                              {v.proximaData ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  {new Date(v.proximaData).toLocaleDateString('pt-BR')}
                                </div>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge className={cn(
                                "border",
                                v.proximaData
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                              )}>
                                {v.proximaData ? 'Programada' : 'Completa'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removerVacina(index)}
                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Syringe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Nenhuma vacina registrada</p>
                  <p className="text-muted-foreground/70 text-sm mt-2">
                    Adicione a primeira vacina usando o formulário acima
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saude" className="mt-6">
          <Card className="bg-card border border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Heart className="h-5 w-5 text-rose-500" />
                Histórico de Saúde
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Informações médicas importantes sobre o animal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Alergias Conhecidas</Label>
                  <Textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleChange}
                    rows={3}
                    className="bg-background border-input focus:border-primary focus:ring-primary"
                    placeholder="Liste as alergias do animal..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Doenças Crônicas</Label>
                  <Textarea
                    name="doencasCronicas"
                    value={formData.doencasCronicas}
                    onChange={handleChange}
                    rows={3}
                    className="bg-background border-input focus:border-primary focus:ring-primary"
                    placeholder="Doenças preexistentes..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Medicamentos em Uso</Label>
                <Textarea
                  name="medicamentos"
                  value={formData.medicamentos}
                  onChange={handleChange}
                  rows={3}
                  className="bg-background border-input focus:border-primary focus:ring-primary"
                  placeholder="Medicamentos de uso contínuo..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Observações Gerais</Label>
                <Textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={5}
                  className="bg-background border-input focus:border-primary focus:ring-primary"
                  placeholder="Informações adicionais sobre saúde, comportamento, etc..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="foto" className="mt-6">
          <Card className="bg-card border border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Camera className="h-5 w-5 text-purple-500" />
                Galeria de Fotos
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Adicione fotos para documentação visual do animal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="main-photo"
                  />
                  <label htmlFor="main-photo" className="cursor-pointer text-center p-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Clique para adicionar</p>
                    <p className="text-sm text-muted-foreground/70">ou arraste uma imagem</p>
                  </label>
                </div>

                {imagemUrl && (
                  <div className="aspect-square rounded-xl overflow-hidden border border-border relative group">
                    <img
                      src={imagemUrl}
                      alt="Animal"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-white hover:bg-gray-800/30"
                        onClick={() => document.getElementById('main-photo')?.click()}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Alterar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={() => navigate('/fichas/lista')}
          className="border-input text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          Cancelar
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-input text-muted-foreground hover:text-foreground hover:bg-muted gap-2"
            onClick={() => setActiveTab('dados')}
          >
            <FileText className="h-4 w-4" />
            Pré-visualizar
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.nomeAnimal || !formData.nomeProprietario}
            onClick={handleSubmit}
            className="gap-2 bg-primary hover:bg-primary/90 px-8 py-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Salvando Ficha...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Salvar Ficha do Animal
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NovaFicha;