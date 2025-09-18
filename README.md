# beancount-parser

A TypeScript parser for the [Beancount](https://beancount.github.io/) plain text accounting format, built with ANTLR4.

## About Beancount

Beancount is a double-entry bookkeeping system that uses plain text files with a simple syntax to record financial transactions. It was created by Martin Blais and is designed to be:

- **Plain text**: Human-readable and version-control friendly
- **Double-entry**: Mathematically rigorous accounting principles
- **Programmable**: Extensible with Python plugins and scripts
- **Precise**: Supports multiple currencies, cost tracking, and complex scenarios

This parser provides a TypeScript/JavaScript interface to parse Beancount files and extract structured data for analysis, reporting, or integration with other tools.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Supported Beancount Syntax](#supported-beancount-syntax)
- [Grammar Reference](#grammar-reference)
- [Data Model](#data-model)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

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

### Basic Example

```typescript
import { BeancountParser } from 'beancount-parser';

// Parse Beancount content
const beancountContent = `
2023-01-01 open Assets:Checking USD
2023-01-01 open Expenses:Food USD

2023-01-15 * "Grocery Store" "Weekly shopping"
  Assets:Checking    -85.40 USD
  Expenses:Food       85.40 USD

2023-01-31 balance Assets:Checking 1914.60 USD
`;

const result = BeancountParser.parse(beancountContent);

// Access the parsed data
console.log(result.directives.length); // 4
const transaction = result.directives[2] as Transaction;
console.log(transaction.payee); // "Grocery Store"
console.log(transaction.postings.length); // 2
```

### Advanced Features

```typescript
// Parse complex transactions with costs and prices
const investmentContent = `
2023-03-15 * "Broker" "Buy shares"
  Assets:Investments:Brokerage  10 AAPL {250.00 USD} @ 255.00 USD
  Assets:Checking              -2500.00 USD
`;

const result = BeancountParser.parse(investmentContent);
const txn = result.directives[0] as Transaction;
const posting = txn.postings[0];

console.log(posting.amount.number); // 10
console.log(posting.amount.currency); // "AAPL"
console.log(posting.cost.amount.number); // 250.00
console.log(posting.priceAnnotation.amount.number); // 255.00
```

### Working with Different Directive Types

```typescript
import { 
  Transaction, 
  Balance, 
  Open, 
  Price, 
  Note 
} from 'beancount-parser';

const content = `
2023-01-01 open Assets:Checking USD
2023-01-15 price EUR 1.08 USD
2023-01-20 note Assets:Checking "Opened new account"
2023-01-31 balance Assets:Checking 1000.00 USD
`;

const result = BeancountParser.parse(content);

result.directives.forEach(directive => {
  if (directive instanceof Open) {
    console.log(`Opened account: ${directive.account}`);
  } else if (directive instanceof Price) {
    console.log(`Price: ${directive.currency} = ${directive.amount.number} ${directive.amount.currency}`);
  } else if (directive instanceof Note) {
    console.log(`Note: ${directive.comment}`);
  } else if (directive instanceof Balance) {
    console.log(`Balance: ${directive.account} = ${directive.amount.number} ${directive.amount.currency}`);
  }
});
```

## Supported Beancount Syntax

This parser supports the complete Beancount syntax including:

### Core Directives
- **Transactions** - Double-entry bookkeeping entries with postings
- **Account Operations** - Opening and closing accounts (`open`, `close`)
- **Balance Assertions** - Verify account balances at specific dates
- **Price Directives** - Record market prices for commodities

### Additional Directives
- **Notes** - Attach comments to accounts
- **Documents** - Link external files to accounts
- **Events** - Record important events
- **Queries** - Define custom queries
- **Commodity** - Declare commodity properties
- **Pad** - Automatic account balancing
- **Custom** - User-defined directive types

### Advanced Features
- **Cost Tracking** - Investment cost basis with `{cost}` notation
- **Price Annotations** - Current market prices with `@` notation
- **Metadata** - Key-value pairs attached to directives
- **Tags and Links** - Transaction categorization with `#tags` and `^links`
- **Multi-currency** - Support for multiple currencies and commodities

### Configuration
- **Options** - Global parser and behavior settings
- **Plugins** - Extensibility through plugin system
- **Includes** - File composition and organization

For complete syntax documentation and examples, see [SYNTAX.md](./SYNTAX.md).

For practical examples and common patterns, see [EXAMPLES.md](./EXAMPLES.md).

For a quick syntax reference, see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md).

## Documentation

This repository includes comprehensive documentation for Beancount syntax:

| Document | Description |
|----------|-------------|
| [SYNTAX.md](./SYNTAX.md) | Complete Beancount syntax reference with detailed explanations |
| [EXAMPLES.md](./EXAMPLES.md) | Practical examples including personal finance, business, and investment tracking |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Quick reference guide for common syntax patterns |
| [Grammar File](./src/grammar/Beancount.g4) | ANTLR4 grammar definition |

### Key Topics Covered

- **Basic Syntax**: Dates, accounts, amounts, comments
- **Transactions**: Simple and complex transaction patterns
- **Investment Tracking**: Cost basis, price annotations, lot tracking
- **Multi-currency**: Foreign exchange and international transactions
- **Business Accounting**: Invoicing, accounts payable/receivable
- **Advanced Features**: Metadata, tags, links, custom directives
- **File Organization**: Best practices for structuring Beancount files
- **Error Prevention**: Common mistakes and how to avoid them

## Grammar Reference

This parser is built using ANTLR4 with a comprehensive grammar that covers all Beancount syntax. The grammar file is located at `src/grammar/Beancount.g4` and defines:

- **Lexical rules** for tokens (dates, numbers, account names, etc.)
- **Parser rules** for all directive types and their structure
- **Proper handling** of indentation, comments, and metadata

The grammar supports:
- All standard Beancount directive types
- Complex posting syntax with costs and price annotations
- Metadata and tag/link syntax
- Proper error handling and recovery
- Full compatibility with the official Beancount syntax

## Data Model

The parser generates a strongly-typed object model with classes for all Beancount directives:

- `Transaction` - Financial transactions with postings
- `Balance` - Balance assertions
- `Open` / `Close` - Account lifecycle management
- `Price` - Commodity price records
- `Note` / `Document` - Account annotations
- `Event` / `Query` - Events and custom queries
- `Commodity` - Commodity declarations
- `Pad` - Account padding directives
- `Custom` - Custom directive types
- `Option` / `Plugin` / `Include` - Configuration directives

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
