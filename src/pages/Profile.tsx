import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { updateProfile, User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera } from 'lucide-react';

const Profile = () => {
    const { user, setClinicName } = useContext(AuthContext);
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState('');
    const [clinicName, setClinicNameLocal] = useState('');
    const [phone, setPhone] = useState('');
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setPhotoURL(user.photoURL || null);
            const savedClinic = localStorage.getItem('sofvet-clinic-name');
            if (savedClinic) setClinicNameLocal(savedClinic);
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateProfile(user as User, {
                displayName: displayName || user.email?.split('@')[0],
                photoURL: photoURL || user.photoURL,
            });
            setClinicName(clinicName);  // Atualiza contexto e localStorage
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingPhoto(true);
        try {
            const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setPhotoURL(url);
            await updateProfile(user as User, { photoURL: url });
            alert('Foto atualizada com sucesso!');
        } catch (error) {
            console.error('Erro no upload:', error);
            alert('Erro ao subir foto. Verifique o Storage no Firebase.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center">Meu Perfil</h1>

            {/* Foto do Perfil */}
            <Card className="bg-black/50 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">Foto do Perfil</CardTitle>
                    <CardDescription className="text-gray-400">
                        Clique na câmera para alterar a foto
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <div className="relative">
                        <Avatar className="h-32 w-32 ring-4 ring-red-600/50">
                            <AvatarImage src={photoURL || ''} alt="Perfil" />
                            <AvatarFallback className="bg-red-600 text-white text-3xl">
                                {displayName[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* Botão da câmera sobreposto */}
                        <label
                            htmlFor="photo-upload"
                            className="absolute bottom-0 right-0 bg-red-600 rounded-full p-3 cursor-pointer hover:bg-red-700 transition-all"
                        >
                            <Camera className="h-6 w-6 text-white" />
                        </label>

                        {/* Input file oculto */}
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />

                        {uploadingPhoto && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                                <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Informações */}
            <Card className="bg-black/50 border-red-600/30">
                <CardHeader>
                    <CardTitle className="text-white">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-white">Nome completo</Label>
                        <Input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Dr. Fernando Venturini"
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Nome da Clínica</Label>
                        <Input
                            value={clinicName}
                            onChange={(e) => setClinicNameLocal(e.target.value)}
                            placeholder="Clínica Veterinária Jardins"
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Telefone</Label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(11) 99999-9999"
                            className="bg-black/50 border-red-600/50 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Email</Label>
                        <Input value={user.email || ''} disabled className="bg-black/30 text-gray-400" />
                    </div>

                    <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;