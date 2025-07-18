export class commandBot {
  private vocabWords: string[]
  private synonymMap: Map<string, Set<string>>
  private reverseSynonymMap: Map<string, string>
  private suffixes: string[]
  private sentenceFrequencies: Map<string, number>
  private sentenceCount: number
  private sentenceParamCount: Map<string, number>
  private sentenceVectorMap: Map<string, number[]>

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
    this.sentenceFrequencies = new Map<string, number>()
    this.sentenceParamCount = new Map<string, number>()
    this.sentenceVectorMap = new Map<string, number[]>()
    this.computeTargetSentenceVectors(targetSentences)
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
   * This method returns the array of suffixes.
   * 
   * @returns The array of suffixes.
   */
  private getSuffixes(): string[] {
    return this.suffixes
  }

  /**
   * This method reutrns the map of the sentence to param count.
   * 
   * @returns The map of the sentence to param count.
   */
  private getSentenceParamCounts(): Map<string, number> {
    return this.sentenceParamCount
  }

  /**
   * This method returns the sentence to vector map.
   * 
   * @returns The sentence to vector map.
   */
  private getSentenceVectorMap(): Map<string, number[]> {
    return this.sentenceVectorMap
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
  private setSentenceFrequencies(sentenceFrequencies: Map<string, number>): void {
    this.sentenceFrequencies = sentenceFrequencies
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
   * This method stores the sentence to vector map.
   * 
   * @param map - The map we are setting to the sentenceVectorMap.
   */
  private setSentenceVectorMap(map: Map<string, number[]>): void {
    this.sentenceVectorMap = map
  }

  /**
   * This method takes in an array of target sentences and goes through the NLP pipeline
   * to make a map made up of the sentence as the key and their vector as the value.
   * 
   * @param sentences - The target sentences we want to map.
   * @returns A map of the sentence as the key and the vector as the value.
   */
  private computeTargetSentenceVectors(sentences: string[]): void {
    const words = new Set<string>([])
    const sentenceFrequencies = new Map<string, number>([])
    const allTokenizedSentence = new Set<string[]>()
    const localSentenceParamCount = new Map<string, number>([])
    const localSentenceVectorMap = new Map<string, number[]>([])
    this.setSentenceCount(sentences)
    for (const sentence of sentences) {
      const [tokenizedSentence, tokenizedParams] = this.tokenize(sentence, false)
      allTokenizedSentence.add(tokenizedSentence)
      localSentenceParamCount.set(sentence, tokenizedParams.length)
      let localSet = new Set<string>()
      for (const token of tokenizedSentence) {
        if (!localSet.has(token)) {
          sentenceFrequencies.set(token, (sentenceFrequencies.get(token) || 0) + 1)
          localSet.add(token)
        }
        words.add(token)
      }
    }
    const sortedVocabWords = Array.from(words).sort((a, b) => a.localeCompare(b))
    const sortedSentenceParamCount = this.sortMapByKey(localSentenceParamCount)
    const sortedSentenceFrequencies = this.sortMapByKey(sentenceFrequencies)
    this.setSentenceParamCount(sortedSentenceParamCount)
    this.setSentenceFrequencies(sortedSentenceFrequencies)
    this.setVocabWords(sortedVocabWords)
    const tokenSentencesArray: string[][] = Array.from(allTokenizedSentence)
    const sentenceParamCount = this.getSentenceParamCounts()
    for (let i = 0; i < sentences.length; i++) {
      const [sentence, vector] = this.vectorize(
        tokenSentencesArray[i], 
        sentences[i],
        sentenceParamCount.get(sentences[i])!
      )
      localSentenceVectorMap.set(sentence, vector)
    }
    this.setSentenceVectorMap(localSentenceVectorMap)
  }

  /**
   * This method is public and finds the closes matching sentence to the input sentnece provided,
   * if the similarity score is not greater than the predecided treshold, the method returns null.
   * 
   * @param inputSentence - The sentnece we are trying to match to one of the target sentences.
   * @returns The target sentence that matched to the input sentence.
   */
  public findClosestMatch(inputSentence: string): string | null {
    const [tokenizedSentence, tokenizedParams] = this.tokenize(inputSentence, true)
    const paramCount = tokenizedParams.length
    const [sentence, vector] = this.vectorize(
      tokenizedSentence,
      inputSentence,
      paramCount
    )
    const targetSentences = this.getSentenceVectorMap()
    let maxSimilarity = 0
    let sentenceFound = ""
    for (const targetSentence of targetSentences) {
      const similarityScore = this.cosineSimilarity(vector, targetSentence[1])
      if (Math.max(maxSimilarity, similarityScore) > maxSimilarity) { 
        maxSimilarity = Math.max(maxSimilarity, similarityScore)
        sentenceFound = targetSentence[0]
      }
    }
    return (maxSimilarity > 0.7) ? sentenceFound : null
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


  /**
   * This method takes in a sentence and tokenizes the words and the params seperately.
   * 
   * @param sentence - The sentence to be tokenized.
   * @returns The tokens of words and params.
   */
  private tokenize(sentence: string, input: boolean): [string[], string[]] {
    const regex: RegExp = /'[\w]+'|(\w+)/g
    let tokens: string[] = []
    let params: string[] = []
    let match
    while ((match = regex.exec(sentence)) !== null) {
      if (match[1] === undefined) {  params.push(match[1]) } 
      else if (match[0]) {
        const token = match[0]
        const normalizedToken = this.normalizeToken(token.toLocaleLowerCase())
        if (input) {
          const stemedToken = this.stemToken(normalizedToken)
          tokens.push(stemedToken)
        } else { tokens.push(normalizedToken) }
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
    const suffixes = this.getSuffixes()
    const vocabWords = this.getVocabWords()
    for (const suffix of suffixes) {
      if (token.indexOf(suffix) !== -1) {
        const index = token.indexOf(suffix)
        const stemToken = token.substring(0, index)
        if (stemToken in vocabWords) { return stemToken }
      }
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
    for (const token of sentenceTokens) {
      if (wordCount.has(token)) { wordCount.set(token, wordCount.get(token)! + 1) }
      else { wordCount.set(token, 1) }
    }
    return this.sortMapByKey(wordCount)
  }

  /**
   * This method vectorizes the tokens into a vector with n dimensions, where n is the length of
   * the vocabWords array. This method returns the 
   * 
   * @param tokenizedSentence - The tokens of the sentence.
   * @param sentence - The senentce the tokens were composed of.
   * @returns The sentennce and the vector in an array.
   */
  private vectorize(tokenizedSentence: string[], sentence: string, sentenceParamCount: number): [string, number[]] {
    const termCount = this.findLocalWordCount(tokenizedSentence)
    const words = this.getVocabWords()
    let vector: number[] = []
    for (let i = 0; i < words.length; i++) {
      if (tokenizedSentence.indexOf(words[i]) !== -1) {
        const tf: number = termCount.get(words[i])! / tokenizedSentence.length
        const df: number = this.sentenceFrequencies.get(words[i])!
        const idf: number = Math.log(1 + this.sentenceCount / (1 + df))
        const vectorValue = tf * idf
        vector.push(vectorValue)
      } else {
        vector.push(0)
      }
    }
    vector.push(sentenceParamCount)
    return [sentence, vector]
  }

  /**
   * This method compares the similarity between two vectors using cosine similarity.
   * 
   * @param vectorA - The first vector.
   * @param vectorB - The second vector.
   * @returns The similarity score between the two vectors.
   */
  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) { throw new Error("Vectors are not of equal dimensions") }
    const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0)
    const magnitudeA = Math.hypot(...vectorA)
    const magnitudeB = Math.hypot(...vectorB)
    return (magnitudeA === 0 || magnitudeB === 0) ? 0 : dotProduct / (magnitudeA * magnitudeB)
  }
}