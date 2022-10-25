/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  InsideLineComment: 2,
  AfterPropertyName: 3,
  AfterPropertyNameAfterColon: 4,
  AfterDash: 5,
  AfterPropertyNameAfterColonAfterNewLine: 6,
  AfterPipe: 7,
  InsideMultiLineString: 8,
  InsideMultiLineStringAfterWhitespace: 9,
  AfterPropertyValue: 10,
  InsidePropertyNameStringSingleQuoted: 11,
  InsidePropertyNameStringDoubleQuoted: 12,
}

export const StateMap = {
  [State.TopLevelContent]: 'TopLevelContent',
  [State.InsideLineComment]: 'InsideLineComment',
}

/**
 * @enum number
 */
export const TokenType = {
  None: 0,
  Text: 1,
  Function: 3,
  Comment: 4,
  Whitespace: 5,
}

export const TokenMap = {
  [TokenType.Function]: 'Function',
  [TokenType.None]: 'None',
  [TokenType.Text]: 'Text',
  [TokenType.Comment]: 'Comment',
  [TokenType.Whitespace]: 'Whitespace',
}

const RE_LINE_COMMENT = /^\-\-.*/s
const RE_WHITESPACE = /^ +/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_PROPERTY_NAME = /^[\p{L}\p{P}\p{S}.\d]+(?=\s*:(\s+|$))/u
const RE_PROPERTY_NAME_2 =
  /^[\:@\/\\a-zA-Z\-\_\d\.\s]*[@\/\\a-zA-Z\-\_\d\.](?=\s*:(\s+|$))/
const RE_PROPERTY_VALUE_1 = /^[^&].*(?=\s+#)/s
const RE_SEMICOLON = /^;/
const RE_COMMA = /^,/
const RE_ANYTHING_BUT_COMMENT = /^[^#]+/
const RE_NUMERIC = /^(([0-9]+\.?[0-9]*)|(\.[0-9]+))(?=\s*$|\s+#|\s*[\[\]\{\}])/
const RE_ANYTHING_UNTIL_CLOSE_BRACE = /^[^\}]+/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_BLOCK_COMMENT_CONTENT = /^.+?(?=\*\/|$)/s
const RE_ROUND_OPEN = /^\(/
const RE_ROUND_CLOSE = /^\)/
const RE_PSEUDO_SELECTOR_CONTENT = /^[^\)]+/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_ATTRIBUTE_SELECTOR_CONTENT = /^[^\]]+/
const RE_QUERY = /^@[a-z\-]+/
const RE_STAR = /^\*/
const RE_QUERY_NAME = /^[a-z\-]+/
const RE_QUERY_CONTENT = /^[^\)]+/
const RE_COMBINATOR = /^[\+\>\~]/
const RE_LANGUAGE_CONSTANT = /^(?:true|false|null)(?!#)/
const RE_COLON = /^:/
const RE_DASH = /^\-/
const RE_WORDS = /^[\w\s]*\w/
const RE_KEY_PRE = /^\s*(\-\s*)?/
const RE_SINGLE_QUOTE = /^'/
const RE_DOUBLE_QUOTE = /^"/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^']+/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/
const RE_ALIAS = /^\*.+/
const RE_ANCHOR = /^\&.+/
const RE_BUILTIN_FUNCTION =
  /^(?:cume_dist|first_value|lag|last_value|lead|percent_rank|percentile_cont|percentile_disc|abs|acos|ascii|asin|atan|atn2|ceiling|char|charindex|cos|concat|difference|format|left|len|lower|ltrim|nchar|nodes|quotename|replace|replicate|reverse|right|rtrim|soundex|space|str|string_agg|string_escape|string_split|stuff|substring|translate|trim|unicode|upper|cot|dense_rank|degrees|exp|floor|log|log10|ntile|patindex|pi|power|radians|rand|rank|round|row_number|sign|sin|sqrt|square|tan|textptr|textvalid)\b/i
const RE_ANYTHING = /^.+/s

export const initialLineState = {
  state: State.TopLevelContent,
  tokens: [],
}

export const hasArrayReturn = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_BUILTIN_FUNCTION))) {
          token = TokenType.Function
          state = State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          part //?
          throw new Error('no')
        }
        break
      default:
        throw new Error('no')
    }
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  return {
    state,
    tokens,
  }
}
