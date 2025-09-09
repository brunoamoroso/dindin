import {getCoins, addNewUserSelectedCoin } from "@/api/coinService";
import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { CoinType } from "@/types/CoinTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProfileCreationDefaultCoin(){
    const navigate = useNavigate();
    const [searchCoin, setSearchCoin] = useState("");
    const [filteredCoins, setFilteredCoins] = useState<CoinType[]>([]);

    const {data} = useQuery<CoinType[]>({
        queryKey: ["profileCreationGetCoins"],
        queryFn: () => getCoins()
    });

    const mutation = useMutation({
        mutationFn: (data: {coinId: string}) => addNewUserSelectedCoin(data),
        onSuccess: () => {
            navigate('/dashboard');
        }
    });

    useEffect(() => {
        setFilteredCoins(data || []);
    }, [data])

    const handleSearchCoin = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchCoin(query);

        if(query === ""){
            setFilteredCoins(data || []);
            return;
        }

        if(query !== ""){
            const filtered = (data || []).filter((coin) => {
                return coin.code.toLowerCase().includes(query.toLowerCase());
            });
            setFilteredCoins(filtered);
        }
    }

    const handleCoinClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const coinId = e.currentTarget.dataset.id;
        if (coinId) {
            mutation.mutate({ coinId });
        }
    }

    return (                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        <div className="min-h-dvh bg-surface flex flex-1 flex-col">
            <AppBar title="Adicionar uma moeda"/>
            <div className="px-6 py-10 flex flex-1 flex-col bg-layer-tertiary rounded-lg">
                <TextField 
                    label="Buscar"
                    placeholder="Buscar moeda"
                    value={searchCoin}
                    onChange={handleSearchCoin}
                />

                <div className="flex flex-col pt-6">
                    {filteredCoins.map((item, i, arr) => (
                        <MenuListItem
                            key={i}
                            separator={arr.length - 1 !== i}
                            dataId={item.id}
                            value={item.code}
                            trailingIcon={false}
                            onClick={handleCoinClick}
                        >
                        <div className="flex gap-4 items-center">
                            <img
                                src={item.img}
                                alt="coin"
                                className="w-7 h-7 object-cover rounded-full">
                                
                            </img>
                            <div className="flex flex-col">
                                <span className="label-large text-content-primary">{item.code}</span>
                                <span className="body-small text-content-subtle">{item.desc}</span>
                            </div>
                        </div>
                        </MenuListItem>
                    ))}
                </div>
            </div>
        </div>
    );
}