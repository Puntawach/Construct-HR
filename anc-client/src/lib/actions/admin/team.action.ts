"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/actions/action.utils";
import type { ActionResult } from "@/lib/actions/action.type";
import { teamService, type TeamPayload } from "@/lib/api/admin/team.service";
import type { Team } from "@/lib/api/admin/team.type";

export async function getTeamsAction(): Promise<ActionResult<Team[]>> {
  try {
    const data = await teamService.getAll();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function createTeamAction(
  payload: TeamPayload,
): Promise<ActionResult<Team>> {
  try {
    const data = await teamService.create(payload);
    revalidatePath("/admin/teams");
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function updateTeamAction(
  id: string,
  payload: Partial<TeamPayload>,
): Promise<ActionResult<Team>> {
  try {
    const data = await teamService.update(id, payload);
    revalidatePath("/admin/teams");
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function deleteTeamAction(id: string): Promise<ActionResult> {
  try {
    await teamService.remove(id);
    revalidatePath("/admin/teams");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
}
