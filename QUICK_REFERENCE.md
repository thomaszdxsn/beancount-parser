# Beancount Quick Reference

A quick reference for the most commonly used Beancount syntax elements.

## Basic Structure

```
DATE [FLAG] [PAYEE] [NARRATION]
  ACCOUNT  AMOUNT
  ACCOUNT  AMOUNT
```

## Common Directives

| Directive | Syntax | Example |
|-----------|--------|---------|
| **Transaction** | `DATE FLAG "PAYEE" "NARRATION"` | `2023-01-15 * "Store" "Groceries"` |
| **Open Account** | `DATE open ACCOUNT [CURRENCIES]` | `2023-01-01 open Assets:Checking USD` |
| **Close Account** | `DATE close ACCOUNT` | `2023-12-31 close Assets:OldAccount` |
| **Balance** | `DATE balance ACCOUNT AMOUNT` | `2023-01-31 balance Assets:Checking 1500.00 USD` |
| **Price** | `DATE price COMMODITY AMOUNT` | `2023-01-15 price EUR 1.08 USD` |
| **Note** | `DATE note ACCOUNT "COMMENT"` | `2023-01-15 note Assets:Checking "New account"` |

## Account Types

| Type | Prefix | Examples |
|------|--------|----------|
| **Assets** | `Assets:` | `Assets:Checking`, `Assets:Investments:Brokerage` |
| **Liabilities** | `Liabilities:` | `Liabilities:CreditCard:Visa`, `Liabilities:Mortgage` |
| **Income** | `Income:` | `Income:Salary`, `Income:Investments:Dividends` |
| **Expenses** | `Expenses:` | `Expenses:Food`, `Expenses:Transportation:Gas` |
| **Equity** | `Equity:` | `Equity:Opening-Balances`, `Equity:Retained-Earnings` |

## Transaction Flags

| Flag | Meaning | Usage |
|------|---------|--------|
| `*` | Cleared | Normal, verified transactions |
| `!` | Pending | Unverified or pending transactions |
| `#` `?` `&` `/` `^` | Custom | User-defined meanings |

## Amount and Cost Syntax

| Syntax | Description | Example |
|--------|-------------|---------|
| `100.50 USD` | Simple amount | Basic currency amount |
| `10 AAPL {150.00 USD}` | Cost basis | Investment with cost per share |
| `10 AAPL @ 155.00 USD` | Price annotation | Current market price |
| `{150.00 USD, 2023-01-15}` | Cost with date | Cost basis with acquisition date |
| `{{1500.00 USD}}` | Total cost | Total cost for all units |

## Metadata Syntax

```
2023-01-15 * "Store" "Purchase"
  category: "essential"
  receipt: "receipt_001.jpg"
  Assets:Checking  -100.00 USD
  Expenses:Food     100.00 USD
    subcategory: "groceries"
```

## Tags and Links

```
2023-01-15 * "Transfer" ^link-001 #transfer #monthly
  Assets:Checking  -500.00 USD
  Assets:Savings    500.00 USD
```

## Date Format

Always use ISO format: `YYYY-MM-DD`
- ✅ `2023-01-15`
- ❌ `01/15/2023`
- ❌ `15-01-2023`

## Common Patterns

### Monthly Salary
```
2023-01-31 * "Employer" "January salary"
  Assets:Checking     3000.00 USD
  Income:Salary      -3000.00 USD
```

### Credit Card Purchase
```
2023-01-15 * "Store" "Purchase"
  Liabilities:CreditCard  -85.00 USD
  Expenses:Shopping        85.00 USD
```

### Credit Card Payment
```
2023-02-01 * "Credit Card Payment"
  Liabilities:CreditCard  1200.00 USD
  Assets:Checking        -1200.00 USD
```

### Investment Purchase
```
2023-01-15 * "Broker" "Buy stock"
  Assets:Investments  10 AAPL {150.00 USD}
  Assets:Checking    -1500.00 USD
```

### Currency Exchange
```
2023-01-15 * "Bank" "Currency exchange"
  Assets:USD  -1000.00 USD @ 0.92 EUR
  Assets:EUR    920.00 EUR
```

## File Organization

```beancount
;; 1. Options and plugins
option "title" "My Finances"
plugin "beancount.plugins.auto_accounts"

;; 2. Account declarations
2023-01-01 open Assets:Checking USD
2023-01-01 open Expenses:Food USD

;; 3. Opening balances
2023-01-01 * "Opening Balance"
  Assets:Checking  1000.00 USD
  Equity:Opening-Balances

;; 4. Transactions (chronological order)
2023-01-15 * "Store" "Groceries"
  Assets:Checking  -85.00 USD
  Expenses:Food     85.00 USD

;; 5. Balance assertions
2023-01-31 balance Assets:Checking 915.00 USD
```

## Common Errors to Avoid

❌ **Unbalanced transactions**
```
2023-01-15 * "Store" 
  Assets:Checking  -100.00 USD
  Expenses:Food      50.00 USD  ; Missing 50.00 USD
```

❌ **Invalid account names**
```
assets:checking  ; Should start with capital letter
```

❌ **Wrong date format**
```
01/15/2023  ; Should be 2023-01-15
```

❌ **Missing quotes**
```
2023-01-15 * Store Name  ; Should be "Store Name"
```

❌ **Using unopened accounts**
```
; Missing: 2023-01-01 open Assets:NewAccount USD
2023-01-15 * "Transaction"
  Assets:NewAccount  100.00 USD
```

## Quick Setup Checklist

1. ✅ Define all account types you'll use
2. ✅ Open accounts before first use
3. ✅ Use consistent account naming
4. ✅ Include opening balances
5. ✅ Add regular balance assertions
6. ✅ Use meaningful descriptions
7. ✅ Track investment costs and prices
8. ✅ Organize with includes for large files