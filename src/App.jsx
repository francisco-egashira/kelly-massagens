import React from 'react';
import { MapPin, Clock, Phone, Camera, Sparkles } from 'lucide-react';

export default function App() {
    // Alterar para o link real do seu estabelecimento
    const googleMapsUrl = "https://google.com";

    const galleryImages = [
        { url: "https://unsplash.com", title: "Sala de Massagem" },
        { url: "https://unsplash.com", title: "Ambiente Relaxante" },
        { url: "https://unsplash.com", title: "Pedras Quentes" },
        { url: "https://unsplash.com", title: "Nossa Equipe" },
    ];

    return (
        <div class="min-h-screen flex flex-col font-sans">
            {/* Navbar */}
            <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
                <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <span class="text-xl font-semibold tracking-wide text-sage-700">kellymassagens.com</span>
                    <nav class="flex gap-6 text-sm font-medium text-stone-600">
                        <a href="#sobre" class="hover:text-sage-600 transition">Sobre</a>
                        <a href="#horarios" class="hover:text-sage-600 transition">Horários</a>
                        <a href="#galeria" class="hover:text-sage-600 transition">Galeria</a>
                        <a href="#localizacao" class="hover:text-sage-600 transition">Localização</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section class="relative bg-sage-100 py-24 text-center px-4">
                <div class="max-w-3xl mx-auto">
                    <span class="text-xs uppercase tracking-widest text-sage-700 font-semibold bg-white/60 px-3 py-1 rounded-full">Massoterapia Profissional</span>
                    <h1 class="text-4xl md:text-5xl font-light text-stone-900 mt-4 mb-6 leading-tight">
                        Sua pausa para o equilíbrio e bem-estar profundo
                    </h1>
                    <p class="text-lg text-stone-600 mb-8 max-w-xl mx-auto">
                        Atendimento personalizado focado no alívio de tensões cotidianas e reabilitação muscular.
                    </p>
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition">
                        <MapPin size={18} /> Ver Localização no Mapa
                    </a>
                </div>
            </section>

            {/* Main Content */}
            <main class="flex-grow max-w-6xl mx-auto px-4 py-16 space-y-24">

                {/* Description */}
                <section id="sobre" class="grid md:grid-cols-2 gap-12 items-center scroll-mt-20">
                    <div>
                        <div class="inline-flex p-2 bg-sage-50 rounded-lg text-sage-600 mb-4">
                            <Sparkles size={24} />
                        </div>
                        <h2 class="text-2xl md:text-3xl font-light text-stone-900 mb-4">Sobre o Espaço</h2>
                        <p class="text-stone-600 leading-relaxed mb-4">
                            O consultório foi planejado para oferecer uma experiência sensorial completa de relaxamento. Combinamos técnicas tradicionais e contemporâneas de massoterapia para aliviar dores musculares, reduzir o estresse e devolver sua vitalidade natural.
                        </p>
                        <p class="text-stone-600 leading-relaxed">
                            Cada sessão é totalmente adaptada às necessidades individuais do seu corpo, garantindo conforto, privacidade e bem-estar.
                        </p>
                    </div>
                    <div class="rounded-2xl overflow-hidden shadow-inner aspect-video md:aspect-square">
                        <img src={galleryImages[0].url} alt="Ambiente" class="w-full h-full object-cover" />
                    </div>
                </section>

                {/* Opening Hours */}
                <section id="horarios" class="bg-white border border-stone-100 rounded-2xl p-8 md:p-12 scroll-mt-20 shadow-sm">
                    <div class="max-w-2xl mx-auto text-center">
                        <div class="inline-flex p-2 bg-sage-50 rounded-lg text-sage-600 mb-4">
                            <Clock size={24} />
                        </div>
                        <h2 class="text-2xl font-light text-stone-900 mb-6">Horário de Atendimento</h2>
                        <div class="space-y-3 text-stone-600 max-w-md mx-auto">
                            <div class="flex justify-between border-b border-stone-100 pb-2">
                                <span class="font-medium text-stone-700">Segunda a Sexta</span>
                                <span>08:00 às 20:00</span>
                            </div>
                            <div class="flex justify-between border-b border-stone-100 pb-2">
                                <span class="font-medium text-stone-700">Sábado</span>
                                <span>09:00 às 14:00</span>
                            </div>
                            <div class="flex justify-between text-stone-400">
                                <span>Domingo e Feriados</span>
                                <span>Fechado</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Photo Gallery */}
                <section id="galeria" class="scroll-mt-20">
                    <div class="flex items-center gap-2 mb-6">
                        <Camera class="text-sage-600" size={24} />
                        <h2 class="text-2xl font-light text-stone-900">Galeria de Fotos</h2>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((img, i) => (
                            <div key={i} class="group relative rounded-xl overflow-hidden aspect-square bg-stone-100">
                                <img src={img.url} alt={img.title} class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                                    <span class="text-white text-xs font-medium">{img.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Location Section */}
                <section id="localizacao" class="grid md:grid-cols-2 gap-8 items-start scroll-mt-20">
                    <div class="space-y-6">
                        <h2 class="text-2xl font-light text-stone-900">Localização e Contato</h2>
                        <div class="space-y-4">
                            <div class="flex gap-3">
                                <MapPin class="text-sage-600 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 class="font-medium text-stone-800">Endereço</h4>
                                    <p class="text-stone-600 text-sm">Av. Paulista, 1000 - Bela Vista<br />São Paulo - SP, 01310-100</p>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <Phone class="text-sage-600 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 class="font-medium text-stone-800">WhatsApp</h4>
                                    <p class="text-stone-600 text-sm">(11) 99999-9999</p>
                                </div>
                            </div>
                        </div>
                        <div class="pt-2">
                            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border border-stone-200 hover:border-stone-300 text-stone-700 font-medium px-5 py-2.5 rounded-lg text-sm transition">
                                Abrir rotas no Google Maps
                            </a>
                        </div>
                    </div>

                    <div class="bg-stone-100 rounded-xl overflow-hidden aspect-video border border-stone-200 h-full min-h-[250px] relative">
                        <iframe
                            title="Google Maps"
                            src="https://google.com"
                            class="absolute inset-0 w-full h-full border-0 grayscale opacity-80"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer class="bg-stone-900 text-stone-500 text-xs py-8 border-t border-stone-800">
                <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} kellymassagens.com. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
