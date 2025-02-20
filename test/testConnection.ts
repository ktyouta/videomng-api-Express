import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        // データベースに接続して、簡単なクエリを実行してみる
        const result = await prisma.$queryRaw`SELECT 1`;

        console.log('Connection test successful:', result);
    } catch (error) {
        console.error('Connection test failed:', error);
    } finally {
        await prisma.$disconnect(); // 接続をクリーンアップ
    }
}

testConnection();