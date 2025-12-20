import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { doc, getDoc, updateDoc, serverTimestamp, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

const EditarFicha = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagemUrl, setImagemUrl] = useState('');

  const [formData, setFormData] = useState({
    nomeAnimal: '',
    especie: '',
    raca: '',
    pelagem: '',
    sexo: '',
    dataNascimento: '',
    cor: '',
    nomeProprietario: '',
    telefoneProprietario: '',
    enderecoProprietario: '',
    observacoes: '',
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

  // Carrega ficha e vacinas da tabela
  useEffect(() => {
    const carregarDados = async () => {
      if (!id || !user) return;
      setLoading(true);
      try {
        // Carrega ficha
        const docRef = doc(db, 'animais', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            nomeAnimal: data.nomeAnimal || '',
            especie: data.especie || '',
            raca: data.raca || '',
            pelagem: data.pelagem || '',
            sexo: data.sexo || '',
            dataNascimento: data.dataNascimento || '',
            cor: data.cor || '',
            nomeProprietario: data.nomeProprietario || '',
            telefoneProprietario: data.telefoneProprietario || '',
            enderecoProprietario: data.enderecoProprietario || '',
            observacoes: data.observacoes || '',
          });
          setImagemUrl(data.imagemUrl || '');
          setVacinasAplicadas(data.vacinas || []);
        } else {
          alert('Ficha não encontrada');
          navigate('/fichas/lista');
        }

        // Carrega vacinas da tabela
        const snapshot = await getDocs(collection(db, 'vacinas'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setVacinasTabela(lista);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar a ficha.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, user, navigate]);

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
    if (!file || !user || !id) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `animais/${user.uid}/${id}_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImagemUrl(url);
      alert('Imagem atualizada com sucesso!');
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      alert('Erro ao atualizar a imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Função corrigida para programação automática
  const adicionarVacina = () => {
    if (!vacinaSelecionada || !dataDose) {
      alert('Selecione a vacina e a data da dose');
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
    alert('Dose aplicada e próximas programadas com sucesso!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'animais', id);
      await updateDoc(docRef, {
        ...formData,
        imagemUrl,
        vacinas: vacinasAplicadas,
        updatedAt: serverTimestamp(),
      });

      alert('Ficha atualizada com sucesso!');
      navigate('/fichas/lista');
    } catch (error) {
      console.error('Erro ao atualizar ficha:', error);
      alert('Erro ao atualizar a ficha.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">Carregando ficha...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-10">Editar Ficha</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Foto do Animal */}
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Foto do Animal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {imagemUrl ? (
              <img src={imagemUrl} alt="Animal" className="h-64 w-64 object-cover rounded-lg" />
            ) : (
              <div className="h-64 w-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                Sem imagem
              </div>
            )}
            <label className="cursor-pointer">
              <Button type="button" variant="outline" disabled={uploadingImage}>
                {uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Trocar Foto'
                )}
              </Button>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </CardContent>
        </Card>

        {/* Dados do Animal */}
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Dados do Animal</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Nome do Animal *</Label>
              <Input
                name="nomeAnimal"
                value={formData.nomeAnimal}
                onChange={handleChange}
                required
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Espécie</Label>
              <Select onValueChange={handleSelectChange('especie')} value={formData.especie}>
                <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canino">Canino</SelectItem>
                  <SelectItem value="felino">Felino</SelectItem>
                  <SelectItem value="ave">Ave</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Raça</Label>
              <Input
                name="raca"
                value={formData.raca}
                onChange={handleChange}
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Pelagem</Label>
              <Input
                name="pelagem"
                value={formData.pelagem}
                onChange={handleChange}
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Sexo</Label>
              <Select onValueChange={handleSelectChange('sexo')} value={formData.sexo}>
                <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="femea">Fêmea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Data de Nascimento</Label>
              <Input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Cor</Label>
              <Input
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados do Proprietário */}
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Dados do Proprietário</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Nome *</Label>
              <Input
                name="nomeProprietario"
                value={formData.nomeProprietario}
                onChange={handleChange}
                required
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Telefone</Label>
              <Input
                name="telefoneProprietario"
                value={formData.telefoneProprietario}
                onChange={handleChange}
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-white">Endereço</Label>
              <Textarea
                name="enderecoProprietario"
                value={formData.enderecoProprietario}
                onChange={handleChange}
                rows={3}
                className="bg-black/50 border-red-600/50 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={5}
              placeholder="Informações adicionais sobre o animal..."
              className="bg-black/50 border-red-600/50 text-white"
            />
          </CardContent>
        </Card>

        {/* Vacinas com programação automática */}
        <Card className="bg-black/50 border-red-600/30">
          <CardHeader>
            <CardTitle className="text-white">Vacinas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-white">Vacina</Label>
                <Select onValueChange={(value) => setVacinaSelecionada(value)} value={vacinaSelecionada}>
                  <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                    <SelectValue placeholder="Selecione uma vacina" />
                  </SelectTrigger>
                  <SelectContent>
                    {vacinasTabela.map((vacina) => (
                      <SelectItem key={vacina.id} value={vacina.id}>
                        {vacina.nome} ({vacina.doses} doses)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Dose Atual</Label>
                <Select onValueChange={(value) => setDoseAtual(Number(value))} value={doseAtual.toString()}>
                  <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                    <SelectValue placeholder="Dose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1ª dose</SelectItem>
                    <SelectItem value="2">2ª dose</SelectItem>
                    <SelectItem value="3">3ª dose</SelectItem>
                    <SelectItem value="4">Reforço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Data da Dose</Label>
                <Input
                  type="date"
                  value={dataDose}
                  onChange={(e) => setDataDose(e.target.value)}
                  className="bg-black/50 border-red-600/50 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={adicionarVacina} type="button" className="bg-red-600 hover:bg-red-700 w-full">
                  Aplicar Dose
                </Button>
              </div>
            </div>

            {/* Lista de vacinas aplicadas e programadas */}
            {vacinasAplicadas.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Vacinas e Próximas Doses</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Vacina</TableHead>
                      <TableHead className="text-white">Dose</TableHead>
                      <TableHead className="text-white">Data Aplicação</TableHead>
                      <TableHead className="text-white">Próxima Dose</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vacinasAplicadas.map((v, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-white">{v.nomeVacina}</TableCell>
                        <TableCell className="text-white">{v.dose}ª dose</TableCell>
                        <TableCell className="text-white">{v.dataAplicacao || '-'}</TableCell>
                        <TableCell className="text-white">{v.proximaData || '-'}</TableCell>
                        <TableCell className={v.proximaData ? 'text-yellow-400' : 'text-green-400'}>
                          {v.proximaData ? 'Programada' : 'Completa'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botão Atualizar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-12 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Ficha do Animal'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarFicha;