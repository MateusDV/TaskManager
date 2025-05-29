import {PrismaClient} from '../src/generated/prisma';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const user1password = await bcrypt.hash('securepassword1', 12);

    const user1 = await prisma.user.upsert({
        where: {email: 'alice@example.com'},
        update: {},
        create: {
            email: 'alice@example.com',
            password: user1password,
            tasks: {
                create: [
                    {
                        title: 'Task 1 for Alice',
                        description: 'Complete the report',
                        dueDate: new Date('2025-06-01T12:00:00Z'),
                    },
                    {
                        title: 'Task 2 for Alice',
                        description: 'Prepare presentation slides',
                        dueDate: new Date('2025-06-05T09:00:00Z'),
                    },
                ],
            },
        },
    });

    const user2password = await bcrypt.hash('securepassword2', 12);

    const user2 = await prisma.user.upsert({
        where: {email: 'bob@example.com'},
        update: {},
        create: {
            email: 'bob@example.com',
            password: user2password,
            tasks: {
                create: [
                    {
                        title: 'Task 1 for Bob',
                        description: 'Review team feedback',
                        dueDate: new Date('2025-06-02T10:00:00Z'),
                    },
                ],
            },
        },
    });

    console.log({user1, user2});
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
