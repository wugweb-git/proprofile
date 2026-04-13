import { MOCK_TRACES } from '../mockData';

export type MemoryState = 'HOLD' | 'SIGNAL' | 'PATTERN';

export interface MemoryNode {
  id: string;
  content: string;
  state: MemoryState;
  timestamp: number;
  source: string;
  tags: string[];
  links: string[]; // IDs of systems or other nodes
}

class MemoryEngine {
  private nodes: MemoryNode[] = [];

  constructor() {
    // Initialize with specific mock data from the dump
    this.nodes = [
      { id: 'hold_1', content: 'Eleks - Distributed Ledger Frameworks: Corda vs Hyperledger (6001 words, 1 CTA sticky right).', state: 'HOLD', timestamp: Date.now() - 1000 * 60 * 30, source: 'Competitive Blog Analysis.csv', tags: [], links: [] },
      { id: 'hold_2', content: 'Pratip Biswas (Unified Infotech) - Posts motivational quotes, comic strip artwork.', state: 'HOLD', timestamp: Date.now() - 1000 * 60 * 60 * 2, source: 'CEO Linkedin Audit.csv', tags: [], links: [] },
      { id: 'hold_3', content: 'Tanmay to audit GMB & Edit. Shreya to send extensive questionnaire.', state: 'HOLD', timestamp: Date.now() - 1000 * 60 * 60 * 5, source: 'VS Marketing Profile', tags: [], links: [] },
      { id: 'sig_1', content: 'Deep-tech B2B audiences tolerate high word counts if CTAs are progressively sticky.', state: 'SIGNAL', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, source: 'Socratic Inbox', tags: ['UX Architecture', 'B2B Content'], links: ['sys_wugweb'] },
      { id: 'sig_2', content: 'Systems fail when decisions are implicit instead of explicit.', state: 'SIGNAL', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, source: 'Voice Spark', tags: ['Decision Clarity'], links: ['sys_kotak', 'sys_adneto'] }
    ];
  }

  getNodesByState(state: MemoryState) {
    // Pruning logic: Filter out old HOLD nodes (e.g., older than 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return this.nodes.filter(n => {
      if (n.state === 'HOLD' && n.timestamp < sevenDaysAgo) return false;
      return n.state === state;
    });
  }

  capture(content: string, source: string = 'Quick Capture') {
    const node: MemoryNode = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      state: 'HOLD',
      timestamp: Date.now(),
      source,
      tags: [],
      links: []
    };
    this.nodes.unshift(node);
    return node;
  }

  promote(id: string, newState: MemoryState, refinedContent?: string, links: string[] = []) {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.state = newState;
      if (refinedContent) node.content = refinedContent;
      if (links.length > 0) node.links = [...new Set([...node.links, ...links])];
      node.timestamp = Date.now();
      
      // Forced Linking Rule: Every SIGNAL MUST connect to at least 1 system or pattern
      if (newState === 'SIGNAL' && node.links.length === 0) {
        throw new Error("Forced Linking Violation: Every SIGNAL must connect to at least 1 applied SYSTEM or PATTERN.");
      }

      // Pattern Promotion Rule: If a theme appears 3+ times, it's a candidate for PATTERN
      this.checkPatternPromotion();
    }
  }

  private checkPatternPromotion() {
    const signals = this.getNodesByState('SIGNAL');
    const themeCounts: Record<string, number> = {};
    
    signals.forEach(s => {
      s.tags.forEach(tag => {
        themeCounts[tag] = (themeCounts[tag] || 0) + 1;
      });
    });

    Object.entries(themeCounts).forEach(([tag, count]) => {
      if (count >= 3) {
        console.log(`Pattern detected: ${tag} has ${count} occurrences. Ready for promotion.`);
      }
    });
  }

  discard(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
  }

  getStats() {
    return {
      hold: this.getNodesByState('HOLD').length,
      signal: this.getNodesByState('SIGNAL').length,
      pattern: this.getNodesByState('PATTERN').length,
    };
  }

  getAllNodes() {
    return this.nodes;
  }
}

export const memoryEngine = new MemoryEngine();
