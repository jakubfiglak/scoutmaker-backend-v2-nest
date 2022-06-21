import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class GoToMatchDto {
  @IsCuid()
  matchId: string;
}