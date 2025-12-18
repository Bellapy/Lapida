import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('Start seeding ...')
  
  // Encontra o primeiro usuário para associar as categorias
  // Em uma aplicação real, você faria isso no momento do cadastro do usuário.
  const user = await db.user.findFirst();

  if (user) {
    console.log(`Found user: ${user.name} (${user.id}). Adding default categories...`);
    
    const defaultCategories = ['Lazer', 'Trabalho', 'Estudo'];
    
    for (const categoryName of defaultCategories) {
      // Cria a categoria apenas se ela não existir para este usuário
      await db.category.upsert({
        where: { name_userId: { name: categoryName, userId: user.id } },
        update: {},
        create: {
          name: categoryName,
          userId: user.id,
        },
      });
      console.log(`- Created or found category: ${categoryName}`);
    }
  } else {
    console.warn('No users found in the database. Skipping default category seeding.');
    console.warn('Please create a user first, then run the seed script again if needed.');
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })