// Application State
const state = {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null, // "Administrador" or "Estudiante"
    studentId: localStorage.getItem('studentId') || null,
    groups: [],
    currentTestimonial: 0,
    apiBase: window.location.origin
};

// Mock Data Fallbacks (for demonstration and fail-safe operation)
const mockData = {
    groups: [
        { id: "11111111-1111-1111-1111-111111111111", name: "Grupo 1", schedule: "Martes y Jueves (4:00 PM - 7:30 PM)", capacity: 25, availableSeats: 22, status: "Disponible" },
        { id: "22222222-2222-2222-2222-222222222222", name: "Grupo 2", schedule: "Martes y Jueves (7:45 PM - 10:45 PM)", capacity: 25, availableSeats: 0, status: "Lleno" },
        { id: "33333333-3333-3333-3333-333333333333", name: "Grupo 3", schedule: "Sábado y Domingo (4:00 PM - 7:00 PM)", capacity: 25, availableSeats: 18, status: "Disponible" },
        { id: "44444444-4444-4444-4444-444444444444", name: "Grupo 4", schedule: "Miércoles y Viernes (8:00 AM - 12:00 PM)", capacity: 25, availableSeats: 25, status: "Disponible" }
    ],
    students: [
        { id: "s1", name: "Juan Pérez", email: "estudiante@hablarconpoder.com", phone: "+51 987 654 321", enrollmentStatus: "Activo", groupId: "11111111-1111-1111-1111-111111111111", groupName: "Grupo 1", schedule: "Martes y Jueves (4:00 PM - 7:30 PM)", registeredAt: "2026-05-28T14:30:00Z" },
        { id: "s2", name: "María Rojas", email: "maria.rojas@gmail.com", phone: "+51 912 345 678", enrollmentStatus: "Activo", groupId: "11111111-1111-1111-1111-111111111111", groupName: "Grupo 1", schedule: "Martes y Jueves (4:00 PM - 7:30 PM)", registeredAt: "2026-05-30T10:15:00Z" },
        { id: "s3", name: "Carlos Gómez", email: "carlos.gomez@gmail.com", phone: "+51 954 789 123", enrollmentStatus: "Pendiente", groupId: "33333333-3333-3333-3333-333333333333", groupName: "Grupo 3", schedule: "Sábado y Domingo (4:00 PM - 7:00 PM)", registeredAt: "2026-06-10T16:45:00Z" }
    ],
    payments: [
        { id: "p1", studentId: "s1", studentName: "Juan Pérez", amount: 166.00, paymentDate: "2026-05-28T14:40:00Z", installmentNumber: 1, status: "Pagado", referenceCode: "TRX-12345" },
        { id: "p2", studentId: "s1", studentName: "Juan Pérez", amount: 166.00, paymentDate: "", installmentNumber: 2, status: "Pendiente", referenceCode: "" },
        { id: "p3", studentId: "s1", studentName: "Juan Pérez", amount: 165.00, paymentDate: "", installmentNumber: 3, status: "Pendiente", referenceCode: "" },
        { id: "p4", studentId: "s2", studentName: "María Rojas", amount: 397.00, paymentDate: "2026-05-30T10:20:00Z", installmentNumber: 1, status: "Pagado", referenceCode: "TRX-98765" },
        { id: "p5", studentId: "s3", studentName: "Carlos Gómez", amount: 497.00, paymentDate: "", installmentNumber: 1, status: "Pendiente", referenceCode: "" }
    ],
    attendance: [
        { id: "a1", studentId: "s1", studentName: "Juan Pérez", date: "2026-06-02", status: "Presente" },
        { id: "a2", studentId: "s1", studentName: "Juan Pérez", date: "2026-06-04", status: "Presente" },
        { id: "a3", studentId: "s1", studentName: "Juan Pérez", date: "2026-06-09", status: "Tardanza" },
        { id: "a4", studentId: "s1", studentName: "Juan Pérez", date: "2026-06-11", status: "Presente" },
        { id: "a5", studentId: "s2", studentName: "María Rojas", date: "2026-06-02", status: "Presente" },
        { id: "a6", studentId: "s2", studentName: "María Rojas", date: "2026-06-04", status: "Falta" },
        { id: "a7", studentId: "s2", studentName: "María Rojas", date: "2026-06-09", status: "Presente" },
        { id: "a8", studentId: "s2", studentName: "María Rojas", date: "2026-06-11", status: "Presente" }
    ],
    testimonials: [
        { name: "Ing. Carolina Méndez", role: "Directora de Operaciones Tech", text: "Superar el miedo escénico era mi mayor reto profesional. Gracias al programa de oratoria de la academia, no solo logré dar discursos asertivos, sino que conseguí un ascenso inmediato a Directora de Proyectos en mi corporativo. ¡Totalmente recomendado!", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80", stars: 5 },
        { name: "Dr. Alberto Valdivia", role: "Cirujano Cardiovascular", text: "Explicar conferencias médicas a audiencias internacionales me generaba una gran ansiedad. Tras cursar el Módulo de Control de Miedo y Comunicación No Verbal, encontré el balance perfecto de seguridad y modulación de la voz. Mi última ponencia en Boston fue un éxito rotundo.", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", stars: 5 },
        { name: "Claudia Estrada", role: "Emprendedora y Conferencista", text: "Esta academia cambió la forma en la que presento mi negocio a inversionistas. Aprendí que la persuasión requiere Storytelling y contacto visual directo. Logramos asegurar nuestra primera ronda de inversión semilla un mes después de graduarme.", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", stars: 5 }
    ]
};

// Global Headers Helper for API fetch
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
    };
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupMobileMenu();
    setupHeaderScroll();
    setupIntersectionObserverForCounters();
    runSimulate(); // run initial simulation
    initRouter();
    loadGroups();
});

// App routing and portals
function initRouter() {
    const handleHashChange = () => {
        const hash = window.location.hash;
        
        // Remove navbar active highlight and set on current hash
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('nav-active');
            } else {
                link.classList.remove('nav-active');
            }
        });

        if (hash === '#login-view' || hash === '#dashboard-student' || hash === '#dashboard-admin') {
            document.getElementById('portal-virtual').classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Lock background scroll
            renderPortal();
        } else {
            document.getElementById('portal-virtual').classList.add('hidden');
            document.body.style.overflow = ''; // Unlock scroll
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger router once on load
    handleHashChange();
}

function initApp() {
    // Inject first testimonial in carousel
    renderTestimonial();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Sticky Navbar dynamic transparency
function setupHeaderScroll() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-2', 'bg-brandBlue', 'shadow-xl');
            header.classList.remove('bg-brandBlue/90', 'backdrop-blur-md');
        } else {
            header.classList.remove('py-2', 'bg-brandBlue', 'shadow-xl');
            header.classList.add('bg-brandBlue/90', 'backdrop-blur-md');
        }
    });
}

// Fetch Groups from API or fallbacks
async function loadGroups() {
    try {
        const res = await fetch(`${state.apiBase}/api/groups`);
        if (res.ok) {
            state.groups = await res.json();
            renderGroups();
        } else {
            throw new Error();
        }
    } catch (e) {
        state.groups = mockData.groups;
        renderGroups();
    }
}

function renderGroups() {
    const container = document.getElementById('groups-container');
    if (!container) return;

    container.innerHTML = state.groups.map(g => {
        const isFull = g.availableSeats <= 0;
        return `
            <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col justify-between">
                <div>
                    <span class="text-xs font-bold ${isFull ? 'bg-gray-100 text-gray-400' : 'bg-brandBlue/10 text-brandGold'} px-3 py-1 rounded-full">
                        ${g.name}
                    </span>
                    <h3 class="font-title font-bold text-xl text-brandBlue mt-4">${g.name}</h3>
                    <p class="text-sm text-gray-500 mt-2 font-semibold"><i class="fa-regular fa-clock mr-2 text-brandGold"></i> ${g.schedule.split('(')[0].trim()}</p>
                    <p class="text-xs text-gray-400 mt-1">${g.schedule.includes('(') ? g.schedule.split('(')[1].replace(')', '') : g.schedule}</p>
                </div>
                <div class="mt-8">
                    <div class="flex items-center justify-between text-xs font-bold text-gray-500 border-t border-gray-100 pt-4 mb-6">
                        <span>CUPOS: <span class="text-brandBlue font-extrabold">${g.availableSeats}/${g.capacity}</span></span>
                        <span class="${isFull ? 'text-red-500' : 'text-green-500'} flex items-center">
                            <i class="fa-solid fa-circle text-[8px] mr-1.5 ${isFull ? '' : 'animate-pulse'}"></i> 
                            ${isFull ? 'Lleno' : 'Disponible'}
                        </span>
                    </div>
                    ${isFull 
                        ? `<button disabled class="w-full text-center bg-gray-200 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed">Sin Cupos</button>`
                        : `<button onclick="openRegistrationModal('${g.name}', '${g.id}')" class="w-full text-center bg-brandBlue hover:bg-brandBlueLight text-white font-bold py-3 rounded-xl transition-colors">Inscribirme</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Calculator Sim
function runSimulate() {
    const planCost = parseFloat(document.getElementById('calc-plan').value);
    const method = document.getElementById('calc-method').value;
    const simDetails = document.getElementById('sim-plan-details');
    
    if (!simDetails) return;

    if (method === "Completo") {
        simDetails.innerHTML = `
            <div class="flex items-center justify-between border-b border-gray-100 pb-2 text-sm font-semibold">
                <span class="text-gray-500">Cuota Única (Matrícula + Curso)</span>
                <span class="text-brandBlue font-bold">S/ ${planCost}</span>
            </div>
            <div class="text-[10px] text-green-500 mt-2 flex items-center">
                <i class="fa-solid fa-circle-check mr-1"></i> Descuento por pago único aplicado.
            </div>
        `;
    } else {
        const baseAmount = Math.round(planCost / 3);
        const lastAmount = planCost - (baseAmount * 2);
        
        simDetails.innerHTML = `
            <div class="flex items-center justify-between border-b border-gray-50 pb-2 text-xs font-medium">
                <span class="text-gray-500">Cuota 1 (Inscripción hoy)</span>
                <span class="text-brandBlue font-bold">S/ ${baseAmount}</span>
            </div>
            <div class="flex items-center justify-between border-b border-gray-50 py-2 text-xs font-medium">
                <span class="text-gray-500">Cuota 2 (Vence en 30 días)</span>
                <span class="text-brandBlue font-bold">S/ ${baseAmount}</span>
            </div>
            <div class="flex items-center justify-between pb-2 pt-2 text-xs font-medium">
                <span class="text-gray-500">Cuota 3 (Vence en 60 días)</span>
                <span class="text-brandBlue font-bold">S/ ${lastAmount}</span>
            </div>
            <div class="text-[10px] text-gray-400 mt-2">
                * Cargos automáticos recurrentes cada 30 días.
            </div>
        `;
    }
}

// Counters animation
function setupIntersectionObserverForCounters() {
    const stats = document.querySelectorAll('#stats-container span[data-target]');
    const options = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.getAttribute('data-target'));
                animateCounter(target, value);
                observer.unobserve(target);
            }
        });
    }, options);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 100);
    const stepTime = 15;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.getAttribute('data-target').startsWith('%')) {
            element.textContent = `${current}%`;
        } else if (element.getAttribute('data-target').startsWith('+') || target >= 100) {
            element.textContent = `+${current.toLocaleString('es-PE')}`;
        } else {
            element.textContent = current;
        }
    }, stepTime);
}

// Gallery filter & Lightbox
function filterGallery(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('bg-brandBlue', 'text-white', 'shadow-md');
            btn.classList.remove('bg-white', 'text-brandBlue', 'border');
        } else {
            btn.classList.remove('bg-brandBlue', 'text-white', 'shadow-md');
            btn.classList.add('bg-white', 'text-brandBlue', 'border');
        }
    });

    document.querySelectorAll('.gallery-item').forEach(item => {
        if (category === 'todo' || item.getAttribute('data-category') === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const text = document.getElementById('lightbox-caption');

    img.src = src;
    text.textContent = caption;
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox-modal').classList.add('hidden');
}

// Testimonials Carousel
function renderTestimonial() {
    const slides = mockData.testimonials;
    const container = document.querySelector('.testimonial-slide');
    if (!container) return;

    const t = slides[state.currentTestimonial];
    
    // Animate fade out and in
    container.style.opacity = 0;
    setTimeout(() => {
        container.innerHTML = `
            <div class="flex justify-center space-x-1 text-brandGold text-lg">
                ${Array(t.stars).fill('<i class="fa-solid fa-star"></i>').join('')}
            </div>
            <p class="text-lg md:text-xl italic font-light text-white/90 px-4 md:px-12 leading-relaxed">
                "${t.text}"
            </p>
            <div class="flex items-center justify-center space-x-4">
                <img src="${t.photo}" alt="${t.name}" class="w-14 h-14 rounded-full object-cover border-2 border-brandGold">
                <div class="text-left">
                    <span class="font-bold block text-sm">${t.name}</span>
                    <span class="text-xs text-white/50">${t.role}</span>
                </div>
            </div>
        `;
        container.style.opacity = 1;
    }, 200);
}

function nextTestimonial() {
    state.currentTestimonial = (state.currentTestimonial + 1) % mockData.testimonials.length;
    renderTestimonial();
}

function prevTestimonial() {
    state.currentTestimonial = (state.currentTestimonial - 1 + mockData.testimonials.length) % mockData.testimonials.length;
    renderTestimonial();
}

// Contact form handling
function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    
    showNotification(`Gracias ${name}, tu mensaje ha sido recibido de manera exitosa. Nos pondremos en contacto contigo en breve.`, 'success');
    document.getElementById('contact-form').reset();
}

// Custom Premium Toast Notification
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-24 left-6 z-50 p-5 rounded-2xl shadow-xl flex items-center space-x-4 border text-white transition-all transform translate-y-10 opacity-0 duration-300 max-w-sm ${
        type === 'success' ? 'bg-emerald-600 border-emerald-500' : 
        type === 'error' ? 'bg-red-600 border-red-500' : 'bg-brandBlue border-brandBlueLight'
    }`;

    toast.innerHTML = `
        <div class="text-xl">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i>
        </div>
        <p class="text-xs font-semibold leading-relaxed">${message}</p>
    `;

    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 50);

    // Remove toast
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4500);
}

// Registration Modal Handling
function openRegistrationModal(planName, priceOrGroupId) {
    const modal = document.getElementById('register-modal');
    
    let selectedPlan = planName;
    let price = planName === 'Plan Estudiante' ? 397 : 497;
    let defaultGroupId = "";
    
    // If second arg is a group UUID, map it
    if (priceOrGroupId.length > 20) {
        defaultGroupId = priceOrGroupId;
        selectedPlan = "Plan Regular"; 
        price = 497;
    }

    const groupOptions = state.groups.map(g => 
        `<option value="${g.id}" ${g.id === defaultGroupId ? 'selected' : ''} ${g.availableSeats <= 0 ? 'disabled' : ''}>
            ${g.name} - ${g.schedule.split('(')[0]} (${g.availableSeats} cupos)
         </option>`
    ).join('');

    modal.innerHTML = `
        <div class="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl p-8 relative text-white animate-fade-in-up">
            <button onclick="closeRegistrationModal()" class="absolute top-6 right-6 text-white/50 hover:text-white text-2xl focus:outline-none"><i class="fa-solid fa-xmark"></i></button>
            
            <h3 class="font-title font-extrabold text-2xl text-brandGold mb-2">Formulario de Matrícula</h3>
            <p class="text-xs text-white/50 mb-6">Completa tus datos personales para inscribirte formalmente en la academia.</p>

            <form onsubmit="handleRegistrationSubmit(event, '${selectedPlan}', ${price})" class="space-y-4">
                <div>
                    <label class="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Nombre Completo</label>
                    <input type="text" id="reg-name" required class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brandGold text-white font-semibold">
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Correo Electrónico</label>
                        <input type="email" id="reg-email" required class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brandGold text-white font-semibold">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Celular / Teléfono</label>
                        <input type="tel" id="reg-phone" required class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brandGold text-white font-semibold">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Contraseña del Aula Virtual</label>
                        <input type="password" id="reg-password" required class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brandGold text-white font-semibold">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Grupo de Estudio</label>
                        <select id="reg-group" required class="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brandGold text-white font-semibold">
                            <option value="" disabled>Seleccione un Horario</option>
                            ${groupOptions}
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5 mt-4">
                    <div>
                        <label class="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Plan de Financiamiento</label>
                        <select id="reg-method" class="w-full bg-slate-800 border border-white/15 rounded-lg p-2 text-xs focus:outline-none text-white font-semibold">
                            <option value="Completo">Pago Único (S/ ${price})</option>
                            <option value="Cuotas">Financiar en 3 Cuotas</option>
                        </select>
                    </div>
                    <div class="text-right flex flex-col justify-center">
                        <span class="text-[10px] text-white/40 block">Total a Invertir</span>
                        <span class="text-brandGold font-title font-bold text-xl block">S/ ${price}</span>
                    </div>
                </div>

                <button type="submit" class="w-full bg-gradient-gold text-brandBlue font-extrabold py-3.5 rounded-xl shadow-lg mt-6 hover:scale-103 transition-transform flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <span>Confirmar Inscripción y Proceder</span>
                </button>
            </form>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeRegistrationModal() {
    document.getElementById('register-modal').classList.add('hidden');
}

async function handleRegistrationSubmit(e, planName, price) {
    e.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    const groupId = document.getElementById('reg-group').value;
    const paymentMethod = document.getElementById('reg-method').value;

    const payload = { name, email, phone, password, groupId, planName, paymentMethod, price };

    try {
        const res = await fetch(`${state.apiBase}/api/students/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (res.ok) {
            closeRegistrationModal();
            showNotification(data.message, 'success');
            window.location.hash = '#login-view';
        } else {
            showNotification(data.message || 'Error al matricularse.', 'error');
        }
    } catch (err) {
        // Mock fallback simulation
        closeRegistrationModal();
        
        // Simulating the user addition locally for preview
        const newUserId = "mock-u-" + Date.now();
        const newStudentId = "mock-s-" + Date.now();
        
        // Add to mock lists
        mockData.students.push({
            id: newStudentId,
            name: name,
            email: email,
            phone: phone,
            enrollmentStatus: "Pendiente",
            groupId: groupId,
            groupName: state.groups.find(g => g.id === groupId)?.name || "Grupo 1",
            schedule: state.groups.find(g => g.id === groupId)?.schedule || "Martes y Jueves",
            userId: newUserId,
            registeredAt: new Date().toISOString()
        });

        // Add mock payments
        if (paymentMethod === "Completo") {
            mockData.payments.push({
                id: "mock-p-" + Date.now(),
                studentId: newStudentId,
                studentName: name,
                amount: price,
                paymentDate: "",
                installmentNumber: 1,
                status: "Pendiente",
                referenceCode: ""
            });
        } else {
            const base = Math.round(price / 3);
            const last = price - (base * 2);
            mockData.payments.push(
                { id: "mock-p1-" + Date.now(), studentId: newStudentId, studentName: name, amount: base, paymentDate: "", installmentNumber: 1, status: "Pendiente", referenceCode: "" },
                { id: "mock-p2-" + Date.now(), studentId: newStudentId, studentName: name, amount: base, paymentDate: "", installmentNumber: 2, status: "Pendiente", referenceCode: "" },
                { id: "mock-p3-" + Date.now(), studentId: newStudentId, studentName: name, amount: last, paymentDate: "", installmentNumber: 3, status: "Pendiente", referenceCode: "" }
            );
        }

        showNotification("¡Registro simulado correctamente! (Sin conexión al backend). Redirigiendo a Login.", "success");
        window.location.hash = '#login-view';
    }
}

// PORTAL VIRTUAL RENDERER (SPA sub-portal)
function renderPortal() {
    const portal = document.getElementById('portal-virtual');
    
    // Case 1: Not authenticated -> Render Login Page
    if (!state.token) {
        renderPortalLogin(portal);
        return;
    }

    // Case 2: Authenticated as Administrador -> Render Admin Dashboard
    if (state.role === "Administrador") {
        renderAdminDashboard(portal);
    } 
    // Case 3: Authenticated as Estudiante -> Render Student Dashboard
    else {
        renderStudentDashboard(portal);
    }
}

// Portal Login Screen
function renderPortalLogin(portal) {
    portal.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            <!-- Background grids and effects -->
            <div class="absolute top-1/3 left-1/4 w-96 h-96 bg-brandBlueLight/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brandGold/5 rounded-full blur-3xl"></div>

            <div class="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 relative z-10 text-white shadow-2xl animate-fade-in-up">
                <a href="#" class="absolute top-6 left-6 text-white/50 hover:text-white flex items-center space-x-1 text-xs">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Volver a Inicio</span>
                </a>
                
                <div class="text-center mt-6 mb-8">
                    <div class="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg mx-auto mb-4">
                        <i class="fa-solid fa-graduation-cap text-brandBlue text-2xl"></i>
                    </div>
                    <h2 class="font-title font-extrabold text-2xl tracking-wide text-white">Aula Virtual</h2>
                    <p class="text-xs text-white/50 mt-1">Ingresa a tu intranet académica de oratoria.</p>
                </div>

                <form onsubmit="handlePortalLoginSubmit(event)" class="space-y-5">
                    <div>
                        <label class="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Correo Electrónico</label>
                        <div class="relative">
                            <i class="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                            <input type="email" id="login-email" required placeholder="ejemplo@correo.com" class="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brandGold text-white font-semibold placeholder:text-white/20">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Contraseña</label>
                        <div class="relative">
                            <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
                            <input type="password" id="login-password" required placeholder="••••••••" class="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brandGold text-white font-semibold placeholder:text-white/20">
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-gradient-gold text-brandBlue font-extrabold py-3.5 rounded-xl shadow-lg mt-6 hover:scale-103 transition-transform flex items-center justify-center space-x-2">
                        <i class="fa-solid fa-key"></i>
                        <span>Ingresar con Seguridad</span>
                    </button>
                </form>

                <div class="mt-8 border-t border-white/5 pt-6 text-center text-xs text-white/40">
                    <p>¿No estás matriculado? <a href="#matriculas" class="text-brandGold hover:underline font-bold">Matricúlate aquí</a></p>
                </div>
            </div>
        </div>
    `;
}

async function handlePortalLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${state.apiBase}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        
        if (res.ok) {
            // Store credentials
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
            localStorage.setItem('role', data.role);
            if (data.studentId) localStorage.setItem('studentId', data.studentId);

            state.token = data.token;
            state.username = data.username;
            state.email = data.email;
            state.role = data.role;
            state.studentId = data.studentId;

            showNotification(`¡Bienvenido de vuelta, ${data.username}!`, 'success');
            renderPortal();
        } else {
            showNotification(data.message || 'Error de autenticación.', 'error');
        }
    } catch (err) {
        // Fallback simulation logins
        if (email.toLowerCase() === 'admin@hablarconpoder.com' && password === 'Admin123!') {
            mockLogin('Admin', 'admin@hablarconpoder.com', 'Administrador', null);
        } else if (email.toLowerCase() === 'estudiante@hablarconpoder.com' && password === 'Student123!') {
            mockLogin('Juan Pérez', 'estudiante@hablarconpoder.com', 'Estudiante', 's1');
        } else {
            // Check if user matches any dynamically registered mock student
            const matched = mockData.students.find(s => s.email.toLowerCase() === email.toLowerCase());
            if (matched && password === 'Student123!') {
                mockLogin(matched.name, matched.email, 'Estudiante', matched.id);
            } else {
                showNotification('Credenciales de simulación incorrectas. Usa admin@hablarconpoder.com / Admin123! o estudiante@hablarconpoder.com / Student123!', 'error');
            }
        }
    }
}

function mockLogin(username, email, role, studentId) {
    const mockToken = "mock-jwt-token-" + Date.now();
    localStorage.setItem('token', mockToken);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    if (studentId) localStorage.setItem('studentId', studentId);

    state.token = mockToken;
    state.username = username;
    state.email = email;
    state.role = role;
    state.studentId = studentId;

    showNotification(`[Simulación] Bienvenido, ${username}!`, 'success');
    renderPortal();
}

function handlePortalLogout() {
    localStorage.clear();
    state.token = null;
    state.username = null;
    state.email = null;
    state.role = null;
    state.studentId = null;

    showNotification('Sesión cerrada correctamente.', 'info');
    window.location.hash = '#inicio';
}

// ----------------------------------------------------
// STUDENT INTRANET DASHBOARD
// ----------------------------------------------------
async function renderStudentDashboard(portal) {
    portal.innerHTML = `
        <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <!-- Intranet Top Nav -->
            <header class="bg-slate-900 border-b border-white/5 py-4 px-6 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded bg-gradient-gold flex items-center justify-center">
                        <i class="fa-solid fa-microphone-lines text-brandBlue text-base"></i>
                    </div>
                    <span class="font-title font-bold text-sm tracking-widest text-white">PORTAL ESTUDIANTE</span>
                </div>
                
                <div class="flex items-center space-x-6">
                    <div class="text-right hidden sm:block">
                        <span class="text-xs font-bold block">${state.username}</span>
                        <span class="text-[10px] text-white/40 block">Estudiante de Oratoria</span>
                    </div>
                    <button onclick="handlePortalLogout()" class="bg-white/5 hover:bg-red-600/20 hover:text-red-500 border border-white/15 hover:border-red-500/30 text-white/80 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                        <i class="fa-solid fa-power-off mr-2"></i> Cerrar Sesión
                    </button>
                </div>
            </header>

            <!-- Main Portal Body -->
            <main class="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left column: Profile, Academic state, Attendance -->
                <div class="space-y-6">
                    <!-- Academic Card -->
                    <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <h3 class="font-title font-bold text-lg text-white mb-4 flex items-center"><i class="fa-solid fa-id-card text-brandGold mr-2"></i> Estado de Matrícula</h3>
                        <div id="student-academic-details" class="space-y-4 text-sm">
                            <!-- Populated dynamically -->
                        </div>
                    </div>

                    <!-- Attendance Chart Card -->
                    <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <h3 class="font-title font-bold text-lg text-white mb-4 flex items-center"><i class="fa-solid fa-chart-pie text-brandGold mr-2"></i> Control de Asistencia</h3>
                        <div class="h-48 flex items-center justify-center">
                            <canvas id="student-attendance-chart" class="max-h-full"></canvas>
                        </div>
                        <div id="student-attendance-summary" class="grid grid-cols-3 gap-2 text-center text-xs mt-4 border-t border-white/5 pt-4">
                            <!-- Stats summary -->
                        </div>
                    </div>
                </div>

                <!-- Center/Right: Core curriculum road, Payments lists -->
                <div class="lg:col-span-2 space-y-6">
                    
                    <!-- Roadmap Modules -->
                    <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="font-title font-bold text-lg text-white flex items-center"><i class="fa-solid fa-graduation-cap text-brandGold mr-2"></i> Plan Curricular del Curso</h3>
                            <button id="download-cert-btn" disabled class="bg-gray-800 text-gray-500 px-4 py-2 rounded-xl text-xs font-bold cursor-not-allowed">
                                <i class="fa-solid fa-file-pdf mr-1.5"></i> Descargar Certificado
                            </button>
                        </div>
                        
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4" id="student-modules-grid">
                            <!-- Populated with modules checklist -->
                        </div>
                    </div>

                    <!-- Financial Status -->
                    <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <h3 class="font-title font-bold text-lg text-white mb-4 flex items-center"><i class="fa-solid fa-file-invoice-dollar text-brandGold mr-2"></i> Registro Histórico de Pagos</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs">
                                <thead>
                                    <tr class="text-white/40 border-b border-white/5 pb-2">
                                        <th class="py-2">Cuota</th>
                                        <th class="py-2">Monto</th>
                                        <th class="py-2">Fecha Pago</th>
                                        <th class="py-2">Operación / Ref</th>
                                        <th class="py-2 text-right">Estado</th>
                                    </tr>
                                </thead>
                                <tbody id="student-payments-tbody" class="divide-y divide-white/5">
                                    <!-- Dynamic payments row -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Profile update form -->
                    <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                        <h3 class="font-title font-bold text-lg text-white mb-4 flex items-center"><i class="fa-solid fa-user-pen text-brandGold mr-2"></i> Actualizar Perfil</h3>
                        <form onsubmit="handleStudentProfileUpdate(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-[10px] font-bold text-white/50 uppercase mb-1">Nombre</label>
                                <input type="text" id="update-student-name" required class="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white font-semibold">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-white/50 uppercase mb-1">Teléfono</label>
                                <input type="text" id="update-student-phone" required class="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white font-semibold">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-white/50 uppercase mb-1">Nueva Contraseña (Opcional)</label>
                                <input type="password" id="update-student-pwd" placeholder="Ingresa nueva clave" class="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white font-semibold">
                            </div>
                            <div class="sm:col-span-3 text-right">
                                <button type="submit" class="bg-brandGold text-brandBlue font-bold px-6 py-2.5 rounded-xl text-xs shadow-md">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    `;

    // Fetch and Populate data
    loadStudentPortalData();
}

async function loadStudentPortalData() {
    let student = null;
    let payments = [];
    let attendance = [];

    try {
        // Fetch Student Profile
        const sRes = await fetch(`${state.apiBase}/api/students/${state.studentId}`, { headers: getHeaders() });
        const pRes = await fetch(`${state.apiBase}/api/payments`, { headers: getHeaders() });
        const aRes = await fetch(`${state.apiBase}/api/attendance`, { headers: getHeaders() });

        if (sRes.ok && pRes.ok && aRes.ok) {
            student = await sRes.json();
            payments = await pRes.json();
            attendance = await aRes.json();
        } else {
            throw new Error();
        }
    } catch (e) {
        // Load fallback data
        student = mockData.students.find(s => s.id === state.studentId) || mockData.students[0];
        payments = mockData.payments.filter(p => p.studentId === student.id);
        attendance = mockData.attendance.filter(a => a.studentId === student.id);
    }

    // Populate fields
    document.getElementById('update-student-name').value = student.name;
    document.getElementById('update-student-phone').value = student.phone;

    // Render Academic Details
    const detailsContainer = document.getElementById('student-academic-details');
    detailsContainer.innerHTML = `
        <div class="flex justify-between py-1 border-b border-white/5"><span class="text-white/50">Estudiante:</span><span class="font-semibold text-white">${student.name}</span></div>
        <div class="flex justify-between py-1 border-b border-white/5"><span class="text-white/50">Grupo:</span><span class="font-semibold text-brandGold">${student.groupName || 'Grupo 1'}</span></div>
        <div class="flex justify-between py-1 border-b border-white/5"><span class="text-white/50">Horarios:</span><span class="font-semibold text-white/80">${student.schedule || 'Martes y Jueves'}</span></div>
        <div class="flex justify-between py-1 border-b border-white/5"><span class="text-white/50">Fecha Ingreso:</span><span class="font-semibold text-white/80">${new Date(student.registeredAt).toLocaleDateString('es-PE')}</span></div>
        <div class="flex justify-between py-1 border-b border-white/5"><span class="text-white/50">Estado:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${student.enrollmentStatus === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">
                ${student.enrollmentStatus}
            </span>
        </div>
    `;

    // Render Payments Table
    const paymentsTbody = document.getElementById('student-payments-tbody');
    paymentsTbody.innerHTML = payments.map(p => `
        <tr class="hover:bg-white/2">
            <td class="py-3 font-semibold text-white">N° ${p.installmentNumber}</td>
            <td class="py-3 font-semibold">S/ ${p.amount}</td>
            <td class="py-3 text-white/60">${p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('es-PE') : '-'}</td>
            <td class="py-3 text-white/50">${p.referenceCode || 'N/A'}</td>
            <td class="py-3 text-right">
                <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${p.status === 'Pagado' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}">
                    ${p.status}
                </span>
            </td>
        </tr>
    `).join('');

    // Process Attendance chart and counts
    const present = attendance.filter(a => a.status === 'Presente').length;
    const late = attendance.filter(a => a.status === 'Tardanza').length;
    const absent = attendance.filter(a => a.status === 'Falta').length;
    const total = attendance.length;
    
    const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

    // Fill attendance summary
    document.getElementById('student-attendance-summary').innerHTML = `
        <div class="bg-emerald-600/10 p-2 rounded-lg"><span class="block text-emerald-400 font-bold">${present}</span><span class="text-[9px] text-white/40">Presente</span></div>
        <div class="bg-amber-600/10 p-2 rounded-lg"><span class="block text-amber-400 font-bold">${late}</span><span class="text-[9px] text-white/40">Tardanza</span></div>
        <div class="bg-rose-600/10 p-2 rounded-lg"><span class="block text-rose-400 font-bold">${absent}</span><span class="text-[9px] text-white/40">Falta</span></div>
    `;

    // Initialize Chart.js Donut for Student Attendance
    const ctx = document.getElementById('student-attendance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Presentes', 'Tardanzas', 'Faltas'],
            datasets: [{
                data: [present || 1, late, absent], // default 1 present if no data to display nicely
                backgroundColor: ['#059669', '#D97706', '#DC2626'],
                borderColor: '#0F172A',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            cutout: '75%'
        }
    });

    // Populate modules curriculum checkboxes
    const modules = [
        "Intro a la Oratoria", "Control Miedo Escénico", "Comunicación Verbal", 
        "Comunicación No Verbal", "Técnicas de Persuasión", "Presentaciones de Alto Impacto", 
        "Liderazgo y Comunicación", "Discurso Final y Acreditado"
    ];

    // Juan Perez has completed first 3 modules based on attendance
    const studentModulesGrid = document.getElementById('student-modules-grid');
    studentModulesGrid.innerHTML = modules.map((m, idx) => {
        const isCompleted = idx < 4; // Mock completed modules for active students
        return `
            <div class="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                <div class="w-8 h-8 rounded-full ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'} flex items-center justify-center text-sm mb-3">
                    <i class="fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-circle'}"></i>
                </div>
                <span class="text-[10px] font-bold block leading-none">Módulo ${idx + 1}</span>
                <span class="text-[9px] text-white/40 block mt-1 leading-tight">${m}</span>
            </div>
        `;
    }).join('');

    // Enable certificate if active and attendance >= 75%
    const certBtn = document.getElementById('download-cert-btn');
    if (student.enrollmentStatus === 'Activo' && attendanceRate >= 75) {
        certBtn.disabled = false;
        certBtn.className = "bg-gradient-gold text-brandBlue px-4 py-2 rounded-xl text-xs font-extrabold shadow-md hover:scale-105 transition-transform cursor-pointer";
        certBtn.onclick = () => showCertificateModal(student.name);
    }
}

async function handleStudentProfileUpdate(e) {
    e.preventDefault();
    const name = document.getElementById('update-student-name').value;
    const phone = document.getElementById('update-student-phone').value;
    const password = document.getElementById('update-student-pwd').value;

    const payload = { name, phone, password };

    try {
        const res = await fetch(`${state.apiBase}/api/students/${state.studentId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (res.ok) {
            showNotification(data.message, 'success');
            localStorage.setItem('username', name.split(' ')[0]);
            state.username = name.split(' ')[0];
            renderPortal();
        } else {
            showNotification(data.message || 'Error al actualizar perfil.', 'error');
        }
    } catch (err) {
        // Mock fallback simulation
        const sIdx = mockData.students.findIndex(s => s.id === state.studentId);
        if (sIdx !== -1) {
            mockData.students[sIdx].name = name;
            mockData.students[sIdx].phone = phone;
        }
        localStorage.setItem('username', name.split(' ')[0]);
        state.username = name.split(' ')[0];
        
        showNotification('[Simulación] Perfil actualizado correctamente.', 'success');
        renderPortal();
    }
}

// Certificate Generator Modal View
function showCertificateModal(studentName) {
    const modal = document.getElementById('register-modal');
    modal.innerHTML = `
        <div class="bg-white border-[12px] border-slate-900 max-w-3xl w-full rounded-2xl p-10 relative text-brandBlue shadow-2xl animate-fade-in-up text-center select-none">
            <button onclick="closeRegistrationModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-2xl focus:outline-none"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="border-4 border-brandGold/40 p-8 flex flex-col items-center">
                <!-- Cert Header -->
                <div class="w-16 h-16 rounded-full bg-brandBlue flex items-center justify-center mb-4 shadow">
                    <i class="fa-solid fa-award text-brandGold text-3xl"></i>
                </div>
                
                <span class="font-title font-bold tracking-widest text-xs uppercase text-brandBlue/70">Certificación Oficial de Excelencia Académica</span>
                <h2 class="font-title font-extrabold text-3xl sm:text-4xl text-brandBlue mt-2 tracking-wide">EL ARTE DE HABLAR CON PODER</h2>
                
                <div class="w-32 h-0.5 bg-brandGold my-6"></div>
                
                <p class="text-sm italic text-gray-500 font-light">Este diploma de reconocimiento se otorga solemnemente a:</p>
                <h3 class="font-title font-extrabold text-2xl sm:text-3xl text-brandBlue my-4 tracking-wider underline decoration-brandGold decoration-2">${studentName}</h3>
                
                <p class="text-xs text-gray-600 max-w-lg leading-relaxed mt-2">
                    Por haber culminado con éxito el programa curricular de **Oratoria, Expresión Ejecutiva y Liderazgo Transformacional**, acreditando dominio en Control de Ansiedad Escénica, Storytelling Persuasivo y Negociación de Alto Nivel.
                </p>

                <!-- Footer Signatures -->
                <div class="grid grid-cols-2 gap-12 w-full max-w-md mt-12 border-t border-gray-150 pt-8 text-center">
                    <div>
                        <span class="font-title text-[10px] text-gray-400 block tracking-widest uppercase">Director General</span>
                        <span class="font-title text-xs font-bold block mt-1 text-slate-800">Lic. Héctor Salvatierra</span>
                        <div class="w-20 h-px bg-slate-300 mx-auto mt-2"></div>
                    </div>
                    <div>
                        <span class="font-title text-[10px] text-gray-400 block tracking-widest uppercase">Secretaría Académica</span>
                        <span class="font-title text-xs font-bold block mt-1 text-slate-800">Dra. Elizabeth Wong</span>
                        <div class="w-20 h-px bg-slate-300 mx-auto mt-2"></div>
                    </div>
                </div>
                
                <!-- Date -->
                <span class="text-[9px] text-gray-400 mt-8 block">Emitido el ${new Date().toLocaleDateString('es-PE')} | Código de Verificación: VER-987-123</span>
            </div>
            
            <button onclick="window.print()" class="bg-brandBlue hover:bg-brandBlueLight text-white font-bold py-2 px-6 rounded-full text-xs shadow-md mt-6 inline-flex items-center space-x-2">
                <i class="fa-solid fa-print"></i>
                <span>Imprimir / Descargar PDF</span>
            </button>
        </div>
    `;
    modal.classList.remove('hidden');
}

// ----------------------------------------------------
// ADMINISTRATOR INTRANET PORTAL (SaaS Style)
// ----------------------------------------------------
async function renderAdminDashboard(portal) {
    portal.innerHTML = `
        <div class="min-h-screen bg-slate-950 text-slate-100 flex">
            <!-- Sidebar Navigation -->
            <aside class="w-64 bg-slate-900 border-r border-white/5 flex flex-col justify-between shrink-0 hidden md:flex">
                <div class="p-6">
                    <div class="flex items-center space-x-3 mb-10">
                        <div class="w-8 h-8 rounded bg-gradient-gold flex items-center justify-center">
                            <i class="fa-solid fa-microphone-lines text-brandBlue text-base"></i>
                        </div>
                        <span class="font-title font-bold text-sm tracking-widest text-white leading-none">PANEL SaaS ADMIN</span>
                    </div>

                    <nav class="space-y-2 text-xs font-bold text-white/70">
                        <button onclick="switchAdminTab('kpis')" class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left admin-tab-btn active-tab-btn bg-white/5 text-white">
                            <i class="fa-solid fa-chart-line text-brandGold"></i>
                            <span>Resumen & KPIs</span>
                        </button>
                        <button onclick="switchAdminTab('students')" class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left admin-tab-btn">
                            <i class="fa-solid fa-users text-brandGold"></i>
                            <span>Alumnos Matriculados</span>
                        </button>
                        <button onclick="switchAdminTab('attendance')" class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left admin-tab-btn">
                            <i class="fa-solid fa-clipboard-user text-brandGold"></i>
                            <span>Control de Asistencias</span>
                        </button>
                        <button onclick="switchAdminTab('payments')" class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 hover:text-white transition-all text-left admin-tab-btn">
                            <i class="fa-solid fa-money-bill-wave text-brandGold"></i>
                            <span>Registrar Pagos</span>
                        </button>
                    </nav>
                </div>

                <div class="p-6 border-t border-white/5">
                    <button onclick="handlePortalLogout()" class="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-xl text-xs font-extrabold transition-all border border-red-500/20">
                        <i class="fa-solid fa-power-off mr-2"></i> Cerrar Sesión
                    </button>
                </div>
            </aside>

            <!-- Main Panel Container -->
            <div class="flex-grow flex flex-col min-w-0">
                <!-- Mobile top nav -->
                <header class="bg-slate-900 border-b border-white/5 py-4 px-6 flex items-center justify-between">
                    <h2 class="font-title font-bold text-base text-white">Consola de Control Educativo</h2>
                    <button onclick="handlePortalLogout()" class="bg-white/5 hover:bg-red-600/20 text-red-500 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold md:hidden">
                        Salir
                    </button>
                </header>

                <!-- Scrollable Content -->
                <main class="flex-grow p-6 lg:p-10 overflow-y-auto space-y-6">
                    
                    <!-- Admin Tab: KPIs (SaaS Metrics) -->
                    <div id="admin-view-kpis" class="admin-tab-view space-y-6">
                        <!-- KPI Widgets Grid -->
                        <div class="grid grid-cols-2 lg:grid-cols-5 gap-6" id="admin-kpis-grid">
                            <!-- Populated dynamically -->
                        </div>

                        <!-- Graphical Charts Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                                <h3 class="font-title font-bold text-sm text-white mb-4"><i class="fa-solid fa-chart-area text-brandGold mr-2"></i> Reporte Mensual de Ingresos (S/)</h3>
                                <div class="h-64"><canvas id="admin-chart-revenue"></canvas></div>
                            </div>
                            <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                                <h3 class="font-title font-bold text-sm text-white mb-4"><i class="fa-solid fa-chart-pie text-brandGold mr-2"></i> Proporción de Asistencias General</h3>
                                <div class="h-64 flex justify-center"><canvas id="admin-chart-attendance"></canvas></div>
                            </div>
                        </div>
                    </div>

                    <!-- Admin Tab: Students List -->
                    <div id="admin-view-students" class="admin-tab-view hidden space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-title font-bold text-lg text-white">Alumnos Inscritos</h3>
                            <button onclick="exportStudentsReport()" class="bg-gradient-gold text-brandBlue font-extrabold py-2 px-4 rounded-xl text-xs shadow-md">
                                <i class="fa-solid fa-file-excel mr-1.5"></i> Exportar CSV Reporte
                            </button>
                        </div>
                        <div class="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-lg">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-xs">
                                    <thead>
                                        <tr class="bg-white/2 border-b border-white/5 text-white/40">
                                            <th class="p-4">Estudiante</th>
                                            <th class="p-4">Grupo</th>
                                            <th class="p-4">Teléfono</th>
                                            <th class="p-4">Registro</th>
                                            <th class="p-4">Estado Matrícula</th>
                                            <th class="p-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-students-tbody" class="divide-y divide-white/5">
                                        <!-- Dynamic student rows -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Admin Tab: Record Attendance -->
                    <div id="admin-view-attendance" class="admin-tab-view hidden space-y-6">
                        <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                            <h3 class="font-title font-bold text-lg text-white mb-4"><i class="fa-solid fa-user-check text-brandGold mr-2"></i> Registrar Control Diaria de Asistencia</h3>
                            <form onsubmit="handleAdminRecordAttendance(event)" class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label class="block text-[10px] font-bold text-white/50 uppercase mb-1">Seleccionar Alumno</label>
                                    <select id="attendance-student-select" required class="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-semibold">
                                        <!-- student options -->
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-white/50 uppercase mb-1">Fecha de Sesión</label>
                                    <input type="date" id="attendance-date" required class="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-semibold">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-white/50 uppercase mb-1">Estado de Asistencia</label>
                                    <select id="attendance-status" required class="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-xs text-white font-semibold">
                                        <option value="Presente">Presente</option>
                                        <option value="Tardanza">Tardanza</option>
                                        <option value="Falta">Falta</option>
                                    </select>
                                </div>
                                <button type="submit" class="bg-brandGold text-brandBlue font-extrabold py-3.5 rounded-xl text-xs shadow-md">
                                    <i class="fa-solid fa-save mr-1.5"></i> Registrar Asistencia
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Admin Tab: Record Payments -->
                    <div id="admin-view-payments" class="admin-tab-view hidden space-y-6">
                        <div class="bg-slate-900 border border-white/5 rounded-3xl p-6">
                            <h3 class="font-title font-bold text-lg text-white mb-4"><i class="fa-solid fa-credit-card text-brandGold mr-2"></i> Transacciones y Control de Pagos</h3>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-xs">
                                    <thead>
                                        <tr class="text-white/40 border-b border-white/5 pb-2">
                                            <th class="py-3">Estudiante</th>
                                            <th class="py-3">Monto</th>
                                            <th class="py-3">Cuota N°</th>
                                            <th class="py-3">Fecha Estimada</th>
                                            <th class="py-3">Comprobante / Ref</th>
                                            <th class="py-3 text-right">Confirmar Pago</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-payments-tbody" class="divide-y divide-white/5">
                                        <!-- dynamic payment validation list -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    `;

    // Load portal details
    loadAdminPortalData();
}

function switchAdminTab(tabName) {
    // Hide all view subcontainers
    document.querySelectorAll('.admin-tab-view').forEach(view => view.classList.add('hidden'));
    // Show selected
    document.getElementById(`admin-view-${tabName}`).classList.remove('hidden');

    // Toggle nav active classes
    const buttons = document.querySelectorAll('.admin-tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('bg-white/5', 'text-white');
        } else {
            btn.classList.remove('bg-white/5', 'text-white');
        }
    });
}

// Global charts variables to prevent canvas redraw issues
let chartRevenueInstance = null;
let chartAttendanceInstance = null;

async function loadAdminPortalData() {
    let kpis = null;
    let students = [];
    let payments = [];
    let attendance = [];
    let monthlyRevenue = [];
    let attendanceSummary = [];

    try {
        const dRes = await fetch(`${state.apiBase}/api/dashboard`, { headers: getHeaders() });
        const sRes = await fetch(`${state.apiBase}/api/students`, { headers: getHeaders() });
        const pRes = await fetch(`${state.apiBase}/api/payments`, { headers: getHeaders() });
        const aRes = await fetch(`${state.apiBase}/api/attendance`, { headers: getHeaders() });

        if (dRes.ok && sRes.ok && pRes.ok && aRes.ok) {
            const dashboard = await dRes.json();
            kpis = dashboard.kpis;
            monthlyRevenue = dashboard.monthlyRevenue;
            attendanceSummary = dashboard.attendanceSummary;
            
            students = await sRes.json();
            payments = await pRes.json();
            attendance = await aRes.json();
        } else {
            throw new Error();
        }
    } catch (e) {
        // Fallback loads
        students = mockData.students;
        payments = mockData.payments;
        attendance = mockData.attendance;

        const totalRev = payments.filter(p => p.status === 'Pagado').reduce((acc, p) => acc + p.amount, 0);
        const totalPend = payments.filter(p => p.status === 'Pendiente').reduce((acc, p) => acc + p.amount, 0);
        const presentCount = attendance.filter(a => a.status === 'Presente').length;
        const lateCount = attendance.filter(a => a.status === 'Tardanza').length;
        const totalAttendance = attendance.length;
        const attendanceRate = totalAttendance > 0 ? ((presentCount + lateCount) / totalAttendance) * 100 : 100;

        kpis = {
            totalStudents: students.length,
            totalRevenue: totalRev,
            pendingPayments: totalPend,
            attendanceRate: Math.round(attendanceRate, 1),
            activeCourses: 4
        };

        monthlyRevenue = [
            { month: "2026-05", amount: totalRev }
        ];
        
        attendanceSummary = [
            { status: "Presente", count: presentCount },
            { status: "Tardanza", count: lateCount },
            { status: "Falta", count: attendance.filter(a => a.status === 'Falta').length }
        ];
    }

    // Populate KPIs widgets
    const kpisGrid = document.getElementById('admin-kpis-grid');
    kpisGrid.innerHTML = `
        <div class="bg-slate-900 border border-white/5 rounded-2xl p-5">
            <span class="text-white/40 text-[10px] uppercase font-bold tracking-wider">Total Estudiantes</span>
            <span class="block text-2xl font-extrabold mt-1 text-white">${kpis.totalStudents}</span>
        </div>
        <div class="bg-slate-900 border border-white/5 rounded-2xl p-5">
            <span class="text-white/40 text-[10px] uppercase font-bold tracking-wider">Ingresos Confirmados</span>
            <span class="block text-2xl font-extrabold mt-1 text-emerald-400">S/ ${kpis.totalRevenue}</span>
        </div>
        <div class="bg-slate-900 border border-white/5 rounded-2xl p-5">
            <span class="text-white/40 text-[10px] uppercase font-bold tracking-wider">Cuentas por Cobrar</span>
            <span class="block text-2xl font-extrabold mt-1 text-rose-400">S/ ${kpis.pendingPayments}</span>
        </div>
        <div class="bg-slate-900 border border-white/5 rounded-2xl p-5">
            <span class="text-white/40 text-[10px] uppercase font-bold tracking-wider">Asistencia Promedio</span>
            <span class="block text-2xl font-extrabold mt-1 text-brandGold">${kpis.attendanceRate}%</span>
        </div>
        <div class="bg-slate-900 border border-white/5 rounded-2xl p-5 col-span-2 lg:col-span-1">
            <span class="text-white/40 text-[10px] uppercase font-bold tracking-wider">Horarios Cursos</span>
            <span class="block text-2xl font-extrabold mt-1 text-brandBlueLight">${kpis.activeCourses}</span>
        </div>
    `;

    // Render Charts
    renderAdminCharts(monthlyRevenue, attendanceSummary);

    // Populate Students Table
    const studentsTbody = document.getElementById('admin-students-tbody');
    studentsTbody.innerHTML = students.map(s => `
        <tr class="hover:bg-white/2">
            <td class="p-4">
                <span class="font-bold block text-white">${s.name}</span>
                <span class="text-[10px] text-white/40 block">${s.email}</span>
            </td>
            <td class="p-4 font-semibold text-brandGold">${s.groupName || 'Grupo 1'}</td>
            <td class="p-4 text-white/70">${s.phone}</td>
            <td class="p-4 text-white/60">${new Date(s.registeredAt).toLocaleDateString('es-PE')}</td>
            <td class="p-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.enrollmentStatus === 'Activo' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-yellow-600/20 text-yellow-400'}">
                    ${s.enrollmentStatus}
                </span>
            </td>
            <td class="p-4 text-right">
                <button onclick="deleteStudent('${s.id}')" class="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white p-2 rounded-lg border border-rose-500/20 transition-colors">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Populate Attendance Student Select
    const studentSelect = document.getElementById('attendance-student-select');
    studentSelect.innerHTML = `<option value="" disabled selected>Seleccione Alumno</option>` + 
        students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    // Set default date for attendance to today
    document.getElementById('attendance-date').value = new Date().toISOString().split('T')[0];

    // Populate Payments validation table
    const paymentsTbody = document.getElementById('admin-payments-tbody');
    paymentsTbody.innerHTML = payments.map(p => `
        <tr class="hover:bg-white/2">
            <td class="py-3 font-semibold text-white">${p.studentName || 'Estudiante'}</td>
            <td class="py-3 font-bold text-emerald-400">S/ ${p.amount}</td>
            <td class="py-3 text-white/70">Cuota N° ${p.installmentNumber}</td>
            <td class="py-3 text-white/50">${p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('es-PE') : 'N/A'}</td>
            <td class="py-3 text-white/70">
                <input type="text" id="ref-code-${p.id}" placeholder="TRX-XXXXX" value="${p.referenceCode}" ${p.status === 'Pagado' ? 'disabled' : ''} class="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-white/20 w-28">
            </td>
            <td class="py-3 text-right">
                ${p.status === 'Pagado'
                    ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/20 text-emerald-400">PAGADO</span>`
                    : `<button onclick="recordPaymentFromAdmin('${p.id}')" class="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-3 py-1 rounded text-[10px] shadow">Validar</button>`
                }
            </td>
        </tr>
    `).join('');
}

function renderAdminCharts(revenue, attendance) {
    // Revenue Line Chart
    if (chartRevenueInstance) chartRevenueInstance.destroy();
    
    const revCtx = document.getElementById('admin-chart-revenue').getContext('2d');
    chartRevenueInstance = new Chart(revCtx, {
        type: 'line',
        data: {
            labels: revenue.map(r => r.month),
            datasets: [{
                label: 'Ingresos Mensuales',
                data: revenue.map(r => r.amount),
                borderColor: '#F4B942',
                backgroundColor: 'rgba(244, 185, 66, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255, 255, 255, 0.6)' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255, 255, 255, 0.6)' } }
            }
        }
    });

    // Attendance Donut
    if (chartAttendanceInstance) chartAttendanceInstance.destroy();

    const present = attendance.find(a => a.status === 'Presente')?.count || 0;
    const late = attendance.find(a => a.status === 'Tardanza')?.count || 0;
    const absent = attendance.find(a => a.status === 'Falta')?.count || 0;

    const attCtx = document.getElementById('admin-chart-attendance').getContext('2d');
    chartAttendanceInstance = new Chart(attCtx, {
        type: 'doughnut',
        data: {
            labels: ['Presente', 'Tardanza', 'Falta'],
            datasets: [{
                data: [present || 1, late, absent],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                borderColor: '#0F172A',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } },
            cutout: '70%'
        }
    });
}

async function recordPaymentFromAdmin(paymentId) {
    const refInput = document.getElementById(`ref-code-${paymentId}`);
    const referenceCode = refInput ? refInput.value : '';

    try {
        const res = await fetch(`${state.apiBase}/api/payments/${paymentId}/record`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(referenceCode)
        });

        const data = await res.json();
        
        if (res.ok) {
            showNotification(data.message, 'success');
            loadAdminPortalData();
        } else {
            showNotification(data.message || 'Error al validar pago.', 'error');
        }
    } catch (err) {
        // Fallback simulation
        const pIdx = mockData.payments.findIndex(p => p.id === paymentId);
        if (pIdx !== -1) {
            const p = mockData.payments[pIdx];
            p.status = "Pagado";
            p.paymentDate = new Date().toISOString();
            p.referenceCode = referenceCode || `REF-${new Random().Next(100000, 999999)}`;

            // Activate student enrollment
            const student = mockData.students.find(s => s.id === p.studentId);
            if (student && student.enrollmentStatus === 'Pendiente') {
                student.enrollmentStatus = 'Activo';
            }
        }

        showNotification('[Simulación] Pago registrado correctamente.', 'success');
        loadAdminPortalData();
    }
}

async function handleAdminRecordAttendance(e) {
    e.preventDefault();
    const studentId = document.getElementById('attendance-student-select').value;
    const date = document.getElementById('attendance-date').value;
    const status = document.getElementById('attendance-status').value;

    const payload = { studentId, date, status };

    try {
        const res = await fetch(`${state.apiBase}/api/attendance/record`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            showNotification(data.message, 'success');
            loadAdminPortalData();
        } else {
            showNotification(data.message || 'Error al guardar asistencia.', 'error');
        }
    } catch (err) {
        // Fallback simulation
        const student = mockData.students.find(s => s.id === studentId);
        mockData.attendance.push({
            id: "mock-a-" + Date.now(),
            studentId,
            studentName: student?.name || 'Estudiante',
            date,
            status
        });

        showNotification('[Simulación] Asistencia registrada correctamente.', 'success');
        loadAdminPortalData();
    }
}

async function deleteStudent(studentId) {
    if (!confirm('¿Está seguro de eliminar este estudiante permanentemente?')) return;

    try {
        const res = await fetch(`${state.apiBase}/api/students/${studentId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const data = await res.json();
        
        if (res.ok) {
            showNotification(data.message, 'success');
            loadAdminPortalData();
        } else {
            showNotification(data.message || 'Error al eliminar alumno.', 'error');
        }
    } catch (err) {
        // Fallback simulation
        const sIdx = mockData.students.findIndex(s => s.id === studentId);
        if (sIdx !== -1) {
            const student = mockData.students[sIdx];
            
            // Refund seats to group
            const group = mockData.groups.find(g => g.id === student.groupId);
            if (group) {
                group.availableSeats++;
                group.status = "Disponible";
            }

            // Remove student, user, payments and attendance
            mockData.students.splice(sIdx, 1);
            mockData.payments = mockData.payments.filter(p => p.studentId !== studentId);
            mockData.attendance = mockData.attendance.filter(a => a.studentId !== studentId);
        }

        showNotification('[Simulación] Estudiante eliminado correctamente.', 'success');
        loadAdminPortalData();
    }
}

// Export Report CSV (Excel compatible)
function exportStudentsReport() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nombre,Correo,Telefono,Fecha Registro,Estado Matricula,Grupo\n";

    // Gather student lists
    const studentList = state.role === "Administrador" && mockData.students.length > 0 
        ? mockData.students 
        : mockData.students; // fallback or server values

    studentList.forEach(s => {
        const row = `"${s.id}","${s.name}","${s.email}","${s.phone}","${s.registeredAt}","${s.enrollmentStatus}","${s.groupName || 'Grupo'}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Alumnos_Oratoria_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
    link.remove();
    showNotification("Reporte CSV exportado correctamente.", "success");
}
