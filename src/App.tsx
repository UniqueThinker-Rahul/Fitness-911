/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Dumbbell, 
  Zap, 
  Trophy, 
  ShieldCheck,
  Menu,
  X,
  Instagram,
  Facebook
} from 'lucide-react';
import { motion, useScroll, useSpring, useInView, useTransform } from 'motion/react';

// --- Components ---

const ProgressBar = ({ label, targetValue }: { label: string, targetValue: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => setValue(targetValue), 200);
      return () => clearTimeout(timeout);
    }
  }, [isInView, targetValue]);

  return (
    <div ref={ref} className="mb-8 px-2">
      <div className="flex justify-between mb-4">
        <span className="font-display font-bold uppercase tracking-wider text-xs sm:text-sm">{label}</span>
        <span className="text-emergency-yellow font-mono font-bold">{value}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${targetValue}%` : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-warning-orange to-emergency-yellow"
        />
      </div>
    </div>
  );
};

const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border-2 border-white/10 shadow-2xl"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image */}
      <div className="absolute inset-0 bg-neutral-800">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" 
          alt="After" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 right-4 bg-emergency-yellow text-black px-3 py-1 font-bold text-xs uppercase rounded z-20">After</div>
      </div>

      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 bg-neutral-900 overflow-hidden z-10"
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200" 
          alt="Before" 
          className="absolute inset-0 h-full object-cover grayscale opacity-60"
          style={{ width: containerWidth }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 font-bold text-xs uppercase rounded">Before</div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-emergency-yellow shadow-[0_0_15px_rgba(255,215,0,0.8)] z-30"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-emergency-yellow rounded-full flex items-center justify-center shadow-xl border-4 border-stealth-black">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-black rounded-full" />
            <div className="w-1 h-4 bg-black rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleTable = () => {
  const schedule = [
    { day: 'Monday', morning: '06:00 - 11:00', evening: '16:00 - 22:00' },
    { day: 'Tuesday', morning: '06:00 - 11:00', evening: '16:00 - 22:00' },
    { day: 'Wednesday', morning: '06:00 - 11:00', evening: '16:00 - 22:00' },
    { day: 'Thursday', morning: '06:00 - 11:00', evening: '16:00 - 22:00' },
    { day: 'Friday', morning: '06:00 - 11:00', evening: '16:00 - 22:00' },
    { day: 'Saturday', morning: '06:00 - 11:00', evening: '16:00 - 21:00' },
    { day: 'Sunday', morning: 'CLOSED', evening: '17:00 - 20:00' },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="p-4 font-display font-bold uppercase text-emergency-yellow">Day</th>
            <th className="p-4 font-display font-bold uppercase text-emergency-yellow">Morning Session</th>
            <th className="p-4 font-display font-bold uppercase text-emergency-yellow">Evening Session</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold">{row.day}</td>
              <td className="p-4 text-neutral-400">{row.morning}</td>
              <td className="p-4 text-neutral-400">{row.evening}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms for hero background
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div className="min-h-screen selection:bg-emergency-yellow selection:text-black">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-emergency-yellow z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-stealth-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emergency-yellow rounded flex items-center justify-center">
                <Dumbbell className="text-black w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-display font-black tracking-tighter italic whitespace-nowrap">
                FITNESS<span className="text-emergency-yellow">-911</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-bold uppercase tracking-widest hover:text-emergency-yellow transition-colors">Features</a>
              <a href="#transformations" className="text-sm font-bold uppercase tracking-widest hover:text-emergency-yellow transition-colors">Results</a>
              <a href="#schedule" className="text-sm font-bold uppercase tracking-widest hover:text-emergency-yellow transition-colors">Schedule</a>
              <a 
                href="tel:8447601911" 
                className="flex items-center gap-2 bg-emergency-yellow text-black px-6 py-2.5 rounded font-black uppercase text-sm hover:bg-warning-orange transition-all active:scale-95"
              >
                <Phone size={16} />
                8447601911
              </a>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-stealth-black border-b border-white/10 px-4 py-8 flex flex-col gap-6"
          >
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest">Features</a>
            <a href="#transformations" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest">Results</a>
            <a href="#schedule" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest">Schedule</a>
            <a 
              href="tel:8447601911" 
              className="flex items-center justify-center gap-3 bg-emergency-yellow text-black px-6 py-4 rounded font-black uppercase text-lg"
            >
              <Phone size={20} />
              Call Now
            </a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Accents with Parallax */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-warning-orange/10 to-transparent -z-10" 
        />
        <motion.div 
          style={{ y: y2, rotate }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-emergency-yellow/10 rounded-full blur-[120px] -z-10" 
        />
        <motion.div 
          style={{ y: y1, x: 100 }}
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-warning-orange/5 rounded-full blur-[100px] -z-10" 
        />
        <motion.div 
          style={{ y: y2, x: -50 }}
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-emergency-yellow/5 rounded-full blur-[110px] -z-10" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-warning-orange"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Emergency Transformation Center</span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-display font-black leading-[0.9] mb-8 tracking-tighter italic">
                FITNESS <br />
                <span className="text-emergency-yellow">EMERGENCY?</span>
              </h1>
              
              <p className="text-xl text-neutral-400 mb-10 max-w-lg leading-relaxed">
                Stop making excuses. We have the cure for your fitness crisis. 
                Elite training, heavy-duty equipment, and extreme results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:8447601911"
                  className="group relative inline-flex items-center justify-center gap-3 bg-emergency-yellow text-black px-8 py-5 rounded-lg font-black uppercase tracking-tighter text-xl overflow-hidden active:scale-95 transition-all"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                  Call 8447601911
                </a>
                <a 
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-emergency-yellow px-8 py-5 rounded-lg font-black uppercase tracking-tighter text-xl transition-all"
                >
                  Explore Facility
                  <ChevronRight size={20} />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl shadow-emergency-yellow/10">
                <img 
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Gym Interior" 
                  className="w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stealth-black via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-stealth-black/80 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-emergency-yellow font-black text-2xl">500+</div>
                      <div className="text-[10px] uppercase font-bold text-neutral-500">Transformed</div>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <div className="text-emergency-yellow font-black text-2xl">15+</div>
                      <div className="text-[10px] uppercase font-bold text-neutral-500">Elite Coaches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emergency-yellow font-black text-2xl">24/7</div>
                      <div className="text-[10px] uppercase font-bold text-neutral-500">Support</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements with Parallax */}
              <motion.div 
                style={{ y: y2 }}
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-warning-orange/20 rounded-full blur-3xl -z-10" 
              />
              <motion.div 
                style={{ y: y1 }}
                className="absolute -top-6 -left-6 w-32 h-32 bg-emergency-yellow/20 rounded-full blur-3xl -z-10" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Bars Section */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <ProgressBar label="Strength & Power" targetValue={100} />
            <ProgressBar label="Endurance & Stamina" targetValue={100} />
            <ProgressBar label="Mental Spirit" targetValue={100} />
          </div>
        </div>
      </section>

      {/* KB Complex Feature Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
                    <img src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Equipment" referrerPolicy="no-referrer" />
                  </div>
                  <div className="h-48 rounded-2xl overflow-hidden border border-white/10 bg-emergency-yellow p-6 flex flex-col justify-end">
                    <Zap className="text-black w-10 h-10 mb-2" />
                    <h3 className="text-black font-display font-black text-xl leading-none">HIGH VOLTAGE TRAINING</h3>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-48 rounded-2xl overflow-hidden border border-white/10 bg-neutral-800 flex items-center justify-center p-6 text-center">
                    <div>
                      <MapPin className="text-emergency-yellow w-8 h-8 mx-auto mb-2" />
                      <p className="font-bold text-sm uppercase tracking-tighter">Sector Alpha II, Greater Noida</p>
                    </div>
                  </div>
                  <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
                    <img src="https://images.unsplash.com/photo-1574673139081-524e73bbbeaf?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Training" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-6xl font-display font-black mb-8 italic tracking-tighter">
                THE <span className="text-emergency-yellow">KB COMPLEX</span> ADVANTAGE
              </h2>
              <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
                Located on the <span className="text-white font-bold">2nd Floor of KB Complex</span>, our facility is designed for those who demand more from their environment. We've created a professional, high-performance space that cuts out the noise and focuses on pure transformation.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <ShieldCheck className="text-emergency-yellow" />, title: "Professional Environment", desc: "Clean, organized, and strictly focused on training." },
                  { icon: <Trophy className="text-emergency-yellow" />, title: "Elite Equipment", desc: "Heavy-duty machines and free weights for serious lifters." },
                  { icon: <MapPin className="text-emergency-yellow" />, title: "Prime Accessibility", desc: "Heart of Alpha II, perfect for students and professionals." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ 
                      scale: 1.02,
                      borderColor: "rgba(255, 215, 0, 0.4)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: "0 0 25px rgba(255, 215, 0, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex gap-4 p-4 rounded-xl border border-white/5 bg-transparent cursor-default"
                  >
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wider mb-1">{item.title}</h4>
                      <p className="text-sm text-neutral-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformations Section */}
      <section id="transformations" className="py-24 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-display font-black mb-4 italic tracking-tighter">
            EXTREME <span className="text-emergency-yellow">RESULTS</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            The proof is in the progress. Slide to see what 90 days of Fitness-911 commitment looks like.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BeforeAfterSlider />
          
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-3xl font-black text-emergency-yellow mb-1">-12KG</div>
              <div className="text-xs font-bold uppercase text-neutral-500">Avg. Weight Loss</div>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-3xl font-black text-emergency-yellow mb-1">+25%</div>
              <div className="text-xs font-bold uppercase text-neutral-500">Muscle Mass Gain</div>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-3xl font-black text-emergency-yellow mb-1">100%</div>
              <div className="text-xs font-bold uppercase text-neutral-500">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-end mb-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl lg:text-6xl font-display font-black italic tracking-tighter mb-4">
                TRAINING <span className="text-emergency-yellow">HOURS</span>
              </h2>
              <p className="text-neutral-400">
                No more "I don't have time." Our split sessions are designed to fit your busy lifestyle in Alpha II.
              </p>
            </div>
            <div className="lg:w-1/2 flex lg:justify-end">
              <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <Clock className="text-emergency-yellow" />
                <span className="font-bold uppercase tracking-widest text-sm">Open 6 Days a Week</span>
              </div>
            </div>
          </div>

          <ScheduleTable />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emergency-yellow -z-10" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 -z-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-7xl font-display font-black text-black mb-8 italic tracking-tighter">
            READY TO CURE YOUR <br /> FITNESS EMERGENCY?
          </h2>
          <p className="text-black/70 text-xl font-bold mb-12 max-w-2xl mx-auto">
            Join the elite squad at Fitness-911 today. Your transformation starts with a single call.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="tel:8447601911"
              className="relative group bg-black text-white px-12 py-6 rounded-xl font-black uppercase text-2xl tracking-tighter shadow-2xl hover:scale-105 transition-all active:scale-95"
            >
              <div className="absolute -top-1 -right-1 flex h-6 w-6">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-warning-orange opacity-75"></span>
                <span className="animate-pulse-dot relative inline-flex rounded-full h-6 w-6 bg-warning-orange"></span>
              </div>
              Call 8447601911
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stealth-black pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emergency-yellow rounded flex items-center justify-center">
                  <Dumbbell className="text-black w-5 h-5" />
                </div>
                <span className="text-xl font-display font-black tracking-tighter italic">
                  FITNESS<span className="text-emergency-yellow">-911</span>
                </span>
              </div>
              <p className="text-neutral-500 max-w-sm mb-8">
                The premier heavy-duty training facility in Greater Noida. We specialize in extreme transformations and elite performance.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/fitness911_gym" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emergency-yellow hover:text-black transition-all"
                  aria-label="Follow Fitness-911 on Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://facebook.com/fitness911gym" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emergency-yellow hover:text-black transition-all"
                  aria-label="Follow Fitness-911 on Facebook"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold uppercase tracking-widest mb-6 text-sm">Location</h4>
              <div className="space-y-4 text-neutral-500 text-sm">
                <div className="flex gap-3">
                  <MapPin className="text-emergency-yellow shrink-0" size={18} />
                  <p>2ND FLOOR, KB COMPLEX, Sector Alpha II, Greater Noida.</p>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block text-emergency-yellow font-bold hover:underline"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold uppercase tracking-widest mb-6 text-sm">Contact</h4>
              <div className="space-y-4 text-neutral-500 text-sm">
                <div className="flex gap-3">
                  <Phone className="text-emergency-yellow shrink-0" size={18} />
                  <p>+91 8447601911</p>
                </div>
                <div className="flex gap-3">
                  <Clock className="text-emergency-yellow shrink-0" size={18} />
                  <p>Mon - Sat: 06:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600 font-bold uppercase tracking-widest">
            <p>© 2026 FITNESS-911. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Call Button for Mobile */}
      <a 
        href="tel:8447601911"
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-emergency-yellow text-black rounded-full shadow-2xl flex items-center justify-center z-[90] animate-bounce"
      >
        <Phone size={28} />
      </a>
    </div>
  );
}
