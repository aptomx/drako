import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { HttpFilterException } from './lib/filters/http-exception.filter';
import * as exphbs from 'express-handlebars';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BASE_PREFIX_API } from 'config/magicVariables';
import { LoggerReportingService } from './lib/vendor/loggerReporting/loggerReporting.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Catch global errors
  app.useGlobalFilters(new HttpFilterException());

  // Handle all user input validation globally
  // Option: Whitelist -> true : skip additional parameters in parse request
  // Option: ForbidNonWhitelisted -> true : return error with additional parameters in request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  LoggerReportingService.init();

  //Config template
  const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '../..', 'views', 'layouts'),
    partialsDir: join(__dirname, '../..', 'views', 'partials'),
    helpers: {
      pathImage: (initialPath) => `${AppModule.appUrl}/${initialPath}`,
    },
  });
  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  app.engine('hbs', hbs.engine);
  app.setViewEngine('hbs');

  //SwaggerModule configuration
  const config = new DocumentBuilder()
    .setTitle(AppModule.appName)
    .setDescription('Set of routes for different user groups')
    .setVersion('1.0')
    .addServer(`${AppModule.appUrl}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${BASE_PREFIX_API}/docs`, app, document);

  //Enable Cors
  app.enableCors();

  //Port listen
  const runningPort = process.env.PORT || AppModule.appPort;
  await app.listen(runningPort, () => {
    console.log(`[SERVER LISTENING AT PORT: ${runningPort}] `);
  });
}
bootstrap();
