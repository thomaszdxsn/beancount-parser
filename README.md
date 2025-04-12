# beancount-parser

A TypeScript parser for the [Beancount](https://beancount.github.io/) plain text accounting format, built with ANTLR4.

## Features

- Full Beancount syntax support
- Strongly-typed TypeScript models
- ANTLR4-based grammar for robust parsing
- Comprehensive unit tests

## Installation

```bash
# Using npm
npm install beancount-parser

# Using yarn
yarn add beancount-parser

# Using bun
bun add beancount-parser
```

## Usage

```typescript
import { BeancountParser } from 'beancount-parser';

// Parse Beancount content
const beancountContent = `
2023-01-15 * "Grocery Store" "Weekly shopping"
  Assets:Checking    -85.40 USD
  Expenses:Food       85.40 USD
`;

const result = BeancountParser.parse(beancountContent);

// Access the parsed data
console.log(result.directives.length); // 1
const transaction = result.directives[0];
console.log(transaction.payee); // "Grocery Store"
console.log(transaction.postings.length); // 2
```

## Data Model

The parser generates a strongly-typed object model with classes for all Beancount directives:

- `Transaction`
- `Balance`
- `Open`
- `Close`
- `Price`
- `Note`
- `Document`
- `Event`
- `Commodity`
- `Pad`
- `Custom`
- And more...

## Development

### Prerequisites

- Node.js 16+ or Bun
- ANTLR4 runtime

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/beancount-parser.git
cd beancount-parser

# Install dependencies
bun install

# Generate parser from grammar
bun run antlr4

# Run tests
bun test
```

## License

MIT
