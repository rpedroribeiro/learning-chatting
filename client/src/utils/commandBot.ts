class commandBot {
  private vocabWords: Set<string>
  private synonymMap: Record<string, string>
  private suffixes: string[]
  private termFrequencies: Record<string, number>
  private sentenceFrequency: Record<string, number>
  private sentenceCount: number
  private sentenceVectorMap: Map<string, (number | undefined)[]>

  constructor(targetSentences: Set<string>) {
    this.vocabWords = this.createVocabWords(targetSentences)
    this.synonymMap = {}
    this.suffixes = []
    this.termFrequencies = {}
    this.sentenceFrequency = {}
    this.sentenceCount = 0
    this.sentenceVectorMap = this.computeTargetSentenceVectors(targetSentences)
  }

  // Step 1, 2, 3: Tokenize sentence applying stop word removal, synonym normalization, and stemming
  tokenize(sentence: string): string[] {

  }

  // Step 2: Replace with synonym
  normalizeToken(token: string): string {
  
  }

  // Step 3: Remove the suffixes
  stemToken(token: string): string {
  }

  // Step 4: Extract parameter and count them
  exctractParameters(sentence: string): { newSentence: string, paramCount: number } {

  }

  // Step 5 & 6: Compute TF-IDF weighted vector for a sentence including parameter count
  vectorize(sentence: string): (number | undefined)[] {
    // Tokenize sentence (Steps 1-3)
    // Extract parameter count (Step 4)
    // Use TF-IDF formula (Step 5)
    // Return final vector: [ ...weights, paramCount ] (Step 5 & 6)
  }

  // Loops through all words from target sentences and stores them in set.
  createVocabWords(targetSentences: Set<string>): Set<string> {

  }

  // Get current vocabulary as array for vectorization
  getVocabWords(): Set<string> {
    
  }

  // Step 7: Store the sentence and its vector in the map for later retrieval
  computeTargetSentenceVectors(sentences: Set<string>): Map<string, (number | undefined)[]> {
  
  }

  // Used to find the closest math to the target sentence, can return null if not close enough
  cosineSimilarity(vectorA: number[], vectorB: number[]): number | null {
    
  }

  // Step 8: Find the closest target sentence match to the input sentence
  findClosestMatch(inputSentence: string): { sentence: string; similarity: number } {
    
  }
}