"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { PlusIcon } from "@heroicons/react/24/outline";

const ORGANISMES_OPTIONS = {
  salaire: ["Prysm Software", "Regiorail"],
  auto_entrepreneur_bic: ["Auto-entrepreneur BIC"],
  auto_entrepreneur_bnc: ["Auto-entrepreneur BNC"],
  chomage: ["France Travail"],
};

const TYPE_REVENU_LABELS = {
  salaire: "Salaire",
  auto_entrepreneur_bic: "Auto-entrepreneur BIC",
  auto_entrepreneur_bnc: "Auto-entrepreneur BNC",
  chomage: "Indemnités chômage",
};

export default function AddRevenue() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    type_revenu: "salaire" as keyof typeof ORGANISMES_OPTIONS,
    organisme: "",
    montant: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("revenus").insert([
        {
          date: formData.date,
          type_revenu: formData.type_revenu,
          organisme: formData.organisme,
          montant: parseFloat(formData.montant),
        },
      ]);

      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu:", error);
      setError("Erreur lors de l'ajout du revenu. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: keyof typeof ORGANISMES_OPTIONS) => {
    setFormData({
      ...formData,
      type_revenu: type,
      organisme: ORGANISMES_OPTIONS[type][0] || "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Ajouter un revenu</h1>
        <p className="mt-2 text-foreground-secondary">
          Enregistrez un nouveau revenu pour mettre à jour vos calculs d&apos;impôts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouveau revenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error border border-red-300 rounded-lg p-4">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input w-full"
              />
            </div>

            <div>
              <label htmlFor="type_revenu" className="block text-sm font-medium text-foreground mb-2">
                Type de revenu
              </label>
              <select
                id="type_revenu"
                required
                value={formData.type_revenu}
                onChange={(e) =>
                  handleTypeChange(e.target.value as keyof typeof ORGANISMES_OPTIONS)
                }
                className="input w-full"
              >
                {Object.entries(TYPE_REVENU_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="organisme" className="block text-sm font-medium text-foreground mb-2">
                Organisme
              </label>
              <select
                id="organisme"
                required
                value={formData.organisme}
                onChange={(e) => setFormData({ ...formData, organisme: e.target.value })}
                className="input w-full"
              >
                <option value="">Sélectionnez un organisme</option>
                {ORGANISMES_OPTIONS[formData.type_revenu].map((organisme) => (
                  <option key={organisme} value={organisme}>
                    {organisme}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="montant" className="block text-sm font-medium text-foreground mb-2">
                Montant (€)
              </label>
              <input
                type="number"
                id="montant"
                required
                min="0"
                step="0.01"
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                className="input w-full"
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground-secondary hover:bg-card-bg-hover transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Ajout en cours..." : "Ajouter le revenu"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section pour ajouter un don */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un don</CardTitle>
        </CardHeader>
        <CardContent>
          <DonForm />
        </CardContent>
      </Card>
    </div>
  );
}

function DonForm() {
  const [donData, setDonData] = useState({
    date: "",
    organisme: "Fondation de France",
    montant: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await supabase.from("dons").insert([
        {
          date: donData.date,
          organisme: donData.organisme,
          montant: parseFloat(donData.montant),
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setDonData({ date: "", organisme: "Fondation de France", montant: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout du don:", error);
      setError("Erreur lors de l'ajout du don. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-error border border-red-300 rounded-lg p-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-success border border-green-300 rounded-lg p-4">
          <p className="text-sm text-success">Don ajouté avec succès !</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="don-date" className="block text-sm font-medium text-foreground mb-2">
            Date
          </label>
          <input
            type="date"
            id="don-date"
            required
            value={donData.date}
            onChange={(e) => setDonData({ ...donData, date: e.target.value })}
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="don-organisme" className="block text-sm font-medium text-foreground mb-2">
            Organisme
          </label>
          <input
            type="text"
            id="don-organisme"
            required
            value={donData.organisme}
            onChange={(e) => setDonData({ ...donData, organisme: e.target.value })}
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="don-montant" className="block text-sm font-medium text-foreground mb-2">
            Montant (€)
          </label>
          <input
            type="number"
            id="don-montant"
            required
            min="0"
            step="0.01"
            value={donData.montant}
            onChange={(e) => setDonData({ ...donData, montant: e.target.value })}
            className="input w-full"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le don"}
        </button>
      </div>
    </form>
  );
}
