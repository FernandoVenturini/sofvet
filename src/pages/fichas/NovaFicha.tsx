import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const NovaFicha = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingImage(true);
        try {
            const storageRef = ref(storage, `animais/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
            alert('Imagem do animal salva!');
        } catch (error) {
            console.error('Erro no upload da imagem:', error);
            alert('Erro ao salvar imagem do animal.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'animais'), {
                ...formData,
                imagemUrl: imageUrl || '',
                userId: user.uid,
                clinicaId: user.uid,  // Futuro: multi-clínica
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            alert('Ficha do animal salva com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao salvar ficha:', error);
            alert('Erro ao salvar ficha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center">Incluir Nova Ficha</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Imagem do Animal */}
                <Card className="bg-black/50 border-red-600/30">
                    <CardHeader>
                        <CardTitle className="text-white">Foto do Animal</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {imageUrl ? (
                            <img src={imageUrl} alt="Animal" className="h-64 w-64 object-cover rounded-lg" />
                        ) : (
                            <div className="h-64 w-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                                Sem imagem
                            </div>
                        )}
                        <label className="mt-4 cursor-pointer">
                            <Button type="button" variant="outline" disabled={uploadingImage}>
                                {uploadingImage ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Escolher Foto'
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
                            <Label className="text-white">Nome do Animal</Label>
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
                            <Select onValueChange={handleSelectChange('especie')}>
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
                            <Select onValueChange={handleSelectChange('sexo')}>
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
                            <Label className="text-white">Nome</Label>
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
                                className="bg-black/50 border-red-600/50 text-white"
                                rows={3}
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
                            placeholder="Informações adicionais sobre o animal..."
                            className="bg-black/50 border-red-600/50 text-white"
                            rows={5}
                        />
                    </CardContent>
                </Card>

                {/* Botão Salvar */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-12 text-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Salvando Ficha...
                            </>
                        ) : (
                            'Salvar Ficha do Animal'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NovaFicha;