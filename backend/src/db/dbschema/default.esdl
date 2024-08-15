module default {
    type User{
        photo: str;
        required name: str;
        required surname: str;
        required email: str {constraint exclusive};
        required username: str {constraint exclusive};
        required password: str;
    }

    scalar type CategoryType extending enum<gain, expense>;

    type Category{
        required desc: str;
        required is_public: bool{
            default := false;
        }
        multi subCategories: subCategory;
        required type: CategoryType;
        required created_by: User;
    }

    type subCategory{
        required desc: str;
        required is_public: bool{
            default := false;
        }
        created_by: User;
    }


    type Account{
        required description: str;
        bank: str;
        required amount: int32{
            default := 0;
        };
        multi cards: Card;
        required created_by: User;
    }

    scalar type CardType extending enum<credit, debit, credit_debit>;

    type Card{
        required description: str;
        required type: CardType;
        card_exp_date: cal::local_date;
    }

    scalar type Recurrency extending enum<`never`, day, week, biweek, month, quarter, semester, annual>;

    type Gain{
        required description: str;
        required amount: int32;
        required category: Category;
        subCategory: subCategory;
        required account: Account;
        required date_earned: cal::local_date;
        required recurrency: Recurrency {
            default := Recurrency.`never`;
        };
        required created_by: User;
    } 

    type Expense{
        required description: str;
        required amount: int32;
        required category: Category;
        subCategory: subCategory;
        required account: Account;
        required date_paid: cal::local_date;
        payment_method: str;
        payment_condition: str;
        installments: int16;
        required recurrency: Recurrency {
            default := Recurrency.`never`;
        }
        required created_by: User;
    }
}
