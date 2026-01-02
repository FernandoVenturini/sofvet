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
import { 
  Loader2, Upload, Camera, Dog, Cat, User, Phone, MapPin, 
  Calendar, Syringe, Shield, FileText, AlertCircle, CheckCircle,
  Plus, Trash2, Edit, History, Thermometer, Heart, Tag, 
  Droplets, Palette, Ruler, Scale, Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NovaFicha = () => {
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
  const [vacinasTabela, setVacinasTabela] = useState<Array<{id: string, nome: string, doses: number, intervaloDias: number}>>([]);
  const [vacinaSelecionada, setVacinaSelecionada] = useState('');
  const [doseAtual, setDoseAtual] = useState(1);
  const [dataDose, setDataDose] = useState('');
  const [vacinasAplicadas, setVacinasAplicadas] = useState<Array<{
    nomeVacina: string;
    dose: number;
    dataAplicacao: string;
    proximaData?: string;
  }>>([]);

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
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const adicionarVacina = () => {
    if (!vacinaSelecionada || !dataDose) {
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
  };

  const removerVacina = (index: number) => {
    const novaLista = vacinasAplicadas.filter((_, i) => i !== index);
    setVacinasAplicadas(novaLista);
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

      navigate('/fichas/lista');
    } catch (error) {
      console.error('Erro ao salvar ficha:', error);
    } finally {
      setLoading(false);
    }
  };

  const especies = [
    { value: 'canino', label: 'Canino', icon: Dog },
    { value: 'felino', label: 'Felino', icon: Cat },
    { value: 'ave', label: 'Ave', icon: Thermometer },
    { value: 'roedor', label: 'Roedor', icon: Heart },
    { value: 'outro', label: 'Outro', icon: Tag },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30">
              <Dog className="h-6 w-6 text-red-400" />
            </div>
            <Badge className="bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 border border-red-500/30">
              <Plus className="h-3 w-3 mr-1" />
              Nova Ficha
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Cadastrar Novo Animal
          </h1>
          <p className="text-gray-400 mt-2">
            Preencha os dados para criar uma nova ficha de paciente
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30 gap-2"
            onClick={() => navigate('/fichas/lista')}
          >
            <History className="h-4 w-4" />
            Ver Todas
          </Button>
          <Button 
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 gap-2"
            onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
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
        <TabsList className="grid grid-cols-5 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800/50 p-1">
          <TabsTrigger value="dados" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
            <Dog className="h-4 w-4 mr-2" />
            Dados
          </TabsTrigger>
          <TabsTrigger value="proprietario" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
            <User className="h-4 w-4 mr-2" />
            Proprietário
          </TabsTrigger>
          <TabsTrigger value="vacinas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
            <Syringe className="h-4 w-4 mr-2" />
            Vacinas
          </TabsTrigger>
          <TabsTrigger value="saude" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
            <Heart className="h-4 w-4 mr-2" />
            Saúde
          </TabsTrigger>
          <TabsTrigger value="foto" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/30 data-[state=active]:to-pink-600/30">
            <Camera className="h-4 w-4 mr-2" />
            Foto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Foto do Animal */}
            <Card className="lg:col-span-1 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-red-400" />
                  Foto do Animal
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Envie uma foto para identificar melhor
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-black/50">
                  {imagemUrl ? (
                    <img 
                      src={imagemUrl} 
                      alt="Animal" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
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
                    className="w-full gap-2 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30"
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
              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dog className="h-5 w-5 text-blue-400" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Nome do Animal *</Label>
                      <Input
                        name="nomeAnimal"
                        value={formData.nomeAnimal}
                        onChange={handleChange}
                        required
                        className="bg-gray-900/50 border-gray-700/50 text-white"
                        placeholder="Ex: Rex, Luna, Thor"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Espécie</Label>
                      <Select onValueChange={handleSelectChange('especie')} value={formData.especie}>
                        <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="Selecione a espécie" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800">
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
                      <Label className="text-white">Raça</Label>
                      <Input
                        name="raca"
                        value={formData.raca}
                        onChange={handleChange}
                        className="bg-gray-900/50 border-gray-700/50 text-white"
                        placeholder="Ex: Labrador, Siames"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Sexo</Label>
                      <Select onValueChange={handleSelectChange('sexo')} value={formData.sexo}>
                        <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          <SelectItem value="macho">Macho</SelectItem>
                          <SelectItem value="femea">Fêmea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Data de Nascimento</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="date"
                          name="dataNascimento"
                          value={formData.dataNascimento}
                          onChange={handleChange}
                          className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Cor</Label>
                      <div className="relative">
                        <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          name="cor"
                          value={formData.cor}
                          onChange={handleChange}
                          className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                          placeholder="Ex: Marrom, Branco"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Pelagem</Label>
                      <div className="relative">
                        <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          name="pelagem"
                          value={formData.pelagem}
                          onChange={handleChange}
                          className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                          placeholder="Ex: Curta, Longa"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Peso (kg)</Label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          name="peso"
                          value={formData.peso}
                          onChange={handleChange}
                          className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                          placeholder="Ex: 25.5"
                          type="number"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-purple-400" />
                    Identificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Número do Microchip</Label>
                      <Input
                        name="microchip"
                        value={formData.microchip}
                        onChange={handleChange}
                        className="bg-gray-900/50 border-gray-700/50 text-white"
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
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-400" />
                Informações do Proprietário
              </CardTitle>
              <CardDescription className="text-gray-400">
                Dados de contato do responsável pelo animal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Nome *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      name="nomeProprietario"
                      value={formData.nomeProprietario}
                      onChange={handleChange}
                      required
                      className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                      placeholder="Nome completo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      name="telefoneProprietario"
                      value={formData.telefoneProprietario}
                      onChange={handleChange}
                      className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">E-mail</Label>
                  <Input
                    name="emailProprietario"
                    value={formData.emailProprietario}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-700/50 text-white"
                    placeholder="email@exemplo.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Textarea
                    name="enderecoProprietario"
                    value={formData.enderecoProprietario}
                    onChange={handleChange}
                    rows={3}
                    className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                    placeholder="Rua, número, bairro, cidade - Estado"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacinas" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-cyan-400" />
                Controle de Vacinação
              </CardTitle>
              <CardDescription className="text-gray-400">
                Registre as vacinas aplicadas e programe as próximas doses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Vacina</Label>
                  <Select onValueChange={(value) => setVacinaSelecionada(value)} value={vacinaSelecionada}>
                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Selecione uma vacina" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
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
                  <Label className="text-white">Dose Atual</Label>
                  <Select onValueChange={(value) => setDoseAtual(Number(value))} value={doseAtual.toString()}>
                    <SelectTrigger className="bg-gray-900/50 border-gray-700/50 text-white">
                      <SelectValue placeholder="Dose" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      {[1, 2, 3, 4].map((dose) => (
                        <SelectItem key={dose} value={dose.toString()}>
                          {dose}ª dose
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Data da Dose</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="date"
                      value={dataDose}
                      onChange={(e) => setDataDose(e.target.value)}
                      className="bg-gray-900/50 border-gray-700/50 text-white pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={adicionarVacina} 
                    type="button" 
                    disabled={!vacinaSelecionada || !dataDose}
                    className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    <Plus className="h-4 w-4" />
                    Aplicar Dose
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-800/50" />

              {/* Lista de vacinas aplicadas e programadas */}
              {vacinasAplicadas.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Histórico de Vacinação</h3>
                    <Badge className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
                      {vacinasAplicadas.length} registro{vacinasAplicadas.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="rounded-lg border border-gray-800/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800/50">
                          <TableHead className="text-gray-400">Vacina</TableHead>
                          <TableHead className="text-gray-400">Dose</TableHead>
                          <TableHead className="text-gray-400">Data Aplicação</TableHead>
                          <TableHead className="text-gray-400">Próxima Dose</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                          <TableHead className="text-gray-400 text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vacinasAplicadas.map((v, index) => (
                          <TableRow key={index} className="border-gray-800/30 hover:bg-gray-800/20">
                            <TableCell className="font-medium text-white">{v.nomeVacina}</TableCell>
                            <TableCell className="text-white">{v.dose}ª dose</TableCell>
                            <TableCell className="text-white">
                              {v.dataAplicacao ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3 text-gray-500" />
                                  {new Date(v.dataAplicacao).toLocaleDateString('pt-BR')}
                                </div>
                              ) : '-'}
                            </TableCell>
                            <TableCell className="text-white">
                              {v.proximaData ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3 text-gray-500" />
                                  {new Date(v.proximaData).toLocaleDateString('pt-BR')}
                                </div>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge className={cn(
                                "bg-gradient-to-r border",
                                v.proximaData 
                                  ? "from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30"
                                  : "from-emerald-600/20 to-green-600/20 text-emerald-400 border-emerald-500/30"
                              )}>
                                {v.proximaData ? 'Programada' : 'Completa'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removerVacina(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
                  <Syringe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Nenhuma vacina registrada</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Adicione a primeira vacina usando o formulário acima
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saude" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                Histórico de Saúde
              </CardTitle>
              <CardDescription className="text-gray-400">
                Informações médicas importantes sobre o animal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Alergias Conhecidas</Label>
                  <Textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleChange}
                    rows={3}
                    className="bg-gray-900/50 border-gray-700/50 text-white"
                    placeholder="Liste as alergias do animal..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Doenças Crônicas</Label>
                  <Textarea
                    name="doencasCronicas"
                    value={formData.doencasCronicas}
                    onChange={handleChange}
                    rows={3}
                    className="bg-gray-900/50 border-gray-700/50 text-white"
                    placeholder="Doenças preexistentes..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Medicamentos em Uso</Label>
                <Textarea
                  name="medicamentos"
                  value={formData.medicamentos}
                  onChange={handleChange}
                  rows={3}
                  className="bg-gray-900/50 border-gray-700/50 text-white"
                  placeholder="Medicamentos de uso contínuo..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Observações Gerais</Label>
                <Textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={5}
                  className="bg-gray-900/50 border-gray-700/50 text-white"
                  placeholder="Informações adicionais sobre saúde, comportamento, etc..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="foto" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-400" />
                Galeria de Fotos
              </CardTitle>
              <CardDescription className="text-gray-400">
                Adicione fotos para documentação visual do animal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/30 flex flex-col items-center justify-center hover:border-purple-500/30 transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    id="main-photo"
                  />
                  <label htmlFor="main-photo" className="cursor-pointer text-center p-4">
                    <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Clique para adicionar</p>
                    <p className="text-sm text-gray-500">ou arraste uma imagem</p>
                  </label>
                </div>
                
                {imagemUrl && (
                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-800/50 relative group">
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
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/fichas/lista')}
          className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30"
        >
          Cancelar
        </Button>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/30 gap-2"
            onClick={() => setActiveTab('dados')}
          >
            <FileText className="h-4 w-4" />
            Pré-visualizar
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.nomeAnimal || !formData.nomeProprietario}
            onClick={handleSubmit}
            className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-8 py-6"
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