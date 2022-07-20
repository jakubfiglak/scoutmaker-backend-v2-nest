import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class ToggleMembershipDto {
  @IsCuid()
  memberId: number;
}
