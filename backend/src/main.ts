import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  const allowedOrigins = configService.get('ALLOWED_ORIGINS')?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('VIATICX API')
    .setDescription('API para gestión de gastos y viáticos empresariales')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y usuarios')
    .addTag('expenses', 'Gestión de gastos')
    .addTag('approvals', 'Aprobaciones')
    .addTag('categories', 'Categorías de gastos')
    .addTag('projects', 'Proyectos y centros de costo')
    .addTag('reports', 'Reportes y exportación')
    .addTag('users', 'Gestión de usuarios')
    .addTag('companies', 'Gestión de empresas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Start server
  const port = configService.get('PORT') || 3001;
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║   🚀 VIATICX API is running!             ║
    ║                                           ║
    ║   🌐 Server: http://localhost:${port}       ║
    ║   📚 API Docs: http://localhost:${port}/api-docs ║
    ║   🔧 Environment: ${configService.get('NODE_ENV')}      ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
  `);
}

bootstrap();
