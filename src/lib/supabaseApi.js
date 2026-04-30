import { supabase } from "./supabaseClient";

export async function saveQuestionnaire(payload) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.");
  }

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
  if (!supabase) {
    throw new Error("Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.");
  }

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
