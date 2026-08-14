import React, { useState } from 'react';
import { MapPin, Clock, Phone, Camera, Sparkles, ChevronRight, Menu, X } from 'lucide-react';

export default function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const googleMapsUrl = "https://maps.google.com/?q=S%C3%A3o+Paulo,+Brazil";

    // Get current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDayIndex = new Date().getDay();
    const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const currentDayName = daysOfWeek[currentDayIndex];

    // Static Data Structure
    const services = [
        { id: 1, title: "Massagem Sensorial Premium", duration: "60 min", price: "R$ 250", desc: "Uma experiência profunda que estimula os sentidos através de toques suaves, óleos aquecidos e manobras envolventes para um relaxamento absoluto." },
        { id: 2, title: "Massagem Tântrica Integrativa", duration: "80 min", price: "R$ 350", desc: "Focada na bioeletricidade corporal e expansão da sensibilidade. Desbloqueia tensões acumuladas e proporciona intensa renovação energética." },
        { id: 3, title: "Massagem Relaxante com Pedras Quentes", duration: "60 min", price: "R$ 220", desc: "Termoterapia combinada com massagem manual profunda para aliviar pontos de estresse e induzir a um estado latente de paz interna." },
        { id: 4, title: "Vivência a Dois (Casais)", duration: "90 min", price: "R$ 580", desc: "Ambiente preparado exclusivamente para o casal reconectar seus sentidos em uma jornada compartilhada de relaxamento e toque terapêutico." }
    ];

    // Using strings for available days to bypass rendering platform engine array parsing conflicts entirely
    const professionals = [
        {
            name: "Kelly Silva",
            role: "Especialista em Massagem Sensorial",
            daysAvailable: "1,2,3,4,5,6",
            bio: "Fundadora do espaço, com mais de 6 anos de experiência em terapias integrativas corporais e toques sensoriais.",
            photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Beatriz Ribeiro",
            role: "Massoterapeuta & Terapeuta Tântrica",
            daysAvailable: "1,3,5",
            bio: "Especializada em técnicas orientais e expansão de sensibilidade corporal, focada em alívio profundo de estresse crônico.",
            photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80"
        },
        {
            name: "Amanda Costa",
            role: "Especialista em Alívio de Tensões",
            daysAvailable: "2,4,6",
            bio: "Focada no bem-estar integral e no alinhamento de manobras musculares profundas associadas à aromaterapia sensual.",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
        }
    ];

    const galleryImages = [
        { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", title: "Sala Vip de Atendimento" },
        { url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80", title: "Iluminação Terapêutica" },
        { url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80", title: "Óleos e Aromas" },
        { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80", title: "Ambiente Climatizado" }
    ];

    const workingToday = professionals.filter(p => p.daysAvailable.split(",").map(Number).includes(currentDayIndex));

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-700 selection:text-white">

            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
                <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
                    <a href="#" className="text-xl font-medium tracking-widest text-stone-950 font-serif">
                        KELLY<span className="text-amber-700">MASSAGENS</span>
                    </a>

                    <nav className="hidden md:flex gap-8 text-xs font-semibold tracking-widest uppercase text-stone-600">
                        <a href="#sobre" className="hover:text-amber-700 transition duration-200">Sobre Nós</a>
                        <a href="#servicos" className="hover:text-amber-700 transition duration-200">Serviços</a>
                        <a href="#precos" className="hover:text-amber-700 transition duration-200">Preços</a>
                        <a href="#profissionais" className="hover:text-amber-700 transition duration-200">Disponíveis Hoje</a>
                        <a href="#contato" className="hover:text-amber-700 transition duration-200">Contato</a>
                    </nav>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-stone-800 focus:outline-none">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-stone-200 py-4 px-6 flex flex-col gap-4 text-sm font-medium tracking-wide uppercase">
                        <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="text-stone-700">Sobre Nós</a>
                        <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="text-stone-700">Serviços</a>
                        <a href="#precos" onClick={() => setMobileMenuOpen(false)} className="text-stone-700">Preços</a>
                        <a href="#profissionais" onClick={() => setMobileMenuOpen(false)} className="text-stone-700">Disponíveis Hoje</a>
                        <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="text-stone-700">Contato</a>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center text-center px-4 overflow-hidden bg-stone-950">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1920&q=80"
                        alt="Sensual ambient background"
                        className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
                    />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">Experiência Sensorial Única</span>
                    <h1 className="text-4xl md:text-6xl font-light font-serif text-white leading-tight">
                        Desperte seus sentidos. <br />Abandone as tensões.
                    </h1>
                    <p className="text-stone-300 text-sm md:text-base max-w-xl mx-auto tracking-wide leading-relaxed font-light">
                        Um refúgio exclusivo planejado para proporcionar relaxamento profundo e experiências sensoriais personalizadas com total discrição e elegância.
                    </p>
                    <div className="pt-4">
                        <a href="#servicos" className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs tracking-widest uppercase px-8 py-4 rounded-sm shadow-md transition duration-300">
                            Conhecer Nossos Serviços <ChevronRight size={14} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Main Content Modules */}
            <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-24 space-y-32">

                {/* About Us & Gallery */}
                <section id="sobre" className="scroll-mt-24 space-y-16">
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-5 space-y-6">
                            <span className="text-xs font-semibold tracking-widest uppercase text-amber-700 block">O Espaço</span>
                            <h2 className="text-3xl font-light font-serif text-stone-950 leading-tight">Privacidade, Conforto & Sofisticação</h2>
                            <p className="text-stone-600 text-sm leading-relaxed font-light">
                                Nosso consultório foi desenvolvido sob medida para que você possa se desconectar inteiramente do mundo exterior. Priorizamos um atendimento de excelência com luz difusa, aromaterapia personalizada e climatização ideal.
                            </p>
                            <p className="text-stone-600 text-sm leading-relaxed font-light">
                                Cada massagem sensual é executada respeitando a individualidade e o ritmo do seu corpo, transformando o toque em uma verdadeira arte de bem-estar e prazer refinado.
                            </p>
                        </div>

                        <div className="md:col-span-7 grid grid-cols-2 gap-4">
                            {galleryImages.map((img, i) => (
                                <div key={i} className={`rounded-sm overflow-hidden aspect-[4/3] bg-stone-100 group relative ${i % 2 === 1 ? 'translate-y-4' : ''}`}>
                                    <img src={img.url} alt={img.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                                        <span className="text-white text-xs font-medium tracking-wide">{img.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Showcase */}
                <section id="servicos" className="scroll-mt-24 space-y-12">
                    <div className="text-center max-w-xl mx-auto space-y-3">
                        <span className="text-xs font-semibold tracking-widest uppercase text-amber-700">Menu Especial</span>
                        <h2 className="text-3xl font-light font-serif text-stone-950">Nossas Técnicas</h2>
                        <p className="text-stone-500 text-xs tracking-wide">Terapias desenvolvidas para harmonizar corpo, mente e energia sensual.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white border border-stone-100 p-8 rounded-sm shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-serif text-lg text-stone-950 font-medium">{service.title}</h3>
                                        <span className="text-xs font-medium bg-stone-50 text-amber-800 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">{service.duration}</span>
                                    </div>
                                    <p className="text-stone-600 text-xs leading-relaxed font-light">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Layout */}
                <section id="precos" className="scroll-mt-24 space-y-12 bg-white border border-stone-100 rounded-sm p-8 md:p-16 shadow-sm">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <span className="text-xs font-semibold tracking-widest uppercase text-amber-700">Transparência</span>
                        <h2 className="text-3xl font-light font-serif text-stone-950">Valores e Sessões</h2>
                    </div>

                    <div className="max-w-2xl mx-auto divide-y divide-stone-100">
                        {services.map((service) => (
                            <div key={service.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                    <h4 className="font-medium text-stone-900 text-sm">{service.title}</h4>
                                    <p className="text-stone-400 text-xs">{service.duration} de sessão individual</p>
                                </div>
                                <div className="flex items-center gap-1 font-serif text-lg font-medium text-amber-800">
                                    <span>{service.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Professionals Available Today */}
                <section id="profissionais" className="scroll-mt-24 space-y-12">
                    <div className="text-center max-w-xl mx-auto space-y-3">
                        <span className="text-xs font-semibold tracking-widest uppercase text-amber-700">Escala do Dia</span>
                        <h2 className="text-3xl font-light font-serif text-stone-950">Profissionais Disponíveis</h2>
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 bg-white border border-stone-200 px-4 py-1.5 rounded-full shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            Hoje é <strong className="text-stone-950">{currentDayName}</strong>
                        </div>
                    </div>

                    {workingToday.length > 0 ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
                            {workingToday.map((pro, index) => (
                                <div key={index} className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm flex flex-col">
                                    <div className="aspect-[4/5] bg-stone-100 w-full overflow-hidden">
                                        <img src={pro.photo} alt={pro.name} className="w-full h-full object-cover filter brightness-[0.95]" />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="font-serif text-base text-stone-950 font-medium">{pro.name}</h3>
                                            <p className="text-amber-800 text-xs font-medium tracking-wide">{pro.role}</p>
                                            <p className="text-stone-600 text-xs font-light leading-relaxed pt-2">{pro.bio}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-stone-200 rounded-lg max-w-md mx-auto">
                            <p className="text-sm text-stone-500 font-light">Não possuímos profissionais agendados para atendimento em nosso espaço físico hoje.</p>
                            <a href="#contato" className="text-xs text-amber-700 font-semibold underline mt-2 block tracking-wider uppercase">Fazer pré-agendamento</a>
                        </div>
                    )}
                </section>

                {/* Contact & Location Module */}
                <section id="contato" className="scroll-mt-24 grid md:grid-cols-12 gap-12 items-stretch">
                    <div className="md:col-span-5 flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                            <span className="text-xs font-semibold tracking-widest uppercase text-amber-700">Agendamentos</span>
                            <h2 className="text-3xl font-light font-serif text-stone-950">Entre em Contato</h2>
                            <p className="text-stone-600 text-sm font-light leading-relaxed">
                                Atendemos estritamente sob agendamento prévio para garantir total discrição e tempo dedicado exclusivo para cada cliente.
                            </p>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex gap-4">
                                <MapPin className="text-amber-700 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-semibold text-stone-950 text-xs tracking-wider uppercase">Endereço Privado</h4>
                                    <p className="text-stone-600 text-xs mt-1 font-light leading-relaxed">Av. Paulista, 1000 - Sala Premium<br />Bela Vista, São Paulo - SP</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Clock className="text-amber-700 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-semibold text-stone-950 text-xs tracking-wider uppercase">Horários do Espaço</h4>
                                    <p className="text-stone-600 text-xs mt-1 font-light">Segunda a Sábado — 09:00 às 21:00</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Phone className="text-amber-700 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-semibold text-stone-950 text-xs tracking-wider uppercase">WhatsApp Direto</h4>
                                    <p className="text-stone-600 text-xs mt-1 font-light">(11) 99999-9999</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <a href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20consultar%20disponibilidade" target="_blank" rel="noopener noreferrer" className="inline-block text-center bg-stone-950 hover:bg-stone-900 text-white font-medium text-xs tracking-widest uppercase px-6 py-4 rounded-sm shadow-md transition duration-300 w-full sm:w-auto">
                                Solicitar Horário via WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-7 bg-stone-100 rounded-sm overflow-hidden min-h-[300px] border border-stone-200 relative">
                        <iframe
                            title="Google Maps Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197576550743!2d-46.6564942!3d-23.5613497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQwLjkiUyA0NsKwMzknMjSuNCJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
                            className="absolute inset-0 w-full h-full border-0 grayscale contrast-125 opacity-75"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </section>

            </footer>
        </div>
    );
}
