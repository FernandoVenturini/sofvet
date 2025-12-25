import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addMinutes from 'date-fns/addMinutes';
import isValid from 'date-fns/isValid';
import ptBR from 'date-fns/locale/pt-BR';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'pt-BR': ptBR },
});

interface AgendaEvent extends Event {
    id: string;
    title: string;
    animal: string;
    proprietario: string;
    veterinario: string;
    tipo: 'consulta' | 'retorno_vacina' | 'bloqueado';
    status: 'agendada' | 'atrasada';
    observacoes?: string;
}

const veterinarios = ['Dr. João Silva', 'Dra. Maria Oliveira', 'Dr. Pedro Santos'];

const AgendaCompleta = () => {
    const [events, setEvents] = useState<AgendaEvent[]>([]);
    const [currentView, setCurrentView] = useState<View>('week');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);

    const [animalBusca, setAnimalBusca] = useState('');
    const [animalSelecionado, setAnimalSelecionado] = useState<any>(null);
    const [veterinario, setVeterinario] = useState(veterinarios[0]);
    const [observacoes, setObservacoes] = useState('');

    const [animais, setAnimais] = useState<any[]>([]);

    useEffect(() => {
        const carregarDados = async () => {
            const novosEvents: AgendaEvent[] = [];

            try {
                const animaisSnap = await getDocs(collection(db, 'animais'));
                const listaAnimais = animaisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAnimais(listaAnimais);

                listaAnimais.forEach(animal => {
                    const vacinas = animal.vacinas || [];
                    vacinas.forEach((v: any) => {
                        if (v.proximaData && typeof v.proximaData === 'string' && v.proximaData.trim() !== '') {
                            const dataPrevista = new Date(v.proximaData);
                            if (isValid(dataPrevista)) {
                                const status = dataPrevista < new Date() ? 'atrasada' : 'agendada';

                                novosEvents.push({
                                    id: `retorno-${animal.id}-${v.dose}`,
                                    title: `${animal.nomeAnimal || 'Animal'} - Revacinação ${v.nomeVacina || 'Vacina'}`,
                                    start: dataPrevista,
                                    end: addMinutes(dataPrevista, 30),
                                    animal: animal.nomeAnimal || 'Sem nome',
                                    proprietario: animal.nomeProprietario || 'Sem proprietário',
                                    veterinario: 'Automático',
                                    tipo: 'retorno_vacina',
                                    status,
                                });
                            }
                        }
                    });
                });

                // Horários bloqueados (almoço)
                const hoje = new Date();
                for (let i = 0; i < 30; i++) {
                    const dia = new Date(hoje);
                    dia.setDate(dia.getDate() + i);
                    const inicio = new Date(dia);
                    inicio.setHours(12, 0, 0, 0);
                    const fim = new Date(dia);
                    fim.setHours(14, 0, 0, 0);

                    novosEvents.push({
                        id: `bloqueado-${i}`,
                        title: 'Horário Bloqueado - Almoço',
                        start: inicio,
                        end: fim,
                        animal: '',
                        proprietario: '',
                        veterinario: '',
                        tipo: 'bloqueado',
                        status: 'agendada',
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar agenda:', error);
            }

            setEvents(novosEvents);
        };

        carregarDados();
    }, []);

    const eventStyleGetter = (event: AgendaEvent) => {
        let backgroundColor = '#dc2626';
        if (event.tipo === 'retorno_vacina') {
            backgroundColor = event.status === 'atrasada' ? '#ef4444' : '#10b981';
        }
        if (event.tipo === 'bloqueado') {
            backgroundColor = '#4b5563';
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '8px',
                opacity: 0.95,
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                padding: '4px 8px',
                fontSize: '0.875rem',
            },
        };
    };

    const handleSelectSlot = ({ start, end }: any) => {
        const bloqueado = events.some(e =>
            e.tipo === 'bloqueado' &&
            start >= e.start &&
            end <= e.end
        );
        if (bloqueado) {
            alert('Este horário está bloqueado (ex: almoço)');
            return;
        }
        setSelectedSlot({ start, end });
    };

    const agendarConsulta = () => {
        if (!animalSelecionado) {
            alert('Selecione um animal');
            return;
        }

        const novoEvento: AgendaEvent = {
            id: `consulta-${Date.now()}`,
            title: `${animalSelecionado.nomeAnimal} - Consulta com ${veterinario}`,
            start: selectedSlot.start,
            end: selectedSlot.end,
            animal: animalSelecionado.nomeAnimal,
            proprietario: animalSelecionado.nomeProprietario,
            veterinario,
            tipo: 'consulta',
            status: 'agendada',
            observacoes,
        };

        setEvents([...events, novoEvento]);
        setSelectedSlot(null);
        setAnimalBusca('');
        setAnimalSelecionado(null);
        setObservacoes('');
        alert('Consulta agendada com sucesso!');
    };

    const animaisFiltrados = animais.filter(a =>
        (a.nomeAnimal || '').toLowerCase().includes(animalBusca.toLowerCase()) ||
        (a.nomeProprietario || '').toLowerCase().includes(animalBusca.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Agenda Completa</h1>

            <Card className="bg-black/70 border-red-600/30 shadow-2xl">
                <CardContent className="p-8">
                    {/* ← CORREÇÃO: Container com overflow-x-hidden e width 100% para eliminar scroll horizontal */}
                    <div className="h-[800px] w-full overflow-x-hidden bg-black/50 rounded-lg">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            selectable
                            onSelectSlot={handleSelectSlot}
                            style={{ height: '100%', width: '100%' }}  // ← Garante largura total
                            view={currentView}
                            onView={(view) => setCurrentView(view)}
                            date={currentDate}
                            onNavigate={(date) => setCurrentDate(date)}
                            eventPropGetter={eventStyleGetter}
                            messages={{
                                next: "Próximo",
                                previous: "Anterior",
                                today: "Hoje",
                                month: "Mês",
                                week: "Semana",
                                day: "Dia",
                            }}
                            onSelectEvent={(event) => setSelectedEvent(event as AgendaEvent)}
                            views={['month', 'week', 'day']}
                            step={30}
                            timeslots={2}
                            defaultView="week"
                            components={{
                                toolbar: (props) => (
                                    <div className="rbc-toolbar bg-black/80 border-b border-red-600/30 p-4 flex flex-wrap justify-between items-center gap-4">
                                        <span className="rbc-btn-group">
                                            <button type="button" onClick={() => props.onNavigate('PREV')} className="text-white font-bold hover:text-red-400 transition">
                                                Anterior
                                            </button>
                                            <button type="button" onClick={() => props.onNavigate('TODAY')} className="text-white font-bold hover:text-red-400 mx-6 transition">
                                                Hoje
                                            </button>
                                            <button type="button" onClick={() => props.onNavigate('NEXT')} className="text-white font-bold hover:text-red-400 transition">
                                                Próximo
                                            </button>
                                        </span>
                                        <span className="rbc-toolbar-label text-3xl font-bold text-white">
                                            {props.label}
                                        </span>
                                        <span className="rbc-btn-group">
                                            {['month', 'week', 'day'].map(view => (
                                                <button
                                                    key={view}
                                                    type="button"
                                                    onClick={() => props.onView(view as View)}
                                                    className={`px-6 py-3 rounded font-bold transition ${currentView === view
                                                            ? 'bg-red-600 text-white shadow-lg'
                                                            : 'text-white bg-black/50 hover:bg-red-600/50'
                                                        }`}
                                                >
                                                    {view === 'month' ? 'Mês' : view === 'week' ? 'Semana' : 'Dia'}
                                                </button>
                                            ))}
                                        </span>
                                    </div>
                                ),
                            }}
                            dayPropGetter={() => ({
                                style: { backgroundColor: '#111111', color: '#e5e7eb' },
                            })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Modal agendar consulta */}
            <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
                <DialogContent className="bg-black/90 border-red-600/30 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Agendar Consulta</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div>
                            <Label className="text-white">Data/Horário</Label>
                            <p className="text-lg">
                                {selectedSlot && isValid(selectedSlot.start) && format(selectedSlot.start, 'dd/MM/yyyy HH:mm')} - {selectedSlot && isValid(selectedSlot.end) && format(selectedSlot.end, 'HH:mm')}
                            </p>
                        </div>

                        <div>
                            <Label className="text-white">Buscar Animal</Label>
                            <Input
                                placeholder="Nome do animal ou proprietário"
                                value={animalBusca}
                                onChange={e => setAnimalBusca(e.target.value)}
                                className="bg-black/50 border-red-600/50 text-white"
                            />
                            {animalBusca && animaisFiltrados.length > 0 && (
                                <div className="max-h-48 overflow-y-auto mt-2 border border-red-600/30 rounded">
                                    {animaisFiltrados.map(animal => (
                                        <div
                                            key={animal.id}
                                            className="p-3 hover:bg-red-600/20 cursor-pointer"
                                            onClick={() => {
                                                setAnimalSelecionado(animal);
                                                setAnimalBusca(`${animal.nomeAnimal} (${animal.nomeProprietario})`);
                                            }}
                                        >
                                            <p className="font-medium">{animal.nomeAnimal}</p>
                                            <p className="text-sm text-gray-400">Proprietário: {animal.nomeProprietario}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label className="text-white">Veterinário</Label>
                            <Select value={veterinario} onValueChange={setVeterinario}>
                                <SelectTrigger className="bg-black/50 border-red-600/50 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {veterinarios.map(vet => (
                                        <SelectItem key={vet} value={vet}>{vet}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-white">Observações</Label>
                            <Textarea
                                value={observacoes}
                                onChange={e => setObservacoes(e.target.value)}
                                rows={3}
                                className="bg-black/50 border-red-600/50 text-white"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setSelectedSlot(null)}>
                                Cancelar
                            </Button>
                            <Button onClick={agendarConsulta} className="bg-red-600 hover:bg-red-700">
                                Agendar Consulta
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal detalhes do evento */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="bg-black/90 border-red-600/30 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Detalhes do Agendamento</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && isValid(selectedEvent.start) && (
                        <div className="space-y-4 py-4">
                            <p className="text-lg"><strong>Animal:</strong> {selectedEvent.animal}</p>
                            <p className="text-lg"><strong>Proprietário:</strong> {selectedEvent.proprietario}</p>
                            <p className="text-lg"><strong>Veterinário:</strong> {selectedEvent.veterinario}</p>
                            <p className="text-lg"><strong>Motivo:</strong> {selectedEvent.title}</p>
                            <p className="text-lg"><strong>Horário:</strong> {format(selectedEvent.start, 'dd/MM/yyyy HH:mm')} - {format(selectedEvent.end!, 'HH:mm')}</p>
                            {selectedEvent.observacoes && <p className="text-lg"><strong>Observações:</strong> {selectedEvent.observacoes}</p>}
                            <div className="flex justify-end gap-4 mt-6">
                                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                                    Fechar
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    Marcar como Realizado
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AgendaCompleta;