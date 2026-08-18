import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flower2,
  Instagram,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'Massagem Sensorial Premium',
    duration: '60 min',
    price: 'R$ 250',
    desc: 'Uma experiência personalizada, com movimentos fluidos, óleos aquecidos e um ambiente preparado para desacelerar corpo e mente.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: '02',
    title: 'Massagem Tântrica Integrativa',
    duration: '80 min',
    price: 'R$ 350',
    desc: 'Uma jornada de presença e sensibilidade corporal, conduzida com respeito ao ritmo individual e foco em relaxamento profundo.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: '03',
    title: 'Pedras Quentes & Relaxamento',
    duration: '60 min',
    price: 'R$ 220',
    desc: 'Termoterapia e massagem manual combinadas para aliviar tensões, aquecer a musculatura e criar uma sensação prolongada de bem-estar.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: '04',
    title: 'Vivência a Dois',
    duration: '90 min',
    price: 'R$ 580',
    desc: 'Um atendimento reservado para casais, pensado como uma pausa compartilhada em um espaço discreto, confortável e acolhedor.',
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1400&q=85',
  },
];

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Valores', path: '/valores' },
  { label: 'Profissionais', path: '/profissionais' },
  { label: 'Oportunidades', path: '/oportunidades' },
  { label: 'Contato', path: '/contato' },
];

const DEFAULT_SITE_SETTINGS = {
  priceOneHour: 'R$ 200',
  priceThirtyMinutes: 'R$ 160',
  whatsapp: '(11) 95282-8169',
  telephone: '(11) 2478-9218',
  weekdayHours: '12:00 às 20:00',
  saturdayHours: '12:00 às 18:00',
  sundayHours: 'Fechado',
  addressLine1: 'Rua Serra de Juréa, 442 - Tatuapé',
  addressLine2: 'São Paulo - SP',
  opportunitiesWhatsapp: '(11) 95282-8169',
};

function normalizePhone(value = '') {
  return value.replace(/\D/g, '');
}

function whatsappHref(value, message = 'Olá, gostaria de consultar disponibilidade') {
  const digits = normalizePhone(value);
  const international = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
}

function telephoneHref(value) {
  const digits = normalizePhone(value);
  const international = digits.startsWith('55') ? digits : `55${digits}`;
  return `tel:+${international}`;
}

function useSiteContent() {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadSiteContent() {
      try {
        const response = await fetch('/api/site-content');
        if (!response.ok) return;
        const data = await response.json();
        if (!active) return;
        setSettings({ ...DEFAULT_SITE_SETTINGS, ...(data.settings || {}) });
        setPromotions(Array.isArray(data.promotions) ? data.promotions : []);
      } catch {
        // Keep the safe fallback values when Sanity is unavailable.
      }
    }

    loadSiteContent();
    return () => { active = false; };
  }, []);

  return { settings, promotions };
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next) => {
    if (next === path) return;
    window.history.pushState({}, '', next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return [path, navigate];
}

function SiteLink({ to, navigate, children, className = '', onClick }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function Header({ path, navigate }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#d8d0c5] bg-[#faf6ef]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[84px] max-w-[1380px] items-center justify-between px-6 md:px-10 lg:px-14">
          <SiteLink to="/" navigate={navigate} className="flex shrink-0 items-center gap-2.5 text-[#211d18]">
            <Flower2 size={22} strokeWidth={1.35} />
            <span className="font-serif text-[22px] tracking-[-.02em]">Kelly Massagens</span>
          </SiteLink>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <SiteLink
                key={item.path}
                to={item.path}
                navigate={navigate}
                className={`relative py-2 text-[12px] font-medium tracking-[.01em] transition-colors hover:text-[#b95e2d] ${path === item.path ? 'text-[#b95e2d]' : 'text-[#4c443d]'
                  }`}
              >
                {item.label}
                {path === item.path && <span className="absolute inset-x-0 -bottom-[24px] h-px bg-[#b95e2d]" />}
              </SiteLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SiteLink
              to="/contato"
              navigate={navigate}
              className="hidden items-center gap-2 rounded-full border border-[#2d2823] px-5 py-3 text-[11px] font-semibold transition hover:bg-[#211d18] hover:text-white sm:inline-flex"
            >
              Agendar horário <ArrowRight size={13} />
            </SiteLink>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#cbc2b7] lg:hidden"
              aria-label="Abrir menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-[#ddd5cb] bg-[#faf6ef] px-6 py-5 lg:hidden">
            <nav className="mx-auto flex max-w-[1380px] flex-col">
              {navItems.map((item) => (
                <SiteLink
                  key={item.path}
                  to={item.path}
                  navigate={navigate}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between border-b border-[#e5ddd3] py-4 text-sm ${path === item.path ? 'text-[#b95e2d]' : ''}`}
                >
                  {item.label} <ChevronRight size={16} />
                </SiteLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="bg-[#e95d19] px-4 py-2.5 text-center text-[11px] font-medium tracking-[.01em] text-white">
        <span className="inline-flex items-center gap-2"><CalendarDays size={13} /> Garanta seu horário • consulte disponibilidade pelo telefone</span>
      </div>
    </>
  );
}

function HomePage({ navigate, siteSettings }) {
  return (
    <main>
      <section className="mx-auto max-w-[1380px] px-4 pt-4 md:px-8 md:pt-7">
        <div className="relative min-h-[650px] overflow-hidden rounded-[26px] bg-[#1d1712] md:min-h-[720px]">
          <img
            src="/images/burgundy-fabric-hero.jpg"
            alt="Tecido bordô abstrato com luz e sombra"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/65 to-transparent" />

          <div className="relative z-10 flex min-h-[650px] flex-col justify-center p-7 text-white md:min-h-[720px] md:p-14 lg:p-20">
            <div className="mb-9 text-[11px] uppercase tracking-[.22em] text-white/75">Bem-estar • presença • cuidado</div>
            <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_.75fr]">
              <div>
                <h1 className="max-w-4xl text-[50px] font-medium leading-[.94] tracking-[-.055em] sm:text-[66px] md:text-[84px] lg:text-[96px]">
                  Muito prazer em
                  <br />
                  <span className="font-serif font-normal italic">
                    boa companhia
                  </span>
                </h1>
                <p className="mt-7 max-w-lg text-sm leading-6 text-white/75 md:text-[15px]">
                  Massagens personalizadas em um ambiente reservado, confortável e pensado para transformar pausa em bem-estar.
                </p>
              </div>

              <div className="justify-self-start lg:justify-self-end">
                <SiteLink
                  to="/servicos"
                  navigate={navigate}
                  className="inline-flex items-center gap-3 rounded-full bg-[#faf6ef] px-6 py-4 text-xs font-semibold text-[#211d18] transition hover:bg-white"
                >
                  Conhecer os serviços <ArrowRight size={15} />
                </SiteLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-20 md:py-28">
        <div className="border-b border-[#d7cec2] pb-16">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#b95e2d]">Kelly Massagens</span>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-[1.05] md:text-5xl">Uma pausa criada para você.</h2>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-[#d7cec2] bg-[#d7cec2] md:grid-cols-3">
          {[
            ['01', 'Serviços', 'Conheça as experiências e encontre a sessão que combina com o seu momento.', '/servicos'],
            ['02', 'Valores', 'Consulte duração, investimento e formatos de atendimento de forma simples.', '/valores'],
            ['03', 'Profissionais', 'Conheça quem conduz cada experiência e os dias de atendimento.', '/profissionais'],
          ].map(([number, title, text, link]) => (
            <SiteLink key={title} to={link} navigate={navigate} className="group bg-[#faf6ef] p-8 transition hover:bg-[#f3ece2] md:p-10">
              <div className="font-serif text-5xl font-light text-[#b86a3a]">{number}</div>
              <h3 className="mt-12 font-serif text-2xl">{title}</h3>
              <p className="mt-4 min-h-[72px] text-sm leading-6 text-[#756c63]">{text}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold">Ver página <ArrowRight className="transition group-hover:translate-x-1" size={14} /></span>
            </SiteLink>
          ))}
        </div>
      </section>

      <ContactSection settings={siteSettings} showHeading />
    </main>
  );
}

function PageIntro({ eyebrow, title, text, compactBottom = false, compactTop = false }) {
  return (
    <section className={`mx-auto max-w-[1240px] px-6 ${compactTop ? 'pt-8 md:pt-24' : 'pt-16 md:pt-24'} ${compactBottom ? 'pb-7 md:pb-20' : 'pb-14 md:pb-20'}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#b95e2d]">{eyebrow}</span>
      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_.65fr] md:items-end">
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-.035em] md:text-7xl">{title}</h1>
        <p className="max-w-lg text-sm leading-7 text-[#71685f]">{text}</p>
      </div>
    </section>
  );
}

function ServicesPage({ navigate }) {
  return (
    <main>
      <PageIntro
        eyebrow="Serviços"
        title="Um espaço dedicado ao prazer"
        text="Atendimento individual, atmosfera reservada e atenção ao conforto em cada detalhe da experiência."
      />
      <section className="mx-auto grid max-w-[1240px] gap-10 px-6 pb-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center md:pb-32">
        <img
          src="/images/burgundy-fabric-hero.jpg"
          alt="Tecido bordô abstrato do espaço Kelly Massagens"
          className="aspect-[4/3] w-full rounded-[24px] object-cover"
        />
        <div className="lg:pl-8">
          <div className="font-serif text-7xl text-[#b86a3a]">6+</div>
          <p className="mt-2 text-xs uppercase tracking-[.16em] text-[#8a8076]">anos de experiência</p>
          <h2 className="mt-9 font-serif text-3xl leading-tight">Atendimento personalizado com uma experiência acolhedora.</h2>
          <p className="mt-5 text-sm leading-7 text-[#71685f]">Você será recebido pela anfitriã Kelly que irá indicar o melhor atendimento de acordo com suas preferências.</p>
          <p className="mt-4 text-sm leading-7 text-[#71685f]">Aqui toda atenção é voltada ao cliente e nossa prioridade é a sua satisfação.</p>
          <SiteLink to="/contato" navigate={navigate} className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#2d2823] px-5 py-3 text-xs font-semibold">Agendar horário <ArrowRight size={14} /></SiteLink>
        </div>
      </section>
      <Cta navigate={navigate} />
    </main>
  );
}

function PricingPage({ navigate, siteSettings, promotions }) {
  const priceRows = [
    { id: '01', title: 'Massagem completa', duration: '1 hora', price: siteSettings.priceOneHour },
    { id: '02', title: 'Massagem completa', duration: '30 minutos', price: siteSettings.priceThirtyMinutes },
  ];

  return (
    <main>
      {promotions.length > 0 && (
        <div className="mx-auto max-w-[1240px] px-6 pt-10 md:pt-14">
          <button
            type="button"
            onClick={() => document.getElementById('promocoes-ativas')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9c9ba] bg-[#fffaf3] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-[#b95e2d] transition hover:border-[#b95e2d] hover:bg-[#fff7ed] md:text-xs"
          >
            Promoções ativas — confira abaixo <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
      <PageIntro eyebrow="Valores" title="Sessões e valores." text="Escolha o formato que mais combina com o tempo que você deseja dedicar ao seu momento." compactBottom compactTop={promotions.length > 0} />
      <section className="mx-auto max-w-[980px] px-6 pb-24 md:pb-32">
        <div className="overflow-hidden rounded-[24px] border border-[#d5cbbf] bg-[#fffaf3]">
          {priceRows.map((item, index) => (
            <div key={item.id} className={`grid gap-5 p-7 md:grid-cols-[70px_1fr_auto] md:items-center md:p-9 ${index ? 'border-t border-[#ddd4ca]' : ''}`}>
              <span className="font-serif text-3xl text-[#b86a3a]">{item.id}</span>
              <div>
                <h2 className="font-serif text-xl md:text-2xl">{item.title}</h2>
                <p className="mt-1.5 text-sm font-medium text-[#71685f] md:text-base">{item.duration}</p>
              </div>
              <div className="font-serif text-2xl md:text-3xl">{item.price}</div>
            </div>
          ))}
        </div>

        {promotions.length > 0 && (
          <div id="promocoes-ativas" className="mb-12 mt-4 scroll-mt-28 md:mt-14">
            <span className="text-base font-medium uppercase tracking-[.22em] text-[#b95e2d]">Promoções</span>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {promotions.map((promotion) => (
                <article key={promotion._id} className="rounded-[22px] border border-[#d5cbbf] bg-[#fffaf3] p-7 md:p-8">
                  <h2 className="font-serif text-2xl leading-tight">{promotion.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-[#71685f]">{promotion.description}</p>
                  {promotion.price && <div className="mt-7 font-serif text-[28px] text-[#b86a3a]">{promotion.price}</div>}
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-[22px] border border-[#d5cbbf] bg-[#faf6ef] p-7 md:p-8">
          <span className="text-base font-medium uppercase tracking-[.22em] text-[#b95e2d]">Formas de pagamento</span>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            {['Dinheiro', 'Cartão', 'PIX'].map((method) => (
              <span key={method} className="rounded-full border border-[#cfc5b9] px-4 py-2">{method}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#26211c] p-7 text-white md:flex-row md:items-center">
          <p className="max-w-xl text-sm leading-6 text-white/70">Para confirmar disponibilidade, horários e detalhes do atendimento, fale diretamente conosco.</p>
          <SiteLink to="/contato" navigate={navigate} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#211d18]">Ir para contato <ArrowRight size={14} /></SiteLink>
        </div>
      </section>
    </main>
  );
}

function ProfessionalCard({ professional }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = professional.photos || [];

  useEffect(() => {
    setPhotoIndex(0);
  }, [professional.name]);

  // Keep the next and previous photos warm in the browser cache so the
  // carousel feels immediate when the visitor uses the arrows.
  useEffect(() => {
    if (photos.length <= 1) return;

    const indexes = new Set([
      (photoIndex + 1) % photos.length,
      (photoIndex - 1 + photos.length) % photos.length,
    ]);

    indexes.forEach((index) => {
      const image = new Image();
      image.src = photos[index].url;
    });
  }, [photoIndex, photos]);

  const previousPhoto = () => {
    if (!photos.length) return;
    setPhotoIndex((current) => (current - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    if (!photos.length) return;
    setPhotoIndex((current) => (current + 1) % photos.length);
  };

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#d8cfc4] bg-[#fffaf3]">
      <div className="px-7 py-5">
        <h2 className="font-serif text-2xl">{professional.name}</h2>
      </div>

      <div className="group relative aspect-[4/5] overflow-hidden bg-[#fffaf3]">
        {photos.length ? (
          <img
            src={photos[photoIndex].url}
            alt={`${professional.name} — foto ${photoIndex + 1}`}
            loading={photoIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            className="pointer-events-none relative z-10 h-full w-full object-contain transition duration-500"
          />
        ) : (
          <div className="grid h-full place-items-center px-8 text-center text-sm text-[#82786e]">
            Nenhuma foto encontrada para esta profissional.
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousPhoto}
              aria-label={`Foto anterior de ${professional.name}`}
              className="absolute left-4 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#faf6ef]/95 text-[#211d18] shadow-md backdrop-blur transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d96846]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              aria-label={`Próxima foto de ${professional.name}`}
              className="absolute right-4 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#faf6ef]/95 text-[#211d18] shadow-md backdrop-blur transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d96846]"
            >
              <ChevronRight size={18} />
            </button>
            <div className="pointer-events-none absolute bottom-4 right-4 z-30 rounded-full bg-black/50 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur">
              {photoIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      <div className="px-7 py-5">
        <div className="text-xs text-[#625a52]">
          Disponível hoje
        </div>
      </div>
    </article>
  );
}

function ProfessionalsPage({ navigate }) {
  const [professionals, setProfessionals] = useState([]);
  const [listDate, setListDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfessionals() {
      try {
        setLoading(true);
        const response = await fetch('/api/professionals');
        const contentType = response.headers.get('content-type') || '';
        const raw = await response.text();

        if (!contentType.includes('application/json')) {
          throw new Error(`A API respondeu em formato inesperado (${response.status}). Abra /api/health para testar o Vercel Function.`);
        }

        const data = JSON.parse(raw);

        if (!response.ok) {
          throw new Error(data.error || 'Não foi possível carregar a lista de profissionais.');
        }

        if (active) {
          const loadedProfessionals = data.professionals || [];

          // Start downloading each professional's first photo immediately and
          // in parallel. The cards can render while the browser fills its cache.
          loadedProfessionals.forEach((professional) => {
            const firstPhoto = professional.photos?.[0];
            if (firstPhoto?.url) {
              const image = new Image();
              image.src = firstPhoto.url;
            }
          });

          setProfessionals(loadedProfessionals);
          setListDate(data.date || '');
          setError('');
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfessionals();
    return () => { active = false; };
  }, []);

  return (
    <main>
      <PageIntro
        eyebrow="Profissionais"
        title="Quem atende hoje."
        text="A equipe abaixo é atualizada automaticamente a partir da lista diária. Use as setas de cada perfil para navegar pelas fotos disponíveis."
      />

      <section className="mx-auto max-w-[1240px] px-6 pb-24 md:pb-32">
        {listDate && !loading && !error && (
          <div className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[.16em] text-[#8a8076]">
            <CalendarDays size={14} /> Lista de {listDate}
          </div>
        )}

        {loading && (
          <div className="rounded-[22px] border border-[#d8cfc4] bg-[#fffaf3] px-8 py-16 text-center text-sm text-[#71685f]">
            Carregando profissionais de hoje…
          </div>
        )}

        {!loading && (error || professionals.length === 0) && (
          <div className="grid min-h-[180px] place-items-center rounded-[22px] border border-[#d8cfc4] bg-[#fffaf3] px-8 text-center">
            <p className="text-sm text-[#71685f]">Profissionais não disponíveis no momento</p>
          </div>
        )}

        {!loading && !error && professionals.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.name} professional={professional} />
            ))}
          </div>
        )}
      </section>
      <Cta navigate={navigate} />
    </main>
  );
}

function ContactSection({ settings, showHeading = false }) {
  const fullAddress = `${settings.addressLine1}, ${settings.addressLine2}`;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-24 md:pb-32">
      {showHeading && (
        <div className="mb-10 border-t border-[#d7cec2] pt-16 md:pt-20">
          <span className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#b95e2d]">Contato</span>
          <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">Reserve seu horário</h2>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[24px] bg-[#24201b] p-8 text-white md:p-10">
          <h2 className="font-serif text-3xl">Fale com a gente</h2>
          <div className="mt-9 space-y-7 text-sm">
            <div className="flex gap-4">
              <Phone className="mt-0.5 text-[#df9464]" size={19} />
              <div>
                <p className="text-xs uppercase tracking-[.15em] text-white/45">Telefone</p>
                <a href={telephoneHref(settings.telephone)} className="mt-1 block hover:text-[#df9464]">{settings.telephone}</a>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-0.5 text-[#df9464]" size={19} />
              <div>
                <p className="text-xs uppercase tracking-[.15em] text-white/45">WhatsApp</p>
                <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer" className="mt-1 block hover:text-[#df9464]">{settings.whatsapp}</a>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 text-[#df9464]" size={19} />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[.15em] text-white/45">Horários</p>
                <p>Segunda a sexta · {settings.weekdayHours}</p>
                <p>Sábado · {settings.saturdayHours}</p>
                <p>Domingo · {settings.sundayHours}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-0.5 text-[#df9464]" size={19} />
              <div>
                <p className="text-xs uppercase tracking-[.15em] text-white/45">Localização</p>
                <p className="mt-1 leading-6">{settings.addressLine1}<br />{settings.addressLine2}</p>
              </div>
            </div>
          </div>
          <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#f7f1e8] px-6 py-3.5 text-xs font-semibold text-[#211d18]">Chamar no WhatsApp <ArrowRight size={14} /></a>
        </div>
        <div className="min-h-[430px] overflow-hidden rounded-[24px] border border-[#d8cfc4] bg-[#eee7dd]">
          <iframe title="Google Maps" src={mapUrl} className="h-full min-h-[430px] w-full border-0 grayscale-[30%]" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function ContactPage({ siteSettings }) {
  return (
    <main>
      <PageIntro eyebrow="Contato" title="Reserve seu horário" text="Nossa prioridade é a sua satisfação" />
      <ContactSection settings={siteSettings} />
    </main>
  );
}

function OpportunitiesPage({ siteSettings }) {
  return (
    <main>
      <PageIntro eyebrow="Oportunidades" title="Trabalhe conosco." text="Quer fazer parte da nossa equipe? Entre em contato e converse com a gente." />
      <section className="mx-auto max-w-[980px] px-6 pb-24 md:pb-32">
        <div className="rounded-[26px] bg-[#24201b] p-8 text-white md:p-12 lg:p-14">
          <span className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#df9464]">Trabalhe Conosco</span>
          <h2 className="mt-6 max-w-xl font-serif text-4xl leading-tight md:text-5xl">Quer fazer parte da nossa equipe?</h2>
          <p className="mt-5 text-sm text-white/65">Nos chame no WhatsApp.</p>
          <a
            href={whatsappHref(siteSettings.opportunitiesWhatsapp, 'Olá, gostaria de saber mais sobre oportunidades na Kelly Massagens')}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#faf6ef] px-6 py-4 text-xs font-semibold text-[#211d18] transition hover:bg-white"
          >
            {siteSettings.opportunitiesWhatsapp} <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </main>
  );
}

function Cta({ navigate }) {
  return (
    <section className="border-t border-[#d7cec2] bg-[#eee5d9]">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:py-20">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#b95e2d]">Agendamento</span>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight md:text-4xl">Escolha seu momento. A gente cuida do restante.</h2>
        </div>
        <SiteLink to="/contato" navigate={navigate} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#211d18] px-6 py-4 text-xs font-semibold text-white">Agendar horário <ArrowRight size={14} /></SiteLink>
      </div>
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="bg-[#171411] text-white">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="flex items-center gap-2 font-serif text-xl"><Flower2 size={19} strokeWidth={1.3} /> Kelly Massagens</div>
          <p className="mt-3 max-w-sm text-xs leading-5 text-white/45">Bem-estar, presença e cuidado em um espaço reservado em São Paulo.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-white/55">
          <SiteLink to="/servicos" navigate={navigate}>Serviços</SiteLink>
          <SiteLink to="/valores" navigate={navigate}>Valores</SiteLink>
          <SiteLink to="/oportunidades" navigate={navigate}>Oportunidades</SiteLink>
          <SiteLink to="/contato" navigate={navigate}>Contato</SiteLink>
          <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [path, navigate] = usePath();
  const { settings: siteSettings, promotions } = useSiteContent();

  const page = (() => {
    switch (path) {
      case '/sobre': return <ServicesPage navigate={navigate} />;
      case '/servicos': return <ServicesPage navigate={navigate} />;
      case '/valores': return <PricingPage navigate={navigate} siteSettings={siteSettings} promotions={promotions} />;
      case '/profissionais': return <ProfessionalsPage navigate={navigate} />;
      case '/oportunidades': return <OpportunitiesPage siteSettings={siteSettings} />;
      case '/contato': return <ContactPage siteSettings={siteSettings} />;
      default: return <HomePage navigate={navigate} siteSettings={siteSettings} />;
    }
  })();

  return (
    <div className="min-h-screen bg-[#faf6ef] text-[#211d18] selection:bg-[#b95e2d] selection:text-white">
      <Header path={path} navigate={navigate} />
      {page}
      <Footer navigate={navigate} />
    </div>
  );
}
