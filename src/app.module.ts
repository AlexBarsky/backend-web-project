import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PaginationModule } from './pagination/pagination.module';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		CategoryModule,
		PaginationModule,
		ReviewModule,
		ProductModule,
		OrderModule,
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
