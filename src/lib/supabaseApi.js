import { supabase } from "./supabaseClient";

const IMMO_PRICE_TABLE = import.meta.env.VITE_SUPABASE_IMMO_TABLE || "prix_immobiliers";

function inferDepartmentFromCity(city = "") {
  const input = city.trim().toLowerCase();
  if (!input) return { code: null, label: null };

  const zipMatch = input.match(/\b(\d{2})\d{3}\b/);
  if (zipMatch) return { code: zipMatch[1], label: null };

  if (input.includes("paris")) return { code: "75", label: "Paris" };
  if (input.includes("lyon")) return { code: "69", label: "Rhône" };
  if (input.includes("marseille") || input.includes("aix")) return { code: "13", label: "Bouches-du-Rhône" };
  if (input.includes("bordeaux")) return { code: "33", label: "Gironde" };
  if (input.includes("nantes")) return { code: "44", label: "Loire-Atlantique" };
  if (input.includes("lille")) return { code: "59", label: "Nord" };
  if (input.includes("toulouse")) return { code: "31", label: "Haute-Garonne" };
  if (input.includes("strasbourg")) return { code: "67", label: "Bas-Rhin" };
  if (input.includes("montpellier")) return { code: "34", label: "Herault" };
  if (input.includes("nice")) return { code: "06", label: "Alpes-Maritimes" };

  return { code: null, label: city.trim() };
}

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

export async function getImmoPriceContext(city) {
  if (!supabase || !city) return null;

  const target = inferDepartmentFromCity(city);
  let query = supabase.from(IMMO_PRICE_TABLE).select("*").limit(1);

  if (target.code) {
    query = query.or(`code_departement.eq.${target.code},departement_code.eq.${target.code}`);
  } else if (target.label) {
    query = query.or(`departement.ilike.%${target.label}%,nom_departement.ilike.%${target.label}%`);
  } else {
    return null;
  }

  const { data, error } = await query;
  if (error || !data?.[0]) return null;

  const row = data[0];
  const departmentName = row.departement || row.nom_departement || row.department || target.label || null;
  const departmentCode = row.code_departement || row.departement_code || row.department_code || target.code || null;
  const averagePrice =
    row.prix_m2 || row.prix_m2_moyen || row.prix_moyen_m2 || row.prix_moyen || row.average_price || null;

  return {
    departmentName,
    departmentCode,
    averagePrice: typeof averagePrice === "number" ? averagePrice : Number(averagePrice) || null,
    sourceTable: IMMO_PRICE_TABLE,
  };
}
