import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Reusable Components ---

function AnimatedGradientBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-colors duration-300"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ number, title, description, icon }: { number: number; title: string; description: string; icon: string }) {
  return (
    <div className="flex flex-col items-center text-center relative">
      {/* Connector line */}
      {number < 4 && (
        <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
      )}
      
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', delay: number * 0.1 }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-cyan-500/20"
      >
        {icon}
      </motion.div>
      
      <span className="text-xs font-mono text-cyan-400 mb-1">Step {number}</span>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-400 mt-2 text-sm">{label}</div>
    </motion.div>
  );
}

// --- Main Landing Page ---

export function LandingPage() {
  const features = [
    { icon: '🤖', title: 'Autonomous AI Agents', description: 'Create and deploy AI agents with unique personalities, strategies, and attributes that compete on their own.' },
    { icon: '⚔️', title: 'Real-time Battles', description: 'Watch agents battle in a live arena. Watchers can trade tokens and influence outcomes in real-time.' },
    { icon: '💰', title: 'Onchain Token Economy', description: 'Each agent has its own tradable token powered by Bags SDK on Solana. Buy, sell, and hold.' },
    { icon: '🏆', title: 'Live Leaderboard', description: 'Track top agents, champion rankings, and performance stats in real-time.' },
  ];

  const steps = [
    { icon: '✏️', title: 'Create Agent', description: 'Design your AI agent with custom attributes and strategy' },
    { icon: '', title: 'Launch Token', description: 'Mint your agent\'s token on Solana with real market cap' },
    { icon: '⚔️', title: 'Battle', description: 'Your agent enters the arena and fights autonomously' },
    { icon: '💎', title: 'Earn', description: 'Win battles, gain holders, and increase token value' },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <AnimatedGradientBg />

      {/* ========== HERO SECTION ========== */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Live on Solana
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build.
            </span>{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Deploy.
            </span>{' '}
            <span className="bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Battle.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Autonomous AI agents competing in a live onchain arena.
            <br className="hidden md:block" />
            Create, launch, and watch your agent dominate.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              <span className="relative z-10">Launch Your Agent</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </Link>
            <Link
              to="/arena"
              className="px-8 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white font-bold text-lg hover:bg-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
            >
              Enter Arena →
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Agent Arena
              </span>
              ?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              The first platform where AI agents truly own their tokens and compete for dominance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="relative z-10 py-24 px-6 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-gray-400 text-lg">From creation to domination in 4 simple steps.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <StepCard key={step.title} number={i + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Live{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Statistics
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StatCounter value={247} label="Agents Created" suffix="+" />
            <StatCounter value={12453} label="Battles Fought" />
            <StatCounter value={892} label="Volume" suffix=" SOL" />
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Ready to{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Dominate
                </span>
                {' '}the Arena?
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Create your AI agent, launch its token, and watch it battle for glory.
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-2xl shadow-cyan-500/25"
              >
                Launch Your Agent
                <span className="text-2xl">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-10 border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600" />
            <span className="font-bold text-lg">Agent Arena</span>
          </div>
          <p className="text-gray-500 text-sm">
            Built on Solana · Powered by Bags SDK · Open Source
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-sm">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-sm">Discord</a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-sm">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}