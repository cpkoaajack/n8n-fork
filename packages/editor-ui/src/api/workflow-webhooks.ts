import { IOnboardingCallPromptResponse, IUser } from "@/Interface";
import { get } from "./helpers";

// TODO: Replace this with production when the workflow is ready
const N8N_WF_WEBHOOK_BASE_URL = 'https://milorad.app.n8n.cloud/webhook';
const N8N_ONBOARDING_CALL_PROMPT_WEBHOOK_PATH = '/46a6a97e-dff8-43bb-8085-535a9455bb0a';

export async function fetchNextOnboardingPrompt(instanceId: string, currentUer: IUser): Promise<IOnboardingCallPromptResponse> {
	return await get(
		N8N_WF_WEBHOOK_BASE_URL,
		`/${N8N_ONBOARDING_CALL_PROMPT_WEBHOOK_PATH}`,
		{
			instance_id: instanceId,
			user_id: currentUer.id,
			is_owner: currentUer.isOwner,
			personalization_answers: currentUer.personalizationAnswers,
		},
	);
}
