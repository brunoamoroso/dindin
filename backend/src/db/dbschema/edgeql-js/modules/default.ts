// GENERATED by @edgedb/generate v0.5.3

import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _cal from "./cal";
export type $CardType = {
  "credit": $.$expr_Literal<$CardType>;
  "debit": $.$expr_Literal<$CardType>;
  "credit_debit": $.$expr_Literal<$CardType>;
} & $.EnumType<"default::CardType", ["credit", "debit", "credit_debit"]>;
const CardType: $CardType = $.makeType<$CardType>(_.spec, "4743e5fc-4877-11ef-83a3-f16d82f722b3", _.syntax.literal);

export type $CategoryType = {
  "gain": $.$expr_Literal<$CategoryType>;
  "expense": $.$expr_Literal<$CategoryType>;
} & $.EnumType<"default::CategoryType", ["gain", "expense"]>;
const CategoryType: $CategoryType = $.makeType<$CategoryType>(_.spec, "b6327e4e-4767-11ef-8ac3-cdee2776c699", _.syntax.literal);

export type $Recurrency = {
  "never": $.$expr_Literal<$Recurrency>;
  "day": $.$expr_Literal<$Recurrency>;
  "week": $.$expr_Literal<$Recurrency>;
  "biweek": $.$expr_Literal<$Recurrency>;
  "month": $.$expr_Literal<$Recurrency>;
  "quarter": $.$expr_Literal<$Recurrency>;
  "semester": $.$expr_Literal<$Recurrency>;
  "annual": $.$expr_Literal<$Recurrency>;
} & $.EnumType<"default::Recurrency", ["never", "day", "week", "biweek", "month", "quarter", "semester", "annual"]>;
const Recurrency: $Recurrency = $.makeType<$Recurrency>(_.spec, "a00c3d68-34ce-11ef-b43f-67f18fdf043d", _.syntax.literal);

export type $AccountλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "created_by": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "amount": $.PropertyDesc<_std.$int32, $.Cardinality.One, false, false, false, true>;
  "bank": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "cards": $.LinkDesc<$Card, $.Cardinality.Many, {}, false, false,  false, false>;
  "desc": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<account[is Transaction]": $.LinkDesc<$Transaction, $.Cardinality.Many, {}, false, false,  false, false>;
  "<account": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Account = $.ObjectType<"default::Account", $AccountλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Account = $.makeType<$Account>(_.spec, "9ff0ac10-34ce-11ef-abfd-755be66d7f35", _.syntax.literal);

const Account: $.$expr_PathNode<$.TypeSet<$Account, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Account, $.Cardinality.Many), null);

export type $CardλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "card_exp_date": $.PropertyDesc<_cal.$local_date, $.Cardinality.AtMostOne, false, false, false, false>;
  "type": $.PropertyDesc<$CardType, $.Cardinality.One, false, false, false, false>;
  "desc": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<cards[is Account]": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, false,  false, false>;
  "<cards": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Card = $.ObjectType<"default::Card", $CardλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Card = $.makeType<$Card>(_.spec, "47441176-4877-11ef-b319-cb4c9932d15f", _.syntax.literal);

const Card: $.$expr_PathNode<$.TypeSet<$Card, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Card, $.Cardinality.Many), null);

export type $CategoryλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "subCategories": $.LinkDesc<$subCategory, $.Cardinality.Many, {}, false, false,  false, false>;
  "desc": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "is_public": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "type": $.PropertyDesc<$CategoryType, $.Cardinality.One, false, false, false, false>;
  "created_by": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "<category[is Transaction]": $.LinkDesc<$Transaction, $.Cardinality.Many, {}, false, false,  false, false>;
  "<category": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Category = $.ObjectType<"default::Category", $CategoryλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Category = $.makeType<$Category>(_.spec, "a001d7e2-34ce-11ef-b326-55f3032b002d", _.syntax.literal);

const Category: $.$expr_PathNode<$.TypeSet<$Category, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Category, $.Cardinality.Many), null);

export type $TransactionλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "account": $.LinkDesc<$Account, $.Cardinality.One, {}, false, false,  false, false>;
  "category": $.LinkDesc<$Category, $.Cardinality.One, {}, false, false,  false, false>;
  "created_by": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "subCategory": $.LinkDesc<$subCategory, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "amount": $.PropertyDesc<_std.$int32, $.Cardinality.One, false, false, false, false>;
  "date": $.PropertyDesc<_cal.$local_date, $.Cardinality.One, false, false, false, false>;
  "installments": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
  "recurrency": $.PropertyDesc<$Recurrency, $.Cardinality.One, false, false, false, true>;
  "type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "desc": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "install_number": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
  "payment_condition": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "group_installment_id": $.PropertyDesc<_std.$uuid, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Transaction = $.ObjectType<"default::Transaction", $TransactionλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $Transaction = $.makeType<$Transaction>(_.spec, "2f22bb84-5fbe-11ef-a67c-a938ba8a41d2", _.syntax.literal);

const Transaction: $.$expr_PathNode<$.TypeSet<$Transaction, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Transaction, $.Cardinality.Many), null);

export type $UserλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "password": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "surname": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "photo": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<created_by[is Account]": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, false,  false, false>;
  "<created_by[is subCategory]": $.LinkDesc<$subCategory, $.Cardinality.Many, {}, false, false,  false, false>;
  "<created_by[is Category]": $.LinkDesc<$Category, $.Cardinality.Many, {}, false, false,  false, false>;
  "<created_by[is Transaction]": $.LinkDesc<$Transaction, $.Cardinality.Many, {}, false, false,  false, false>;
  "<created_by": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"default::User", $UserλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
  {username: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
  {email: {__element__: _std.$str, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
]>;
const $User = $.makeType<$User>(_.spec, "9fe8b212-34ce-11ef-9368-a35923a2a8c3", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);

export type $subCategoryλShape = $.typeutil.flatten<_std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588λShape & {
  "created_by": $.LinkDesc<$User, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "desc": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "is_public": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "<subCategories[is Category]": $.LinkDesc<$Category, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subCategory[is Transaction]": $.LinkDesc<$Transaction, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subCategories": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subCategory": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $subCategory = $.ObjectType<"default::subCategory", $subCategoryλShape, null, [
  ..._std.$Object_8ce8c71ee4fa5f73840c22d7eaa58588['__exclusives__'],
]>;
const $subCategory = $.makeType<$subCategory>(_.spec, "9ffc69ba-34ce-11ef-bc45-2900c7461c25", _.syntax.literal);

const subCategory: $.$expr_PathNode<$.TypeSet<$subCategory, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($subCategory, $.Cardinality.Many), null);



export { CardType, CategoryType, Recurrency, $Account, Account, $Card, Card, $Category, Category, $Transaction, Transaction, $User, User, $subCategory, subCategory };

type __defaultExports = {
  "CardType": typeof CardType;
  "CategoryType": typeof CategoryType;
  "Recurrency": typeof Recurrency;
  "Account": typeof Account;
  "Card": typeof Card;
  "Category": typeof Category;
  "Transaction": typeof Transaction;
  "User": typeof User;
  "subCategory": typeof subCategory
};
const __defaultExports: __defaultExports = {
  "CardType": CardType,
  "CategoryType": CategoryType,
  "Recurrency": Recurrency,
  "Account": Account,
  "Card": Card,
  "Category": Category,
  "Transaction": Transaction,
  "User": User,
  "subCategory": subCategory
};
export default __defaultExports;
