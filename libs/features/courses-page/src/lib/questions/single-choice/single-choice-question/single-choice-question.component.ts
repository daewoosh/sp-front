import { Component, Input, OnInit } from '@angular/core';
import { Question, QuestionType } from '@sp/core/models';
import { CommonModule, NgForOf } from '@angular/common';
import { TuiLabel } from '@taiga-ui/core';
import { TuiCheckbox, TuiRadio } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { NgDompurifyPipe } from '@taiga-ui/dompurify';

interface QuestionModel {
  text: string;
  variants: Record<string, QuestionVariantItem>;
}

interface QuestionVariantItem {
  text: string;
  isSelected: boolean;
  isCorrect: boolean | null;
}

@Component({
  selector: 'sp-single-choice-question',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabel,
    TuiRadio,
    FormsModule,
    TuiCheckbox,
    NgDompurifyPipe,
  ],
  templateUrl: './single-choice-question.component.html',
  styleUrl: './single-choice-question.component.scss',
})
export class SingleChoiceQuestionComponent implements OnInit {
  @Input() questionModel!: QuestionModel;
  @Input() question!: Question;

  options: { key: string; value: QuestionVariantItem }[] = [];
  isMultipleChoice = false;
  ngOnInit(): void {
    this.questionModel = JSON.parse(this.question.text);
    this.options = this.getOptions();
    this.isMultipleChoice = this.question.type === QuestionType.MultipleChoice;

    // Если ответ пустой, инициализируем пустым массивом
    if (!this.question.userAnswer) {
      this.question.userAnswer = [];
    } else {
      this.question.userAnswer = JSON.parse(
        this.question.userAnswer.toString()
      ) as string[];
    }
  }

  getOptions(): { key: string; value: QuestionVariantItem }[] {
    return Object.keys(this.questionModel.variants).map((key) => ({
      key,
      value: this.questionModel.variants[key],
    }));
  }

  toggleAnswer(optionKey: string): void {
    if (this.isMultipleChoice) {
      if (!Array.isArray(this.question.userAnswer)) {
        this.question.userAnswer = [];
      }

      const index = (this.question.userAnswer as string[]).indexOf(optionKey);
      if (index === -1) {
        (this.question.userAnswer as string[]).push(optionKey);
      } else {
        (this.question.userAnswer as string[]).splice(index, 1);
      }
    } else {
      this.question.userAnswer = [];
      this.question.userAnswer.push(optionKey);
    }
    Object.keys(this.questionModel.variants).map((key) => {
      this.questionModel.variants[key].isSelected = false;
      this.questionModel.variants[key].isCorrect = false;
    });
  }
}
