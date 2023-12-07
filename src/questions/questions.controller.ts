import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, SetMetadata } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll() {
    return this.questionsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(+id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(+id, updateQuestionDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id)
  }

  @Get()
  async getQuestionsByPage(@Query('page') page: number) {
    const questions = await this.questionsService.getQuestionsByPage(page)
    return questions
  }

  @Post('vote-vrai/:id')
  async voteVrai(@Param('id') id: number) {
    await this.questionsService.voteVrai(id)
    return { success: true }
  }

  @Post('vote-faux/:id')
  async voteFaux(@Param('id') id: number) {
    await this.questionsService.voteFaux(id)
    return { success: true }
  }
}
