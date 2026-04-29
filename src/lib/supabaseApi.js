import { supabase } from "./supabaseClient";

export async function saveQuestionnaire(payload) {
  const questionnaireRow = {
    ville: payload.ville,
    surface: payload.surface,
    loyer: payload.loyer,
    concept: payload.concept,
    clientele: payload.clientele,
    atouts: payload.atouts ?? [],
  };

  const { data, error } = await supabase
    .from("questionnaires")
    .insert(questionnaireRow)
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function saveReport(params) {
  const { questionnaireId, title, payload } = params;

  const { data, error } = await supabase
    .from("reports")
    .insert({
      questionnaire_id: questionnaireId,
      title,
      payload,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}
