# Beancount Examples

This document provides practical examples of Beancount syntax that can be parsed by this library.

## Complete Personal Finance Example

Here's a comprehensive example showing a month of personal finance tracking:

```beancount
;; Personal Finance Example - January 2023
;; This file demonstrates common Beancount patterns

;; ============================================================================
;; Account Definitions
;; ============================================================================

;; Assets
2023-01-01 open Assets:Checking USD
2023-01-01 open Assets:Savings USD
2023-01-01 open Assets:Cash USD
2023-01-01 open Assets:Investments:Brokerage USD,AAPL,MSFT
2023-01-01 open Assets:Investments:401k USD,VTSAX

;; Liabilities  
2023-01-01 open Liabilities:CreditCard:Visa USD
2023-01-01 open Liabilities:Mortgage USD

;; Income
2023-01-01 open Income:Salary:Base USD
2023-01-01 open Income:Salary:Bonus USD
2023-01-01 open Income:Investments:Dividends USD
2023-01-01 open Income:Investments:CapitalGains USD

;; Expenses
2023-01-01 open Expenses:Food:Groceries USD
2023-01-01 open Expenses:Food:Restaurants USD
2023-01-01 open Expenses:Transportation:Gas USD
2023-01-01 open Expenses:Transportation:Parking USD
2023-01-01 open Expenses:Housing:Rent USD
2023-01-01 open Expenses:Housing:Utilities USD
2023-01-01 open Expenses:Entertainment USD
2023-01-01 open Expenses:Healthcare USD
2023-01-01 open Expenses:Taxes:Federal USD
2023-01-01 open Expenses:Taxes:State USD
2023-01-01 open Expenses:Taxes:Social USD

;; Equity
2023-01-01 open Equity:Opening-Balances USD

;; ============================================================================
;; Commodity Definitions
;; ============================================================================

2023-01-01 commodity USD
  name: "US Dollar"
  asset-class: "cash"

2023-01-01 commodity AAPL
  name: "Apple Inc."
  asset-class: "stock"
  
2023-01-01 commodity MSFT
  name: "Microsoft Corporation"
  asset-class: "stock"

2023-01-01 commodity VTSAX
  name: "Vanguard Total Stock Market Index"
  asset-class: "mutual-fund"

;; ============================================================================
;; Opening Balances
;; ============================================================================

2023-01-01 * "Opening Balances"
  Assets:Checking           2500.00 USD
  Assets:Savings           10000.00 USD
  Assets:Cash                200.00 USD
  Liabilities:CreditCard:Visa  -1200.00 USD
  Liabilities:Mortgage      -185000.00 USD
  Equity:Opening-Balances

;; ============================================================================
;; January 2023 Transactions
;; ============================================================================

;; Week 1

2023-01-02 * "ATM" "Cash withdrawal"
  Assets:Checking   -100.00 USD
  Assets:Cash        100.00 USD

2023-01-03 * "Whole Foods" "Groceries" #food
  Assets:CreditCard:Visa  -87.45 USD
  Expenses:Food:Groceries   87.45 USD

2023-01-05 * "Shell" "Gas station" #transportation
  Assets:CreditCard:Visa         -45.20 USD
  Expenses:Transportation:Gas     45.20 USD

2023-01-06 * "Italian Restaurant" "Dinner with friends" #food #social
  Assets:CreditCard:Visa      -85.00 USD
  Expenses:Food:Restaurants    85.00 USD

;; Week 2

2023-01-09 * "Landlord" "January rent"
  Assets:Checking       -1800.00 USD
  Expenses:Housing:Rent  1800.00 USD

2023-01-10 * "Electric Company" "Monthly electricity bill"
  Assets:Checking            -95.50 USD
  Expenses:Housing:Utilities  95.50 USD

2023-01-12 * "Pharmacy" "Prescription medication"
  Assets:CreditCard:Visa  -35.80 USD
  Expenses:Healthcare      35.80 USD

2023-01-13 price AAPL 150.00 USD
2023-01-13 price MSFT 250.00 USD

2023-01-13 * "Broker" "Buy Apple stock" #investment
  Assets:Investments:Brokerage  10 AAPL {150.00 USD}
  Assets:Checking              -1500.00 USD

;; Week 3

2023-01-15 * "Employer" "Bi-weekly salary"
  Assets:Checking              2800.00 USD
  Expenses:Taxes:Federal        420.00 USD
  Expenses:Taxes:State          140.00 USD
  Expenses:Taxes:Social         240.00 USD
  Income:Salary:Base          -3600.00 USD

2023-01-16 * "Grocery Store" "Weekly shopping" #food
  category: "essential"
  receipt: "/receipts/2023-01-16-grocery.pdf"
  Assets:CreditCard:Visa      -124.67 USD
  Expenses:Food:Groceries      124.67 USD

2023-01-18 * "Movie Theater" "Movie tickets" #entertainment
  Assets:Cash                -25.00 USD
  Expenses:Entertainment      25.00 USD

2023-01-20 * "Parking Meter" "Downtown parking" #transportation
  Assets:Cash                        -5.00 USD
  Expenses:Transportation:Parking     5.00 USD

;; Week 4

2023-01-23 * "Automatic Transfer" "Monthly savings"
  Assets:Checking  -500.00 USD
  Assets:Savings    500.00 USD

2023-01-25 * "Credit Card Payment" "Monthly payment"
  Liabilities:CreditCard:Visa  1200.00 USD
  Assets:Checking             -1200.00 USD

2023-01-27 * "Apple Inc." "Dividend payment" #dividend
  Assets:Checking                    15.50 USD
  Income:Investments:Dividends      -15.50 USD

2023-01-30 price AAPL 155.00 USD

2023-01-30 * "Employer" "Bi-weekly salary" 
  Assets:Checking              2800.00 USD
  Expenses:Taxes:Federal        420.00 USD
  Expenses:Taxes:State          140.00 USD
  Expenses:Taxes:Social         240.00 USD
  Income:Salary:Base          -3600.00 USD

;; ============================================================================
;; Month-end Balance Assertions
;; ============================================================================

2023-01-31 balance Assets:Checking    2690.05 USD
2023-01-31 balance Assets:Savings    10500.00 USD
2023-01-31 balance Assets:Cash         170.00 USD
2023-01-31 balance Liabilities:CreditCard:Visa  -377.92 USD

;; ============================================================================
;; Notes and Documentation
;; ============================================================================

2023-01-31 note Assets:Investments:Brokerage "Opened investment account to start building portfolio"
2023-01-31 document Assets:Checking "/statements/2023-01-checking-statement.pdf"

;; ============================================================================
;; Events
;; ============================================================================

2023-01-15 event "pay-day" "Bi-weekly salary received"
2023-01-30 event "pay-day" "Bi-weekly salary received"

;; ============================================================================
;; Custom Directives and Queries
;; ============================================================================

2023-01-31 custom "budget-check" Expenses:Food 400.00 USD "Monthly food budget"
2023-01-31 query "monthly-expenses" "SELECT sum(position) WHERE account ~ 'Expenses:' AND date >= 2023-01-01 AND date <= 2023-01-31"
```

## Investment Tracking Example

```beancount
;; Investment Portfolio Tracking

2023-01-01 open Assets:Investments:Brokerage USD,AAPL,MSFT,GOOGL
2023-01-01 open Assets:Investments:401k USD,VTSAX,VTIAX
2023-01-01 open Income:Investments:Dividends USD
2023-01-01 open Income:Investments:CapitalGains USD

;; Stock purchases with cost tracking
2023-01-15 * "Broker" "Buy tech stocks"
  Assets:Investments:Brokerage  10 AAPL {150.00 USD}
  Assets:Investments:Brokerage   5 MSFT {250.00 USD}
  Assets:Checking              -2750.00 USD

;; 401k contribution
2023-01-31 * "Employer" "401k contribution and match"
  Assets:Investments:401k  50 VTSAX {100.00 USD}  ; Employee contribution
  Assets:Investments:401k  25 VTSAX {100.00 USD}  ; Employer match
  Income:Salary:Base      -7500.00 USD            ; Reduced salary

;; Stock sale with capital gains
2023-02-15 * "Broker" "Sell Apple stock"
  Assets:Investments:Brokerage  -5 AAPL {150.00 USD} @ 160.00 USD
  Assets:Checking                800.00 USD
  Income:Investments:CapitalGains -50.00 USD

;; Dividend income
2023-03-15 * "Apple Inc." "Quarterly dividend"
  Assets:Checking                    12.50 USD
  Income:Investments:Dividends      -12.50 USD

;; Price tracking
2023-01-15 price AAPL 150.00 USD
2023-01-31 price AAPL 155.00 USD
2023-02-15 price AAPL 160.00 USD
2023-02-28 price AAPL 158.00 USD

2023-01-15 price MSFT 250.00 USD
2023-01-31 price MSFT 255.00 USD
2023-02-28 price MSFT 260.00 USD
```

## Multi-Currency Example

```beancount
;; Multi-currency transactions

2023-01-01 open Assets:Checking:USD USD
2023-01-01 open Assets:Checking:EUR EUR
2023-01-01 open Expenses:Travel EUR,USD
2023-01-01 open Income:Consulting EUR

;; Currency exchange
2023-01-15 * "Bank" "Currency exchange"
  Assets:Checking:USD  -1000.00 USD @ 0.92 EUR
  Assets:Checking:EUR    920.00 EUR

;; International consulting income
2023-01-20 * "European Client" "Consulting services"
  Assets:Checking:EUR   2500.00 EUR
  Income:Consulting    -2500.00 EUR

;; Travel expenses in foreign currency
2023-01-25 * "Hotel Paris" "Business travel accommodation"
  Expenses:Travel      180.00 EUR
  Assets:Checking:EUR -180.00 EUR

;; Price history for currency conversion
2023-01-15 price EUR 1.08 USD
2023-01-31 price EUR 1.09 USD
```

## Business Accounting Example

```beancount
;; Small Business Accounting

;; Business accounts
2023-01-01 open Assets:Business:Checking USD
2023-01-01 open Assets:Business:AccountsReceivable USD
2023-01-01 open Liabilities:Business:AccountsPayable USD
2023-01-01 open Liabilities:Business:CreditCard USD
2023-01-01 open Income:Business:Services USD
2023-01-01 open Income:Business:Products USD
2023-01-01 open Expenses:Business:Rent USD
2023-01-01 open Expenses:Business:Supplies USD
2023-01-01 open Expenses:Business:Marketing USD

;; Client invoice
2023-01-15 * "Client ABC" "Web development project - Invoice #001"
  invoice-number: "001"
  project: "website-redesign"
  Assets:Business:AccountsReceivable  5000.00 USD
  Income:Business:Services           -5000.00 USD

;; Client payment received
2023-01-30 * "Client ABC" "Payment for Invoice #001"
  invoice-number: "001"
  Assets:Business:Checking            5000.00 USD
  Assets:Business:AccountsReceivable -5000.00 USD

;; Business expenses
2023-01-05 * "Office Landlord" "January office rent"
  Expenses:Business:Rent      1500.00 USD
  Assets:Business:Checking   -1500.00 USD

2023-01-10 * "Office Supplies Store" "Printer paper and pens"
  Expenses:Business:Supplies       85.50 USD
  Liabilities:Business:CreditCard -85.50 USD

2023-01-20 * "Google Ads" "January advertising campaign"
  Expenses:Business:Marketing      300.00 USD
  Liabilities:Business:CreditCard -300.00 USD
```

## Error Examples (What NOT to do)

```beancount
;; These examples show common errors that will be caught by the parser

;; ERROR: Transaction doesn't balance
2023-01-15 * "Bad Transaction"
  Assets:Checking  100.00 USD
  Expenses:Food     50.00 USD  ; Missing 50.00 USD to balance

;; ERROR: Account not opened
2023-01-15 * "Using unopened account"
  Assets:NewAccount  100.00 USD  ; This account was never opened
  Assets:Checking   -100.00 USD

;; ERROR: Invalid date format
2023/01/15 * "Wrong date format"  ; Should be 2023-01-15
  Assets:Checking  100.00 USD
  Income:Other    -100.00 USD

;; ERROR: Invalid account name
2023-01-15 * "Bad account name"
  assets:checking  100.00 USD  ; Should start with capital letter
  Income:Other    -100.00 USD

;; ERROR: Missing quotes around strings
2023-01-15 * Unquoted Payee "Description"  ; Payee should be quoted
  Assets:Checking  100.00 USD
  Income:Other    -100.00 USD
```

## Advanced Features Examples

### Complex Cost and Price Tracking

```beancount
;; Advanced investment tracking with lot identification

2023-01-15 * "Broker" "Buy AAPL - Lot 1"
  Assets:Investments  10 AAPL {150.00 USD, 2023-01-15, "lot1"}
  Assets:Checking    -1500.00 USD

2023-02-15 * "Broker" "Buy AAPL - Lot 2"  
  Assets:Investments  10 AAPL {160.00 USD, 2023-02-15, "lot2"}
  Assets:Checking    -1600.00 USD

2023-03-15 * "Broker" "Sell AAPL - Specific lot"
  Assets:Investments  -5 AAPL {150.00 USD, 2023-01-15, "lot1"} @ 170.00 USD
  Assets:Checking      850.00 USD
  Income:CapitalGains -100.00 USD
```

### Metadata and Tags

```beancount
;; Rich metadata and categorization

2023-01-15 * "Restaurant" "Business dinner with client" #business #meal #deductible
  client: "ABC Corp"
  attendees: "John Smith, Jane Doe"
  receipt: "/receipts/2023-01-15-dinner.pdf"
  tax-deductible: "yes"
  Assets:CreditCard     -125.50 USD
    tip: 18.50 USD
  Expenses:Business:Meals 125.50 USD
    category: "client-entertainment"
```

These examples demonstrate the full range of Beancount syntax supported by this parser. They can be used as templates for building your own accounting files or as test cases for parser development.