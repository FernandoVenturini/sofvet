import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const EditarFicha = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [imagemUrl, setImagemUrl] = useState('');

    const [form, setForm] = useState({
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

    useEffect(() => {
        const carregarFicha = async () => {
            if (!id || !user) return;
            try {
                const docRef = doc(db, 'animais', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setForm({
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
                } else {
                    alert('Ficha não encontrada');
                    navigate('/fichas/lista');
                }
            } catch (error) {
                console.error('Erro ao carregar ficha:', error);
                alert('Erro ao carregar a ficha.');
            } finally {
                setLoading(false);
            }
        };

        carregarFicha();
    }, [id, user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelect = (field: string) => (value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user || !id) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `animais/${user.uid}/${id}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setImagemUrl(url);
        } catch (error) {
            alert('Erro ao enviar imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setLoading(true);
        try {
            const docRef = doc(db, 'animais', id);
            await updateDoc(docRef, {
                ...form,
                imagemUrl,
                updatedAt: serverTimestamp(),
            });
            alert('Ficha atualizada com sucesso!');
            navigate('/fichas/lista');
        } catch (error) {
            alert('Erro ao atualizar ficha');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center">Carregando ficha....</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Editar Ficha</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Mesmo formulário da NovaFicha, só mudando o título e botão */}
                {/* (Copie a estrutura do NovaFicha.tsx aqui, só mudando o título e botão para "Atualizar Ficha") */}
                {/* Para não repetir código, você pode criar um componente compartilhado depois, mas por agora, copie o form do NovaFicha e mude o título */}

                {/* Exemplo resumido (use o mesmo form do NovaFicha) */}
                {/* ... campos iguais ao NovaFicha ... */}

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg font-bold">
                        {loading ? <Loader2 className="mr-2 animate-spin" /> : 'Atualizar Ficha'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditarFicha;