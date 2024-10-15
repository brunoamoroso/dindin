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
        required desc: str;
        bank: str;
        required amount: int32{
            default := 0;
        };
        multi cards: Card;
        required created_by: User;
    }

    scalar type CardType extending enum<credit, debit, credit_debit>;

    type Card{
        required desc: str;
        required type: CardType;
        card_exp_date: cal::local_date;
    }

    scalar type Recurrency extending enum<`never`, day, week, biweek, month, quarter, semester, annual>;

    type Transaction{
        required type: str{
            constraint one_of("gain",  "expense");
        };
        desc: str;
        required amount: int32;
        required category: Category;
        subCategory: subCategory;
        required account: Account;
        required date: cal::local_date;
        required recurrency: Recurrency{
            default := Recurrency.`never`;
        };
        required created_by: User;
        payment_method: str;
        installments: int16;

    }
}
