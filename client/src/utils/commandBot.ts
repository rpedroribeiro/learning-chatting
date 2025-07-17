class commandBot {
  private vocabWords: Set<string>
  private synonymMap: Map<string, Set<string>>
  private reverseSynonymMap: Map<string, string>
  private suffixes: string[]
  private termFrequencies: Record<string, number>
  private sentenceFrequency: Record<string, number>
  private sentenceCount: number
  private sentenceVectorMap: Map<string, (number | undefined)[]>

  constructor(targetSentences: string[]) {
    const synonyms = new Map<string, Set<string>>([
      ["get", new Set(["find", "fetch"])]
    ])
    this.vocabWords = new Set<string>()
    this.synonymMap = synonyms
    this.reverseSynonymMap = this.createReverseSynonymMap(synonyms)
    this.suffixes = []
    this.termFrequencies = {}
    this.sentenceFrequency = {}
    this.sentenceCount = 0
    this.sentenceVectorMap = this.computeTargetSentenceVectors(targetSentences)
  }

  /**
   * This method takes in an array of target sentences and goes through the NLP pipeline
   * to make a map made up of the sentence as the key and their vector as the value.
   * 
   * @param sentences - The target sentences we want to map.
   * @returns A map of the sentence as the key and the vector as the value.
   */
  computeTargetSentenceVectors(sentences: string[]): Map<string, number[]> {
    for (const sentence of sentences) {
      const [tokenizedSentence, tokenizedParams] = this.tokenize(sentence)
    }

    return // TODO
  }

  /**
   * This meethod takes in a sentence and tokenizes the words and the params seperately.
   * 
   * @param sentence - The sentence to be tokenized.
   * @returns The tokens of words and params.
   */
  tokenize(sentence: string): [string[], string[]] {
    const regex: RegExp = /'[\w]+'|(\w+)/g
    let tokens: string[] = []
    let params: string[] = []
    let match
    while ((match = regex.exec(sentence)) !== null) {
      if (match[1] === undefined) {  params.push(match[1]) } 
      else if (match[0]) {
        const token = match[0]
        const finalToken = this.normalizeToken(token.toLocaleLowerCase())
        tokens.push(finalToken)
      }
    }
    return [tokens, params]
  }

  /**
   * This method takes in the synonym map and reverses it by making every synonym in the synonym
   * array a key and the value is its corresponding original key, making the new synonym map have
   * a O(1) lookup. 
   * 
   * @param synonymMap - The original synonym map.
   * @returns The new reversed synonym map that has O(1) lookup.
   */
  private createReverseSynonymMap(synonymMap: Map<string, Set<string>>): Map<string, string> {
    const reverseMap = new Map<string, string>()
    for (const [canonical, synonyms] of synonymMap.entries()) {
      reverseMap.set(canonical, canonical)
      for (const synonym of synonyms) {
        reverseMap.set(synonym, canonical)
      }
    }
    return reverseMap
  }

  /**
   * This method checks if the token passed in exists in the reverse synonym map, returns the
   * synonym if found, and the original token if no synonym is found.
   * 
   * @param token - The token we try to find the synonym of. 
   * @returns Either the synonym or the original token.
   */
  normalizeToken(token: string): string {
    const normalized = this.reverseSynonymMap.get(token)
    if (normalized !== undefined) { return normalized }
    return token
  }

  // Step 3: Remove the suffixes
  stemToken(token: string): string {
  }

  // Step 4: Extract parameter and count them
  exctractParameters(tokens: string[]): { newSentence: string, paramCount: number } {

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

  // Used to find the closest math to the target sentence, can return null if not close enough
  cosineSimilarity(vectorA: number[], vectorB: number[]): number | null {
    
  }

  // Step 8: Find the closest target sentence match to the input sentence
  findClosestMatch(inputSentence: string): { sentence: string; similarity: number } {
    
  }
}