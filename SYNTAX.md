# Beancount Syntax Reference

This document provides a comprehensive reference for the Beancount plain text accounting syntax supported by this parser.

## Overview

Beancount is a double-entry bookkeeping system that uses plain text files with a specific syntax to record financial transactions. This parser supports the complete Beancount syntax including all directive types.

## Basic Syntax Rules

### Dates
Dates must be in ISO format: `YYYY-MM-DD`
```
2023-01-15
2022-12-31
```

### Account Names
Account names follow a hierarchical structure with components separated by colons. They must start with a capital letter:
```
Assets:Checking
Liabilities:CreditCard:Visa
Income:Salary:Base
Expenses:Food:Groceries
```

### Amounts
Amounts consist of a number followed by a currency code:
```
100.50 USD
-25.00 EUR
1000 SHARES
```

### Comments
Comments start with `;`, `*`, or `#` and continue to end of line:
```
; This is a comment
* Another comment style
# Yet another comment style
```

## Directive Types

### 1. Transactions

Transactions are the core of double-entry bookkeeping. They record the movement of money between accounts.

#### Basic Transaction Syntax
```
DATE [FLAG] [PAYEE] [NARRATION]
  ACCOUNT  AMOUNT
  ACCOUNT  AMOUNT
  ...
```

#### Examples

**Simple transaction:**
```
2023-01-15 * "Grocery Store" "Weekly shopping"
  Assets:Checking    -85.40 USD
  Expenses:Food       85.40 USD
```

**Transaction with multiple flags:**
```
2023-01-15 ! "ATM" "Cash withdrawal - need receipt"
  Assets:Checking    -100.00 USD
  Assets:Cash         100.00 USD
```

**Transaction flags:**
- `*` - Cleared/completed transaction
- `!` - Pending transaction  
- `#`, `?`, `&`, `/`, `^`, `(`, `)`, `%`, `"`, `'` - Custom flags

#### Postings with Costs

For investment transactions, you can specify the cost basis:

```
2023-03-15 * "Broker" "Buy shares"
  Assets:Investments:Brokerage  10 AAPL {250.00 USD}
  Assets:Checking              -2500.00 USD
```

**Cost notation:**
- `{250.00 USD}` - Specific cost per unit
- `{250.00 USD, 2023-03-15}` - Cost with acquisition date
- `{{2500.00 USD}}` - Total cost for all units

#### Price Annotations

You can specify the current market price different from cost:

```
2023-03-15 * "Broker" "Buy shares"
  Assets:Investments:Brokerage  10 AAPL {250.00 USD} @ 255.00 USD
  Assets:Checking              -2500.00 USD
```

### 2. Account Operations

#### Opening Accounts
Declare an account before using it:

```
2023-01-01 open Assets:Checking USD
2023-01-01 open Assets:Investments:Brokerage USD,AAPL,MSFT
2023-01-01 open Liabilities:CreditCard USD "FIFO"
```

**Syntax:**
```
DATE open ACCOUNT [CURRENCIES] [BOOKING_METHOD]
```

#### Closing Accounts
Close an account when no longer used:

```
2023-12-31 close Assets:OldChecking
```

### 3. Balance Assertions

Verify account balances at specific dates:

```
2023-01-31 balance Assets:Checking 1500.50 USD
2023-02-28 balance Assets:Investments:Brokerage 0 USD
```

**Syntax:**
```
DATE balance ACCOUNT AMOUNT
```

### 4. Price Directives

Record market prices for commodities:

```
2023-01-15 price EUR 1.08 USD
2023-03-15 price AAPL 250.00 USD
2023-03-15 price BTC 45000.00 USD
```

**Syntax:**
```
DATE price COMMODITY AMOUNT
```

### 5. Notes and Documents

#### Notes
Attach notes to accounts:

```
2023-01-15 note Assets:Checking "Opened new account with XYZ Bank"
2023-02-01 note Liabilities:Mortgage "Refinanced at 3.5% rate"
```

#### Documents
Link external documents:

```
2023-01-15 document Assets:Checking "/path/to/bank_statement.pdf"
2023-04-15 document Expenses:Taxes "/path/to/tax_documents/"
```

### 6. Events and Queries

#### Events
Record important events:

```
2023-01-01 event "location" "New York, NY"
2023-06-15 event "job-change" "Started new position at ABC Corp"
```

#### Queries
Define custom queries:

```
2023-12-31 query "cash" "SELECT sum(position) WHERE account ~ 'Assets:Cash'"
2023-12-31 query "net-worth" "SELECT sum(convert(position, 'USD')) WHERE account_type='Assets'"
```

### 7. Commodity Declarations

Declare commodities and their properties:

```
2023-01-01 commodity USD
  name: "US Dollar" 
  asset-class: "cash"

2023-01-01 commodity AAPL
  name: "Apple Inc."
  asset-class: "stock"
```

### 8. Pad Directives

Automatically balance accounts:

```
2023-01-01 pad Assets:Checking Equity:Opening-Balances
```

This directive will automatically create a transaction to balance the checking account using the equity account.

### 9. Custom Directives

Create custom directive types:

```
2023-01-15 custom "budget" Expenses:Food 500.00 USD "monthly"
2023-06-01 custom "goal" Assets:Savings 10000.00 USD 2023-12-31
```

### 10. Options and Plugins

#### Options
Set global options:

```
option "title" "My Personal Finances"
option "operating_currency" "USD"
option "booking_method" "FIFO"
```

#### Plugins
Load plugins:

```
plugin "beancount.plugins.auto_accounts"
plugin "beancount.plugins.check_dups"
plugin "beancount.plugins.forecast" "config_forecast.py"
```

### 11. Include Directives

Include other Beancount files:

```
include "accounts.beancount"
include "2023/transactions.beancount"
```

## Metadata

You can attach metadata to any directive:

```
2023-01-15 * "Grocery Store" "Weekly shopping"
  category: "essential"
  receipt: "receipt_001.jpg"
  Assets:Checking    -85.40 USD
  Expenses:Food       85.40 USD
    tags: "groceries"
```

## Tags and Links

### Tags
Use hashtags to categorize transactions:

```
2023-01-15 * "Business Lunch" "Meeting with client" #business #meal
  Assets:Checking    -45.00 USD
  Expenses:Business:Meals  45.00 USD
```

### Links
Use links to connect related transactions:

```
2023-01-15 * "Transfer to Savings" ^transfer-001
  Assets:Checking    -1000.00 USD
  Assets:Savings      1000.00 USD

2023-01-15 * "Savings deposit confirmed" ^transfer-001
  Assets:Savings      1000.00 USD
  Assets:Checking    -1000.00 USD
```

## Common Patterns

### Setting up a new account
```
2023-01-01 open Assets:Checking USD
2023-01-01 balance Assets:Checking 0.00 USD
```

### Monthly salary
```
2023-01-31 * "Employer" "January salary"
  Assets:Checking     3000.00 USD
  Income:Salary      -3000.00 USD
```

### Credit card payment
```
2023-02-01 * "Credit Card Payment"
  Liabilities:CreditCard:Visa  1200.00 USD
  Assets:Checking             -1200.00 USD
```

### Investment purchase
```
2023-03-15 * "Broker" "Buy index fund"
  Assets:Investments:Brokerage  100 VTSAX {95.50 USD}
  Assets:Checking              -9550.00 USD
```

## File Organization

A typical Beancount file structure:

```
; Account definitions
2023-01-01 open Assets:Checking USD
2023-01-01 open Expenses:Food USD
2023-01-01 open Income:Salary USD

; Opening balances
2023-01-01 balance Assets:Checking 0.00 USD

; Transactions
2023-01-15 * "Employer" "Salary"
  Assets:Checking   3000.00 USD
  Income:Salary    -3000.00 USD

2023-01-20 * "Grocery Store" "Weekly shopping"
  Assets:Checking  -85.40 USD
  Expenses:Food     85.40 USD

; Balance checks
2023-01-31 balance Assets:Checking 2914.60 USD
```

## Best Practices

1. **Use descriptive account names**: Choose clear, hierarchical account names
2. **Regular balance assertions**: Include balance checks monthly or quarterly
3. **Consistent dating**: Use the actual transaction date, not when you enter it
4. **Meaningful descriptions**: Write clear payee and narration fields
5. **Price tracking**: Record prices for investments and foreign currencies
6. **Organize with includes**: Split large files into logical components
7. **Use metadata**: Add relevant metadata for reporting and analysis

## Error Prevention

1. **Balance your transactions**: Each transaction must balance (sum to zero)
2. **Open accounts first**: Always open accounts before using them
3. **Check date formats**: Use YYYY-MM-DD format consistently
4. **Quote strings**: Always quote payee and narration strings
5. **Mind indentation**: Use exactly two spaces for posting indentation
6. **Account naming**: Start account components with capital letters

This syntax reference covers all the major features of Beancount supported by this parser. For more complex scenarios and advanced features, refer to the official Beancount documentation.

## Using This Parser

This TypeScript parser can handle all the syntax described in this document. Here's how to use it:

```typescript
import { BeancountParser } from 'beancount-parser';
import { Transaction, Balance, Open } from 'beancount-parser';

// Parse any valid Beancount content
const content = `
2023-01-01 open Assets:Checking USD
2023-01-15 * "Store" "Purchase"
  Assets:Checking  -100.00 USD
  Expenses:Food     100.00 USD
2023-01-31 balance Assets:Checking 900.00 USD
`;

const result = BeancountParser.parse(content);

// Access parsed directives with full type safety
result.directives.forEach(directive => {
  if (directive instanceof Transaction) {
    console.log(`Transaction: ${directive.payee} - ${directive.narration}`);
    directive.postings.forEach(posting => {
      console.log(`  ${posting.account}: ${posting.amount?.number} ${posting.amount?.currency}`);
    });
  } else if (directive instanceof Balance) {
    console.log(`Balance: ${directive.account} = ${directive.amount.number} ${directive.amount.currency}`);
  }
});
```

The parser returns strongly-typed TypeScript objects that make it easy to analyze, transform, or report on your Beancount data programmatically.