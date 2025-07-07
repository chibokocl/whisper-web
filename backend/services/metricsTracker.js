import { WERCalculator } from './werCalculator.js';

export class MetricsTracker {
  constructor() {
    this.sessions = new Map();
    this.initializeMetricsData();
  }

  initializeMetricsData() {
    // Kiswahili language patterns for accuracy calculation
    this.kiswahiliPatterns = [
      'ni', 'na', 'wa', 'ya', 'za', 'la', 'ma', 'ku', 'mu', 'ki', 'vi', 'mi',
      'hujambo', 'sijambo', 'asante', 'karibu', 'pole', 'heshima'
    ];

    // Medical terminology for domain expertise
    this.medicalTerms = [
      'maumivu', 'homa', 'kikohozi', 'kichefuchefu', 'kuharisha', 'tumbo', 
      'kichwa', 'mgongo', 'uchungu', 'dalili', 'matibabu', 'dawa', 'chanjo',
      'afya', 'hospitali', 'daktari', 'mgonjwa', 'sababu', 'suluhisho'
    ];

    // Cultural sensitivity indicators
    this.culturalTerms = [
      'asante', 'pole', 'hujambo', 'sijambo', 'karibu', 'heshima', 'utamaduni',
      'jamii', 'familia', 'mzee', 'mtoto', 'rafiki', 'jirani'
    ];

    // Response quality indicators
    this.qualityIndicators = {
      positive: ['asante', 'nzuri', 'safi', 'vizuri', 'karibu'],
      negative: ['tatizo', 'shida', 'maumivu', 'uchungu', 'homa'],
      neutral: ['sawa', 'hakuna', 'kuna', 'ni', 'na']
    };
  }

  async calculateMetrics(userInput, responseConfidence) {
    const input = userInput.toLowerCase();
    
    // Calculate Kiswahili accuracy
    const kiswahiliAccuracy = this.calculateKiswahiliAccuracy(input);
    
    // Calculate medical terminology recognition
    const medicalTerminology = this.calculateMedicalTerminology(input);
    
    // Calculate cultural sensitivity
    const culturalSensitivity = this.calculateCulturalSensitivity(input);
    
    // Calculate response latency (simulated)
    const responseLatency = this.calculateResponseLatency();
    
    // Calculate WER (Word Error Rate) - simplified
    const wer = this.calculateWER(input, responseConfidence);
    
    return {
      kiswahiliAccuracy: Math.round(kiswahiliAccuracy),
      medicalTerminology: Math.round(medicalTerminology),
      culturalSensitivity: Math.round(culturalSensitivity),
      responseLatency: responseLatency,
      wer: Math.round(wer * 100) / 100,
      timestamp: new Date()
    };
  }

  calculateKiswahiliAccuracy(input) {
    let score = 70; // Base score
    
    // Count Kiswahili patterns
    const patternMatches = this.kiswahiliPatterns.filter(pattern => 
      input.includes(pattern)
    ).length;
    
    // Adjust score based on pattern matches
    score += patternMatches * 3;
    
    // Bonus for longer, more complex sentences
    if (input.length > 20) {
      score += 5;
    }
    
    // Bonus for proper sentence structure
    if (input.includes('ni') || input.includes('na')) {
      score += 3;
    }
    
    return Math.min(100, score);
  }

  calculateMedicalTerminology(input) {
    let score = 50; // Base score
    
    // Count medical terms
    const medicalCount = this.medicalTerms.filter(term => 
      input.includes(term)
    ).length;
    
    // Adjust score based on medical term usage
    score += medicalCount * 15;
    
    // Bonus for multiple medical terms
    if (medicalCount > 1) {
      score += 10;
    }
    
    // Bonus for symptom descriptions
    if (input.includes('maumivu') || input.includes('homa')) {
      score += 5;
    }
    
    return Math.min(100, score);
  }

  calculateCulturalSensitivity(input) {
    let score = 60; // Base score
    
    // Count cultural terms
    const culturalCount = this.culturalTerms.filter(term => 
      input.includes(term)
    ).length;
    
    // Adjust score based on cultural term usage
    score += culturalCount * 8;
    
    // Bonus for respectful language
    if (input.includes('asante') || input.includes('pole')) {
      score += 10;
    }
    
    // Bonus for greetings
    if (input.includes('hujambo') || input.includes('sijambo')) {
      score += 5;
    }
    
    // Penalty for potentially insensitive terms (placeholder)
    const insensitiveTerms = ['mbaya', 'hafifu', 'duni'];
    const insensitiveCount = insensitiveTerms.filter(term => 
      input.includes(term)
    ).length;
    
    score -= insensitiveCount * 5;
    
    return Math.min(100, Math.max(0, score));
  }

  calculateResponseLatency() {
    // Simulate realistic response latency
    const baseLatency = 600; // Base 600ms
    const variation = Math.random() * 400; // ±200ms variation
    return Math.round(baseLatency + variation);
  }

  calculateWER(input, confidence) {
    // Initialize WER calculator if not already done
    if (!this.werCalculator) {
      this.werCalculator = new WERCalculator();
    }
    
    // For now, we'll use a simplified approach since we don't have reference text
    // In a real implementation, you'd compare with actual reference responses
    
    // Simulate reference text based on input patterns
    const referenceText = this.getReferenceText(input);
    const hypothesisText = input; // The actual transcribed text
    
    // Calculate WER using proper algorithm
    const wer = this.werCalculator.calculateWER(referenceText, hypothesisText);
    
    // Adjust based on confidence
    const confidenceAdjustedWER = this.werCalculator.calculateConfidenceAdjustedWER(
      referenceText, 
      hypothesisText, 
      confidence
    );
    
    return Math.max(0.05, Math.min(0.25, confidenceAdjustedWER));
  }

  getReferenceText(input) {
    // Generate expected reference text based on input patterns
    const words = input.toLowerCase().split(' ');
    
    // Look for key medical terms and generate expected text
    if (words.some(word => ['maumivu', 'uchungu'].includes(word))) {
      return "nina maumivu ya tumbo";
    }
    if (words.some(word => ['homa', 'joto'].includes(word))) {
      return "nina homa na joto la mwili";
    }
    if (words.some(word => ['tumbo', 'kichwa'].includes(word))) {
      return "tumbo linauma sana";
    }
    if (words.some(word => ['asante', 'hujambo'].includes(word))) {
      return "asante sana hujambo";
    }
    
    // Default reference for general conversation
    return "jina langu ni john nina tatizo la afya";
  }

  // Track session metrics over time
  trackSessionMetrics(sessionId, metrics) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        metrics: [],
        startTime: new Date(),
        totalMessages: 0
      });
    }
    
    const session = this.sessions.get(sessionId);
    session.metrics.push(metrics);
    session.totalMessages++;
    
    // Keep only last 100 metrics per session
    if (session.metrics.length > 100) {
      session.metrics = session.metrics.slice(-100);
    }
  }

  // Get aggregated metrics for a session
  getSessionMetrics(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }
    
    const metrics = session.metrics;
    if (metrics.length === 0) {
      return null;
    }
    
    // Calculate averages
    const avgKiswahiliAccuracy = metrics.reduce((sum, m) => sum + m.kiswahiliAccuracy, 0) / metrics.length;
    const avgMedicalTerminology = metrics.reduce((sum, m) => sum + m.medicalTerminology, 0) / metrics.length;
    const avgCulturalSensitivity = metrics.reduce((sum, m) => sum + m.culturalSensitivity, 0) / metrics.length;
    const avgResponseLatency = metrics.reduce((sum, m) => sum + m.responseLatency, 0) / metrics.length;
    const avgWER = metrics.reduce((sum, m) => sum + m.wer, 0) / metrics.length;
    
    return {
      sessionId,
      totalMessages: session.totalMessages,
      duration: new Date() - session.startTime,
      averages: {
        kiswahiliAccuracy: Math.round(avgKiswahiliAccuracy),
        medicalTerminology: Math.round(avgMedicalTerminology),
        culturalSensitivity: Math.round(avgCulturalSensitivity),
        responseLatency: Math.round(avgResponseLatency),
        wer: Math.round(avgWER * 100) / 100
      },
      latest: metrics[metrics.length - 1],
      trend: this.calculateTrend(metrics)
    };
  }

  // Calculate trend (improving, declining, stable)
  calculateTrend(metrics) {
    if (metrics.length < 2) {
      return 'stable';
    }
    
    const recent = metrics.slice(-5); // Last 5 metrics
    const older = metrics.slice(-10, -5); // Previous 5 metrics
    
    if (recent.length === 0 || older.length === 0) {
      return 'stable';
    }
    
    const recentAvg = recent.reduce((sum, m) => sum + m.kiswahiliAccuracy, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.kiswahiliAccuracy, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  // Get global statistics across all sessions
  getGlobalStats() {
    const allSessions = Array.from(this.sessions.values());
    
    if (allSessions.length === 0) {
      return null;
    }
    
    const allMetrics = allSessions.flatMap(session => session.metrics);
    
    if (allMetrics.length === 0) {
      return null;
    }
    
    return {
      totalSessions: allSessions.length,
      totalMessages: allSessions.reduce((sum, session) => sum + session.totalMessages, 0),
      averageMetrics: {
        kiswahiliAccuracy: Math.round(allMetrics.reduce((sum, m) => sum + m.kiswahiliAccuracy, 0) / allMetrics.length),
        medicalTerminology: Math.round(allMetrics.reduce((sum, m) => sum + m.medicalTerminology, 0) / allMetrics.length),
        culturalSensitivity: Math.round(allMetrics.reduce((sum, m) => sum + m.culturalSensitivity, 0) / allMetrics.length),
        responseLatency: Math.round(allMetrics.reduce((sum, m) => sum + m.responseLatency, 0) / allMetrics.length),
        wer: Math.round(allMetrics.reduce((sum, m) => sum + m.wer, 0) / allMetrics.length * 100) / 100
      }
    };
  }

  // Clean up old sessions
  cleanupOldSessions(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      if ((now - session.startTime) > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }
} 