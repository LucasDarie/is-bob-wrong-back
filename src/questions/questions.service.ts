// src/questions/question.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';

/**
 * Service responsible for handling CRUD operations for questions.
 */
@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  /**
   * Retrieves all questions from the database.
   * @returns A promise that resolves to an array of questions.
   */
  findAll() {
    return this.questionsRepository.find();
  }

  /**
   * Retrieves a question by its ID.
   * @param id - The ID of the question to retrieve.
   * @returns A promise that resolves to the question with the specified ID.
   */
  findOne(id: number) {
    return this.questionsRepository.findOne({ where: { id: id } });
  }

  /**
   * Creates a new question.
   * @param createQuestionDto - The data for creating the question.
   * @returns A promise that resolves to the created question.
   */
  async create(createQuestionDto: CreateQuestionDto) {
    const question = this.questionsRepository.create(createQuestionDto);
    return this.questionsRepository.save(question);
  }

  /**
   * Updates a question by its ID.
   * @param id - The ID of the question to update.
   * @param updateQuestionDto - The data for updating the question.
   * @returns A promise that resolves to the updated question.
   */
  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    await this.questionsRepository.update(id, updateQuestionDto);
    return this.findOne(id);
  }

  /**
   * Removes a question by its ID.
   * @param id - The ID of the question to remove.
   */
  async remove(id: number) {
    await this.questionsRepository.delete(id);
  }

  /**
   * Retrieves a page of questions.
   * @param page - The page number.
   * @returns A promise that resolves to an array of questions for the specified page.
   */
  async getQuestionsByPage(page: number): Promise<Question[]> {
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const questions = await this.questionsRepository
      .createQueryBuilder('question')
      .skip(skip)
      .take(pageSize)
      .getMany();

    return questions;
  }

  /**
   * Increases the vote count for the "vrai" option of a question.
   * @param id - The ID of the question to vote for.
   * @throws NotFoundException if the question with the specified ID is not found.
   */
  async voteVrai(id: number): Promise<void> {
    const question = await this.questionsRepository.findOne({ where: { id: id } });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    question.nbVoteVrai += 1;
    await this.questionsRepository.save(question);
  }

  /**
   * Increases the vote count for the "faux" option of a question.
   * @param id - The ID of the question to vote for.
   * @throws NotFoundException if the question with the specified ID is not found.
   */
  async voteFaux(id: number): Promise<void> {
    const question = await this.questionsRepository.findOne({ where: { id: id } });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    question.nbVoteFaux += 1;
    await this.questionsRepository.save(question);
  }
}
