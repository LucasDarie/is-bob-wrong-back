export class CreateQuestionDto {
    intitule: string;
    isVraie: boolean;
    explication: string;

  }
  
  export class UpdateQuestionDto {
    intitule?: string;
    isVraie?: boolean;
    explication?: string;
  }