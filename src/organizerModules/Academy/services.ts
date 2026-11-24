import { apiClient } from '../../services/apiClient';
import {
  ACADEMY_ENDPOINT,
  COMPLETE_LESSON_ENDPOINT,
  COMPLETE_STAGE3_ENDPOINT,
  REGISTER_WORKSHOP_ENDPOINT,
} from './constants';
import type { AcademyAction, AcademyDTO } from './types';

export async function getAcademy(): Promise<AcademyDTO> {
  const { data } = await apiClient.get<AcademyDTO>(ACADEMY_ENDPOINT);
  return data;
}

const ACTION_ENDPOINT: Record<AcademyAction, string> = {
  lesson: COMPLETE_LESSON_ENDPOINT,
  workshop: REGISTER_WORKSHOP_ENDPOINT,
  stage3: COMPLETE_STAGE3_ENDPOINT,
};

/** Completes a lesson, registers for a workshop, or completes a master-class item. */
export async function runAcademyAction(
  action: AcademyAction,
  key: string,
): Promise<AcademyDTO> {
  const { data } = await apiClient.post<AcademyDTO>(ACTION_ENDPOINT[action], {
    key,
  });
  return data;
}
