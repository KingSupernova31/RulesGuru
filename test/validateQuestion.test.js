/* @Peripheral1994 - Peter Richmond
  Test suite for validateQuestion.js => Starting with what I'm fixing, but we
  should expand this whenever we add/change functionality to make it easier to
  avoid any regressions and confirm our fixes! :)
*/

const assert = require('assert')
const validateQuestion = require('../public_html/question-editor/validateQuestion')

// Code state relies on some globals existing, have to declare them as such. We
// should fix this reliance later to make the code easier to work with. :)
allKeywords = require('../public_html/globalResources/allKeywords')
allCards = require('../public_html/question-editor/allCards')
allSubtypes = []

const questionData = {}

// Reset state to a valid default before each test.
beforeEach(() => {
  questionData.cardLists = []
  questionData.cardTemplates = []
  questionData.tags = ['Default Tag']
  questionData.question = 'This is a default question for [AP]?'
  questionData.answer = 'This is a default answer.'
  questionData.level = 'Default Level'
  questionData.complexity = 'Default Complexity'
})

describe('validateQuestion', () => {
  describe('pronoun validation', () => {
    it('should succeed when there are no pronouns in the question', async () => {
      questionData.question = '[AP] sacrifies a token. How many tokens does [AP] have left on the battlefield?'
      questionData.answer = 'Four. One for air, fire, water, and earth.'

      const validation = validateQuestion(questionData, {})
      assert(validation.errors.length === 0, `expected no errors, got: ${validation.errors}`)
      assert(validation.warnings.length === 0, `expected no warnings, got: ${validation.warnings}`)
    })

    it('should succeed when there are no pronouns in the answer', async () => {
      questionData.question = '[AP] sacrifies a token. How many tokens does [AP s] have left on the battlefield?'
      questionData.answer = 'Four. One for air, fire, water, and earth.'

      const validation = validateQuestion(questionData, {})
      assert(validation.errors.length === 0, `expected no errors, got: ${validation.errors}`)
      assert(validation.warnings.length === 0, `expected no warnings, got: ${validation.warnings}`)
    })
  })
})
