// Model classes for Beancount data structures

export type MetadataValue = string | Date | number;

export interface Metadata {
  [key: string]: MetadataValue;
}

export interface Position {
  line: number;
  column: number;
}

export interface SourceLocation {
  start: Position;
  end: Position;
}

export abstract class DirectiveBase {
  location?: SourceLocation;
  metadata: Metadata = {};

  constructor(location?: SourceLocation, metadata: Metadata = {}) {
    this.location = location;
    this.metadata = metadata;
  }
}

export class Transaction extends DirectiveBase {
  date: Date;
  flag: string;
  payee: string | null;
  narration: string | null;
  postings: Posting[];

  constructor(
    date: Date,
    flag: string,
    payee: string | null,
    narration: string | null,
    postings: Posting[] = [],
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.flag = flag;
    this.payee = payee;
    this.narration = narration;
    this.postings = postings;
  }
}

export class Amount {
  number: number;
  currency: string;

  constructor(number: number, currency: string) {
    this.number = number;
    this.currency = currency;
  }

  toString(): string {
    return `${this.number} ${this.currency}`;
  }
}

export class Cost {
  amount?: Amount;
  date?: Date;
  label?: string;

  constructor(amount?: Amount, date?: Date, label?: string) {
    this.amount = amount;
    this.date = date;
    this.label = label;
  }
}

export class PriceAnnotation {
  amount: Amount;
  isTotal: boolean;

  constructor(amount: Amount, isTotal: boolean = false) {
    this.amount = amount;
    this.isTotal = isTotal;
  }
}

export class Posting extends DirectiveBase {
  account: string;
  amount?: Amount;
  cost?: Cost;
  priceAnnotation?: PriceAnnotation;

  constructor(
    account: string,
    amount?: Amount,
    cost?: Cost,
    priceAnnotation?: PriceAnnotation,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.account = account;
    this.amount = amount;
    this.cost = cost;
    this.priceAnnotation = priceAnnotation;
  }
}

export class Price extends DirectiveBase {
  date: Date;
  currency: string;
  amount: Amount;

  constructor(
    date: Date,
    currency: string,
    amount: Amount,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.currency = currency;
    this.amount = amount;
  }
}

export class Balance extends DirectiveBase {
  date: Date;
  account: string;
  amount: Amount;

  constructor(
    date: Date,
    account: string,
    amount: Amount,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.account = account;
    this.amount = amount;
  }
}

export class Open extends DirectiveBase {
  date: Date;
  account: string;
  currencies: string[];
  booking?: string;

  constructor(
    date: Date,
    account: string,
    currencies: string[] = [],
    booking?: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.account = account;
    this.currencies = currencies;
    this.booking = booking;
  }
}

export class Close extends DirectiveBase {
  date: Date;
  account: string;

  constructor(
    date: Date,
    account: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.account = account;
  }
}

export class Commodity extends DirectiveBase {
  date: Date;
  currency: string;

  constructor(
    date: Date,
    currency: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.currency = currency;
  }
}

export class Pad extends DirectiveBase {
  date: Date;
  account: string;
  sourceAccount: string;

  constructor(
    date: Date,
    account: string,
    sourceAccount: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.account = account;
    this.sourceAccount = sourceAccount;
  }
}

export class Note extends DirectiveBase {
  date: Date;
  account: string;
  comment: string;

  constructor(
    date: Date,
    account: string,
    comment: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.account = account;
    this.comment = comment;
  }
}

export class Document extends DirectiveBase {
  date: Date;
  account: string;
  path: string;

  constructor(
    date: Date,
    account: string,
    path: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.account = account;
    this.path = path;
  }
}

export class Event extends DirectiveBase {
  date: Date;
  type: string;
  description: string;

  constructor(
    date: Date,
    type: string,
    description: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.type = type;
    this.description = description;
  }
}

export class Query extends DirectiveBase {
  date: Date;
  name: string;
  query: string;

  constructor(
    date: Date,
    name: string,
    query: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.name = name;
    this.query = query;
  }
}

export class Custom extends DirectiveBase {
  date: Date;
  type: string;
  values: (string | Date | number | Amount)[];

  constructor(
    date: Date,
    type: string,
    values: (string | Date | number | Amount)[] = [],
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.date = date;
    this.type = type;
    this.values = values;
  }
}

export class Option extends DirectiveBase {
  name: string;
  value: string;

  constructor(
    name: string,
    value: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.name = name;
    this.value = value;
  }
}

export class Plugin extends DirectiveBase {
  name: string;
  config?: string;

  constructor(
    name: string,
    config?: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.name = name;
    this.config = config;
  }
}

export class Include extends DirectiveBase {
  filename: string;

  constructor(
    filename: string,
    location?: SourceLocation,
    metadata: Metadata = {}
  ) {
    super(location, metadata);
    this.filename = filename;
  }
}

export type Directive =
  | Transaction
  | Price
  | Balance
  | Open
  | Close
  | Commodity
  | Pad
  | Note
  | Document
  | Event
  | Query
  | Custom
  | Option
  | Plugin
  | Include;

export class BeancountFile {
  directives: Directive[] = [];

  constructor(directives: Directive[] = []) {
    this.directives = directives;
  }
}