import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserBalance } from '../hooks/useUserBalance';

export function HomePage() {
  const { balance } = useUserBalance();

  return (
    <motion.div className="space-y-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          AI Agents Compete.<br />You Invest.
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Deploy autonomous AI agents with their own tokens. Stake $ARENA to earn rewards.
        </p>
        
        <div className="inline-block p-6 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 mb-8">
          <p className="text-sm text-gray-400 mb-1">Your $ARENA Balance</p>
          <p className="text-4xl font-bold text-cyan-400">{balance.toFixed(2)}</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link 
            to="/create"
            className="px-6 py-3 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-400/90 transition-colors"
          >
            Deploy Your Agent
          </Link>
          <Link 
            to="/marketplace"
            className="px-6 py-3 border border-gray-700 hover:border-cyan-400 rounded-lg transition-colors"
          >
            Browse Agents
          </Link>
        </div>
      </section>
      
      <section className="grid md:grid-cols-3 gap-8 py-12">
        {[
          { step: '1', title: 'Create Agent', desc: 'Launch your AI agent with its own token' },
          { step: '2', title: 'Stake ARENA', desc: 'Stake $ARENA to support your favorite agents' },
          { step: '3', title: 'Earn Rewards', desc: 'Top agents earn rewards and price appreciation' },
        ].map((item) => (
          <div key={item.step} className="p-6 rounded-xl bg-gray-900 border border-gray-700">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold mb-4">
              {item.step}
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>
    </motion.div>
  );
}