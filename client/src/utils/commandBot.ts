class commandBot {
  private vocabWords: string[]
  private synonymMap: Map<string, Set<string>>
  private reverseSynonymMap: Map<string, string>
  private suffixes: string[]
  private termFrequencies: Map<string, number>
  private sentenceCount: number
  private sentenceParamCount: Map<string, number>
  private sentenceVectorMap: Map<string, (number | undefined)[]>

  constructor(targetSentences: string[]) {
    const synonyms = new Map<string, Set<string>>([
      ["get", new Set(["find", "fetch", "search"])],
      ["post", new Set(["create", "make"])]
    ])
    this.vocabWords = []
    this.synonymMap = synonyms
    this.reverseSynonymMap = this.createReverseSynonymMap(synonyms)
    this.suffixes = ["ing", "ed", "es", "s"]
    this.sentenceCount = 0
    this.termFrequencies = new Map<string, number>()
    this.sentenceParamCount = new Map<string, number>()
    this.sentenceVectorMap = this.computeTargetSentenceVectors(targetSentences)
  }

  /**
   * This method returns the set of vocab words.
   * 
   * @returns The set of vocab words.
   */
  private getVocabWords(): string[] {
    return this.vocabWords
  }

  /**
   * This method sets the param count.
   * 
   * @param paramCount 
   */
  private setSentenceParamCount(paramCount: Map<string, number>): void {
    this.sentenceParamCount = paramCount
  }

  /**
   * This method sets the vocab words.
   * 
   * @param words - The words to be set as the vocab words.
   */
  private setVocabWords(words: string[]): void {
    this.vocabWords = words
  }

  /**
   * This method sets the word frequency map.
   * 
   * @param wordFrequency - The build word frequency map.
   */
  private setTermFrequency(wordFrequency: Map<string, number>): void {
    this.termFrequencies = wordFrequency
  }

  /**
   * This method stores the number of target sentences.
   * 
   * @param sentences - The target sentences.
   */
  private setSentenceCount(sentences: string[]): void {
    this.sentenceCount = sentences.length
  }

  /**
   * This method takes in an array of target sentences and goes through the NLP pipeline
   * to make a map made up of the sentence as the key and their vector as the value.
   * 
   * @param sentences - The target sentences we want to map.
   * @returns A map of the sentence as the key and the vector as the value.
   */
  private computeTargetSentenceVectors(sentences: string[]): Map<string, number[]> {
    const words = new Set<string>([])
    const wordFrequency = new Map<string, number>([])
    const allTokenizedSentence = new Set<string[]>()
    const sentenceParamCount = new Map<string, number>([])
    this.setSentenceCount(sentences)
    for (const sentence of sentences) {
      const [tokenizedSentence, tokenizedParams] = this.tokenize(sentence)
      allTokenizedSentence.add(tokenizedSentence)
      sentenceParamCount.set(sentence, tokenizedParams.length)
      for (const token in tokenizedSentence) {
        if (wordFrequency.has(token)) { wordFrequency.set(token, wordFrequency.get(token)! + 1) }
        else { wordFrequency.set(token, 1) }
        words.add(token) 
      }
    }
    const sortedVocabWords = Array.from(words).sort((a, b) => a.localeCompare(b))
    const sortedSentenceParamCount = this.sortMapByKey(sentenceParamCount)
    const sortedWordFrequency = this.sortMapByKey(wordFrequency)
    this.setSentenceParamCount(sortedSentenceParamCount)
    this.setTermFrequency(sortedWordFrequency)
    this.setVocabWords(sortedVocabWords)
    const tokenSentencesArray: string[][] = Array.from(allTokenizedSentence)
    for (let i = 0; i < sentences.length; i++) {
      this.vectorize(tokenSentencesArray[i], sentences[i])
    }
  }

  /**
   * This method sorts maps by their key, used to match the order of the words in map to the
   * order in the wordsVocab.
   * 
   * @param currMap - The map to be sorted.
   * @returns The sorted map.
   */
  private sortMapByKey(currMap: Map<string, number>): Map<string, number> {
    const entriesArray = [...currMap.entries()]
    const sortedArray = entriesArray.sort((a, b) => a[0].localeCompare(b[0]))
    return new Map(sortedArray)
  }

  // Step 8: Find the closest target sentence match to the input sentence
  findClosestMatch(inputSentence: string): { sentence: string; similarity: number } {
    
  }

  /**
   * This method takes in a sentence and tokenizes the words and the params seperately.
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
        const normalizedToken = this.normalizeToken(token.toLocaleLowerCase())
        const stemedToken = this.stemToken(normalizedToken)
        tokens.push(stemedToken)
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
  private normalizeToken(token: string): string {
    const normalized = this.reverseSynonymMap.get(token)
    if (normalized !== undefined) { return normalized }
    return token
  }

  /**
   * This method checks if the token has any unnecessary suffixes that can mess with matching words
   * to the dictionary.
   * 
   * @param token - The token being checked for prefix.
   * @returns The new token if prefix was removed, the old token if no change was needed.
   */
  private stemToken(token: string): string {
    const matchingSuffixes = this.suffixes.filter(suffix => token.endsWith(suffix))
    if (matchingSuffixes.length > 0) { 
      const index = token.indexOf(matchingSuffixes[0])
      const newToken = token.substring(0, index)
      return newToken
    }
    return token
  }

  /**
   * This method counts the frequency of each word in the sentence and then returns it as a
   * map with the key being the word and the value being the count.
   * 
   * @param sentenceTokens - The tokens for the current sentence.
   * @returns The word count for every word in the sentence.
   */
  private findLocalWordCount(sentenceTokens: string[]): Map<string, number> {
    const wordCount = new Map<string, number>([])
    for (const token in sentenceTokens) {
      if (wordCount.has(token)) { wordCount.set(token, wordCount.get(token)! + 1) }
      else { wordCount.set(token, 1) }
    }
    return this.sortMapByKey(wordCount)
  }

  // Step 5 & 6: Compute TF-IDF weighted vector for a sentence including parameter count
  vectorize(tokenizedSentence: string[], sentence: string): (number | undefined)[] {
    const termCount = this.findLocalWordCount(tokenizedSentence)
  }

  // Loops through all words from target sentences and stores them in set.
  createVocabWords(targetSentences: Set<string>): Set<string> {

  }

  // Used to find the closest math to the target sentence, can return null if not close enough
  cosineSimilarity(vectorA: number[], vectorB: number[]): number | null {
    
  }

}