import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { IconButton } from './ui/icon-button'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useState } from 'react'

interface ActionsTransactionProps {
  id: string;
}

export default function ActionsTransaction({id}: ActionsTransactionProps) {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger>
            <IconButton variant={"ghost"} size={"small"}><EllipsisVertical width={16} /></IconButton>
        </DrawerTrigger>
        <DrawerContent className='bg-container1 flex border-outline rounded-t-lg'>
            <div className="container flex flex-col gap-6 py-10 w-full items-center">
                <DrawerTitle className='title-small text-title'>O que você quer fazer?</DrawerTitle>
                <div className="flex flex-col w-full items-center gap-6">
                    <Link className='w-full' to={`/transaction/delete/${id}`}>
                        <Button className='w-full' variant={"destructive"} size={"lg"}><Trash2/> Excluir</Button>
                    </Link>
                    <Link className='w-full' to={`/transaction/edit/${id}`}>
                        <Button className="w-full" variant={"outline"} size={"lg"}><SquarePen /> Editar</Button>
                    </Link>
                    <Button className="w-full text-body" variant={"ghost"} size={"lg"} onClick={() => setIsOpen(false)}>Fechar</Button>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
  )
}
