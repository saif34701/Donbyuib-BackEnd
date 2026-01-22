import { Controller, Get } from '@nestjs/common';
import { AssociationsService } from './associations.service';


@Controller('associations')
export class AssociationsController {
  constructor(private associationsService: AssociationsService) {}

  @Get()
  findAll() {
    return this.associationsService.findAll();
  }
}
