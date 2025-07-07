export class WERCalculator {
  constructor() {
    // Common Kiswahili words that might be confused
    this.similarWords = {
      'maumivu': ['maumivu', 'maumivu', 'maumivu'],
      'homa': ['homa', 'homa', 'homa'],
      'tumbo': ['tumbo', 'tumbo', 'tumbo'],
      'kichwa': ['kichwa', 'kichwa', 'kichwa'],
      'mgongo': ['mgongo', 'mgongo', 'mgongo'],
      'asante': ['asante', 'asante', 'asante'],
      'hujambo': ['hujambo', 'hujambo', 'hujambo']
    };
  }

  /**
   * Calculate WER using Levenshtein distance algorithm
   * @param {string} reference - The correct/expected text
   * @param {string} hypothesis - The transcribed text
   * @returns {number} WER value between 0 and 1
   */
  calculateWER(reference, hypothesis) {
    if (!reference || !hypothesis) {
      return 1.0; // 100% error if either is empty
    }

    // Normalize text: lowercase, remove extra spaces, punctuation
    const refWords = this.normalizeText(reference);
    const hypWords = this.normalizeText(hypothesis);

    if (refWords.length === 0) {
      return hypWords.length === 0 ? 0.0 : 1.0;
    }

    // Calculate edit distance
    const distance = this.levenshteinDistance(refWords, hypWords);
    
    // WER = edit distance / number of words in reference
    return distance / refWords.length;
  }

  /**
   * Calculate Levenshtein distance between two arrays of words
   * @param {string[]} reference - Array of reference words
   * @param {string[]} hypothesis - Array of hypothesis words
   * @returns {number} Minimum number of operations to transform one to the other
   */
  levenshteinDistance(reference, hypothesis) {
    const m = reference.length;
    const n = hypothesis.length;
    
    // Create matrix
    const matrix = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= m; i++) {
      matrix[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      matrix[0][j] = j;
    }
    
    // Fill the matrix
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = reference[i - 1] === hypothesis[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return matrix[m][n];
  }

  /**
   * Normalize text for WER calculation
   * @param {string} text - Input text
   * @returns {string[]} Array of normalized words
   */
  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim()
      .split(' ')
      .filter(word => word.length > 0); // Remove empty words
  }

  /**
   * Calculate WER with detailed breakdown
   * @param {string} reference - Reference text
   * @param {string} hypothesis - Hypothesis text
   * @returns {object} Detailed WER analysis
   */
  calculateWERDetailed(reference, hypothesis) {
    const refWords = this.normalizeText(reference);
    const hypWords = this.normalizeText(hypothesis);
    
    const { distance, operations } = this.levenshteinDistanceDetailed(refWords, hypWords);
    
    const substitutions = operations.filter(op => op.type === 'substitution').length;
    const insertions = operations.filter(op => op.type === 'insertion').length;
    const deletions = operations.filter(op => op.type === 'deletion').length;
    
    const wer = refWords.length > 0 ? distance / refWords.length : 1.0;
    
    return {
      wer: Math.round(wer * 100) / 100,
      totalWords: refWords.length,
      substitutions,
      insertions,
      deletions,
      operations,
      referenceWords: refWords,
      hypothesisWords: hypWords
    };
  }

  /**
   * Calculate Levenshtein distance with operation tracking
   * @param {string[]} reference - Reference words
   * @param {string[]} hypothesis - Hypothesis words
   * @returns {object} Distance and operations
   */
  levenshteinDistanceDetailed(reference, hypothesis) {
    const m = reference.length;
    const n = hypothesis.length;
    
    // Create matrix and backpointer matrix
    const matrix = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    const backpointers = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));
    
    // Initialize
    for (let i = 0; i <= m; i++) {
      matrix[i][0] = i;
      backpointers[i][0] = i > 0 ? 'deletion' : null;
    }
    for (let j = 0; j <= n; j++) {
      matrix[0][j] = j;
      backpointers[0][j] = j > 0 ? 'insertion' : null;
    }
    
    // Fill matrices
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = reference[i - 1] === hypothesis[j - 1] ? 0 : 1;
        
        const deletion = matrix[i - 1][j] + 1;
        const insertion = matrix[i][j - 1] + 1;
        const substitution = matrix[i - 1][j - 1] + cost;
        
        matrix[i][j] = Math.min(deletion, insertion, substitution);
        
        // Track operation
        if (matrix[i][j] === deletion) {
          backpointers[i][j] = 'deletion';
        } else if (matrix[i][j] === insertion) {
          backpointers[i][j] = 'insertion';
        } else {
          backpointers[i][j] = cost === 0 ? 'match' : 'substitution';
        }
      }
    }
    
    // Trace back to get operations
    const operations = this.traceOperations(backpointers, reference, hypothesis);
    
    return {
      distance: matrix[m][n],
      operations
    };
  }

  /**
   * Trace back through backpointers to get operations
   * @param {string[][]} backpointers - Backpointer matrix
   * @param {string[]} reference - Reference words
   * @param {string[]} hypothesis - Hypothesis words
   * @returns {Array} Array of operations
   */
  traceOperations(backpointers, reference, hypothesis) {
    const operations = [];
    let i = reference.length;
    let j = hypothesis.length;
    
    while (i > 0 || j > 0) {
      const operation = backpointers[i][j];
      
      switch (operation) {
        case 'match':
          operations.unshift({
            type: 'match',
            refWord: reference[i - 1],
            hypWord: hypothesis[j - 1]
          });
          i--;
          j--;
          break;
        case 'substitution':
          operations.unshift({
            type: 'substitution',
            refWord: reference[i - 1],
            hypWord: hypothesis[j - 1]
          });
          i--;
          j--;
          break;
        case 'deletion':
          operations.unshift({
            type: 'deletion',
            refWord: reference[i - 1],
            hypWord: null
          });
          i--;
          break;
        case 'insertion':
          operations.unshift({
            type: 'insertion',
            refWord: null,
            hypWord: hypothesis[j - 1]
          });
          j--;
          break;
      }
    }
    
    return operations;
  }

  /**
   * Calculate WER for a conversation session
   * @param {Array} conversationHistory - Array of message objects
   * @returns {object} Session WER statistics
   */
  calculateSessionWER(conversationHistory) {
    const userMessages = conversationHistory.filter(msg => msg.role === 'user');
    const doctorResponses = conversationHistory.filter(msg => msg.role === 'daktari');
    
    let totalWER = 0;
    let totalMessages = 0;
    const detailedResults = [];
    
    // For each user message, calculate WER against expected response
    for (let i = 0; i < userMessages.length; i++) {
      const userMsg = userMessages[i];
      const doctorMsg = doctorResponses[i];
      
      if (userMsg && doctorMsg) {
        // In a real scenario, you'd have reference responses
        // For now, we'll use a simplified approach
        const expectedResponse = this.getExpectedResponse(userMsg.content);
        const actualResponse = doctorMsg.content;
        
        const werResult = this.calculateWERDetailed(expectedResponse, actualResponse);
        totalWER += werResult.wer;
        totalMessages++;
        detailedResults.push(werResult);
      }
    }
    
    return {
      averageWER: totalMessages > 0 ? totalWER / totalMessages : 0,
      totalMessages,
      detailedResults
    };
  }

  /**
   * Get expected response for a user message (simplified)
   * @param {string} userMessage - User's message
   * @returns {string} Expected response
   */
  getExpectedResponse(userMessage) {
    const input = userMessage.toLowerCase();
    
    // Simple mapping of expected responses
    if (input.includes('maumivu')) {
      return "Pole sana kwa maumivu hayo. Je, ni mahali gani haswa mwilini unaposikia uchungu?";
    }
    if (input.includes('homa')) {
      return "Je, homa hii imekuwa ikiendelea kwa siku ngapi? Una dalili zingine?";
    }
    if (input.includes('tumbo')) {
      return "Je, tumbo linauma kwa namna gani? Ni maumivu makali au ya kupita?";
    }
    
    return "Asante kwa ujumbe wako. Je, unaweza kuniambia zaidi?";
  }

  /**
   * Calculate confidence-adjusted WER
   * @param {string} reference - Reference text
   * @param {string} hypothesis - Hypothesis text
   * @param {number} confidence - Confidence score (0-100)
   * @returns {number} Adjusted WER
   */
  calculateConfidenceAdjustedWER(reference, hypothesis, confidence) {
    const baseWER = this.calculateWER(reference, hypothesis);
    
    // Adjust WER based on confidence
    // Higher confidence should generally correlate with lower WER
    const confidenceFactor = (100 - confidence) / 100; // 0 to 1
    const adjustment = confidenceFactor * 0.1; // Max 10% adjustment
    
    return Math.max(0, Math.min(1, baseWER + adjustment));
  }
} 