import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Bug,
  Award,
  Mail,
  Linkedin,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  // Hall of Fame achievements
  const achievements = [
    {
      company: 'Google',
      logo: '🔍',
      description: 'Critical vulnerability discovered',
      reward: '$15,000',
      year: '2024'
    },
    {
      company: 'Meta (Facebook)',
      logo: '👤',
      description: 'Security flaw in authentication',
      reward: '$10,000',
      year: '2024'
    },
    {
      company: 'Microsoft',
      logo: '💻',
      description: 'XSS vulnerability found',
      reward: '$8,500',
      year: '2023'
    },
    {
      company: 'Apple',
      logo: '🍎',
      description: 'Data leak prevention',
      reward: '$12,000',
      year: '2023'
    },
    {
      company: 'Tesla',
      logo: '⚡',
      description: 'API security vulnerability',
      reward: '$7,500',
      year: '2023'
    },
    {
      company: 'Netflix',
      logo: '🎬',
      description: 'Account takeover prevention',
      reward: '$6,000',
      year: '2022'
    }
  ];

  // Certifications
  const certifications = [
    {
      title: 'Certified Ethical Hacker (CEH)',
      org: 'EC-Council',
      date: 'Januari 2023',
      image: '/certificates/ceh.jpg'
    },
    {
      title: 'Offensive Security Certified Professional (OSCP)',
      org: 'Offensive Security',
      date: 'Maret 2023',
      image: '/certificates/oscp.jpg'
    },
    {
      title: 'CompTIA Security+',
      org: 'CompTIA',
      date: 'Juli 2022',
      image: '/certificates/security-plus.jpg'
    },
    {
      title: 'Certified Information Systems Security Professional',
      org: 'ISC²',
      date: 'September 2023',
      image: '/certificates/cissp.jpg'
    },
    {
      title: 'Bug Bounty Hunter',
      org: 'HackerOne',
      date: 'Mei 2024',
      image: '/certificates/hackerone.jpg'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', message: 'Mohon isi semua field' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormStatus({ type: 'error', message: 'Format email tidak valid' });
      return;
    }

    // Success message
    setFormStatus({ type: 'success', message: 'Pesan berhasil dikirim!' });
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setFormStatus(null), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg overflow-x-hidden">
      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl -top-48 -left-48"></div>
          <div className="absolute w-96 h-96 bg-matrix-green/10 rounded-full blur-3xl -bottom-48 -right-48"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative inline-block mb-8">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-cyber-blue animate-glow">
                <img
                  src="/profil.jpg"
                  alt="Riski Permana - Security Researcher dan Bug Bounty Hunter"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-cyber-blue to-matrix-green flex items-center justify-center text-6xl">RP</div>';
                  }}
                />
              </div>
              {/* Scanner effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent animate-scan opacity-50"></div>
              </div>
            </div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Portofolio <span className="text-gradient">Riski Permana</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Securing the Digital Frontier | Independent Security Researcher
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <a
                href="#about"
                className="px-6 py-3 bg-cyber-blue hover:bg-cyber-blue/80 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Shield size={20} />
                Tentang Saya
              </a>
              <a
                href="#contact"
                className="px-6 py-3 glassmorphism hover:bg-white/10 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Send size={20} />
                Hubungi Saya
              </a>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* About Section */}
      <main>
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center">
                Tentang <span className="text-gradient">Saya</span>
              </h2>

              <div className="glassmorphism rounded-2xl p-6 sm:p-8 md:p-12">
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300 mb-6">
                  Saya adalah <strong className="text-cyber-blue">Security Researcher independen</strong> yang berdedikasi
                  untuk mengamankan ekosistem digital. Dengan pengalaman lebih dari 4 tahun di bidang <strong className="text-matrix-green">Cyber Security</strong>,
                  saya telah berhasil menemukan dan melaporkan berbagai kerentanan kritis pada platform-platform teknologi terkemuka dunia.
                </p>

                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300 mb-6">
                  Keahlian saya mencakup <strong>Penetration Testing</strong>, <strong>Vulnerability Assessment</strong>,
                  <strong> Web Application Security</strong>, dan <strong>API Security</strong>. Saya berspesialisasi dalam
                  mengidentifikasi kelemahan keamanan seperti SQL Injection, Cross-Site Scripting (XSS), Authentication Bypass,
                  dan berbagai vektor serangan lainnya.
                </p>

                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
                  Sebagai <strong className="text-cyber-blue">Bug Bounty Hunter</strong> aktif, saya telah berkontribusi
                  dalam meningkatkan keamanan berbagai perusahaan Fortune 500 dan startup teknologi. Misi saya adalah
                  menjadikan internet tempat yang lebih aman bagi semua orang.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-cyber-blue mb-2">50+</div>
                    <div className="text-gray-400">Kerentanan Ditemukan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-matrix-green mb-2">$75K+</div>
                    <div className="text-gray-400">Total Bounty Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-cyber-blue mb-2">15+</div>
                    <div className="text-gray-400">Perusahaan Global</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Hall of Fame Section */}
        <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
                Hall of <span className="text-gradient">Fame</span>
              </h2>
              <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Pencapaian dan pengakuan dari perusahaan teknologi terkemuka dunia
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="glassmorphism rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {achievement.logo}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-cyber-blue">{achievement.company}</h3>
                    <p className="text-gray-300 mb-3">{achievement.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                      <span className="text-matrix-green font-bold text-lg">{achievement.reward}</span>
                      <span className="text-gray-400 text-sm">{achievement.year}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
                Lisensi & <span className="text-gradient">Sertifikasi</span>
              </h2>
              <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Kredensial profesional dan sertifikasi keamanan siber
              </p>

              {/* Horizontal scrolling container */}
              <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-80 sm:w-96 snap-center"
                  >
                    <div className="glassmorphism rounded-xl overflow-hidden h-full hover:bg-white/10 transition-all duration-300 group">
                      <div className="h-48 bg-gradient-to-br from-cyber-blue/20 to-matrix-green/20 flex items-center justify-center overflow-hidden">
                        <img
                          src={cert.image}
                          alt={`Sertifikat ${cert.title} Riski Permana`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full"><Award size="64" class="text-cyber-blue" /></div>';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyber-blue transition-colors">
                          {cert.title}
                        </h3>
                        <p className="text-gray-400 mb-2">{cert.org}</p>
                        <p className="text-sm text-gray-500">{cert.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-6 text-gray-400 text-sm">
                <ChevronRight className="inline animate-pulse" />
                Scroll horizontal untuk melihat lebih banyak
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
                Hubungi <span className="text-gradient">Saya</span>
              </h2>
              <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Mari berkolaborasi untuk meningkatkan keamanan digital bersama
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-6">Media Sosial</h3>

                  <a
                    href="mailto:riskiper819@gmail.com"
                    className="flex items-center gap-4 glassmorphism p-4 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <Mail className="text-cyber-blue group-hover:scale-110 transition-transform" size={24} />
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-sm text-gray-400">riskiper819@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/riskipermana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 glassmorphism p-4 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <Linkedin className="text-cyber-blue group-hover:scale-110 transition-transform" size={24} />
                    <div>
                      <div className="font-semibold">LinkedIn</div>
                      <div className="text-sm text-gray-400">linkedin.com/in/riskipermana</div>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/rskprmn_668/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 glassmorphism p-4 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <Instagram className="text-matrix-green group-hover:scale-110 transition-transform" size={24} />
                    <div>
                      <div className="font-semibold">Instagram</div>
                      <div className="text-sm text-gray-400">@rskprmn_668</div>
                    </div>
                  </a>
                </div>

                {/* Contact Form */}
                <div>
                  <h3 className="text-xl font-bold mb-6">Kirim Pesan</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nama Anda"
                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 transition-all"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Anda"
                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 transition-all"
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Pesan Anda"
                        rows="4"
                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 transition-all resize-none"
                      ></textarea>
                    </div>

                    {formStatus && (
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${formStatus.type === 'success'
                          ? 'bg-matrix-green/20 text-matrix-green'
                          : 'bg-red-500/20 text-red-400'
                        }`}>
                        {formStatus.type === 'success' ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <AlertCircle size={20} />
                        )}
                        <span>{formStatus.message}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyber-blue to-matrix-green hover:from-cyber-blue/80 hover:to-matrix-green/80 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      Kirim Pesan
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 <span className="text-cyber-blue font-semibold">Riski Permana</span>.
            Semua hak cipta dilindungi.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Made with <span className="text-red-500">❤</span> for a Safer Digital World
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
