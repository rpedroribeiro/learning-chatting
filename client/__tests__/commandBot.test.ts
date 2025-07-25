import { commandBot } from '../src/utils/commandBot'
import { targetSentenceToRoute } from '../src/utils/targetSentenceToRoutes'

const naturalSentenceVariations: Record<string, string[]> = {
  "get the filesystem file ''": [
    "can you get the filesystem file ''?",
    "fetch the file '' from the filesystem",
    "find the filesystem file named ''"
  ],
  "post the filesystem file ''": [
    "please create the filesystem file ''",
    "make a new filesystem file called ''",
    "add the file '' to the filesystem"
  ],
  "get the filesystem folder ''": [
    "get the folder '' from the filesystem",
    "fetch the filesystem folder named ''",
    "find the folder '' in the filesystem"
  ],
  "post the filesystem folder ''": [
    "please create the filesystem folder ''",
    "make a new folder called '' in the filesystem",
    "add the folder '' to the filesystem"
  ],
  "get the assignment '' information": [
    "show me information about the assignment ''",
    "fetch info on assignment ''"
  ],
  "get the assignment '' due date": [
    "what is the due date for assignment ''?",
    "when is the assignment '' due date?"
  ],
  "get the assignment '' files": [
    "show me the files for assignment ''",
    "get all files related to assignment ''",
    "fetch assignment '' files"
  ],
  "get the assignment '' my submission": [
    "show my submission for assignment ''",
    "get my assignment '' submission",
    "fetch my submission for assignment ''"
  ],
  "put the assignment ''": [
    "submit the assignment ''",
    "update assignment ''",
    "put in the assignment ''"
  ],
};

describe('commandBot.findClosestMatch', () => {
  let bot: commandBot;

  beforeAll(() => {
    bot = new commandBot([...targetSentenceToRoute.keys()]);
  });

  it('should return a non-null match that is a key in the targetSentenceToRoute map', () => {
    for (const [targetSentence, variations] of Object.entries(naturalSentenceVariations)) {
      for (const input of variations) {
        const match = bot.findClosestMatch(input);
        expect(match).not.toBeNull();
        expect(match!.sentenceFound).toBe(targetSentence);
      }
    }
  });
});