import { PrismaClient } from '@prisma/client';

const roles = [
        {id:1, name: 'User'},
        {id: 2, name: 'Admin'} 
    ]

const prisma = new PrismaClient();


async function main() {
    for (let role of roles) {
        await prisma.role.create({
            data: role
        })
    }

}

main().catch(e => {
    console.log(e);
    process.exit(1)
}).finally(()=> { 
    prisma.$disconnect();
})
