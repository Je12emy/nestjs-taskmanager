import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');

  const logger = new Logger('bootstrap'); // Context for the logg message
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors(); // Accept request from the public
  }

  const port = process.env.PORT || serverConfig.port; // PORT=3005 npm run start:dev
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
